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
export const selectionsStore = createPersistedStore("miyar:selections:v2", [
  { id: 201, projectId: 1, room: "الريسبشن", name: "كنبة ثلاثية مخمل", supplier: "معرض دار الأثاث - مدينة نصر", phone: "01001234567", dims: "٢٤٠×٩٥×٨٥ سم", material: "مخمل مع هيكل خشب زان", code: "SF-240", leadDays: 21, color: "#8C7A5B", image: "", qty: 1, cost: 38000, price: 46000, status: "proposed" },
  { id: 202, projectId: 1, room: "الريسبشن", name: "طاولة قهوة رخام", supplier: "ورشة النخبة للرخام - العبور", phone: "01112223334", dims: "١٢٠×٦٠×٤٥ سم", material: "رخام كرارا بقاعدة نحاس", code: "CT-120", leadDays: 14, color: "#E8E2D6", image: "", qty: 1, cost: 9000, price: 12500, status: "approved" },
  { id: 203, projectId: 1, room: "غرفة الماستر", name: "سرير كينج بظهر منجد", supplier: "ورشة الأمل للأثاث - دمياط", phone: "01223334445", dims: "٢٠٠×٢٢٠ سم", material: "قماش كتان وخشب زان", code: "BD-200", leadDays: 30, color: "#B7A58C", image: "", qty: 1, cost: 52000, price: 65000, status: "proposed" },
  { id: 204, projectId: 1, room: "غرفة الماستر", name: "ستارة بلاك آوت مع شير", supplier: "دار الستائر - مصر الجديدة", phone: "01005556667", dims: "عرض ٤ م × ارتفاع ٢٫٨ م", material: "كتان مع بطانة عازلة", code: "CR-01", leadDays: 10, color: "#6B5B4B", image: "", qty: 1, cost: 14000, price: 18500, status: "approved" },
  { id: 205, projectId: 1, room: "المطبخ", name: "جزيرة مطبخ بسطح كوارتز", supplier: "ورشة المطابخ الحديثة - ١٠ رمضان", phone: "01556667778", dims: "٢٨٠×١١٠×٩٠ سم", material: "كوارتز أبيض وجوانب خشب جوز", code: "KI-280", leadDays: 28, color: "#D9D4CB", image: "", qty: 1, cost: 86000, price: 110000, status: "ordered" },
  { id: 206, projectId: 1, room: "الريسبشن", name: "ثريا كريستال معاصرة", supplier: "معرض الإضاءة الذهبي - وسط البلد", phone: "01067778889", dims: "قطر ٩٠ سم", material: "كريستال وإطار نحاسي", code: "LT-90", leadDays: 12, color: "#C8A27A", image: "", qty: 1, cost: 21000, price: 27500, status: "proposed" },
], localize);

// Electronic quote acceptances keyed by quote number: { name, img (png data URL), total, at }.
export const signaturesStore = createPersistedStore("miyar:signatures:v1", {}, (x) => x);

// Moodboard tiles per project: image (https URL), colour (#hex) or note; the client can like tiles.
export const moodStore = createPersistedStore("miyar:mood:v2", [
  { id: 101, projectId: 1, kind: "image", value: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80", caption: "ريسبشن نيوكلاسيك بإضاءة مخفية", liked: true },
  { id: 102, projectId: 1, kind: "color", value: "#C8A27A", caption: "بيج كاميل للحوائط", liked: true },
  { id: 103, projectId: 1, kind: "image", value: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80", caption: "مطبخ مفتوح بخشب جوز", liked: false },
  { id: 104, projectId: 1, kind: "note", value: "الرخام كلكتا جولد في البهو، ومط في الحمامات.", caption: "ملاحظة المصممة", liked: false },
  { id: 105, projectId: 1, kind: "color", value: "#2F3A40", caption: "رمادي فحمي للأبواب", liked: false },
  { id: 106, projectId: 1, kind: "image", value: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80", caption: "واجهة وحديقة", liked: false },
], localize);

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
