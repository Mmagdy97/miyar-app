// Localised display text for the built-in demo data (Arabic is the source language).
import { getLocale } from "../i18n";

import MAPS from "./demoStrings.json";

const LOGIC_KEYS = new Set(["status","phase","role","priority","severity","id","type","color","icon","key","tab","code","kind"]);

/** Translate one demo string; user-entered text passes through untouched. */
export { MAPS };
export const D = (v) => (typeof v === "string" ? (MAPS[getLocale()]?.[v] ?? v) : v);

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
