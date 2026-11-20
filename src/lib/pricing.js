// Regional LAUNCH price lists (fixed per market, not FX-converted): 50% off for the first 30 offices.
// The regular list price is LAUNCH_FACTOR x these. Validate with first customers.
export const PRICES = {
  EGP: [0, 899, 1990],
  SAR: [0, 149, 299],
  AED: [0, 149, 299],
  KWD: [0, 12, 25],
  JOD: [0, 25, 55],
  TRY: [0, 1290, 2790],
  USD: [0, 39, 89],
  // Europe (Italy first): ~2% of the average monthly wage, in line with the Gulf; regular price is double.
  EUR: [0, 49, 109],
};

/** Regular price = launch price x 2 (the launch offer is 50% off). */
export const LAUNCH_FACTOR = 2;

/** Monthly price of one extra active project, per market (about half the Professional price). */
export const EXTRA_PROJECT = { EGP: 450, SAR: 75, AED: 75, KWD: 6, JOD: 13, TRY: 650, USD: 20, EUR: 25 };

export const PLANS = [
  { key: "free", n: 4, projects: 1 },
  { key: "pro", n: 5, projects: 4, highlight: true },
  { key: "office", n: 5, projects: 8 },
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

/** Regular (post-launch) total for one billing cycle: list x 2, with the cycle discount. */
export function regularPrice(currency, index, months = 1) {
  const p = planPrice(currency, index, months);
  return p == null ? null : p * LAUNCH_FACTOR;
}

/** The launch offer covers 3, 6 and 12-month subscriptions only, not monthly. */
export const launchApplies = (months) => months >= 3;

/** Launch-offer total for one billing cycle: 50% off the regular monthly price, not combined with the cycle discount.
 *  Monthly billing has no launch offer, so it returns the regular price. */
export function launchPrice(currency, index, months = 1) {
  const list = PRICES[currency];
  if (!list || PLANS[index]?.custom) return null;
  return launchApplies(months) ? list[index] * months : regularPrice(currency, index, months);
}
