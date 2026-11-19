-- RFI (technical queries): site/office raise, technical office/admin answer. Run AFTER schema-reports.sql.
create table if not exists rfis (
  id bigint generated always as identity primary key,
  org_id uuid not null references organizations(id) on delete cascade,
  project_id bigint not null references projects(id) on delete cascade,
  no int not null,
  title text not null,
  question text,
  answer text,
  due_date date,
  status text not null default 'open' check (status in ('open','answered','closed')),
  asked_by uuid default auth.uid(),
  asked_name text,
  answered_at timestamptz,
  created_at timestamptz not null default now()
);
alter table rfis enable row level security;
drop policy if exists rfi_read on rfis;
create policy rfi_read on rfis for select
  using (org_id = auth_org() and auth_role() in ('admin','technical_office','site_engineer'));
drop policy if exists rfi_ins on rfis;
create policy rfi_ins on rfis for insert
  with check (org_id = auth_org() and status = 'open' and auth_role() in ('admin','technical_office','site_engineer'));
drop policy if exists rfi_upd on rfis;
create policy rfi_upd on rfis for update
  using (org_id = auth_org() and auth_role() in ('admin','technical_office'))
  with check (org_id = auth_org() and auth_role() in ('admin','technical_office'));
drop policy if exists rfi_del on rfis;
create policy rfi_del on rfis for delete
  using (org_id = auth_org() and auth_role() = 'admin');
