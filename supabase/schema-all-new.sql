-- Safe to re-run. Run AFTER schema.sql, schema-saas.sql, schema-owner.sql, schema-projects.sql.
-- Contains: clients, cash, team, attendance, procurement, changeorders, certificates, selections, moodboard.

-- ===== schema-clients.sql =====
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


-- ===== schema-cash.sql =====
-- Petty cash (العهد): admin gives a custody to a named holder, then records expenses against it.
create table if not exists cash_custodies (
  id bigint generated always as identity primary key,
  org_id uuid not null references organizations(id) on delete cascade,
  project_id bigint references projects(id) on delete set null,
  holder text not null,
  amount numeric(14,2) not null check (amount > 0),
  created_at timestamptz not null default now()
);
create table if not exists cash_expenses (
  id bigint generated always as identity primary key,
  org_id uuid not null references organizations(id) on delete cascade,
  custody_id bigint not null references cash_custodies(id) on delete cascade,
  description text not null,
  category text,
  amount numeric(14,2) not null check (amount > 0),
  spent_on date not null default current_date,
  created_at timestamptz not null default now()
);
alter table cash_custodies enable row level security;
alter table cash_expenses enable row level security;
drop policy if exists cust_admin on cash_custodies;
create policy cust_admin on cash_custodies for all
  using (org_id = auth_org() and auth_role() = 'admin') with check (org_id = auth_org() and auth_role() = 'admin');
drop policy if exists cexp_admin on cash_expenses;
create policy cexp_admin on cash_expenses for all
  using (org_id = auth_org() and auth_role() = 'admin') with check (org_id = auth_org() and auth_role() = 'admin');


-- ===== schema-team.sql =====
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


-- ===== schema-attendance.sql =====
-- Labour attendance (الحضور والعمالة). Run AFTER schema-team.sql.
create table if not exists workers (
  id bigint generated always as identity primary key,
  org_id uuid not null references organizations(id) on delete cascade,
  name text not null, trade text,
  rate numeric(12,2) not null check (rate > 0),
  created_at timestamptz not null default now()
);
create table if not exists attendance (
  id bigint generated always as identity primary key,
  org_id uuid not null references organizations(id) on delete cascade,
  worker_id bigint not null references workers(id) on delete cascade,
  day date not null,
  status text not null check (status in ('present','half','absent')),
  ot numeric(4,1) not null default 0,
  rate numeric(12,2) not null,         -- the day's rate, so later rate changes never rewrite history
  unique (worker_id, day)
);
alter table workers enable row level security;
alter table attendance enable row level security;
drop policy if exists workers_staff on workers;
create policy workers_staff on workers for all
  using (org_id = auth_org() and is_staff()) with check (org_id = auth_org() and is_staff());
drop policy if exists attendance_staff on attendance;
create policy attendance_staff on attendance for all
  using (org_id = auth_org() and is_staff()) with check (org_id = auth_org() and is_staff());


-- ===== schema-procurement.sql =====
-- Subcontractors, their payments, and purchase orders. Run AFTER schema-attendance.sql. Admin only.
create table if not exists subcontractors (
  id bigint generated always as identity primary key,
  org_id uuid not null references organizations(id) on delete cascade,
  name text not null, trade text,
  contract numeric(14,2) not null check (contract > 0),
  created_at timestamptz not null default now()
);
create table if not exists sub_payments (
  id bigint generated always as identity primary key,
  org_id uuid not null references organizations(id) on delete cascade,
  sub_id bigint not null references subcontractors(id) on delete cascade,
  amount numeric(14,2) not null check (amount > 0),
  paid_on date not null default current_date
);
create table if not exists purchase_orders (
  id bigint generated always as identity primary key,
  org_id uuid not null references organizations(id) on delete cascade,
  no text not null, supplier text not null, item text not null,
  qty numeric(14,3) not null, price numeric(14,2) not null,
  status text not null default 'draft' check (status in ('draft','sent','received')),
  created_at timestamptz not null default now()
);
do $$ declare t text; begin
  foreach t in array array['subcontractors','sub_payments','purchase_orders'] loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists %I on %I', t||'_admin', t);
    execute format('create policy %I on %I for all using (org_id = auth_org() and auth_role() = ''admin'') with check (org_id = auth_org() and auth_role() = ''admin'')', t||'_admin', t);
  end loop;
end $$;


-- ===== schema-changeorders.sql =====
-- Change orders. Run AFTER schema-procurement.sql.
-- Staff raise and send them; the project's client approves/rejects through decide_change_order().
create table if not exists change_orders (
  id bigint generated always as identity primary key,
  org_id uuid not null references organizations(id) on delete cascade,
  project_id bigint not null references projects(id) on delete cascade,
  no int not null,
  title text not null, descr text,
  cost numeric(14,2) not null default 0,
  days int not null default 0,
  status text not null default 'draft' check (status in ('draft','sent','approved','rejected')),
  created_at timestamptz not null default now()
);
alter table change_orders enable row level security;
drop policy if exists co_staff on change_orders;
create policy co_staff on change_orders for all
  using (org_id = auth_org() and auth_role() in ('admin','technical_office'))
  with check (org_id = auth_org() and auth_role() in ('admin','technical_office'));
drop policy if exists co_client on change_orders;
create policy co_client on change_orders for select
  using (status <> 'draft' and exists (select 1 from projects p where p.id = project_id and p.client_id = auth.uid()));

create or replace function decide_change_order(p_id bigint, p_status text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if p_status not in ('approved','rejected') then raise exception 'bad status'; end if;
  update change_orders c set status = p_status
    where c.id = p_id and c.status = 'sent'
      and exists (select 1 from projects p where p.id = c.project_id and p.client_id = auth.uid());
  if not found then raise exception 'not allowed'; end if;
end $$;


-- ===== schema-certificates.sql =====
-- Progress-billing certificates (مستخلصات). Run AFTER schema-changeorders.sql. Admin only.
create table if not exists certificates (
  id bigint generated always as identity primary key,
  org_id uuid not null references organizations(id) on delete cascade,
  project_id bigint not null references projects(id) on delete cascade,
  no int not null,
  cum_pct numeric(5,2) not null, retention_pct numeric(5,2) not null default 0, vat_rate numeric(5,2) not null default 0,
  cum_value numeric(14,2) not null, gross numeric(14,2) not null, retention numeric(14,2) not null,
  advance numeric(14,2) not null default 0, vat numeric(14,2) not null default 0, net numeric(14,2) not null,
  status text not null default 'draft' check (status in ('draft','approved','paid')),
  retention_released boolean not null default false,
  created_at timestamptz not null default now()
);
alter table certificates enable row level security;
drop policy if exists cert_admin on certificates;
create policy cert_admin on certificates for all
  using (org_id = auth_org() and auth_role() = 'admin') with check (org_id = auth_org() and auth_role() = 'admin');


-- ===== schema-selections.sql =====
-- Client selections / FF&E. Run AFTER schema-certificates.sql.
-- Staff manage everything. Clients never read the table (it holds cost + supplier): they use client_selections()
-- and decide with decide_selection().
create table if not exists selections (
  id bigint generated always as identity primary key,
  org_id uuid not null references organizations(id) on delete cascade,
  project_id bigint not null references projects(id) on delete cascade,
  room text, name text not null, supplier text, phone text,
  dims text, material text, code text, lead_days int not null default 0, color text, image text,
  qty numeric(10,2) not null default 1, cost numeric(14,2) not null default 0, price numeric(14,2) not null,
  status text not null default 'proposed' check (status in ('proposed','approved','rejected','ordered','delivered','installed')),
  ordered_at date, delivered_at date,
  created_at timestamptz not null default now()
);
alter table selections enable row level security;
drop policy if exists sel_staff on selections;
create policy sel_staff on selections for all
  using (org_id = auth_org() and auth_role() in ('admin','technical_office'))
  with check (org_id = auth_org() and auth_role() in ('admin','technical_office'));

create or replace function client_selections() returns table(
  id bigint, project_id bigint, room text, name text, dims text, material text, code text, lead_days int,
  color text, image text, qty numeric, price numeric, status text, ordered_at date, delivered_at date)
language sql stable security definer set search_path = public as $$
  select s.id, s.project_id, s.room, s.name, s.dims, s.material, s.code, s.lead_days,
         s.color, s.image, s.qty, s.price, s.status, s.ordered_at, s.delivered_at
  from selections s join projects p on p.id = s.project_id
  where p.client_id = auth.uid()
$$;

create or replace function decide_selection(p_id bigint, p_status text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if p_status not in ('approved','rejected') then raise exception 'bad status'; end if;
  update selections s set status = p_status
    where s.id = p_id and s.status = 'proposed'
      and (exists (select 1 from projects p where p.id = s.project_id and p.client_id = auth.uid())
           or (s.org_id = auth_org() and auth_role() in ('admin','technical_office')));
  if not found then raise exception 'not allowed'; end if;
end $$;


-- ===== schema-moodboard.sql =====
-- Moodboard tiles. Run AFTER schema-selections.sql.
-- Staff manage tiles; the project's client reads them and toggles "liked" through toggle_tile_like().
create table if not exists mood_tiles (
  id bigint generated always as identity primary key,
  org_id uuid not null references organizations(id) on delete cascade,
  project_id bigint not null references projects(id) on delete cascade,
  kind text not null check (kind in ('image','color','note')),
  value text not null, caption text,
  liked boolean not null default false,
  created_at timestamptz not null default now()
);
alter table mood_tiles enable row level security;
drop policy if exists mood_staff on mood_tiles;
create policy mood_staff on mood_tiles for all
  using (org_id = auth_org() and auth_role() in ('admin','technical_office'))
  with check (org_id = auth_org() and auth_role() in ('admin','technical_office'));
drop policy if exists mood_client on mood_tiles;
create policy mood_client on mood_tiles for select
  using (exists (select 1 from projects p where p.id = project_id and p.client_id = auth.uid()));

create or replace function toggle_tile_like(p_id bigint) returns void
language plpgsql security definer set search_path = public as $$
begin
  update mood_tiles t set liked = not liked
    where t.id = p_id and exists (select 1 from projects p where p.id = t.project_id and (p.client_id = auth.uid() or (p.org_id = auth_org() and auth_role() in ('admin','technical_office'))));
  if not found then raise exception 'not allowed'; end if;
end $$;
