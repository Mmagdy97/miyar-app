-- v2: Professional 4 / Office 8 active projects. Project limit counts purchased extra projects (organizations.extra_projects).
create or replace function enforce_project_limit() returns trigger language plpgsql security definer set search_path = public as $$
declare v_plan text; v_status text; v_limit int; v_count int; v_extra int;
begin
  select plan, status, coalesce(extra_projects,0) into v_plan, v_status, v_extra from organizations where id = new.org_id;
  if v_status = 'suspended' then raise exception 'organization suspended'; end if;
  v_limit := case v_plan when 'free' then 1 when 'pro' then 4 when 'office' then 8 else null end;
  if v_limit is null then return new; end if;
  v_limit := v_limit + v_extra;
  select count(*) into v_count from projects where org_id = new.org_id and coalesce(status,'') <> 'completed';
  if v_count >= v_limit then raise exception 'project limit reached for plan %', v_plan using errcode = 'P0001'; end if;
  return new;
end $$;
