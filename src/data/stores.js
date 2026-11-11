import { createPersistedStore } from "./persisted";
import { localize } from "./dataI18n";
import { CLIENT_INVOICES } from "./seed";
import { TECH_DRAWINGS, TECH_RFIS } from "./techSeed";
import { WORKERS } from "./workersSeed";
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

// Site problems reported from field tasks (Admin/Tech Office read these later via Supabase).
export const problemsStore = createPersistedStore("miyar:problems:v1", [], (x) => x);

// Progress-billing certificates (مستخلصات / hakediş). Amounts in base currency units.
export const certsStore = createPersistedStore("miyar:certs:v1", [], (x) => x);

// Site labour (puantaj): workers list and daily attendance { "YYYY-MM-DD": { workerId: { s, ot } } }.
export const workersStore = createPersistedStore("miyar:workers:v1", WORKERS, localize);
export const attendanceStore = createPersistedStore("miyar:attendance:v1", {}, (x) => x);

// Subcontractors and purchase orders (Admin). Amounts in base currency units.
export const subsStore = createPersistedStore("miyar:subs:v1", [
  { id: 1, name: "شركة النور للكهرباء", trade: "كهرباء", contract: 420000, paid: 210000 },
  { id: 2, name: "مؤسسة الأمل للسباكة", trade: "سباكة", contract: 310000, paid: 93000 },
], (x) => x);
export const posStore = createPersistedStore("miyar:pos:v1", [
  { id: 1, no: "PO-001", supplier: "الصفا للرخام", item: "رخام كرارة", qty: 120, price: 1850, status: "sent" },
], (x) => x);

// Change orders (أوامر التغيير): draft -> sent -> approved/rejected by the client.
export const changeOrdersStore = createPersistedStore("miyar:changeorders:v1", [], (x) => x);

// Client selections / FF&E schedule lines: proposed -> approved/rejected -> ordered.
export const selectionsStore = createPersistedStore("miyar:selections:v1", [], (x) => x);

// Electronic quote acceptances keyed by quote number: { name, img (png data URL), total, at }.
export const signaturesStore = createPersistedStore("miyar:signatures:v1", {}, (x) => x);

// Moodboard tiles per project: image (https URL), colour (#hex) or note; the client can like tiles.
export const moodStore = createPersistedStore("miyar:mood:v1", [], (x) => x);

// Technical office: drawings and RFIs shared by the dashboard and the drawings screen; workflow settings.
export const drawingsStore = createPersistedStore("miyar:drawings:v1", TECH_DRAWINGS, localize);
export const rfisStore = createPersistedStore("miyar:rfis:v1", TECH_RFIS, localize);
export const TECH_SETTINGS_DEFAULT = {
  notifySiteOnAfc: true,
  requireConsultantSign: true,
  autoArchiveRevisions: true,
  autoAlertDelayedRfi: true,
  lockBoqAfterClientApproval: false,
};
export const techSettingsStore = createPersistedStore("miyar:techsettings:v1", TECH_SETTINGS_DEFAULT, (x) => x);
