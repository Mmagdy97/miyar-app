import { useMemo } from "react";
import { createPersistedStore } from "./persisted";
import { supabase } from "../lib/supabase";
import { DEFAULT_ITEMS, groupItems, itemsForType } from "./boqLibrary";
import { officeStore } from "./office";
import { getActiveOrg, hasFeature } from "../lib/entitlements";

// Office item library (Supabase). Until the office edits it, the built-in defaults are used.
const live = createPersistedStore("live:library", { rows: [], loaded: false }, (x) => x, { persist: false });
let orgId = null;
const fail = (error) => window.dispatchEvent(new CustomEvent("miyar:error", { detail: error.message || String(error) }));

async function reload() {
  const { data, error } = await supabase.from("boq_library").select("*").order("id");
  if (error) { fail(error); return; }
  live.set({ rows: (data || []).map((r) => ({ id: r.id, cat: r.cat, name: r.name, unit: r.unit || "", terms: r.terms || [], finishes: r.finishes || [] })), loaded: true });
}
export async function attachLibrary(org) { orgId = org || null; live.set({ rows: [], loaded: false }); if (orgId) await reload(); }

/** Items in use: the office's own list once it has one, otherwise the defaults. */
export const useLibraryItems = () => {
  const [s] = live.use();
  const [o] = officeStore.use();
  const org = getActiveOrg();
  const allow = hasFeature(org, "structural");
  return useMemo(() => itemsForType(s.rows.length ? s.rows : DEFAULT_ITEMS, o.type, allow), [s, o.type, allow]);
};
export const useLibrary = () => { const items = useLibraryItems(); return useMemo(() => groupItems(items), [items]); };
export const libraryIsCustom = () => live.get().rows.length > 0;

const row = (i) => ({ cat: i.cat.trim(), name: i.name.trim(), unit: i.unit || null, terms: i.terms || [], finishes: i.finishes || [] });
// First edit copies the defaults into the office's table so edits are applied on top of them.
async function ensureSeeded() {
  if (live.get().rows.length) return;
  const { error } = await supabase.from("boq_library").insert(DEFAULT_ITEMS.map((i) => ({ org_id: orgId, ...row(i) })));
  if (error) fail(error);
}
const done = async (q) => { const { error } = await q; if (error) fail(error); await reload(); };

const byName = (name) => live.get().rows.find((r) => r.name === name);
export const libraryRepo = {
  add: async (i) => { await ensureSeeded(); await done(supabase.from("boq_library").insert({ org_id: orgId, ...row(i) })); },
  update: async (name, i) => { await ensureSeeded(); await reload(); const t = byName(name); if (t) await done(supabase.from("boq_library").update(row(i)).eq("id", t.id)); },
  remove: async (name) => { await ensureSeeded(); await reload(); const t = byName(name); if (t) await done(supabase.from("boq_library").delete().eq("id", t.id)); },
  resetToDefaults: async () => { await done(supabase.from("boq_library").delete().eq("org_id", orgId)); },
};
