// Supabase Edge Function "send-push" (paste into Dashboard > Edge Functions > New function, name: send-push).
// Secrets: VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT (mailto:you@example.com), PUSH_SECRET.
// Called by the database trigger on `notifications` inserts (supabase/schema-push.sql).
import webpush from "npm:web-push@3.6.7";
import { createClient } from "npm:@supabase/supabase-js@2";

webpush.setVapidDetails(Deno.env.get("VAPID_SUBJECT")!, Deno.env.get("VAPID_PUBLIC_KEY")!, Deno.env.get("VAPID_PRIVATE_KEY")!);
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

Deno.serve(async (req) => {
  if (req.headers.get("x-push-secret") !== Deno.env.get("PUSH_SECRET")) return new Response("forbidden", { status: 403 });
  const { record } = await req.json();
  if (!record?.target_user) return new Response("no target");
  const { data: subs } = await db.from("push_subscriptions").select("*").eq("user_id", record.target_user);
  const payload = JSON.stringify({ title: record.title, body: record.body || "", tag: record.type || undefined, url: "/" });
  await Promise.all((subs || []).map(async (s) => {
    try { await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payload); }
    catch (e) { if (e?.statusCode === 404 || e?.statusCode === 410) await db.from("push_subscriptions").delete().eq("endpoint", s.endpoint); }
  }));
  return new Response("ok");
});
