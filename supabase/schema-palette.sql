-- Office colour palette (chosen by the office admin).
alter table organizations add column if not exists palette text not null default 'teal';
alter table organizations add column if not exists palette_color text;

create or replace function set_org_palette(p_palette text, p_color text) returns void language plpgsql security definer set search_path = public as $$
begin
  if auth_role() <> 'admin' or auth_org() is null then raise exception 'not allowed'; end if;
  if p_palette not in ('teal','indigo','forest','burgundy','slate','bronze','terra','custom') then raise exception 'bad palette'; end if;
  if p_palette = 'custom' and (p_color is null or p_color !~ '^#[0-9a-fA-F]{6}$') then raise exception 'bad color'; end if;
  update organizations set palette = p_palette, palette_color = case when p_palette = 'custom' then p_color else null end where id = auth_org();
end $$;
grant execute on function set_org_palette(text, text) to authenticated;
