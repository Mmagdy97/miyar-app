-- Supplier quotes (compare before ordering) + project link on purchase orders and subcontracts (committed cost per project).
alter table purchase_orders add column if not exists project_id bigint references projects(id) on delete set null;
alter table subcontractors add column if not exists project_id bigint references projects(id) on delete set null;

create table if not exists supplier_quotes (
  id bigint generated always as identity primary key,
  org_id uuid not null references organizations(id) on delete cascade,
  project_id bigint references projects(id) on delete cascade,
  item text not null,
  qty numeric(14,3) not null check (qty > 0),
  supplier text not null,
  price numeric(14,2) not null check (price >= 0),
  lead_days int check (lead_days >= 0),
  status text not null default 'open' check (status in ('open','awarded','rejected')),
  created_at timestamptz not null default now()
);
alter table supplier_quotes enable row level security;
drop policy if exists sq_admin on supplier_quotes;
create policy sq_admin on supplier_quotes for all
  using (org_id = auth_org() and auth_role() = 'admin')
  with check (org_id = auth_org() and auth_role() = 'admin');
