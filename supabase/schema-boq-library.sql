-- Editable office item library with quantity formulas. Empty table = app uses the built-in defaults.
create table if not exists boq_library (
  id bigint generated always as identity primary key,
  org_id uuid not null references organizations(id) on delete cascade,
  cat text not null, name text not null, unit text,
  terms jsonb not null default '[]',
  finishes text[] not null default '{eco,mid,lux}',
  unique (org_id, name)
);
alter table boq_library enable row level security;
drop policy if exists lib_read on boq_library;
create policy lib_read on boq_library for select using (org_id = auth_org() and (is_staff() or auth_role() in ('accountant','secretary')));
drop policy if exists lib_write on boq_library;
create policy lib_write on boq_library for all
  using (org_id = auth_org() and auth_role() in ('admin','technical_office'))
  with check (org_id = auth_org() and auth_role() in ('admin','technical_office'));
