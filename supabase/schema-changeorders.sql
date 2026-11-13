-- Change orders. Run AFTER schema-procurement.sql.
-- Staff raise and send them; the project's client approves/rejects through decide_change_order().
create table if not exists change_orders (
  id bigint generated always as identity primary key,
  org_id uuid not null references organizations(id) on delete cascade,
  project_id bigint not null references projects(id) on delete cascade,
  no int not null,
  title text not null, descr text,
  cost numeric(14,2) not null default 0,
  days int not null default 0,
  status text not null default 'draft' check (status in ('draft','sent','approved','rejected')),
  created_at timestamptz not null default now()
);
alter table change_orders enable row level security;
create policy co_staff on change_orders for all
  using (org_id = auth_org() and auth_role() in ('admin','technical_office'))
  with check (org_id = auth_org() and auth_role() in ('admin','technical_office'));
create policy co_client on change_orders for select
  using (status <> 'draft' and exists (select 1 from projects p where p.id = project_id and p.client_id = auth.uid()));

create or replace function decide_change_order(p_id bigint, p_status text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if p_status not in ('approved','rejected') then raise exception 'bad status'; end if;
  update change_orders c set status = p_status
    where c.id = p_id and c.status = 'sent'
      and exists (select 1 from projects p where p.id = c.project_id and p.client_id = auth.uid());
  if not found then raise exception 'not allowed'; end if;
end $$;
