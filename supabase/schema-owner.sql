-- Owner tools v2. Run AFTER schema.sql and schema-saas.sql.
-- Adds: per-office extra features, owner-created offices with an invited admin email.

alter table organizations add column extra_features text[] not null default '{}';

create table org_invites (
  email text primary key,
  org_id uuid not null references organizations(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table org_invites enable row level security; -- no policies: security-definer functions only

-- Signup: attach the new user to an office when the owner invited that email
create or replace function handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
declare v_org uuid;
begin
  insert into profiles(id, full_name) values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  select org_id into v_org from org_invites where email = lower(new.email);
  if v_org is not null then
    update profiles set org_id = v_org, role = 'admin' where id = new.id;
    delete from org_invites where email = lower(new.email);
  end if;
  return new;
end $$;

drop function if exists admin_orgs();
create function admin_orgs() returns table (
  id uuid, name text, country text, currency text, plan text, status text, trial_ends_at timestamptz,
  billing_months int, paid_until date, created_at timestamptz, extra_features text[], members bigint, projects bigint, invited text
) language sql stable security definer set search_path = public as $$
  select o.id, o.name, o.country, o.currency, o.plan, o.status, o.trial_ends_at, o.billing_months, o.paid_until, o.created_at, o.extra_features,
         (select count(*) from profiles p where p.org_id = o.id),
         (select count(*) from projects j where j.org_id = o.id),
         (select i.email from org_invites i where i.org_id = o.id limit 1)
  from organizations o where is_platform_admin() order by o.created_at desc
$$;

drop function if exists admin_set_org(uuid, text, text, int, date);
create function admin_set_org(p_org uuid, p_plan text, p_status text, p_billing_months int, p_paid_until date, p_extra text[])
returns void language plpgsql security definer set search_path = public as $$
begin
  if not is_platform_admin() then raise exception 'not allowed'; end if;
  update organizations set plan = p_plan, status = p_status, billing_months = p_billing_months,
         paid_until = p_paid_until, extra_features = coalesce(p_extra, '{}')
   where id = p_org;
end $$;

-- Owner creates an office; its admin is the existing user with that email, or is attached at their signup
create function admin_create_org(p_name text, p_country text, p_currency text, p_plan text, p_status text,
  p_billing_months int, p_paid_until date, p_extra text[], p_admin_email text)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_org uuid; v_user uuid; v_email text := lower(trim(coalesce(p_admin_email, '')));
begin
  if not is_platform_admin() then raise exception 'not allowed'; end if;
  insert into organizations(name, country, currency, plan, status, billing_months, paid_until, extra_features)
    values (p_name, p_country, p_currency, p_plan, p_status, p_billing_months, p_paid_until, coalesce(p_extra, '{}'))
    returning id into v_org;
  if v_email <> '' then
    select id into v_user from auth.users where lower(email) = v_email;
    if v_user is not null then
      if (select org_id from profiles where id = v_user) is not null then raise exception 'user already in an office'; end if;
      update profiles set org_id = v_org, role = 'admin' where id = v_user;
    else
      insert into org_invites(email, org_id) values (v_email, v_org) on conflict (email) do update set org_id = excluded.org_id;
    end if;
  end if;
  return v_org;
end $$;
