-- Client selections / FF&E. Run AFTER schema-certificates.sql.
-- Staff manage everything. Clients never read the table (it holds cost + supplier): they use client_selections()
-- and decide with decide_selection().
create table if not exists selections (
  id bigint generated always as identity primary key,
  org_id uuid not null references organizations(id) on delete cascade,
  project_id bigint not null references projects(id) on delete cascade,
  room text, name text not null, supplier text, phone text,
  dims text, material text, code text, lead_days int not null default 0, color text, image text,
  qty numeric(10,2) not null default 1, cost numeric(14,2) not null default 0, price numeric(14,2) not null,
  status text not null default 'proposed' check (status in ('proposed','approved','rejected','ordered','delivered','installed')),
  ordered_at date, delivered_at date,
  created_at timestamptz not null default now()
);
alter table selections enable row level security;
drop policy if exists sel_staff on selections;
create policy sel_staff on selections for all
  using (org_id = auth_org() and auth_role() in ('admin','technical_office'))
  with check (org_id = auth_org() and auth_role() in ('admin','technical_office'));

create or replace function client_selections() returns table(
  id bigint, project_id bigint, room text, name text, dims text, material text, code text, lead_days int,
  color text, image text, qty numeric, price numeric, status text, ordered_at date, delivered_at date)
language sql stable security definer set search_path = public as $$
  select s.id, s.project_id, s.room, s.name, s.dims, s.material, s.code, s.lead_days,
         s.color, s.image, s.qty, s.price, s.status, s.ordered_at, s.delivered_at
  from selections s join projects p on p.id = s.project_id
  where p.client_id = auth.uid()
$$;

create or replace function decide_selection(p_id bigint, p_status text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if p_status not in ('approved','rejected') then raise exception 'bad status'; end if;
  update selections s set status = p_status
    where s.id = p_id and s.status = 'proposed'
      and (exists (select 1 from projects p where p.id = s.project_id and p.client_id = auth.uid())
           or (s.org_id = auth_org() and auth_role() in ('admin','technical_office')));
  if not found then raise exception 'not allowed'; end if;
end $$;
