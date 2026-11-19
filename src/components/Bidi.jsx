import { getLocale } from "../i18n";

/** Latin/number run inside RTL text: keeps "(ZATCA / ETA / e-Arşiv)", "18/24", "65%" in visual order. */
const MARKS = /[\u200e\u200f\u061c]/g; // Intl adds RTL marks in Arabic; inside an LTR run they flip "US$ 39".
// Only for Latin symbols (US$, €): Arabic symbols like "ج.م." need the marks to stay after the number.
const clean = (c) => (typeof c === "string" ? (/[\u0600-\u06ff]/.test(c) ? c : c.replace(MARKS, "")) : Array.isArray(c) ? c.map(clean) : c);
export const N = ({ children, className = "" }) => <span dir="ltr" className={`inline-block tabular-nums ${className}`}>{clean(children)}</span>;

// A run starts and ends on a Latin letter, digit, %, ² or a closing bracket; it may carry an opening bracket.
const RUN = /(\(?[+\-−]?[$€£₺]?[A-Za-z0-9][A-Za-z0-9şŞıİğĞüÜöÖçÇ.,/%$€£₺²×\-+ ]*[A-Za-z0-9şıüöç%²)$€£₺]\)?|\(?[+\-−]?[A-Za-z0-9]%?\)?)/g;

/** Wraps Latin/number runs of an Arabic string in LTR spans. Other languages pass through untouched. */
export function Bidi({ children }) {
  if (typeof children !== "string" || getLocale() !== "ar") return children;
  const parts = children.split(RUN);
  return parts.map((p, i) => (i % 2 ? <N key={i}>{p}</N> : p));
}
