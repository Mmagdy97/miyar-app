import { useMemo } from "react";
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
    custodies: (c.data || []).map((r) => ({ id: r.id, projectId: r.project_id, holder: r.holder, amount: Number(r.amount) || 0, archivedAt: r.archived_at || null })),
    expenses: (e.data || []).map((r) => ({ id: r.id, custodyId: r.custody_id, description: r.description, category: r.category || "", amount: Number(r.amount) || 0, date: r.spent_on, archivedAt: r.archived_at || null })),
  });
}

export async function attachCash(org) {
  orgId = org || null;
  live.set({ custodies: [], expenses: [] });
  if (orgId) { await supabase.rpc("purge_archived"); await reload(); }
}

const run = async (q) => { const { error } = await q; if (error) fail(error); await reload(); };

export const cashRepo = {
  use: () => {
    const s = live.use()[0];
    return useMemo(() => {
      const custodies = s.custodies.filter((c) => !c.archivedAt);
      const ids = new Set(custodies.map((c) => c.id));
      return { custodies, expenses: s.expenses.filter((x) => !x.archivedAt && ids.has(x.custodyId)) };
    }, [s]);
  },
  useArchived: () => {
    const s = live.use()[0];
    return useMemo(() => ({ custodies: s.custodies.filter((c) => c.archivedAt), expenses: s.expenses.filter((x) => x.archivedAt) }), [s]);
  },
  restoreCustody: (id) => run(supabase.from("cash_custodies").update({ archived_at: null }).eq("id", id)),
  restoreExpense: (id) => run(supabase.from("cash_expenses").update({ archived_at: null }).eq("id", id)),
  addCustody: ({ projectId, holder, amount }) => run(supabase.from("cash_custodies").insert({ org_id: orgId, project_id: projectId, holder, amount })),
  removeCustody: (id) => run(supabase.from("cash_custodies").update({ archived_at: new Date().toISOString() }).eq("id", id)),
  addExpense: ({ custodyId, description, category, amount, boqItemId }) =>
    run(supabase.from("cash_expenses").insert({ org_id: orgId, custody_id: custodyId, description, category: category || null, amount, boq_item_id: boqItemId || null })),
  removeExpense: (id) => run(supabase.from("cash_expenses").update({ archived_at: new Date().toISOString() }).eq("id", id)),
};

export const custodyStats = (custody, expenses) => {
  const spent = expenses.filter((x) => x.custodyId === custody.id).reduce((s, x) => s + x.amount, 0);
  return { spent, left: custody.amount - spent };
};
