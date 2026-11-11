-- Miyar schema: multi-tenant (organization), role-based, RLS on everything.
-- Run once in Supabase Dashboard > SQL Editor.

create type app_role as enum ('admin','site_engineer','technical_office','client');

create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  country text not null default 'EG',       -- EG | SA | AE | TR
  currency text not null default 'EGP',     -- EGP | SAR | AED | TRY
  locale text not null default 'ar',        -- ar | tr | en
  created_at timestamptz not null default now()
);

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  org_id uuid references organizations(id) on delete set null,
  full_name text,
  role app_role not null default 'client',
  created_at timestamptz not null default now()
);

create table projects (
  id bigint generated always as identity primary key,
  org_id uuid not null references organizations(id) on delete cascade,
  code text, name text not null, client_name text, location text,
  engineer_id uuid references profiles(id),
  client_id uuid references profiles(id),
  phase text, progress int not null default 0 check (progress between 0 and 100),
  status text, start_date date, deadline date,
  contract_value numeric(14,2) not null default 0,
  created_at timestamptz not null default now()
);

create table invoices (
  id bigint generated always as identity primary key,
  org_id uuid not null references organizations(id) on delete cascade,
  project_id bigint not null references projects(id) on delete cascade,
  title text not null, amount numeric(14,2) not null,
  due_date date, paid boolean not null default false, paid_at timestamptz
);

create table petty_cash (
  id bigint generated always as identity primary key,
  org_id uuid not null references organizations(id) on delete cascade,
  project_id bigint references projects(id) on delete set null,
  engineer_id uuid not null references profiles(id),
  given numeric(14,2) not null default 0,
  spent numeric(14,2) not null default 0
);

-- Helpers (security definer avoids RLS recursion on profiles)
create function auth_org() returns uuid language sql stable security definer set search_path = public
  as $$ select org_id from profiles where id = auth.uid() $$;
create function auth_role() returns app_role language sql stable security definer set search_path = public
  as $$ select role from profiles where id = auth.uid() $$;

-- New auth user -> empty profile
create function handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profiles(id, full_name) values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function handle_new_user();

-- First signup creates the office and becomes its admin
create function create_organization(p_name text, p_country text, p_currency text, p_locale text)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_org uuid;
begin
  if (select org_id from profiles where id = auth.uid()) is not null then
    raise exception 'already in an organization';
  end if;
  insert into organizations(name, country, currency, locale) values (p_name, p_country, p_currency, p_locale)
    returning id into v_org;
  update profiles set org_id = v_org, role = 'admin' where id = auth.uid();
  return v_org;
end $$;

alter table organizations enable row level security;
alter table profiles enable row level security;
alter table projects enable row level security;
alter table invoices enable row level security;
alter table petty_cash enable row level security;

create policy org_read on organizations for select using (id = auth_org());
create policy org_admin_update on organizations for update using (id = auth_org() and auth_role() = 'admin');

create policy profiles_read on profiles for select using (id = auth.uid() or org_id = auth_org());
create policy profiles_self_update on profiles for update using (id = auth.uid())
  with check (id = auth.uid() and role = auth_role() and org_id is not distinct from auth_org()); -- cannot self-promote
create policy profiles_admin_update on profiles for update using (org_id = auth_org() and auth_role() = 'admin')
  with check (org_id = auth_org()); -- admin cannot move users to another office

-- Projects: staff see whole org, clients only their own
create policy projects_staff on projects for select
  using (org_id = auth_org() and auth_role() in ('admin','technical_office','site_engineer'));
create policy projects_client on projects for select using (client_id = auth.uid());
create policy projects_write on projects for all
  using (org_id = auth_org() and auth_role() in ('admin','technical_office'))
  with check (org_id = auth_org() and auth_role() in ('admin','technical_office'));

-- Invoices: admin full; client sees own projects' invoices
create policy invoices_admin on invoices for all
  using (org_id = auth_org() and auth_role() = 'admin') with check (org_id = auth_org() and auth_role() = 'admin');
create policy invoices_client on invoices for select
  using (exists (select 1 from projects p where p.id = project_id and p.client_id = auth.uid()));

-- Petty cash: admin full; engineer sees own
create policy cash_admin on petty_cash for all
  using (org_id = auth_org() and auth_role() = 'admin') with check (org_id = auth_org() and auth_role() = 'admin');
create policy cash_engineer on petty_cash for select using (engineer_id = auth.uid());

-- ───────── Modules (v2) ─────────
-- Staff = admin | technical_office | site_engineer. Writers noted per table.
create function is_staff() returns boolean language sql stable security definer set search_path = public
  as $$ select auth_role() in ('admin','technical_office','site_engineer') $$;

create table boq_items (
  id bigint generated always as identity primary key,
  org_id uuid not null references organizations(id) on delete cascade,
  project_id bigint references projects(id) on delete cascade,
  category text, name text not null, unit text,
  quantity numeric(14,3) not null default 0, unit_cost numeric(14,2) not null default 0,
  margin numeric(5,2) not null default 0, note text,
  created_at timestamptz not null default now()
);
create table expenses (            -- petty-cash settlement requests
  id bigint generated always as identity primary key,
  org_id uuid not null references organizations(id) on delete cascade,
  project_id bigint references projects(id) on delete set null,
  engineer_id uuid not null references profiles(id),
  category text, description text, amount numeric(14,2) not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);
create table snags (
  id bigint generated always as identity primary key,
  org_id uuid not null references organizations(id) on delete cascade,
  project_id bigint references projects(id) on delete cascade,
  title text not null, location text, severity text, responsible text,
  resolved boolean not null default false, created_by uuid references profiles(id),
  created_at timestamptz not null default now()
);
create table tasks (
  id bigint generated always as identity primary key,
  org_id uuid not null references organizations(id) on delete cascade,
  project_id bigint references projects(id) on delete cascade,
  assignee_id uuid references profiles(id),
  title text not null, priority text, due_at timestamptz, completed boolean not null default false,
  created_at timestamptz not null default now()
);
create table material_requests (
  id bigint generated always as identity primary key,
  org_id uuid not null references organizations(id) on delete cascade,
  project_id bigint references projects(id) on delete cascade,
  requested_by uuid not null references profiles(id),
  material text not null, quantity text, required_date text, notes text,
  status text not null default 'review',
  created_at timestamptz not null default now()
);
create table drawings (
  id bigint generated always as identity primary key,
  org_id uuid not null references organizations(id) on delete cascade,
  project_id bigint references projects(id) on delete cascade,
  code text, name text not null, discipline text, rev text, status text, file_path text,
  created_at timestamptz not null default now()
);
create table notifications (       -- approvals / alerts feed (replaces action items)
  id bigint generated always as identity primary key,
  org_id uuid not null references organizations(id) on delete cascade,
  target_user uuid references profiles(id), target_role app_role,
  type text, title text not null, body text, payload jsonb,
  read boolean not null default false, created_at timestamptz not null default now()
);

do $$ declare t text; begin
  foreach t in array array['boq_items','expenses','snags','tasks','material_requests','drawings','notifications'] loop
    execute format('alter table %I enable row level security', t);
    execute format('create policy %I on %I for select using (org_id = auth_org() and is_staff())', t||'_read', t);
  end loop;
end $$;

-- Writers
create policy boq_write on boq_items for all using (org_id = auth_org() and auth_role() in ('admin','technical_office'))
  with check (org_id = auth_org() and auth_role() in ('admin','technical_office'));
create policy drawings_write on drawings for all using (org_id = auth_org() and auth_role() in ('admin','technical_office'))
  with check (org_id = auth_org() and auth_role() in ('admin','technical_office'));
create policy snags_write on snags for all using (org_id = auth_org() and is_staff()) with check (org_id = auth_org() and is_staff());
create policy tasks_write on tasks for all using (org_id = auth_org() and is_staff()) with check (org_id = auth_org() and is_staff());
create policy mreq_write on material_requests for all using (org_id = auth_org() and is_staff()) with check (org_id = auth_org() and is_staff());
create policy exp_insert on expenses for insert with check (org_id = auth_org() and engineer_id = auth.uid());
create policy exp_admin on expenses for update using (org_id = auth_org() and auth_role() = 'admin');
create policy notif_own on notifications for select using (target_user = auth.uid());
create policy notif_mark on notifications for update using (target_user = auth.uid());
create policy notif_insert on notifications for insert with check (org_id = auth_org() and is_staff());
-- Clients may read BOQs and drawings of their own projects
create policy boq_client on boq_items for select using (exists (select 1 from projects p where p.id = project_id and p.client_id = auth.uid()));
create policy drawings_client on drawings for select using (exists (select 1 from projects p where p.id = project_id and p.client_id = auth.uid()));
