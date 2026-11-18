-- Archive instead of delete (invoices, custodies, expenses) + automatic purge by plan retention.
alter table invoices add column if not exists archived_at timestamptz;
alter table cash_custodies add column if not exists archived_at timestamptz;
alter table cash_expenses add column if not exists archived_at timestamptz;

create or replace function purge_archived() returns void language plpgsql security definer set search_path = public as $$
declare v_org uuid := auth_org(); v_days int;
begin
  if v_org is null then return; end if;
  select case plan when 'free' then 30 when 'pro' then 365 else null end into v_days from organizations where id = v_org;
  if v_days is null then return; end if;
  delete from cash_expenses where org_id = v_org and archived_at < now() - make_interval(days => v_days);
  delete from cash_custodies where org_id = v_org and archived_at < now() - make_interval(days => v_days);
  delete from invoices where org_id = v_org and archived_at < now() - make_interval(days => v_days);
end $$;
grant execute on function purge_archived() to authenticated;
