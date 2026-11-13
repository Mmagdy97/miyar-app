import { createPersistedStore } from "./persisted";
import { supabase } from "../lib/supabase";

// Site work of the signed-in office: tasks, snags, material requests (Supabase only; tables from schema.sql).
const live = createPersistedStore("live:site", { tasks: [], snags: [], requests: [] }, (x) => x, { persist: false });
const fail = (error) => window.dispatchEvent(new CustomEvent("miyar:error", { detail: error.message || String(error) }));
let orgId = null;

export const taskFrom = (r) => ({ id: r.id, projectId: r.project_id, title: r.title, priority: r.priority || "medium", due: r.due_at ? String(r.due_at).slice(0, 10) : "", done: Boolean(r.completed) });
export const snagFrom = (r) => ({ id: r.id, projectId: r.project_id, title: r.title, location: r.location || "", severity: r.severity || "medium", responsible: r.responsible || "", resolved: Boolean(r.resolved) });
export const requestFrom = (r) => ({ id: r.id, projectId: r.project_id, material: r.material, quantity: r.quantity || "", date: r.required_date || "", notes: r.notes || "", status: r.status || "review" });

async function reload() {
  const [t, s, m] = await Promise.all([
    supabase.from("tasks").select("*").order("id", { ascending: false }),
    supabase.from("snags").select("*").order("id", { ascending: false }),
    supabase.from("material_requests").select("*").order("id", { ascending: false }),
  ]);
  const err = t.error || s.error || m.error;
  if (err) return fail(err);
  live.set({ tasks: (t.data || []).map(taskFrom), snags: (s.data || []).map(snagFrom), requests: (m.data || []).map(requestFrom) });
}

export async function attachSite(org) {
  orgId = org || null;
  live.set({ tasks: [], snags: [], requests: [] });
  if (orgId) await reload();
}

const run = async (q) => { const { error } = await q; if (error) fail(error); await reload(); };
const uid = async () => (await supabase.auth.getUser()).data?.user?.id || null;

export const siteRepo = {
  use: () => live.use()[0],
  addTask: (t) => run(supabase.from("tasks").insert({ org_id: orgId, project_id: t.projectId, title: t.title, priority: t.priority, due_at: t.due || null })),
  toggleTask: (id, completed) => run(supabase.from("tasks").update({ completed }).eq("id", id)),
  removeTask: (id) => run(supabase.from("tasks").delete().eq("id", id)),
  addSnag: async (s) => run(supabase.from("snags").insert({ org_id: orgId, project_id: s.projectId, title: s.title, location: s.location || null, severity: s.severity, responsible: s.responsible || null, created_by: await uid() })),
  toggleSnag: (id, resolved) => run(supabase.from("snags").update({ resolved }).eq("id", id)),
  removeSnag: (id) => run(supabase.from("snags").delete().eq("id", id)),
  addRequest: async (r) => run(supabase.from("material_requests").insert({ org_id: orgId, project_id: r.projectId, requested_by: await uid(), material: r.material, quantity: r.quantity || null, required_date: r.date || null, notes: r.notes || null })),
  setRequestStatus: (id, status) => run(supabase.from("material_requests").update({ status }).eq("id", id)),
  removeRequest: (id) => run(supabase.from("material_requests").delete().eq("id", id)),
};
