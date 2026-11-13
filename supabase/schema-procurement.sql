-- Subcontractors, their payments, and purchase orders. Run AFTER schema-attendance.sql. Admin only.
create table if not exists subcontractors (
  id bigint generated always as identity primary key,
  org_id uuid not null references organizations(id) on delete cascade,
  name text not null, trade text,
  contract numeric(14,2) not null check (contract > 0),
  created_at timestamptz not null default now()
);
create table if not exists sub_payments (
  id bigint generated always as identity primary key,
  org_id uuid not null references organizations(id) on delete cascade,
  sub_id bigint not null references subcontractors(id) on delete cascade,
  amount numeric(14,2) not null check (amount > 0),
  paid_on date not null default current_date
);
create table if not exists purchase_orders (
  id bigint generated always as identity primary key,
  org_id uuid not null references organizations(id) on delete cascade,
  no text not null, supplier text not null, item text not null,
  qty numeric(14,3) not null, price numeric(14,2) not null,
  status text not null default 'draft' check (status in ('draft','sent','received')),
  created_at timestamptz not null default now()
);
do $$ declare t text; begin
  foreach t in array array['subcontractors','sub_payments','purchase_orders'] loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists %I on %I', t||'_admin', t);
    execute format('create policy %I on %I for all using (org_id = auth_org() and auth_role() = ''admin'') with check (org_id = auth_org() and auth_role() = ''admin'')', t||'_admin', t);
  end loop;
end $$;
