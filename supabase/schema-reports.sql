-- Daily site reports with photos. Photos live in the private bucket 'site-photos' at <org_id>/<project_id>/<file>.
create table if not exists daily_reports (
  id bigint generated always as identity primary key,
  org_id uuid not null references organizations(id) on delete cascade,
  project_id bigint not null references projects(id) on delete cascade,
  author_id uuid references profiles(id) on delete set null,
  author_name text,
  day date not null default current_date,
  note text,
  progress int check (progress between 0 and 100),
  photos text[] not null default '{}',
  created_at timestamptz not null default now()
);
alter table daily_reports enable row level security;
drop policy if exists rep_staff on daily_reports;
create policy rep_staff on daily_reports for select using (org_id = auth_org() and auth_role() in ('admin','technical_office','site_engineer','secretary'));
drop policy if exists rep_client on daily_reports;
create policy rep_client on daily_reports for select using (exists (select 1 from projects p where p.id = project_id and p.client_id = auth.uid()));
drop policy if exists rep_write on daily_reports;
create policy rep_write on daily_reports for insert with check (org_id = auth_org() and author_id = auth.uid() and auth_role() in ('admin','technical_office','site_engineer'));
drop policy if exists rep_del on daily_reports;
create policy rep_del on daily_reports for delete using (org_id = auth_org() and (auth_role() = 'admin' or author_id = auth.uid()));

insert into storage.buckets (id, name, public) values ('site-photos', 'site-photos', false) on conflict (id) do nothing;
drop policy if exists photos_staff_read on storage.objects;
create policy photos_staff_read on storage.objects for select to authenticated
  using (bucket_id = 'site-photos' and (storage.foldername(name))[1] = auth_org()::text and auth_role() in ('admin','technical_office','site_engineer','secretary'));
drop policy if exists photos_client_read on storage.objects;
create policy photos_client_read on storage.objects for select to authenticated
  using (bucket_id = 'site-photos' and exists (select 1 from projects p where p.id::text = (storage.foldername(name))[2] and p.client_id = auth.uid()));
drop policy if exists photos_staff_write on storage.objects;
create policy photos_staff_write on storage.objects for insert to authenticated
  with check (bucket_id = 'site-photos' and (storage.foldername(name))[1] = auth_org()::text and auth_role() in ('admin','technical_office','site_engineer'));
drop policy if exists photos_staff_del on storage.objects;
create policy photos_staff_del on storage.objects for delete to authenticated
  using (bucket_id = 'site-photos' and (storage.foldername(name))[1] = auth_org()::text and auth_role() in ('admin','technical_office','site_engineer'));
