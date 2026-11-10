import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import ar from "./ar";
import en from "./en";
import tr from "./tr";
import { LOCALES } from "../config/locale";
import { CURRENCIES, formatMoney } from "../lib/currency";

const DICTS = { ar, en, tr };
const INTL = { ar: "ar-EG", en: "en-US", tr: "tr-TR" };
const KEY = "miyar:settings:v1";

const load = () => {
  try {
    const s = JSON.parse(localStorage.getItem(KEY));
    if (s && DICTS[s.locale] && CURRENCIES[s.currency]) return s;
  } catch { /* ignore */ }
  return { locale: "ar", currency: "EGP" };
};

// Module-level current settings so plain helpers (formatters in seed.js) can read them.
let current = load();
export const getLocale = () => current.locale;
export const getCurrency = () => current.currency;
export const intlLocale = () => INTL[current.locale];
export const tr_ = (key) => DICTS[current.locale][key] ?? DICTS.ar[key] ?? key;
export const money = (n, opts) => formatMoney(n, current.currency, intlLocale(), opts);
export const currencySymbol = () => {
  const parts = new Intl.NumberFormat(intlLocale(), { style: "currency", currency: current.currency }).formatToParts(0);
  return parts.find((p) => p.type === "currency")?.value ?? current.currency;
};

const Ctx = createContext(null);

export function I18nProvider({ children }) {
  const [settings, setSettings] = useState(current);

  const update = useCallback((patch) => {
    current = { ...current, ...patch };
    try { localStorage.setItem(KEY, JSON.stringify(current)); } catch { /* ignore */ }
    setSettings(current);
    // Module-level formatted data (seed-derived state) is rebuilt cleanly by a reload.
    // Session (login/role) is kept in sessionStorage, so the user stays where they were.
    window.location.reload();
  }, []);

  useEffect(() => {
    const l = LOCALES[settings.locale];
    document.documentElement.lang = l.lang;
    document.documentElement.dir = l.dir;
  }, [settings.locale]);

  const value = useMemo(() => ({
    ...settings,
    dir: LOCALES[settings.locale].dir,
    setLocale: (locale) => update({ locale }),
    setCurrency: (currency) => update({ currency }),
    t: (key) => DICTS[settings.locale][key] ?? DICTS.ar[key] ?? key,
  }), [settings, update]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useI18n = () => useContext(Ctx);
