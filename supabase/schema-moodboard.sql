-- Moodboard tiles. Run AFTER schema-selections.sql.
-- Staff manage tiles; the project's client reads them and toggles "liked" through toggle_tile_like().
create table if not exists mood_tiles (
  id bigint generated always as identity primary key,
  org_id uuid not null references organizations(id) on delete cascade,
  project_id bigint not null references projects(id) on delete cascade,
  kind text not null check (kind in ('image','color','note')),
  value text not null, caption text,
  liked boolean not null default false,
  created_at timestamptz not null default now()
);
alter table mood_tiles enable row level security;
create policy mood_staff on mood_tiles for all
  using (org_id = auth_org() and auth_role() in ('admin','technical_office'))
  with check (org_id = auth_org() and auth_role() in ('admin','technical_office'));
create policy mood_client on mood_tiles for select
  using (exists (select 1 from projects p where p.id = project_id and p.client_id = auth.uid()));

create or replace function toggle_tile_like(p_id bigint) returns void
language plpgsql security definer set search_path = public as $$
begin
  update mood_tiles t set liked = not liked
    where t.id = p_id and exists (select 1 from projects p where p.id = t.project_id and (p.client_id = auth.uid() or (p.org_id = auth_org() and auth_role() in ('admin','technical_office'))));
  if not found then raise exception 'not allowed'; end if;
end $$;
