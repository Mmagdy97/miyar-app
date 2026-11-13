import { createPersistedStore } from "./persisted";
import { supabase } from "../lib/supabase";

// BOQ items of the signed-in office (Supabase only).
const live = createPersistedStore("live:boq", [], (x) => x, { persist: false });
const fail = (error) => window.dispatchEvent(new CustomEvent("miyar:error", { detail: error.message || String(error) }));
let orgId = null;

const fromRow = (r) => ({
  id: r.id, projectId: r.project_id, category: r.category || "", name: r.name, unit: r.unit || "",
  quantity: Number(r.quantity) || 0, unitCost: Number(r.unit_cost) || 0, margin: Number(r.margin) || 0, note: r.note || "",
});

async function reload() {
  const { data, error } = await supabase.from("boq_items").select("*").order("id");
  if (error) fail(error); else live.set((data || []).map(fromRow));
}

export async function attachBoq(org) {
  orgId = org || null;
  live.set([]);
  if (orgId) await reload();
}

const run = async (q) => { const { error } = await q; if (error) fail(error); await reload(); };

export const boqRepo = {
  use: () => live.use()[0],
  add: (i) => run(supabase.from("boq_items").insert({ org_id: orgId, project_id: i.projectId, category: i.category || null, name: i.name, unit: i.unit || null, quantity: i.quantity, unit_cost: i.unitCost, margin: i.margin })),
  remove: (id) => run(supabase.from("boq_items").delete().eq("id", id)),
};

export const itemCost = (i) => i.quantity * i.unitCost;
export const itemPrice = (i) => itemCost(i) * (1 + i.margin / 100);
export const boqTotals = (items) => {
  const cost = items.reduce((s, i) => s + itemCost(i), 0);
  const price = items.reduce((s, i) => s + itemPrice(i), 0);
  return { cost, price, profit: price - cost };
};
