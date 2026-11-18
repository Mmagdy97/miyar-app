-- Warranty per project + maintenance requests (clients raise, office handles).
create table if not exists warranties (
  project_id bigint primary key references projects(id) on delete cascade,
  org_id uuid not null references organizations(id) on delete cascade,
  start_date date not null,
  months int not null default 12 check (months between 1 and 120),
  notes text
);
create table if not exists maintenance_requests (
  id bigint generated always as identity primary key,
  org_id uuid not null references organizations(id) on delete cascade,
  project_id bigint not null references projects(id) on delete cascade,
  title text not null,
  descr text,
  status text not null default 'open' check (status in ('open','in_progress','done')),
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now()
);
alter table warranties enable row level security;
alter table maintenance_requests enable row level security;
drop policy if exists war_admin on warranties;
create policy war_admin on warranties for all
  using (org_id = auth_org() and auth_role() in ('admin','technical_office'))
  with check (org_id = auth_org() and auth_role() in ('admin','technical_office'));
drop policy if exists war_client on warranties;
create policy war_client on warranties for select
  using (exists (select 1 from projects p where p.id = project_id and p.client_id = auth.uid()));
drop policy if exists mr_admin on maintenance_requests;
create policy mr_admin on maintenance_requests for all
  using (org_id = auth_org() and auth_role() in ('admin','technical_office'))
  with check (org_id = auth_org() and auth_role() in ('admin','technical_office'));
drop policy if exists mr_client_sel on maintenance_requests;
create policy mr_client_sel on maintenance_requests for select
  using (exists (select 1 from projects p where p.id = project_id and p.client_id = auth.uid()));
drop policy if exists mr_client_ins on maintenance_requests;
create policy mr_client_ins on maintenance_requests for insert
  with check (org_id = auth_org() and status = 'open' and exists (select 1 from projects p where p.id = project_id and p.client_id = auth.uid())
    and exists (select 1 from warranties w where w.project_id = maintenance_requests.project_id and w.start_date + make_interval(months => w.months) >= current_date));
