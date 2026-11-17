-- Secretary can add/remove staff, clients and workers; removals notify the office admins. Run AFTER schema-roles-b.sql.
create or replace function notify_admins(p_type text, p_title text, p_body text) returns void
language plpgsql security definer set search_path = public as $$
begin
  insert into notifications(org_id, target_user, target_role, type, title, body)
  select auth_org(), p.id, 'admin', p_type, p_title, p_body
  from profiles p where p.org_id = auth_org() and p.role = 'admin' and p.id <> auth.uid();
end $$;
revoke all on function notify_admins(text, text, text) from public, anon;

-- Own notifications: allow marking read (already) and reading (already). Members list for admin + secretary
create or replace function list_members() returns table(id uuid, full_name text, email text, role app_role, pending boolean)
language plpgsql security definer set search_path = public as $$
begin
  if auth_role() not in ('admin','secretary') then raise exception 'not allowed'; end if;
  return query
    select p.id, p.full_name, u.email::text, p.role, false
      from profiles p join auth.users u on u.id = p.id
      where p.org_id = auth_org() and p.role <> 'client'
    union all
    select null::uuid, null::text, t.email, t.role, true from team_invites t where t.org_id = auth_org();
end $$;

create or replace function remove_member(p_user uuid, p_email text) returns void
language plpgsql security definer set search_path = public as $$
declare v_name text; v_role app_role;
begin
  if auth_role() not in ('admin','secretary') then raise exception 'not allowed'; end if;
  if p_user is not null then
    if p_user = auth.uid() then raise exception 'cannot remove yourself'; end if;
    select full_name, role into v_name, v_role from profiles where id = p_user and org_id = auth_org();
    if v_role is null then raise exception 'not found'; end if;
    if auth_role() = 'secretary' and v_role in ('admin','secretary') then raise exception 'not allowed'; end if;
    update profiles set org_id = null where id = p_user and org_id = auth_org();
    if auth_role() = 'secretary' then perform notify_admins('member_removed', 'تم حذف عضو من الفريق', coalesce(v_name, '') || ' — بواسطة ' || (select full_name from profiles where id = auth.uid())); end if;
  else
    delete from team_invites where email = lower(p_email) and org_id = auth_org();
  end if;
end $$;

-- Create member: secretary may create non-admin staff
create or replace function admin_create_member(p_name text, p_login text, p_password text, p_role app_role)
returns uuid language plpgsql security definer set search_path = public, auth, extensions as $$
declare v_id uuid := gen_random_uuid(); v_login text := lower(trim(p_login));
begin
  if auth_role() not in ('admin','secretary') then raise exception 'not allowed'; end if;
  if p_role not in ('admin', 'site_engineer', 'technical_office', 'accountant', 'secretary') then raise exception 'invalid role'; end if;
  if auth_role() = 'secretary' and p_role in ('admin','secretary') then raise exception 'not allowed'; end if;
  if length(coalesce(p_password, '')) < 8 then raise exception 'password must be at least 8 characters'; end if;
  if length(trim(coalesce(p_name, ''))) < 2 then raise exception 'name is required'; end if;
  if v_login !~ '^[^@[:space:]]+@[^@[:space:]]+$' then raise exception 'invalid login'; end if;
  if exists (select 1 from auth.users where lower(email) = v_login) then raise exception 'this login already exists'; end if;
  insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
                          created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, email_change)
  values ('00000000-0000-0000-0000-000000000000', v_id, 'authenticated', 'authenticated', v_login, crypt(p_password, gen_salt('bf', 10)), now(),
          '{"provider":"email","providers":["email"]}'::jsonb, jsonb_build_object('full_name', trim(p_name)), now(), now(), '', '', '', '');
  insert into auth.identities (id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at)
  values (gen_random_uuid(), v_id, v_id::text, 'email', jsonb_build_object('sub', v_id::text, 'email', v_login, 'email_verified', true), now(), now(), now());
  update public.profiles set org_id = auth_org(), role = p_role, full_name = trim(p_name) where id = v_id;
  return v_id;
end $$;

-- Clients: secretary can invite and unlink
create or replace function invite_client(p_project bigint, p_email text) returns text
language plpgsql security definer set search_path = public as $$
declare v_org uuid; v_email text := lower(trim(p_email)); v_user uuid; v_user_org uuid; v_user_role app_role;
begin
  if auth_role() not in ('admin','technical_office','secretary') then raise exception 'not allowed'; end if;
  select org_id into v_org from projects where id = p_project and org_id = auth_org();
  if v_org is null then raise exception 'project not found'; end if;
  update projects set client_email = v_email where id = p_project;
  select id into v_user from auth.users where lower(email) = v_email;
  if v_user is null then
    insert into client_invites(email, project_id, org_id) values (v_email, p_project, v_org) on conflict do nothing;
    return 'invited';
  end if;
  select org_id, role into v_user_org, v_user_role from profiles where id = v_user;
  if v_user_org is not null and not (v_user_org = v_org and v_user_role = 'client') then raise exception 'user belongs to another office or role'; end if;
  update profiles set org_id = v_org, role = 'client' where id = v_user;
  update projects set client_id = v_user where id = p_project;
  return 'linked';
end $$;

create or replace function remove_client(p_project bigint) returns void
language plpgsql security definer set search_path = public as $$
declare v_name text; v_email text;
begin
  if auth_role() not in ('admin','technical_office','secretary') then raise exception 'not allowed'; end if;
  select name, client_email into v_name, v_email from projects where id = p_project and org_id = auth_org();
  if v_name is null then raise exception 'project not found'; end if;
  update projects set client_id = null, client_email = null where id = p_project;
  delete from client_invites where project_id = p_project;
  if auth_role() = 'secretary' then perform notify_admins('client_removed', 'تم حذف عميل من مشروع', coalesce(v_email, '') || ' — ' || v_name || ' — بواسطة ' || (select full_name from profiles where id = auth.uid())); end if;
end $$;

-- Workers: any non-admin deletion notifies admins
create or replace function trg_worker_deleted() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and auth_role() = 'secretary' then
    perform notify_admins('worker_removed', 'تم حذف عامل', old.name || ' — بواسطة ' || (select full_name from profiles where id = auth.uid()));
  end if;
  return old;
end $$;
drop trigger if exists worker_deleted on workers;
create trigger worker_deleted before delete on workers for each row execute function trg_worker_deleted();
