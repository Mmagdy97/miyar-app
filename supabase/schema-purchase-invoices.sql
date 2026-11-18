-- Purchase invoices (supplier invoices) with per-invoice client visibility. Files live in private bucket 'purchase-invoices' at <org_id>/<project_id>/<file>.
create table if not exists purchase_invoices (
  id bigint generated always as identity primary key,
  org_id uuid not null references organizations(id) on delete cascade,
  project_id bigint not null references projects(id) on delete cascade,
  title text not null,
  supplier text,
  amount numeric not null default 0,
  file_path text,
  visible_to_client boolean not null default false,
  archived_at timestamptz,
  created_at timestamptz not null default now()
);
alter table purchase_invoices enable row level security;
drop policy if exists pinv_staff on purchase_invoices;
create policy pinv_staff on purchase_invoices for all
  using (org_id = auth_org() and auth_role() in ('admin','accountant'))
  with check (org_id = auth_org() and auth_role() in ('admin','accountant'));
drop policy if exists pinv_client on purchase_invoices;
create policy pinv_client on purchase_invoices for select to authenticated
  using (visible_to_client and archived_at is null and exists (select 1 from projects p where p.id = project_id and p.client_id = auth.uid()));

insert into storage.buckets (id, name, public) values ('purchase-invoices', 'purchase-invoices', false) on conflict (id) do nothing;
drop policy if exists pinvf_staff on storage.objects;
create policy pinvf_staff on storage.objects for all to authenticated
  using (bucket_id = 'purchase-invoices' and (storage.foldername(name))[1] = auth_org()::text and auth_role() in ('admin','accountant'))
  with check (bucket_id = 'purchase-invoices' and (storage.foldername(name))[1] = auth_org()::text and auth_role() in ('admin','accountant'));
drop policy if exists pinvf_client on storage.objects;
create policy pinvf_client on storage.objects for select to authenticated
  using (bucket_id = 'purchase-invoices' and exists (
    select 1 from purchase_invoices i join projects p on p.id = i.project_id
    where i.file_path = name and i.visible_to_client and i.archived_at is null and p.client_id = auth.uid()));
