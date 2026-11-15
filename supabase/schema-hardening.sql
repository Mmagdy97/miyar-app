-- RLS hardening (run once in the Supabase SQL editor, safe to re-run).
-- 1) Clients must never read BOQ cost price / margin (boq_items has unit_cost + margin).
drop policy if exists boq_client on boq_items;

-- 2) Profiles: org-wide read is for staff only; a client sees just their own row (no other clients' names/emails).
drop policy if exists profiles_read on profiles;
create policy profiles_read on profiles for select
  using (id = auth.uid() or (org_id = auth_org() and is_staff()));

-- 3) Petty-cash settlement requests can only be filed by staff (not clients) for themselves.
drop policy if exists exp_insert on expenses;
create policy exp_insert on expenses for insert
  with check (org_id = auth_org() and engineer_id = auth.uid() and is_staff());

-- 4) Notifications: marking as read must not let the row be re-targeted or moved to another org.
drop policy if exists notif_mark on notifications;
create policy notif_mark on notifications for update
  using (target_user = auth.uid())
  with check (target_user = auth.uid() and org_id = auth_org());
