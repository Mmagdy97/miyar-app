-- Step B: run after step A. Accountant = finance only; secretary = projects + attendance, no finance.
alter table team_invites drop constraint if exists team_invites_role_check;
alter table team_invites add constraint team_invites_role_check check (role in ('admin','site_engineer','technical_office','accountant','secretary'));

create or replace function invite_member(p_email text, p_role app_role) returns text
language plpgsql security definer set search_path = public as $$
declare v_email text := lower(trim(p_email)); v_user uuid; v_uorg uuid;
begin
  if auth_role() <> 'admin' then raise exception 'not allowed'; end if;
  if p_role not in ('admin','site_engineer','technical_office','accountant','secretary') then raise exception 'bad role'; end if;
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
  if p_role not in ('admin','site_engineer','technical_office','accountant','secretary') then raise exception 'bad role'; end if;
  update profiles set role = p_role where id = p_user and org_id = auth_org();
end $$;

-- admin_create_member: allow the new roles
create or replace function admin_create_member(p_name text, p_login text, p_password text, p_role app_role)
returns uuid language plpgsql security definer set search_path = public, auth, extensions as $$
declare v_id uuid := gen_random_uuid(); v_login text := lower(trim(p_login));
begin
  if auth_role() is distinct from 'admin' then raise exception 'not allowed'; end if;
  if p_role not in ('admin', 'site_engineer', 'technical_office', 'accountant', 'secretary') then raise exception 'invalid role'; end if;
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

-- Finance tables: admin + accountant
do $$ declare r record; begin
  for r in select * from (values
    ('invoices','invoices_admin'),('petty_cash','cash_admin'),('cash_custodies','cust_admin'),('cash_expenses','cexp_admin'),
    ('certificates','cert_admin'),('subcontractors','subcontractors_admin'),('sub_payments','sub_payments_admin'),('purchase_orders','purchase_orders_admin')
  ) as v(t, pol) loop
    execute format('drop policy if exists %I on %I', r.pol, r.t);
    execute format('create policy %I on %I for all using (org_id = auth_org() and auth_role() in (''admin'',''accountant'')) with check (org_id = auth_org() and auth_role() in (''admin'',''accountant''))', r.pol, r.t);
  end loop;
end $$;

-- Projects: accountant + secretary can read their office's projects
drop policy if exists projects_staff on projects;
create policy projects_staff on projects for select
  using (org_id = auth_org() and auth_role() in ('admin','technical_office','site_engineer','accountant','secretary'));

-- Workers & attendance: add secretary
drop policy if exists workers_staff on workers;
create policy workers_staff on workers for all
  using (org_id = auth_org() and (is_staff() or auth_role() = 'secretary')) with check (org_id = auth_org() and (is_staff() or auth_role() = 'secretary'));
drop policy if exists attendance_staff on attendance;
create policy attendance_staff on attendance for all
  using (org_id = auth_org() and (is_staff() or auth_role() = 'secretary')) with check (org_id = auth_org() and (is_staff() or auth_role() = 'secretary'));
