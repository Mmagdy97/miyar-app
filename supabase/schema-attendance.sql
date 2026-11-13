-- Labour attendance (الحضور والعمالة). Run AFTER schema-team.sql.
create table if not exists workers (
  id bigint generated always as identity primary key,
  org_id uuid not null references organizations(id) on delete cascade,
  name text not null, trade text,
  rate numeric(12,2) not null check (rate > 0),
  created_at timestamptz not null default now()
);
create table if not exists attendance (
  id bigint generated always as identity primary key,
  org_id uuid not null references organizations(id) on delete cascade,
  worker_id bigint not null references workers(id) on delete cascade,
  day date not null,
  status text not null check (status in ('present','half','absent')),
  ot numeric(4,1) not null default 0,
  rate numeric(12,2) not null,         -- the day's rate, so later rate changes never rewrite history
  unique (worker_id, day)
);
alter table workers enable row level security;
alter table attendance enable row level security;
drop policy if exists workers_staff on workers;
create policy workers_staff on workers for all
  using (org_id = auth_org() and is_staff()) with check (org_id = auth_org() and is_staff());
drop policy if exists attendance_staff on attendance;
create policy attendance_staff on attendance for all
  using (org_id = auth_org() and is_staff()) with check (org_id = auth_org() and is_staff());
