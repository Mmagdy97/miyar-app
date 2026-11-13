// Regional price lists (fixed per market, not FX-converted). Validate with first customers.
export const PRICES = {
  EGP: [0, 899, 1990],
  SAR: [0, 149, 299],
  AED: [0, 149, 299],
  KWD: [0, 12, 25],
  JOD: [0, 25, 55],
  TRY: [0, 1290, 2790],
  USD: [0, 39, 89],
};

export const PLANS = [
  { key: "free", n: 4, projects: 1 },
  { key: "pro", n: 5, projects: 3, highlight: true },
  { key: "office", n: 5, projects: 12 },
  { key: "enterprise", n: 4, projects: Infinity, custom: true },
];

/** Billing cycles: months prepaid and the share of the list price paid (12 months = pay 10). */
export const CYCLES = [
  { months: 1, factor: 1, save: 0 },
  { months: 3, factor: 0.95, save: 5 },
  { months: 6, factor: 0.88, save: 12 },
  { months: 12, factor: 10 / 12, save: 17 },
];

/** Total due for one billing cycle (monthly list price x months x cycle factor). */
export function planPrice(currency, index, months = 1) {
  const list = PRICES[currency];
  if (!list || PLANS[index]?.custom) return null;
  const c = CYCLES.find((x) => x.months === months) || CYCLES[0];
  return Math.round(list[index] * c.months * c.factor);
}

export function projectLimit(planKey) {
  return PLANS.find((p) => p.key === planKey)?.projects ?? 0;
}
