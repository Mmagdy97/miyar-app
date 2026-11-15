-- Admin creates a team member directly (name + mobile/email + password), no self-signup needed.
create or replace function admin_create_member(p_name text, p_login text, p_password text, p_role app_role)
returns uuid language plpgsql security definer set search_path = public, auth, extensions as $$
declare v_id uuid := gen_random_uuid(); v_login text := lower(trim(p_login));
begin
  if auth_role() is distinct from 'admin' then raise exception 'not allowed'; end if;
  if p_role not in ('admin', 'site_engineer', 'technical_office') then raise exception 'invalid role'; end if;
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
revoke all on function admin_create_member(text, text, text, app_role) from public, anon;
grant execute on function admin_create_member(text, text, text, app_role) to authenticated;
