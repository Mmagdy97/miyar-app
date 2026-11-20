import { createPersistedStore } from "./persisted";

// Office profile used on quotes, share links and exported invoices.
// vatRate: percent. Defaults are filled per currency on first use (see defaultVat).
export const officeStore = createPersistedStore("miyar:office:v1", {
  name: "",
  taxId: "",
  phone: "",
  vatRate: null,
  quoteDays: 14,
  logo: "",
  color: "#0E2A47",
  address: "",
  email: "",
  type: "architectural",
});

export const DEFAULT_VAT = { EGP: 14, SAR: 15, AED: 5, TRY: 20, JOD: 16, KWD: 0, USD: 0, EUR: 22 };
export const defaultVat = (currency) => DEFAULT_VAT[currency] ?? 0;
