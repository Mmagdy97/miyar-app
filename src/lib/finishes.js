/** Options of one category priced for `area` m2, cheapest first, with the gap to the cheapest. */
export function compareFinishes(options, category, area) {
  const a = Math.max(0, Number(area) || 0);
  const rows = options.filter((o) => o.category === category).map((o) => ({ ...o, total: Math.round(o.price * a) }));
  rows.sort((x, y) => x.total - y.total);
  const min = rows[0]?.total ?? 0;
  return rows.map((r) => ({ ...r, diff: r.total - min }));
}
export const categoriesOf = (options) => [...new Set(options.map((o) => o.category))];
