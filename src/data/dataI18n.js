// Localised display text for the built-in demo data (Arabic is the source language).
import { getLocale } from "../i18n";

import MAPS from "./demoStrings.json";

const LOGIC_KEYS = new Set(["status","phase","role","priority","severity","id","type","color","icon","key","tab","code","kind"]);

/** Translate one demo string; user-entered text passes through untouched. */
export { MAPS };
const toLatin = (v) => v.replace(/[0-9]/g, (d) => "0123456789".indexOf(d)).replace(/٪/g, "%").replace(/./g, ".");
export const D = (v) => {
  if (typeof v !== "string") return v;
  const loc = getLocale();
  return MAPS[loc]?.[v] ?? (loc === "ar" ? v : toLatin(v));
};

/** Deep-localise display fields only (status/phase/role stay intact for logic). */
export const localize = (x) => {
  if (Array.isArray(x)) return x.map((v) => (typeof v === "string" ? D(v) : localize(v)));
  if (x && typeof x === "object") {
    const o = {};
    for (const k in x) o[k] = LOGIC_KEYS.has(k) ? x[k] : typeof x[k] === "string" ? D(x[k]) : localize(x[k]);
    return o;
  }
  return x;
};

/** Translate a template with {0},{1}… placeholders (key is the Arabic template). */
export const DF = (tpl, ...a) => D(tpl).replace(/\{(\d+)\}/g, (m, i) => (i in a ? a[i] : m));

/** 53 -> "%53" (ar, as before) | "53%" (en/tr) */
export const pct = (n) => (getLocale() === "ar" ? `%${n}` : `${n}%`);
