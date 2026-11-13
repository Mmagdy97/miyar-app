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
  { key: "office", n: 5, projects: 10 },
  { key: "enterprise", n: 4, projects: Infinity, custom: true },
];

/** Annual billing = pay 10 months. */
export const YEAR_MONTHS = 10;

export function planPrice(currency, index, yearly = false) {
  const list = PRICES[currency];
  if (!list || PLANS[index]?.custom) return null;
  const m = list[index];
  return yearly ? m * YEAR_MONTHS : m;
}

export function projectLimit(planKey) {
  return PLANS.find((p) => p.key === planKey)?.projects ?? 0;
}
