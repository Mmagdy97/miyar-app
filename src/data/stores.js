import { createPersistedStore } from "./persisted";
import { localize } from "./dataI18n";
import { CLIENT_INVOICES } from "./seed";
import { INITIAL_BOQ_ITEMS } from "./boqSeed";
import { INITIAL_ENGINEERS_CASH, INITIAL_PENDING_EXPENSES } from "./cashSeed";

export const cashStore = createPersistedStore("miyar:cash:v1", INITIAL_ENGINEERS_CASH, localize);
export const expensesStore = createPersistedStore("miyar:expenses:v1", INITIAL_PENDING_EXPENSES, localize);

export const cashTotals = (rows) => {
  const given = rows.reduce((s, r) => s + (Number(r.totalGiven) || 0), 0);
  const spent = rows.reduce((s, r) => s + (Number(r.spent) || 0), 0);
  return { given, spent, remaining: given - spent, usedPct: given ? Math.round((spent / given) * 100) : 0, count: rows.length };
};

export const invoicesStore = createPersistedStore("miyar:invoices:v1", CLIENT_INVOICES, localize);
export const boqStore = createPersistedStore("miyar:boq:v1", INITIAL_BOQ_ITEMS, localize);
