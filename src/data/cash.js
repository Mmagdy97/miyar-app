import { createPersistedStore } from "./persisted";
import { supabase } from "../lib/supabase";

// Petty cash of the signed-in office (Supabase only).
const live = createPersistedStore("live:cash", { custodies: [], expenses: [] }, (x) => x, { persist: false });
const fail = (error) => window.dispatchEvent(new CustomEvent("miyar:error", { detail: error.message || String(error) }));
let orgId = null;

async function reload() {
  const [c, e] = await Promise.all([
    supabase.from("cash_custodies").select("*").order("id", { ascending: false }),
    supabase.from("cash_expenses").select("*").order("id", { ascending: false }),
  ]);
  if (c.error || e.error) return fail(c.error || e.error);
  live.set({
    custodies: (c.data || []).map((r) => ({ id: r.id, projectId: r.project_id, holder: r.holder, amount: Number(r.amount) || 0 })),
    expenses: (e.data || []).map((r) => ({ id: r.id, custodyId: r.custody_id, description: r.description, category: r.category || "", amount: Number(r.amount) || 0, date: r.spent_on })),
  });
}

export async function attachCash(org) {
  orgId = org || null;
  live.set({ custodies: [], expenses: [] });
  if (orgId) await reload();
}

const run = async (q) => { const { error } = await q; if (error) fail(error); await reload(); };

export const cashRepo = {
  use: () => live.use()[0],
  addCustody: ({ projectId, holder, amount }) => run(supabase.from("cash_custodies").insert({ org_id: orgId, project_id: projectId, holder, amount })),
  removeCustody: (id) => run(supabase.from("cash_custodies").delete().eq("id", id)),
  addExpense: ({ custodyId, description, category, amount }) =>
    run(supabase.from("cash_expenses").insert({ org_id: orgId, custody_id: custodyId, description, category: category || null, amount })),
  removeExpense: (id) => run(supabase.from("cash_expenses").delete().eq("id", id)),
};

export const custodyStats = (custody, expenses) => {
  const spent = expenses.filter((x) => x.custodyId === custody.id).reduce((s, x) => s + x.amount, 0);
  return { spent, left: custody.amount - spent };
};
