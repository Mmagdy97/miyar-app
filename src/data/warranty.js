import { createPersistedStore } from "./persisted";
import { supabase } from "../lib/supabase";

// Warranties (one per project) and maintenance requests of the signed-in office.
const live = createPersistedStore("live:warranty", { warranties: [], requests: [] }, (x) => x, { persist: false });
const fail = (error) => window.dispatchEvent(new CustomEvent("miyar:error", { detail: error.message || String(error) }));
let orgId = null;

async function reload() {
  const [w, r] = await Promise.all([
    supabase.from("warranties").select("*"),
    supabase.from("maintenance_requests").select("*").order("id", { ascending: false }),
  ]);
  if (w.error || r.error) return fail(w.error || r.error);
  live.set({
    warranties: (w.data || []).map((x) => ({ projectId: x.project_id, start: x.start_date, months: x.months, notes: x.notes || "" })),
    requests: (r.data || []).map((x) => ({ id: x.id, projectId: x.project_id, title: x.title, desc: x.descr || "", status: x.status, date: String(x.created_at || "").slice(0, 10) })),
  });
}
export async function attachWarranty(org) { orgId = org || null; live.set({ warranties: [], requests: [] }); if (orgId) await reload(); }

const run = async (q) => { const { error } = await q; if (error) fail(error); await reload(); };

export const warrantyRepo = {
  use: () => live.use()[0],
  save: ({ projectId, start, months, notes }) => run(supabase.from("warranties").upsert({ project_id: projectId, org_id: orgId, start_date: start, months: Number(months), notes: notes || null })),
  request: ({ projectId, title, desc }) => run(supabase.from("maintenance_requests").insert({ org_id: orgId, project_id: projectId, title, descr: desc || null })),
  setStatus: (id, status) => run(supabase.from("maintenance_requests").update({ status }).eq("id", id)),
};
