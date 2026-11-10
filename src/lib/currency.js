// Currency catalogue + locale-aware formatting (Intl based, no hardcoded digits).
// minor = number of decimal places the currency really uses.
export const CURRENCIES = {
  EGP: { code: "EGP", name: "جنيه مصري", symbol: "ج.م", minor: 2, country: "EG" },
  SAR: { code: "SAR", name: "ريال سعودي", symbol: "ر.س", minor: 2, country: "SA" },
  AED: { code: "AED", name: "درهم إماراتي", symbol: "د.إ", minor: 2, country: "AE" },
  KWD: { code: "KWD", name: "دينار كويتي", symbol: "د.ك", minor: 3, country: "KW" },
  JOD: { code: "JOD", name: "دينار أردني", symbol: "د.أ", minor: 3, country: "JO" },
  TRY: { code: "TRY", name: "ليرة تركية", symbol: "₺", minor: 2, country: "TR" },
  USD: { code: "USD", name: "دولار أمريكي", symbol: "$", minor: 2, country: "US" },
};

export const isSupportedCurrency = (code) => Object.hasOwn(CURRENCIES, code);

/** Format a monetary amount for a locale. compact -> no decimals when the value is whole. */
export function formatMoney(amount, currency = "EGP", locale = "ar-EG", { compact = false } = {}) {
  if (!isSupportedCurrency(currency)) throw new Error(`Unsupported currency: ${currency}`);
  const n = Number(amount);
  if (!Number.isFinite(n)) throw new Error("Amount must be a finite number");
  const { minor } = CURRENCIES[currency];
  const digits = compact && Number.isInteger(n) ? 0 : minor;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(n);
}

/** Money is stored in minor units (integers) to avoid float drift. */
export const toMinor = (amount, currency) => Math.round(Number(amount) * 10 ** CURRENCIES[currency].minor);
export const fromMinor = (minorAmount, currency) => minorAmount / 10 ** CURRENCIES[currency].minor;

/** Add VAT (e.g. 0.14 Egypt, 0.15 KSA, 0.05 UAE, 0.20 Turkey general rate) to a net amount. */
export const withVat = (net, rate, currency) => {
  const m = toMinor(net, currency);
  const vat = Math.round(m * rate);
  return { net: fromMinor(m, currency), vat: fromMinor(vat, currency), gross: fromMinor(m + vat, currency) };
};
