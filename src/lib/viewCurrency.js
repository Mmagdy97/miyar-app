import { useSyncExternalStore } from "react";
import { getCurrency } from "../i18n";

// Landing-page currency shared by pricing, the savings calculator and previews.
// Changing it re-renders in place (no reload) and is remembered for the next visit.
const KEY = "miyar:settings:v1";
let cur = null;
const subs = new Set();
const get = () => (cur ??= getCurrency());
export function setViewCurrency(c) {
  cur = c;
  try { const s = JSON.parse(localStorage.getItem(KEY)) || {}; localStorage.setItem(KEY, JSON.stringify({ ...s, currency: c })); } catch { /* storage unavailable */ }
  subs.forEach((f) => f());
}
const subscribe = (f) => { subs.add(f); return () => subs.delete(f); };
export const useViewCurrency = () => useSyncExternalStore(subscribe, get, get);
