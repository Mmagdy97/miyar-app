-- Drawings with version history. Every upload of an existing code adds a new revision; older ones stay as history.
-- Files live in private bucket 'drawings' at <org_id>/<project_id>/<file>. Run AFTER schema-reports.sql.
create table if not exists drawing_files (
  id bigint generated always as identity primary key,
  org_id uuid not null references organizations(id) on delete cascade,
  project_id bigint not null references projects(id) on delete cascade,
  code text not null,
  name text not null,
  discipline text,
  rev int not null default 1,
  status text not null default 'review' check (status in ('review','approved','rejected')),
  note text,
  file_path text,
  uploaded_by text,
  created_at timestamptz not null default now(),
  unique (project_id, code, rev)
);
alter table drawing_files enable row level security;
drop policy if exists dwg_read on drawing_files;
create policy dwg_read on drawing_files for select
  using (org_id = auth_org() and auth_role() in ('admin','technical_office','site_engineer'));
drop policy if exists dwg_write on drawing_files;
create policy dwg_write on drawing_files for all
  using (org_id = auth_org() and auth_role() in ('admin','technical_office'))
  with check (org_id = auth_org() and auth_role() in ('admin','technical_office'));

insert into storage.buckets (id, name, public) values ('drawings', 'drawings', false) on conflict (id) do nothing;
drop policy if exists dwgf_read on storage.objects;
create policy dwgf_read on storage.objects for select to authenticated
  using (bucket_id = 'drawings' and (storage.foldername(name))[1] = auth_org()::text and auth_role() in ('admin','technical_office','site_engineer'));
drop policy if exists dwgf_write on storage.objects;
create policy dwgf_write on storage.objects for insert to authenticated
  with check (bucket_id = 'drawings' and (storage.foldername(name))[1] = auth_org()::text and auth_role() in ('admin','technical_office'));
