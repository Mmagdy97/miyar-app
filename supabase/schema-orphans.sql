-- Owner: list and delete accounts with no office (failed signups)
create or replace function admin_orphans() returns table (id uuid, login text, full_name text, created_at timestamptz)
language sql stable security definer set search_path = public as $$
  select u.id, u.email::text, p.full_name, u.created_at
  from auth.users u left join profiles p on p.id = u.id
  where is_platform_admin() and p.org_id is null
    and not exists (select 1 from platform_admins a where a.user_id = u.id)
  order by u.created_at desc
$$;

create or replace function admin_delete_user(p_user uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not is_platform_admin() then raise exception 'not allowed'; end if;
  if exists (select 1 from platform_admins where user_id = p_user) then raise exception 'not allowed'; end if;
  if (select org_id from profiles where id = p_user) is not null then raise exception 'user belongs to an office'; end if;
  delete from auth.users where id = p_user;
end $$;
