import { createPersistedStore } from "./persisted";
import { supabase } from "../lib/supabase";

// Moodboard tiles of the signed-in office (Supabase only).
const live = createPersistedStore("live:mood", [], (x) => x, { persist: false });
const fail = (error) => window.dispatchEvent(new CustomEvent("miyar:error", { detail: error.message || String(error) }));
let orgId = null;

export const fromRow = (r) => ({ id: r.id, projectId: r.project_id, kind: r.kind, value: r.value, caption: r.caption || "", liked: Boolean(r.liked) });

async function reload() {
  const { data, error } = await supabase.from("mood_tiles").select("*").order("id", { ascending: false });
  if (error) fail(error); else live.set((data || []).map(fromRow));
}

export async function attachMood(org) {
  orgId = org || null;
  live.set([]);
  if (orgId) await reload();
}

const run = async (q) => { const { error } = await q; if (error) fail(error); await reload(); };

export const moodRepo = {
  use: () => live.use()[0],
  add: (t) => run(supabase.from("mood_tiles").insert({ org_id: orgId, project_id: t.projectId, kind: t.kind, value: t.value, caption: t.caption || null })),
  toggleLike: (id) => run(supabase.rpc("toggle_tile_like", { p_id: id })),
  remove: (id) => run(supabase.from("mood_tiles").delete().eq("id", id)),
};
