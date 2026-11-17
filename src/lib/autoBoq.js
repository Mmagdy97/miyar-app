import { DEFAULT_ITEMS } from "../data/boqLibrary";

// Auto-BOQ: quantities from project data using each library item's formula (terms = sum of coef x basis).
const r1 = (n) => Math.round(n * 10) / 10;
const up = (n) => Math.ceil(n - 1e-9);

/** Quantity bases a formula can use (key -> value from the project spec). */
export const BASES = {
  area: (s) => s.A,
  walls: (s) => s.walls,
  walls_ceiling: (s) => s.walls + s.A,
  dry_walls: (s) => s.walls - s.baths * 19 - s.kitchen * 8,
  paint_ceiling: (s) => s.A - (s.finish === "eco" ? 0 : s.A * 0.6),
  rooms: (s) => s.rooms,
  baths: (s) => s.baths,
  kitchen: (s) => s.kitchen,
  living: (s) => (s.home ? 1 : 0),
  office_area: (s) => (s.home ? 0 : s.A),
  wet: (s) => (s.baths + s.kitchen > 0 ? 1 : 0),
  fixed: () => 1,
};
export const BASIS_KEYS = Object.keys(BASES);

const context = (spec) => {
  const A = Number(spec?.area) || 0;
  const h = Number(spec?.height) || 2.8;
  const type = spec?.type || "apartment";
  const home = type === "apartment" || type === "villa";
  return { A, walls: A * 0.9 * h, rooms: Math.max(0, Number(spec?.rooms) || 0), baths: Math.max(0, Number(spec?.baths) || 0), kitchen: home ? 1 : 0, home, finish: spec?.finish || "mid" };
};

/** spec: { area, rooms, baths, height, type, finish } -> [{ cat, name, unit, quantity }] (items with a formula, quantity > 0). */
export function generateBoq(spec, items = DEFAULT_ITEMS) {
  const s = context(spec);
  if (s.A <= 0) return [];
  return items
    .filter((it) => it.terms?.length && (it.finishes || []).includes(s.finish))
    .map((it) => {
      const q = it.terms.reduce((sum, [b, c]) => sum + (BASES[b] ? BASES[b](s) * (Number(c) || 0) : 0), 0);
      return { cat: it.cat, name: it.name, unit: it.unit, quantity: it.unit === "م²" || it.unit === "م.ط" ? r1(q) : up(q) };
    })
    .filter((x) => x.quantity > 0);
}
