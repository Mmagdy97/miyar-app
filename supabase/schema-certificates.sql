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
create policy cert_admin on certificates for all
  using (org_id = auth_org() and auth_role() = 'admin') with check (org_id = auth_org() and auth_role() = 'admin');
