import { createPersistedStore } from "./persisted";
import { supabase } from "../lib/supabase";

// RFIs (technical queries) of the signed-in office (Supabase only).
const live = createPersistedStore("live:rfi", [], (x) => x, { persist: false });
const fail = (error) => window.dispatchEvent(new CustomEvent("miyar:error", { detail: error.message || String(error) }));
let orgId = null;

export const fromRow = (r) => ({
  id: r.id, projectId: r.project_id, no: r.no, title: r.title, question: r.question || "", answer: r.answer || "",
  due: r.due_date || "", status: r.status, by: r.asked_name || "", date: String(r.created_at || "").slice(0, 10),
});

async function reload() {
  const { data, error } = await supabase.from("rfis").select("*").order("id", { ascending: false });
  if (error) fail(error); else live.set((data || []).map(fromRow));
}
export async function attachRfi(org) { orgId = org || null; live.set([]); if (orgId) await reload(); }
const run = async (q) => { const { error } = await q; if (error) fail(error); await reload(); };

export const rfiRepo = {
  use: () => live.use()[0],
  add: (o) => run(supabase.from("rfis").insert({ org_id: orgId, project_id: o.projectId, no: o.no, title: o.title, question: o.question || null, due_date: o.due || null, asked_name: o.by || null })),
  answer: (id, answer) => run(supabase.from("rfis").update({ answer, status: "answered", answered_at: new Date().toISOString() }).eq("id", id)),
  close: (id) => run(supabase.from("rfis").update({ status: "closed" }).eq("id", id)),
};
