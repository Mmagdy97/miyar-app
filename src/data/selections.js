import { createPersistedStore } from "./persisted";
import { supabase } from "../lib/supabase";

// Selections / FF&E of the signed-in office (Supabase only). Clients get a cost-free view through an RPC.
const live = createPersistedStore("live:selections", [], (x) => x, { persist: false });
const fail = (error) => window.dispatchEvent(new CustomEvent("miyar:error", { detail: error.message || String(error) }));
let orgId = null;

export const fromRow = (r) => ({
  id: r.id, projectId: r.project_id, room: r.room || "", name: r.name, supplier: r.supplier || "", phone: r.phone || "",
  dims: r.dims || "", material: r.material || "", code: r.code || "", leadDays: r.lead_days || 0, color: r.color || "", image: r.image || "",
  qty: Number(r.qty) || 1, cost: Number(r.cost) || 0, price: Number(r.price) || 0, status: r.status,
  ...(r.ordered_at ? { orderedAt: r.ordered_at } : {}), ...(r.delivered_at ? { deliveredAt: r.delivered_at } : {}),
});

async function reload() {
  let { data, error } = await supabase.from("selections").select("*").order("id");
  if (!error && !(data || []).length) ({ data, error } = await supabase.rpc("client_selections")); // clients see no table rows
  if (error) fail(error); else live.set((data || []).map(fromRow));
}

export async function attachSelections(org) {
  orgId = org || null;
  live.set([]);
  if (orgId) await reload();
}

const run = async (q) => { const { error } = await q; if (error) fail(error); await reload(); };
const day = () => new Date().toISOString().slice(0, 10);

export const selectionsRepo = {
  use: () => live.use()[0],
  add: (i) => run(supabase.from("selections").insert({
    org_id: orgId, project_id: i.projectId, room: i.room || null, name: i.name, supplier: i.supplier || null, phone: i.phone || null,
    dims: i.dims || null, material: i.material || null, code: i.code || null, lead_days: i.leadDays || 0, color: i.color || null, image: i.image || null,
    qty: i.qty, cost: i.cost, price: i.price,
  })),
  remove: (id) => run(supabase.from("selections").delete().eq("id", id)),
  setStatus: (id, status) => {
    if (status === "approved" || status === "rejected") return run(supabase.rpc("decide_selection", { p_id: id, p_status: status })); // client path; staff pass the same RPC only if client
    return run(supabase.from("selections").update({ status, ...(status === "ordered" ? { ordered_at: day() } : status === "delivered" ? { delivered_at: day() } : {}) }).eq("id", id));
  },
  orderAll: (ids) => run(supabase.from("selections").update({ status: "ordered", ordered_at: day() }).in("id", ids)),
};
