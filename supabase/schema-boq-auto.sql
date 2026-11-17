-- Project spec (drives auto-BOQ) + office price list
alter table projects add column if not exists area numeric(10,2);
alter table projects add column if not exists rooms int;
alter table projects add column if not exists bathrooms int;
alter table projects add column if not exists ceiling_height numeric(4,2) default 2.8;
alter table projects add column if not exists project_type text;
alter table projects add column if not exists finish_level text default 'mid' check (finish_level in ('eco','mid','lux'));

create table if not exists price_list (
  org_id uuid not null references organizations(id) on delete cascade,
  item text not null, unit text,
  eco numeric(14,2), mid numeric(14,2), lux numeric(14,2),
  primary key (org_id, item)
);
alter table price_list enable row level security;
drop policy if exists price_read on price_list;
create policy price_read on price_list for select using (org_id = auth_org() and (is_staff() or auth_role() in ('accountant','secretary')));
drop policy if exists price_write on price_list;
create policy price_write on price_list for all
  using (org_id = auth_org() and auth_role() in ('admin','technical_office','accountant'))
  with check (org_id = auth_org() and auth_role() in ('admin','technical_office','accountant'));
