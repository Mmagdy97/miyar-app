import { createPersistedStore } from "./persisted";
import { supabase } from "../lib/supabase";

// Workers + daily attendance of the signed-in office (Supabase only).
const live = createPersistedStore("live:attendance", { workers: [], records: {} }, (x) => x, { persist: false });
const fail = (error) => window.dispatchEvent(new CustomEvent("miyar:error", { detail: error.message || String(error) }));
let orgId = null;

/** Rows -> { workers, records: { "YYYY-MM-DD": { [workerId]: { s, ot, r } } } } (same shape the demo store uses). */
export function toState(workerRows, attRows) {
  const workers = workerRows.map((w) => ({ id: w.id, name: w.name, trade: w.trade || "", rate: Number(w.rate) }));
  const records = {};
  for (const a of attRows) (records[a.day] ||= {})[a.worker_id] = { s: a.status, ot: Number(a.ot) || 0, r: Number(a.rate) };
  return { workers, records };
}

async function reload() {
  const [w, a] = await Promise.all([supabase.from("workers").select("*").order("id"), supabase.from("attendance").select("*")]);
  if (w.error || a.error) return fail(w.error || a.error);
  live.set(toState(w.data || [], a.data || []));
}

export async function attachAttendance(org) {
  orgId = org || null;
  live.set({ workers: [], records: {} });
  if (orgId) await reload();
}

const run = async (q) => { const { error } = await q; if (error) fail(error); await reload(); };

export const attendanceRepo = {
  use: () => live.use()[0],
  addWorker: ({ name, trade, rate }) => run(supabase.from("workers").insert({ org_id: orgId, name, trade: trade || null, rate })),
  mark: (workerId, day, entry) =>
    run(supabase.from("attendance").upsert({ org_id: orgId, worker_id: workerId, day, status: entry.s, ot: Math.min(8, Math.max(0, Number(entry.ot) || 0)), rate: entry.r }, { onConflict: "worker_id,day" })),
  setRate: async (workerId, rate, day, hasEntry) => {
    const r = Math.round(Number(rate) || 0);
    if (r <= 0) return;
    const a = await supabase.from("workers").update({ rate: r }).eq("id", workerId);
    if (a.error) fail(a.error);
    if (hasEntry) { const b = await supabase.from("attendance").update({ rate: r }).eq("worker_id", workerId).eq("day", day); if (b.error) fail(b.error); }
    await reload();
  },
};
