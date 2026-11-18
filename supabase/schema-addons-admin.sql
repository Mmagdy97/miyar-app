-- Owner panel: show and set purchased extra projects per office.
drop function if exists admin_orgs();
create function admin_orgs() returns table (
  id uuid, name text, country text, currency text, plan text, status text, trial_ends_at timestamptz,
  billing_months int, paid_until date, created_at timestamptz, extra_features text[], members bigint, projects bigint, invited text, extra_projects int
) language sql stable security definer set search_path = public as $$
  select o.id, o.name, o.country, o.currency, o.plan, o.status, o.trial_ends_at, o.billing_months, o.paid_until, o.created_at, o.extra_features,
         (select count(*) from profiles p where p.org_id = o.id),
         (select count(*) from projects j where j.org_id = o.id),
         (select i.email from org_invites i where i.org_id = o.id limit 1),
         coalesce(o.extra_projects, 0)
  from organizations o where is_platform_admin() order by o.created_at desc
$$;

create or replace function admin_set_extra_projects(p_org uuid, p_n int)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not is_platform_admin() then raise exception 'not allowed'; end if;
  update organizations set extra_projects = greatest(0, coalesce(p_n, 0)) where id = p_org;
end $$;
