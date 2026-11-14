// Turn a store update into readable audit events (added / removed / changed fields).
const LABEL_KEYS = ["name", "title", "item", "no", "desc", "description", "supplier", "engineerName"];
const SKIP = new Set(["id", "image", "img", "photo", "liked", "updatedAt"]);
const MAX_CHANGES = 6;

export const labelOf = (o) => {
  if (!o || typeof o !== "object") return "";
  for (const k of LABEL_KEYS) if (o[k] != null && o[k] !== "") return String(o[k]).slice(0, 80);
  return o.id != null ? `#${o.id}` : "";
};

const short = (v) => {
  if (v == null || v === "") return "—";
  if (typeof v === "object") return "…";
  const s = String(v);
  return s.length > 40 ? s.slice(0, 39) + "…" : s;
};

export function diffEvents(scope, prev, next) {
  if (!Array.isArray(prev) || !Array.isArray(next)) return [];
  const key = (o, i) => (o && o.id != null ? String(o.id) : `i${i}`);
  const before = new Map(prev.map((o, i) => [key(o, i), o]));
  const after = new Map(next.map((o, i) => [key(o, i), o]));
  const out = [];
  for (const [k, o] of after) {
    const old = before.get(k);
    if (!old) { out.push({ scope, action: "add", label: labelOf(o) }); continue; }
    if (old === o) continue;
    const changes = [];
    for (const f of new Set([...Object.keys(old), ...Object.keys(o)])) {
      if (SKIP.has(f)) continue;
      const a = old[f], b = o[f];
      if (a === b || (typeof a === "object" && JSON.stringify(a) === JSON.stringify(b))) continue;
      changes.push({ f, from: short(a), to: short(b) });
    }
    if (changes.length) out.push({ scope, action: "upd", label: labelOf(o), changes: changes.slice(0, MAX_CHANGES) });
  }
  for (const [k, o] of before) if (!after.has(k)) out.push({ scope, action: "del", label: labelOf(o) });
  return out;
}
