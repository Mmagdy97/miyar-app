-- Team members. Run AFTER schema-clients.sql.
-- Admin invites staff by email with a role; they sign up with that email and join the office.

create table if not exists team_invites (
  email text primary key,
  org_id uuid not null references organizations(id) on delete cascade,
  role app_role not null check (role in ('admin','site_engineer','technical_office'))
);
alter table team_invites enable row level security; -- no policies: security-definer functions only

create or replace function handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
declare v_org uuid; v_role app_role; v_email text := lower(new.email); c record;
begin
  insert into profiles(id, full_name) values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  select org_id into v_org from org_invites where email = v_email;
  if v_org is not null then
    update profiles set org_id = v_org, role = 'admin' where id = new.id;
    delete from org_invites where email = v_email;
    return new;
  end if;
  select org_id, role into v_org, v_role from team_invites where email = v_email;
  if v_org is not null then
    update profiles set org_id = v_org, role = v_role where id = new.id;
    delete from team_invites where email = v_email;
    return new;
  end if;
  for c in select * from client_invites where email = v_email loop
    update profiles set org_id = c.org_id, role = 'client' where id = new.id and (org_id is null or org_id = c.org_id);
    update projects set client_id = new.id where id = c.project_id;
  end loop;
  delete from client_invites where email = v_email;
  return new;
end $$;

-- Members + pending invites of my office (admin only)
create or replace function list_members() returns table(id uuid, full_name text, email text, role app_role, pending boolean)
language plpgsql security definer set search_path = public as $$
begin
  if auth_role() <> 'admin' then raise exception 'not allowed'; end if;
  return query
    select p.id, p.full_name, u.email::text, p.role, false
      from profiles p join auth.users u on u.id = p.id
      where p.org_id = auth_org() and p.role <> 'client'
    union all
    select null::uuid, null::text, t.email, t.role, true from team_invites t where t.org_id = auth_org();
end $$;

create or replace function invite_member(p_email text, p_role app_role) returns text
language plpgsql security definer set search_path = public as $$
declare v_email text := lower(trim(p_email)); v_user uuid; v_uorg uuid;
begin
  if auth_role() <> 'admin' then raise exception 'not allowed'; end if;
  if p_role not in ('admin','site_engineer','technical_office') then raise exception 'bad role'; end if;
  select id into v_user from auth.users where lower(email) = v_email;
  if v_user is null then
    insert into team_invites(email, org_id, role) values (v_email, auth_org(), p_role)
      on conflict (email) do update set org_id = excluded.org_id, role = excluded.role;
    return 'invited';
  end if;
  select org_id into v_uorg from profiles where id = v_user;
  if v_uorg is not null and v_uorg <> auth_org() then raise exception 'user belongs to another office'; end if;
  update profiles set org_id = auth_org(), role = p_role where id = v_user;
  return 'linked';
end $$;

create or replace function set_member_role(p_user uuid, p_role app_role) returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth_role() <> 'admin' then raise exception 'not allowed'; end if;
  if p_user = auth.uid() then raise exception 'cannot change yourself'; end if;
  if p_role not in ('admin','site_engineer','technical_office') then raise exception 'bad role'; end if;
  update profiles set role = p_role where id = p_user and org_id = auth_org();
end $$;

create or replace function remove_member(p_user uuid, p_email text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth_role() <> 'admin' then raise exception 'not allowed'; end if;
  if p_user is not null then
    if p_user = auth.uid() then raise exception 'cannot remove yourself'; end if;
    update profiles set org_id = null where id = p_user and org_id = auth_org();
  else
    delete from team_invites where email = lower(p_email) and org_id = auth_org();
  end if;
end $$;
