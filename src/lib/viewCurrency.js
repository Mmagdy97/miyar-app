import { useSyncExternalStore } from "react";
import { getCurrency } from "../i18n";
import { detectCountry, currencyForCountry } from "./geo";

// Landing-page currency shared by pricing, the savings calculator and previews.
// When the visitor's country is known (IP), prices are locked to that country's list,
// so nobody can pick another country's cheaper price. Unknown country: free choice.
const KEY = "miyar:settings:v1";
let cur = null;
let geo = { country: null, currency: null };
const subs = new Set();
const emit = () => subs.forEach((f) => f());
const get = () => geo.currency || (cur ??= getCurrency());

export function setViewCurrency(c) {
  if (geo.currency) return; // locked to the visitor's country
  cur = c;
  try { const s = JSON.parse(localStorage.getItem(KEY)) || {}; localStorage.setItem(KEY, JSON.stringify({ ...s, currency: c })); } catch { /* storage unavailable */ }
  emit();
}

if (typeof window !== "undefined") {
  detectCountry().then((cc) => {
    const c = currencyForCountry(cc);
    if (c) { geo = { country: cc, currency: c }; emit(); }
  });
}

const subscribe = (f) => { subs.add(f); return () => subs.delete(f); };
export const useViewCurrency = () => useSyncExternalStore(subscribe, get, get);
/** { country, currency } when prices are locked to the visitor's country, else nulls. */
const getGeo = () => geo;
export const usePriceGeo = () => useSyncExternalStore(subscribe, getGeo, getGeo);
