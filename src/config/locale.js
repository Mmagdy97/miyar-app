// Locale registry: direction + language per supported locale.
// UI strings are still Arabic; full i18n (ar/tr/en) comes in Step 4.
export const LOCALES = {
  ar: { lang: "ar", dir: "rtl", name: "العربية" },
  tr: { lang: "tr", dir: "ltr", name: "Türkçe" },
  en: { lang: "en", dir: "ltr", name: "English" },
};
export const DEFAULT_LOCALE = "ar";
export const dirOf = (locale) => (LOCALES[locale] || LOCALES[DEFAULT_LOCALE]).dir;
