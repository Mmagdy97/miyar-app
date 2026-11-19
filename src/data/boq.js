import { createPersistedStore } from "./persisted";
import { supabase } from "../lib/supabase";

// BOQ items of the signed-in office (Supabase only).
const live = createPersistedStore("live:boq", [], (x) => x, { persist: false });
const liveVersions = createPersistedStore("live:boqVersions", [], (x) => x, { persist: false });
const liveActuals = createPersistedStore("live:boqActuals", {}, (x) => x, { persist: false }); // itemId -> [{ id, amount, qty, note, date, source }]
const fail = (error) => window.dispatchEvent(new CustomEvent("miyar:error", { detail: error.message || String(error) }));
let orgId = null;

const fromRow = (r) => ({
  id: r.id, projectId: r.project_id, category: r.category || "", name: r.name, unit: r.unit || "",
  quantity: Number(r.quantity) || 0, unitCost: Number(r.unit_cost) || 0, margin: Number(r.margin) || 0, note: r.note || "",
});

async function reload() {
  const [b, a, c] = await Promise.all([
    supabase.from("boq_items").select("*").order("id"),
    supabase.from("boq_actuals").select("*").order("id"),
    supabase.from("cash_expenses").select("id, description, amount, spent_on, boq_item_id").not("boq_item_id", "is", null),
  ]);
  if (b.error) fail(b.error); else live.set((b.data || []).map(fromRow));
  // Actuals are visible to admin / accountant / technical office only; other roles just get an empty map.
  const map = {};
  for (const r of a.data || []) (map[r.boq_item_id] ||= []).push({ id: r.id, amount: Number(r.amount) || 0, qty: Number(r.qty) || 0, note: r.note || "", date: r.spent_on, source: "direct" });
  for (const r of c.data || []) (map[r.boq_item_id] ||= []).push({ id: "c" + r.id, amount: Number(r.amount) || 0, qty: 0, note: r.description, date: r.spent_on, source: "cash" });
  liveActuals.set(map);
  const v = await supabase.from("boq_versions").select("*").order("id", { ascending: false });
  liveVersions.set(v.error ? [] : (v.data || []).map((r) => ({ id: r.id, projectId: r.project_id, label: r.label, items: r.items || [], cost: Number(r.cost) || 0, price: Number(r.price) || 0, at: r.created_at })));
}

export const refreshBoq = () => reload();

export async function attachBoq(org) {
  orgId = org || null;
  live.set([]); liveActuals.set({}); liveVersions.set([]);
  if (orgId) await reload();
}

const run = async (q) => { const { error } = await q; if (error) fail(error); await reload(); };

export const boqRepo = {
  use: () => live.use()[0],
  add: (i) => run(supabase.from("boq_items").insert({ org_id: orgId, project_id: i.projectId, category: i.category || null, name: i.name, unit: i.unit || null, quantity: i.quantity, unit_cost: i.unitCost, margin: i.margin })),
  // A manual edit takes the item out of auto-sync (note = null).
  update: (id, i) => run(supabase.from("boq_items").update({ category: i.category || null, name: i.name, unit: i.unit || null, quantity: i.quantity, unit_cost: i.unitCost, margin: i.margin, note: null }).eq("id", id)),
  remove: (id) => run(supabase.from("boq_items").delete().eq("id", id)),
  actuals: () => liveActuals.use()[0],
  addActual: ({ itemId, amount, qty, note }) => run(supabase.from("boq_actuals").insert({ org_id: orgId, boq_item_id: itemId, amount, qty: qty || 0, note: note || null })),
  removeActual: (id) => run(supabase.from("boq_actuals").delete().eq("id", id)),
  versions: () => liveVersions.use()[0],
  saveVersion: ({ projectId, label, items, cost, price }) => run(supabase.from("boq_versions").insert({ org_id: orgId, project_id: projectId, label, items, cost, price })),
  removeVersion: (id) => run(supabase.from("boq_versions").delete().eq("id", id)),
  /** Apply a restore plan (lib/boqVersions restorePlan) to one project. */
  restore: async (projectId, plan) => {
    const row = (i) => ({ category: i.category || null, name: i.name, unit: i.unit || null, quantity: i.quantity, unit_cost: i.unitCost, margin: i.margin, note: null });
    const res = await Promise.all([
      ...plan.update.map((i) => supabase.from("boq_items").update(row(i)).eq("id", i.id)),
      ...(plan.insert.length ? [supabase.from("boq_items").insert(plan.insert.map((i) => ({ org_id: orgId, project_id: projectId, ...row(i) })))] : []),
      ...plan.remove.map((i) => supabase.from("boq_items").delete().eq("id", i.id)),
    ]);
    const err = res.find((r) => r.error);
    if (err) fail(err.error);
    await reload();
  },
};

/** Create/refresh the auto items of one project. create=false only refreshes existing auto items. */
export async function applyAutoBoq(projectId, generated, priceOf, { create = true } = {}) {
  const mine = live.get().filter((x) => x.projectId === projectId);
  const auto = mine.filter((x) => x.note === "auto");
  const ops = [];
  for (const g of generated) {
    const e = auto.find((x) => x.name === g.name);
    if (e) { if (e.quantity !== g.quantity) ops.push(supabase.from("boq_items").update({ quantity: g.quantity }).eq("id", e.id)); }
    else if (create && !mine.some((x) => x.name === g.name))
      ops.push(supabase.from("boq_items").insert({ org_id: orgId, project_id: projectId, category: g.cat, name: g.name, unit: g.unit, quantity: g.quantity, unit_cost: priceOf(g.name), margin: 20, note: "auto" }));
  }
  const keep = new Set(generated.map((g) => g.name));
  for (const e of auto) if (!keep.has(e.name)) ops.push(supabase.from("boq_items").delete().eq("id", e.id));
  const res = await Promise.all(ops);
  const err = res.find((r) => r.error);
  if (err) fail(err.error);
  await reload();
  return ops.length;
}

export const itemCost = (i) => i.quantity * i.unitCost;
export const itemPrice = (i) => itemCost(i) * (1 + i.margin / 100);
export const boqTotals = (items) => {
  const cost = items.reduce((s, i) => s + itemCost(i), 0);
  const price = items.reduce((s, i) => s + itemPrice(i), 0);
  return { cost, price, profit: price - cost };
};
