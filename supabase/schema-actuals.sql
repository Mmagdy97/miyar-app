-- Actual cost vs BOQ: direct entries + petty-cash expenses linked to a BOQ item.
alter table cash_expenses add column if not exists boq_item_id bigint references boq_items(id) on delete set null;

create table if not exists boq_actuals (
  id bigint generated always as identity primary key,
  org_id uuid not null references organizations(id) on delete cascade,
  boq_item_id bigint not null references boq_items(id) on delete cascade,
  qty numeric(14,3) not null default 0,
  amount numeric(14,2) not null check (amount > 0),
  note text,
  spent_on date not null default current_date,
  created_at timestamptz not null default now()
);
alter table boq_actuals enable row level security;
drop policy if exists actuals_rw on boq_actuals;
create policy actuals_rw on boq_actuals for all
  using (org_id = auth_org() and auth_role() in ('admin','accountant','technical_office'))
  with check (org_id = auth_org() and auth_role() in ('admin','accountant','technical_office'));
