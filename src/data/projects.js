import { useMemo } from "react";
import { createPersistedStore } from "./persisted";
import { PROJECTS as SEED, personById, formatEGP } from "./seed";
import { supabase } from "../lib/supabase";
import { money } from "../i18n";

const DEFAULT_IMG = "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80";

/** Digits (Arabic-Indic or Latin) in a formatted amount -> number. */
export const parseAmount = (str) => Number(String(str ?? "").replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d)).replace(/[^\d]/g, "")) || 0;

// Demo (guest) projects: single source is src/data/seed.js
export const INITIAL_PROJECTS = SEED.map((p) => ({
  id: p.id, code: p.code, name: p.name, client: p.client, engineer: personById(p.engineerId).displayName,
  progress: p.progress, status: p.status, phase: p.phase, startDate: p.startDate, deadline: p.deadline,
  budget: formatEGP(p.contractValue), location: p.location, image: p.image,
}));

const guest = createPersistedStore("miyar:projects:v1", INITIAL_PROJECTS);
const live = createPersistedStore("live:projects", [], (x) => x, { persist: false }); // real office: Supabase only, never localStorage
let orgId = null;

const fromRow = (r) => ({
  id: r.id, code: r.code || `P-${r.id}`, name: r.name, client: r.client_name || "", engineer: r.engineer_name || "",
  progress: r.progress ?? 0, status: r.status || "جاري العمل", phase: r.phase || "تصميم",
  startDate: r.start_date || "", deadline: r.deadline || "", contractValue: Number(r.contract_value) || 0,
  budget: money(Number(r.contract_value) || 0), location: r.location || "", image: r.image || DEFAULT_IMG,
});
const toRow = (p) => ({
  code: p.code || null, name: p.name, client_name: p.client || null, engineer_name: p.engineer || null,
  progress: Number(p.progress) || 0, status: p.status, phase: p.phase, start_date: p.startDate || null,
  deadline: p.deadline || null, location: p.location || null, image: p.image || null,
  contract_value: p.contractValue ?? parseAmount(p.budget),
});
const fail = (error) => window.dispatchEvent(new CustomEvent("miyar:error", { detail: error.message || String(error) }));
const same = (a, b) => JSON.stringify(toRow(a)) === JSON.stringify(toRow(b));

async function reload() {
  const { data, error } = await supabase.from("projects").select("*").order("id", { ascending: false });
  if (error) fail(error); else live.set((data || []).map(fromRow));
}

/** Switch to the signed-in office's projects (null = back to demo data). */
export async function attachProjects(org) {
  orgId = org || null;
  live.set([]);
  if (orgId) await reload();
}

// Diff the next list against the current one and write the changes to Supabase.
async function sync(prev, next) {
  const had = new Map(prev.map((p) => [p.id, p]));
  const keep = new Set(next.map((p) => p.id));
  try {
    for (const p of next) {
      const old = had.get(p.id);
      if (!old) {
        const { error } = await supabase.from("projects").insert({ ...toRow(p), org_id: orgId });
        if (error) throw error;
      } else if (!same(old, p)) {
        const { error } = await supabase.from("projects").update(toRow(p)).eq("id", p.id);
        if (error) throw error;
      }
    }
    for (const p of prev) if (!keep.has(p.id)) {
      const { error } = await supabase.from("projects").delete().eq("id", p.id);
      if (error) throw error;
    }
  } catch (e) { fail(e); }
  await reload(); // real ids, server-side validation (project limit) and revert on failure
}

const setLive = (next) => {
  const prev = live.get();
  const arr = typeof next === "function" ? next(prev) : next;
  live.set(arr);
  sync(prev, arr);
};

export const projectsStore = {
  use() {
    const [g, setG] = guest.use();
    const [l] = live.use();
    return orgId ? [l, setLive] : [g, setG];
  },
  reset: () => guest.reset(),
  get isLive() { return Boolean(orgId); },
};

/** Light project list for the pickers in other screens: { id, name, code, contractValue }. */
export function useProjectList() {
  const [rows] = projectsStore.use();
  return useMemo(() => rows.map((p) => ({
    id: p.id, name: p.name, code: p.code || `P-${p.id}`,
    contractValue: p.contractValue ?? SEED.find((s) => s.id === p.id)?.contractValue ?? parseAmount(p.budget),
  })), [rows]);
}
