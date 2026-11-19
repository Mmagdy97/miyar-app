import { createPersistedStore } from "./persisted";
import { supabase } from "../lib/supabase";
import { addPayment, editPayment } from "../lib/procurement";

// Subcontractors, their payments and purchase orders of the signed-in office (Supabase only).
const live = createPersistedStore("live:procurement", { subs: [], pos: [], quotes: [] }, (x) => x, { persist: false });
const fail = (error) => window.dispatchEvent(new CustomEvent("miyar:error", { detail: error.message || String(error) }));
let orgId = null;

/** Rows -> the shapes the demo stores use (subs carry payments[] and a paid total). */
export function toState(subRows, payRows, poRows, quoteRows = []) {
  const subs = subRows.map((s) => {
    const payments = payRows.filter((p) => p.sub_id === s.id).map((p) => ({ id: p.id, amount: Number(p.amount), date: p.paid_on }));
    return { id: s.id, projectId: s.project_id ?? null, name: s.name, trade: s.trade || "", contract: Number(s.contract), payments, paid: payments.reduce((a, p) => a + p.amount, 0) };
  });
  const pos = poRows.map((p) => ({ id: p.id, projectId: p.project_id ?? null, no: p.no, supplier: p.supplier, item: p.item, qty: Number(p.qty), price: Number(p.price), status: p.status }));
  const quotes = quoteRows.map((q) => ({ id: q.id, projectId: q.project_id ?? null, item: q.item, qty: Number(q.qty), supplier: q.supplier, price: Number(q.price), leadDays: q.lead_days ?? null, status: q.status }));
  return { subs, pos, quotes };
}

async function reload() {
  const [s, p, o] = await Promise.all([
    supabase.from("subcontractors").select("*").order("id"),
    supabase.from("sub_payments").select("*").order("id"),
    supabase.from("purchase_orders").select("*").order("id", { ascending: false }),
  ]);
  const err = s.error || p.error || o.error;
  if (err) return fail(err);
  const q = await supabase.from("supplier_quotes").select("*").order("id");
  live.set(toState(s.data || [], p.data || [], o.data || [], q.error ? [] : q.data || []));
}

export async function attachProcurement(org) {
  orgId = org || null;
  live.set({ subs: [], pos: [], quotes: [] });
  if (orgId) await reload();
}

const run = async (q) => { const { error } = await q; if (error) fail(error); await reload(); };

export const procurementRepo = {
  use: () => live.use()[0],
  addSub: ({ name, trade, contract, projectId }) => run(supabase.from("subcontractors").insert({ org_id: orgId, name, trade: trade || null, contract, project_id: projectId ?? null })),
  pay: (sub, amount) => {
    const next = addPayment(sub, amount);
    if (next === sub) return;
    return run(supabase.from("sub_payments").insert({ org_id: orgId, sub_id: sub.id, amount: next.payments[next.payments.length - 1].amount }));
  },
  editPay: (sub, pid, amount) => {
    const next = editPayment(sub, pid, amount);
    const p = next.payments.find((x) => x.id === pid);
    if (next === sub || !p) return;
    return run(supabase.from("sub_payments").update({ amount: p.amount }).eq("id", pid));
  },
  delPay: (pid) => run(supabase.from("sub_payments").delete().eq("id", pid)),
  addPo: ({ projectId, ...po }, count) => run(supabase.from("purchase_orders").insert({ org_id: orgId, no: "PO-" + String(count + 1).padStart(3, "0"), project_id: projectId ?? null, ...po })),
  addQuote: (q) => run(supabase.from("supplier_quotes").insert({ org_id: orgId, project_id: q.projectId ?? null, item: q.item, qty: q.qty, supplier: q.supplier, price: q.price, lead_days: q.leadDays ?? null })),
  delQuote: (id) => run(supabase.from("supplier_quotes").delete().eq("id", id)),
  /** Award one quote of a group: it becomes a purchase order, the others are rejected. */
  award: async (q, group, count) => {
    const res = await Promise.all([
      supabase.from("supplier_quotes").update({ status: "awarded" }).eq("id", q.id),
      ...group.filter((x) => x.id !== q.id && x.status === "open").map((x) => supabase.from("supplier_quotes").update({ status: "rejected" }).eq("id", x.id)),
      supabase.from("purchase_orders").insert({ org_id: orgId, no: "PO-" + String(count + 1).padStart(3, "0"), project_id: q.projectId ?? null, supplier: q.supplier, item: q.item, qty: q.qty, price: q.price }),
    ]);
    const err = res.find((r) => r.error);
    if (err) fail(err.error);
    await reload();
  },
  setPoStatus: (id, status) => run(supabase.from("purchase_orders").update({ status }).eq("id", id)),
};
