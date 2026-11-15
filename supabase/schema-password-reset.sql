-- Admin sets a new password for a member of their own office (phone-login accounts have no email reset).
create or replace function admin_reset_password(p_user uuid, p_password text) returns void
language plpgsql security definer set search_path = public, auth, extensions as $$
begin
  if auth_role() is distinct from 'admin' then raise exception 'not allowed'; end if;
  if length(coalesce(p_password, '')) < 8 then raise exception 'password must be at least 8 characters'; end if;
  if p_user = auth.uid() then raise exception 'use your own account to change your password'; end if;
  if not exists (select 1 from profiles where id = p_user and org_id = auth_org()) then raise exception 'not in your organization'; end if;
  if exists (select 1 from platform_admins where user_id = p_user) then raise exception 'not allowed'; end if;
  update auth.users set encrypted_password = crypt(p_password, gen_salt('bf', 10)), updated_at = now() where id = p_user;
  delete from auth.sessions where user_id = p_user;   -- sign them out everywhere (refresh tokens cascade)
end $$;
revoke all on function admin_reset_password(uuid, text) from public, anon;
grant execute on function admin_reset_password(uuid, text) to authenticated;
