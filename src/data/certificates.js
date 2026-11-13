import { createPersistedStore } from "./persisted";
import { supabase } from "../lib/supabase";

// Progress-billing certificates of the signed-in office (Supabase only).
const live = createPersistedStore("live:certificates", [], (x) => x, { persist: false });
const fail = (error) => window.dispatchEvent(new CustomEvent("miyar:error", { detail: error.message || String(error) }));
let orgId = null;
const n = (v) => Number(v) || 0;

export const fromRow = (r) => ({
  id: r.id, projectId: r.project_id, no: r.no, date: String(r.created_at || "").slice(0, 10),
  cumPct: n(r.cum_pct), retentionPct: n(r.retention_pct), vatRate: n(r.vat_rate),
  cumValue: n(r.cum_value), gross: n(r.gross), retention: n(r.retention), advance: n(r.advance), vat: n(r.vat), net: n(r.net),
  status: r.status, retentionReleased: Boolean(r.retention_released),
});

async function reload() {
  const { data, error } = await supabase.from("certificates").select("*").order("no");
  if (error) fail(error); else live.set((data || []).map(fromRow));
}

export async function attachCertificates(org) {
  orgId = org || null;
  live.set([]);
  if (orgId) await reload();
}

const run = async (q) => { const { error } = await q; if (error) fail(error); await reload(); };

export const certificatesRepo = {
  use: () => live.use()[0],
  add: (c) => run(supabase.from("certificates").insert({
    org_id: orgId, project_id: c.projectId, no: c.no, cum_pct: c.cumPct, retention_pct: c.retentionPct, vat_rate: c.vatRate,
    cum_value: c.cumValue, gross: c.gross, retention: c.retention, advance: c.advance, vat: c.vat, net: c.net,
  })),
  setStatus: (id, status) => run(supabase.from("certificates").update({ status }).eq("id", id)),
  setReleased: (id, released) => run(supabase.from("certificates").update({ retention_released: released }).eq("id", id)),
};
