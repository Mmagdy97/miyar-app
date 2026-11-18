import { createPersistedStore } from "./persisted";
import { supabase } from "../lib/supabase";

// Office finish price list (per m2) for the client calculator.
const live = createPersistedStore("live:finishes", [], (x) => x, { persist: false });
const fail = (error) => window.dispatchEvent(new CustomEvent("miyar:error", { detail: error.message || String(error) }));
let orgId = null;

async function reload() {
  const { data, error } = await supabase.from("finish_options").select("*").order("id");
  if (error) fail(error); else live.set((data || []).map((r) => ({ id: r.id, category: r.category, name: r.name, price: Number(r.price) || 0 })));
}
export async function attachFinishes(org) { orgId = org || null; live.set([]); if (orgId) await reload(); }
const run = async (q) => { const { error } = await q; if (error) fail(error); await reload(); };

export const finishesRepo = {
  use: () => live.use()[0],
  add: (o) => run(supabase.from("finish_options").insert({ org_id: orgId, category: o.category, name: o.name, price: o.price })),
  remove: (id) => run(supabase.from("finish_options").delete().eq("id", id)),
};
