import { createPersistedStore } from "./persisted";
import { supabase } from "../lib/supabase";
import { addPayment, editPayment } from "../lib/procurement";

// Subcontractors, their payments and purchase orders of the signed-in office (Supabase only).
const live = createPersistedStore("live:procurement", { subs: [], pos: [] }, (x) => x, { persist: false });
const fail = (error) => window.dispatchEvent(new CustomEvent("miyar:error", { detail: error.message || String(error) }));
let orgId = null;

/** Rows -> the shapes the demo stores use (subs carry payments[] and a paid total). */
export function toState(subRows, payRows, poRows) {
  const subs = subRows.map((s) => {
    const payments = payRows.filter((p) => p.sub_id === s.id).map((p) => ({ id: p.id, amount: Number(p.amount), date: p.paid_on }));
    return { id: s.id, name: s.name, trade: s.trade || "", contract: Number(s.contract), payments, paid: payments.reduce((a, p) => a + p.amount, 0) };
  });
  const pos = poRows.map((p) => ({ id: p.id, no: p.no, supplier: p.supplier, item: p.item, qty: Number(p.qty), price: Number(p.price), status: p.status }));
  return { subs, pos };
}

async function reload() {
  const [s, p, o] = await Promise.all([
    supabase.from("subcontractors").select("*").order("id"),
    supabase.from("sub_payments").select("*").order("id"),
    supabase.from("purchase_orders").select("*").order("id", { ascending: false }),
  ]);
  const err = s.error || p.error || o.error;
  if (err) return fail(err);
  live.set(toState(s.data || [], p.data || [], o.data || []));
}

export async function attachProcurement(org) {
  orgId = org || null;
  live.set({ subs: [], pos: [] });
  if (orgId) await reload();
}

const run = async (q) => { const { error } = await q; if (error) fail(error); await reload(); };

export const procurementRepo = {
  use: () => live.use()[0],
  addSub: ({ name, trade, contract }) => run(supabase.from("subcontractors").insert({ org_id: orgId, name, trade: trade || null, contract })),
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
  addPo: (po, count) => run(supabase.from("purchase_orders").insert({ org_id: orgId, no: "PO-" + String(count + 1).padStart(3, "0"), ...po })),
  setPoStatus: (id, status) => run(supabase.from("purchase_orders").update({ status }).eq("id", id)),
};
