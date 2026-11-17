-- Client quote: frozen snapshot of the BOQ (prices only, no cost/margin) + client approval.
alter table projects add column if not exists quote jsonb;
alter table projects add column if not exists quote_status text not null default 'none' check (quote_status in ('none','sent','approved'));
alter table projects add column if not exists quote_total numeric(14,2);
alter table projects add column if not exists quote_sent_at timestamptz;
alter table projects add column if not exists quote_approved_at timestamptz;

create or replace function send_quote(p_project bigint, p_quote jsonb, p_total numeric) returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth_role() not in ('admin','technical_office') then raise exception 'not allowed'; end if;
  update projects set quote = p_quote, quote_total = p_total, quote_status = 'sent', quote_sent_at = now(), quote_approved_at = null
   where id = p_project and org_id = auth_org();
  if not found then raise exception 'project not found'; end if;
end $$;

create or replace function approve_quote(p_project bigint) returns void
language plpgsql security definer set search_path = public as $$
declare v_name text; v_who text;
begin
  select name into v_name from projects where id = p_project and client_id = auth.uid() and quote_status = 'sent';
  if v_name is null then raise exception 'no quote to approve'; end if;
  update projects set quote_status = 'approved', quote_approved_at = now() where id = p_project;
  select full_name into v_who from profiles where id = auth.uid();
  perform notify_admins('quote_approved', 'العميل وافق على عرض السعر', v_name || ' — ' || coalesce(v_who, ''));
end $$;
revoke all on function send_quote(bigint, jsonb, numeric), approve_quote(bigint) from public, anon;
grant execute on function send_quote(bigint, jsonb, numeric), approve_quote(bigint) to authenticated;
