-- Client access. Run AFTER schema.sql, schema-saas.sql, schema-owner.sql, schema-projects.sql.
-- Office admin invites a client by email for one project; the client then sees only that project and its invoices.

alter table projects add column if not exists client_email text;

create table if not exists client_invites (
  email text not null,
  project_id bigint not null references projects(id) on delete cascade,
  org_id uuid not null references organizations(id) on delete cascade,
  primary key (email, project_id)
);
alter table client_invites enable row level security; -- no policies: security-definer functions only

-- Signup: attach to an office as admin (owner invite) or as client (project invite)
create or replace function handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
declare v_org uuid; v_email text := lower(new.email); c record;
begin
  insert into profiles(id, full_name) values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  select org_id into v_org from org_invites where email = v_email;
  if v_org is not null then
    update profiles set org_id = v_org, role = 'admin' where id = new.id;
    delete from org_invites where email = v_email;
  else
    for c in select * from client_invites where email = v_email loop
      update profiles set org_id = c.org_id, role = 'client' where id = new.id and (org_id is null or org_id = c.org_id);
      update projects set client_id = new.id where id = c.project_id;
    end loop;
    delete from client_invites where email = v_email;
  end if;
  return new;
end $$;

-- Office admin / technical office invites a client to a project
create or replace function invite_client(p_project bigint, p_email text) returns text
language plpgsql security definer set search_path = public as $$
declare v_org uuid; v_email text := lower(trim(p_email)); v_user uuid; v_user_org uuid; v_user_role app_role;
begin
  if auth_role() not in ('admin','technical_office') then raise exception 'not allowed'; end if;
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
