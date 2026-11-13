-- Petty cash (العهد): admin gives a custody to a named holder, then records expenses against it.
create table if not exists cash_custodies (
  id bigint generated always as identity primary key,
  org_id uuid not null references organizations(id) on delete cascade,
  project_id bigint references projects(id) on delete set null,
  holder text not null,
  amount numeric(14,2) not null check (amount > 0),
  created_at timestamptz not null default now()
);
create table if not exists cash_expenses (
  id bigint generated always as identity primary key,
  org_id uuid not null references organizations(id) on delete cascade,
  custody_id bigint not null references cash_custodies(id) on delete cascade,
  description text not null,
  category text,
  amount numeric(14,2) not null check (amount > 0),
  spent_on date not null default current_date,
  created_at timestamptz not null default now()
);
alter table cash_custodies enable row level security;
alter table cash_expenses enable row level security;
create policy cust_admin on cash_custodies for all
  using (org_id = auth_org() and auth_role() = 'admin') with check (org_id = auth_org() and auth_role() = 'admin');
create policy cexp_admin on cash_expenses for all
  using (org_id = auth_org() and auth_role() = 'admin') with check (org_id = auth_org() and auth_role() = 'admin');
