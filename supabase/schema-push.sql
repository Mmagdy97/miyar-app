-- Web Push: subscriptions + notification triggers. Run AFTER schema-secretary.sql (notify_admins) and schema-quote.sql / schema-actuals.sql / schema-reports.sql.
-- Needs the pg_net extension (Dashboard > Database > Extensions > pg_net ON).
create extension if not exists pg_net;

create table if not exists push_subscriptions (
  endpoint text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  p256dh text not null, auth text not null,
  created_at timestamptz not null default now()
);
alter table push_subscriptions enable row level security;
drop policy if exists push_own on push_subscriptions;
create policy push_own on push_subscriptions for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Every notification row triggers a push (the Edge Function ignores users without a subscription).
create or replace function trg_notification_push() returns trigger language plpgsql security definer set search_path = public, extensions as $$
begin
  perform net.http_post(
    url := 'https://ekpjeurepyqwhmankjxk.supabase.co/functions/v1/send-push',
    headers := jsonb_build_object('Content-Type', 'application/json', 'x-push-secret', 'PUSH_SECRET_HERE'),
    body := jsonb_build_object('record', to_jsonb(new)));
  return new;
end $$;
drop trigger if exists notification_push on notifications;
create trigger notification_push after insert on notifications for each row execute function trg_notification_push();

-- Client gets a notification when a daily report is published
create or replace function trg_report_notify() returns trigger language plpgsql security definer set search_path = public as $$
declare v_client uuid; v_name text;
begin
  select client_id, name into v_client, v_name from projects where id = new.project_id;
  if v_client is not null then
    insert into notifications(org_id, target_user, type, title, body) values (new.org_id, v_client, 'report', 'تقرير جديد من الموقع', v_name || coalesce(' — ' || left(new.note, 80), ''));
  end if;
  return new;
end $$;
drop trigger if exists report_notify on daily_reports;
create trigger report_notify after insert on daily_reports for each row execute function trg_report_notify();

-- Client gets a notification when a quote is sent
create or replace function send_quote(p_project bigint, p_quote jsonb, p_total numeric) returns void
language plpgsql security definer set search_path = public as $$
declare v_client uuid; v_name text;
begin
  if auth_role() not in ('admin','technical_office') then raise exception 'not allowed'; end if;
  update projects set quote = p_quote, quote_total = p_total, quote_status = 'sent', quote_sent_at = now(), quote_approved_at = null
   where id = p_project and org_id = auth_org() returning client_id, name into v_client, v_name;
  if not found then raise exception 'project not found'; end if;
  if v_client is not null then
    insert into notifications(org_id, target_user, type, title, body) values (auth_org(), v_client, 'quote', 'عرض سعر جديد بانتظار موافقتك', v_name);
  end if;
end $$;

-- Admins are alerted when an item's actual spend first passes 90% or 100% of its budget
create or replace function trg_budget_alert() returns trigger language plpgsql security definer set search_path = public as $$
declare v_item bigint; v_org uuid; v_budget numeric; v_name text; v_before numeric; v_after numeric;
begin
  v_item := new.boq_item_id;
  if v_item is null then return new; end if;
  select org_id, quantity * unit_cost, name into v_org, v_budget, v_name from boq_items where id = v_item;
  if coalesce(v_budget, 0) <= 0 then return new; end if;
  select coalesce((select sum(amount) from boq_actuals where boq_item_id = v_item), 0) + coalesce((select sum(amount) from cash_expenses where boq_item_id = v_item), 0) into v_after;
  v_before := v_after - new.amount;
  if v_before / v_budget < 1 and v_after / v_budget >= 1 then
    insert into notifications(org_id, target_user, target_role, type, title, body)
      select v_org, p.id, 'admin', 'budget', 'بند تجاوز ميزانيته', v_name from profiles p where p.org_id = v_org and p.role = 'admin';
  elsif v_before / v_budget < 0.9 and v_after / v_budget >= 0.9 then
    insert into notifications(org_id, target_user, target_role, type, title, body)
      select v_org, p.id, 'admin', 'budget', 'بند وصل 90% من ميزانيته', v_name from profiles p where p.org_id = v_org and p.role = 'admin';
  end if;
  return new;
end $$;
drop trigger if exists budget_alert_a on boq_actuals;
create trigger budget_alert_a after insert on boq_actuals for each row execute function trg_budget_alert();
drop trigger if exists budget_alert_c on cash_expenses;
create trigger budget_alert_c after insert on cash_expenses for each row execute function trg_budget_alert();
