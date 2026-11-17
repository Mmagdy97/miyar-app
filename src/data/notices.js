import { supabase } from "../lib/supabase";
import { createPersistedStore } from "./persisted";

// Live notifications for the signed-in member (rows addressed to them in `notifications`).
const live = createPersistedStore("live:notices", [], (x) => x, { persist: false });
let timer = null;

export async function loadNotices() {
  if (!supabase) return;
  const { data } = await supabase.from("notifications").select("id, type, title, body, read, created_at").order("id", { ascending: false }).limit(30);
  live.set((data || []).map((n) => ({
    id: "n" + n.id, nid: n.id, live: true, title: n.title, subtitle: n.body || "", category: "تنبيه",
    timestamp: new Date(n.created_at).toLocaleString("ar-EG-u-nu-latn", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }),
    unread: !n.read,
  })));
}

export const noticesRepo = {
  use: () => live.use()[0],
  markRead: async () => { await supabase.from("notifications").update({ read: true }).eq("read", false); await loadNotices(); },
  /** Start polling for a signed-in account (pass false to stop). */
  attach: (on) => {
    clearInterval(timer); timer = null;
    if (!on) { live.set([]); return; }
    loadNotices();
    timer = setInterval(loadNotices, 30000);
  },
};
