import { boqTotals } from "../data/boq";

const FIELDS = ["category", "name", "unit", "quantity", "unitCost", "margin"];
/** Only the fields a version keeps. */
export const snapshot = (items) => items.map((i) => Object.fromEntries([["id", i.id], ...FIELDS.map((k) => [k, i[k]])]));
const key = (i) => String(i.id ?? "") || i.name;
const same = (a, b) => ["quantity", "unitCost", "margin", "unit", "category", "name"].every((k) => (a[k] ?? "") === (b[k] ?? ""));

/** What changed going from `from` to `to`: added, removed, changed items and the totals delta. */
export function diffVersions(from, to) {
  const a = new Map(from.map((i) => [key(i), i]));
  const b = new Map(to.map((i) => [key(i), i]));
  const added = to.filter((i) => !a.has(key(i)));
  const removed = from.filter((i) => !b.has(key(i)));
  const changed = to.filter((i) => a.has(key(i)) && !same(a.get(key(i)), i)).map((i) => ({ before: a.get(key(i)), after: i }));
  const ta = boqTotals(from), tb = boqTotals(to);
  return { added, removed, changed, delta: { cost: tb.cost - ta.cost, price: tb.price - ta.price, profit: tb.profit - ta.profit } };
}

/** How to turn `current` back into `snap`: rows to update, insert and remove. Rows in `keep` (e.g. with actual costs) are never removed. */
export function restorePlan(current, snap, keep = new Set()) {
  const cur = new Map(current.map((i) => [i.id, i]));
  const ids = new Set(snap.map((i) => i.id));
  return {
    update: snap.filter((i) => cur.has(i.id) && !same(cur.get(i.id), i)),
    insert: snap.filter((i) => !cur.has(i.id)),
    remove: current.filter((i) => !ids.has(i.id) && !keep.has(i.id)),
    kept: current.filter((i) => !ids.has(i.id) && keep.has(i.id)),
  };
}
