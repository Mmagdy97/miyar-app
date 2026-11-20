// Country → price-list currency. Unlisted countries pay in USD; euro-area countries in EUR.
const EURO = ["IT", "DE", "FR", "ES", "PT", "NL", "BE", "AT", "IE", "FI", "GR", "LU", "SK", "SI", "EE", "LV", "LT", "MT", "CY", "HR"];
const MAP = { EG: "EGP", SA: "SAR", AE: "AED", KW: "KWD", JO: "JOD", TR: "TRY" };

export const currencyForCountry = (cc) => (!cc ? null : MAP[cc] || (EURO.includes(cc) ? "EUR" : "USD"));

const KEY = "miyar:geo:v1";
let pending = null;

/** Detects the visitor's country once per session. Resolves to null when unknown (local dev, API down). */
export function detectCountry() {
  if (pending) return pending;
  pending = (async () => {
    try {
      const hit = sessionStorage.getItem(KEY);
      if (hit) return hit === "-" ? null : hit;
    } catch { /* storage unavailable */ }
    try {
      const r = await fetch("/api/geo", { cache: "no-store" });
      const cc = r.ok ? (await r.json()).country : null;
      const v = /^[A-Z]{2}$/.test(cc || "") && cc !== "XX" ? cc : null;
      try { sessionStorage.setItem(KEY, v || "-"); } catch { /* storage unavailable */ }
      return v;
    } catch {
      return null;
    }
  })();
  return pending;
}
