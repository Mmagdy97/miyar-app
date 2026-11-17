// Budget (BOQ cost) vs actual spend per item. Selling price and margin are never part of this.
export const WARN = 0.9;

/** actuals: [{ amount, qty }] for one item -> { budget, actual, qty, pct, level: ok|warn|over|none } */
export function itemVariance(item, actuals) {
  const budget = (Number(item.quantity) || 0) * (Number(item.unitCost) || 0);
  const actual = actuals.reduce((s, a) => s + (Number(a.amount) || 0), 0);
  const qty = actuals.reduce((s, a) => s + (Number(a.qty) || 0), 0);
  const pct = budget > 0 ? actual / budget : actual > 0 ? Infinity : 0;
  const level = actual === 0 ? "none" : pct > 1 ? "over" : pct >= WARN ? "warn" : "ok";
  return { budget, actual, qty, pct, level };
}

export function projectVariance(items, actualsByItem) {
  const rows = items.map((i) => ({ item: i, ...itemVariance(i, actualsByItem[i.id] || []) }));
  const budget = rows.reduce((s, r) => s + r.budget, 0);
  const actual = rows.reduce((s, r) => s + r.actual, 0);
  return { rows, budget, actual, diff: actual - budget, alerts: rows.filter((r) => r.level === "warn" || r.level === "over").length };
}
