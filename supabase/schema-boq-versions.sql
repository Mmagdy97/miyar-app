-- BOQ versions: a frozen copy of a project's BOQ (items + totals) that can be compared and restored.
create table if not exists boq_versions (
  id bigint generated always as identity primary key,
  org_id uuid not null references organizations(id) on delete cascade,
  project_id bigint not null references projects(id) on delete cascade,
  label text not null,
  items jsonb not null default '[]',
  cost numeric(16,2) not null default 0,
  price numeric(16,2) not null default 0,
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now()
);
alter table boq_versions enable row level security;
drop policy if exists bv_read on boq_versions;
create policy bv_read on boq_versions for select
  using (org_id = auth_org() and auth_role() in ('admin','technical_office','accountant'));
drop policy if exists bv_write on boq_versions;
create policy bv_write on boq_versions for all
  using (org_id = auth_org() and auth_role() in ('admin','technical_office'))
  with check (org_id = auth_org() and auth_role() in ('admin','technical_office'));
