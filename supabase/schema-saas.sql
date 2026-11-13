-- Miyar SaaS layer. Run AFTER schema.sql (Supabase Dashboard > SQL Editor).
-- Adds: plans/subscription fields, platform owner (super admin) access, project-limit enforcement.

alter table organizations
  add column plan text not null default 'free' check (plan in ('free','pro','office','enterprise')),
  add column status text not null default 'trial' check (status in ('trial','active','suspended')),
  add column trial_ends_at timestamptz not null default now() + interval '14 days',
  add column billing_months int not null default 1 check (billing_months in (1,3,6,12)),
  add column paid_until date;

-- Platform owner(s): you. Add yourself after your first signup:
--   insert into platform_admins(user_id) select id from auth.users where email = 'nathanay84@gmail.com';
create table platform_admins (user_id uuid primary key references auth.users(id) on delete cascade);
alter table platform_admins enable row level security; -- no policies: only security-definer functions read it

create function is_platform_admin() returns boolean language sql stable security definer set search_path = public
  as $$ select exists (select 1 from platform_admins where user_id = auth.uid()) $$;

-- Owner dashboard: every office with member/project counts (owner only)
create function admin_orgs() returns table (
  id uuid, name text, country text, currency text, plan text, status text, trial_ends_at timestamptz,
  billing_months int, paid_until date, created_at timestamptz, members bigint, projects bigint
) language sql stable security definer set search_path = public as $$
  select o.id, o.name, o.country, o.currency, o.plan, o.status, o.trial_ends_at, o.billing_months, o.paid_until, o.created_at,
         (select count(*) from profiles p where p.org_id = o.id),
         (select count(*) from projects j where j.org_id = o.id)
  from organizations o where is_platform_admin() order by o.created_at desc
$$;

-- Owner changes an office's plan / status / paid-until (offices cannot edit these themselves)
create function admin_set_org(p_org uuid, p_plan text, p_status text, p_billing_months int, p_paid_until date)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not is_platform_admin() then raise exception 'not allowed'; end if;
  update organizations set plan = p_plan, status = p_status, billing_months = p_billing_months, paid_until = p_paid_until
   where id = p_org;
end $$;

-- Offices may update only their own descriptive fields, never plan/status/billing
revoke update on organizations from authenticated;
grant update (name, country, currency, locale) on organizations to authenticated;

-- Active-project limit per plan (free 1, pro 3, office 12, enterprise unlimited)
create function enforce_project_limit() returns trigger language plpgsql security definer set search_path = public as $$
declare v_plan text; v_status text; v_limit int; v_count int;
begin
  select plan, status into v_plan, v_status from organizations where id = new.org_id;
  if v_status = 'suspended' then raise exception 'organization suspended'; end if;
  v_limit := case v_plan when 'free' then 1 when 'pro' then 3 when 'office' then 12 else null end;
  if v_limit is null then return new; end if;
  select count(*) into v_count from projects where org_id = new.org_id and coalesce(status,'') <> 'completed';
  if v_count >= v_limit then raise exception 'project limit reached for plan %', v_plan using errcode = 'P0001'; end if;
  return new;
end $$;
create trigger projects_limit before insert on projects for each row execute function enforce_project_limit();
