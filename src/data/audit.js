import { createPersistedStore } from "./persisted";
import { diffEvents } from "../lib/audit";

const CAP = 500;
const MERGE_MS = 15_000;
export const auditStore = createPersistedStore("miyar:audit:v1", [], (x) => x);

const actor = () => {
  try {
    const s = JSON.parse(sessionStorage.getItem("miyar:session")) || {};
    return { role: s.role || "—", mode: s.mode || "" };
  } catch { return { role: "—", mode: "" }; }
};

let seq = 0;
/** Store option: records every add/remove/field change of a list store. */
export const audit = (scope) => (prev, next) => {
  const evts = diffEvents(scope, prev, next);
  if (!evts.length) return;
  const at = new Date().toISOString();
  const who = actor();
  auditStore.set((log) => {
    const out = [...log];
    for (const e of evts) {
      const last = out[0];
      // Typing "1 → 15 → 150" is one edit: merge into the last entry for the same item within 15s.
      if (e.action === "upd" && last && last.action === "upd" && last.scope === e.scope && last.label === e.label && last.role === who.role
        && Date.parse(at) - Date.parse(last.at) < MERGE_MS) {
        const merged = [...last.changes];
        for (const c of e.changes) {
          const k = merged.findIndex((m) => m.f === c.f);
          if (k >= 0) merged[k] = { ...merged[k], to: c.to }; else merged.push(c);
        }
        out[0] = { ...last, at, changes: merged.filter((c) => c.from !== c.to) };
        if (!out[0].changes.length) out.shift();
        continue;
      }
      out.unshift({ id: `${Date.now()}-${seq++}`, at, ...who, ...e });
    }
    return out.slice(0, CAP);
  });
};
