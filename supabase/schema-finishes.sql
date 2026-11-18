-- Finish options with price per m2 (office price list shown in the client calculator).
create table if not exists finish_options (
  id bigint generated always as identity primary key,
  org_id uuid not null references organizations(id) on delete cascade,
  category text not null,
  name text not null,
  price numeric not null check (price >= 0)
);
alter table finish_options enable row level security;
drop policy if exists fo_admin on finish_options;
create policy fo_admin on finish_options for all
  using (org_id = auth_org() and auth_role() in ('admin','technical_office'))
  with check (org_id = auth_org() and auth_role() in ('admin','technical_office'));
drop policy if exists fo_client on finish_options;
create policy fo_client on finish_options for select
  using (org_id = auth_org() and auth_role() = 'client');
