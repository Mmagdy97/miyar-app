import { createPersistedStore } from "./persisted";
import { supabase } from "../lib/supabase";

// Invoices of the signed-in office (Supabase only, never localStorage).
const live = createPersistedStore("live:invoices", [], (x) => x, { persist: false });
const fail = (error) => window.dispatchEvent(new CustomEvent("miyar:error", { detail: error.message || String(error) }));
let orgId = null;

const fromRow = (r) => ({
  id: r.id, projectId: r.project_id, title: r.title, amount: Number(r.amount) || 0, dueDate: r.due_date || "",
  paid: Boolean(r.paid), paidDate: r.paid_at ? String(r.paid_at).slice(0, 10) : "", receiptNo: `RC-${String(r.id).padStart(5, "0")}`,
});

async function reload() {
  const { data, error } = await supabase.from("invoices").select("*").order("id", { ascending: false });
  if (error) fail(error); else live.set((data || []).map(fromRow));
}

export async function attachInvoices(org) {
  orgId = org || null;
  live.set([]);
  if (orgId) await reload();
}

const run = async (q) => { const { error } = await q; if (error) fail(error); await reload(); };

export const invoicesRepo = {
  use: () => live.use()[0],
  add: ({ projectId, title, amount, dueDate }) =>
    run(supabase.from("invoices").insert({ org_id: orgId, project_id: projectId, title, amount, due_date: dueDate || null })),
  markPaid: (id) => run(supabase.from("invoices").update({ paid: true, paid_at: new Date().toISOString() }).eq("id", id)),
  remove: (id) => run(supabase.from("invoices").delete().eq("id", id)),
};

export const invoiceTotals = (rows) => {
  const total = rows.reduce((s, i) => s + i.amount, 0);
  const paid = rows.filter((i) => i.paid).reduce((s, i) => s + i.amount, 0);
  return { total, paid, due: total - paid };
};
export const isOverdue = (i, today = new Date().toISOString().slice(0, 10)) => !i.paid && i.dueDate && i.dueDate < today;
