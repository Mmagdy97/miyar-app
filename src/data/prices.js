import { createPersistedStore } from "./persisted";
import { supabase } from "../lib/supabase";

// Office price list: item name -> { unit, eco, mid, lux } (Supabase only).
const live = createPersistedStore("live:prices", {}, (x) => x, { persist: false });
let orgId = null;

async function reload() {
  const { data } = await supabase.from("price_list").select("*");
  live.set(Object.fromEntries((data || []).map((r) => [r.item, { unit: r.unit || "", eco: r.eco, mid: r.mid, lux: r.lux }])));
}
export async function attachPrices(org) { orgId = org || null; live.set({}); if (orgId) await reload(); }

export const pricesRepo = {
  use: () => live.use()[0],
  set: async (item, unit, level, value) => {
    const row = { org_id: orgId, item, unit, [level]: value === "" ? null : Number(value) };
    const { error } = await supabase.from("price_list").upsert(row, { onConflict: "org_id,item" });
    if (error) window.dispatchEvent(new CustomEvent("miyar:error", { detail: error.message })); else await reload();
  },
};
export const priceFor = (prices, item, level) => { const p = prices[item]; return Number(p?.[level] ?? p?.mid ?? 0) || 0; };
