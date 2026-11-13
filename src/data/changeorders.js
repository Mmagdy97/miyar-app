import { createPersistedStore } from "./persisted";
import { supabase } from "../lib/supabase";

// Change orders of the signed-in office (Supabase only).
const live = createPersistedStore("live:changeorders", [], (x) => x, { persist: false });
const fail = (error) => window.dispatchEvent(new CustomEvent("miyar:error", { detail: error.message || String(error) }));
let orgId = null;

export const fromRow = (r) => ({
  id: r.id, projectId: r.project_id, no: r.no, title: r.title, desc: r.descr || "",
  cost: Number(r.cost) || 0, days: r.days || 0, status: r.status, date: String(r.created_at || "").slice(0, 10),
});

async function reload() {
  const { data, error } = await supabase.from("change_orders").select("*").order("id", { ascending: false });
  if (error) fail(error); else live.set((data || []).map(fromRow));
}

export async function attachChangeOrders(org) {
  orgId = org || null;
  live.set([]);
  if (orgId) await reload();
}

const run = async (q) => { const { error } = await q; if (error) fail(error); await reload(); };

export const changeOrdersRepo = {
  use: () => live.use()[0],
  add: (o) => run(supabase.from("change_orders").insert({ org_id: orgId, project_id: o.projectId, no: o.no, title: o.title, descr: o.desc || null, cost: o.cost, days: o.days })),
  setStatus: (id, status) =>
    run(status === "sent" ? supabase.from("change_orders").update({ status }).eq("id", id) : supabase.rpc("decide_change_order", { p_id: id, p_status: status })),
};
