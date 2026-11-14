/**
 * Single source of truth for the demo data.
 * Every screen (Admin, Projects, Team, Financials, Client portal, Landing)
 * reads from here, so numbers, names and dates can never disagree.
 * When the Supabase backend is added, this file is replaced by queries.
 */

/* ───────────── Formatting helpers (locale + currency aware) ───────────── */

import { getLocale, intlLocale, currencySymbol } from "../i18n";
import { localize } from "./dataI18n";


/** Latin digits everywhere (one numeral system across the UI). */
export const toAr = (value) =>
  String(value);

/** 5400000 -> "5,400,000" (ar) | "5,400,000" (en) | "5.400.000" (tr) */
export const formatNumber = (n) =>
  getLocale() === "ar"
    ? toAr(Math.round(n).toLocaleString("en-US"))
    : Math.round(n).toLocaleString(intlLocale());

/** Amount + the office currency symbol (name kept for existing callers). */
export const formatEGP = (n) => `${formatNumber(n)} ${currencySymbol()}`;

const COMPACT = {
  ar: { m: "مليون", k: "ألف" },
  en: { m: "M", k: "K" },
  tr: { m: "Mn", k: "B" },
};

/** 15550000 -> "15.55 M" / "15.55 مليون", 580000 -> "580 K" / "580 ألف" */
export const formatCompact = (n) => {
  const w = COMPACT[getLocale()];
  if (n >= 1_000_000) {
    const m = Math.round((n / 1_000_000) * 100) / 100;
    return `${toAr(m)} ${w.m}`;
  }
  return `${toAr(Math.round(n / 1000))} ${w.k}`;
};

const dateFmt = (opts) => (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat(intlLocale(), { ...opts, timeZone: "UTC" }).format(Date.UTC(y, m - 1, d));
};

/** "2026-12-30" -> "30 ديسمبر 2026" / "30 December 2026" (name kept for existing callers) */
export const formatDateAr = dateFmt({ day: "numeric", month: "long", year: "numeric" });

/** "2026-12-30" -> "ديسمبر 2026" / "December 2026" */
export const formatMonthYearAr = dateFmt({ month: "long", year: "numeric" });

/* ───────────── People ───────────── */

const prefixed = (name) => `${{ ar: "م.", en: "Eng.", tr: "Müh." }[getLocale()] || "م."} ${name}`;

export const PEOPLE = [
  { id: "sara", name: "سارة عامر", title: "كبير المعماريين", role: "مدير", email: "sara.amer@miyar.eg", phone: "+20 111 876 5432", status: "نشط", color: "bg-[#1E2429]" },
  { id: "tarek", name: "طارق يوسف", title: "استشاري MEP", role: "مكتب فني", email: "tarek.youssef@miyar.eg", phone: "+20 122 345 6789", status: "نشط", color: "bg-[#5F6C61]" },
  { id: "layla", name: "ليلى رياض", title: "مصممة الديكور", role: "مكتب فني", email: "layla.riad@miyar.eg", phone: "+20 114 999 8877", status: "في إجازة", color: "bg-[#5F6C61]" },
  { id: "ahmed", name: "أحمد الشناوي", title: "مهندس الموقع", role: "مهندس موقع", email: "ahmed.elshennawy@miyar.eg", phone: "+20 100 234 5678", status: "نشط", color: "bg-[#5F6C61]" },
  { id: "karim", name: "كريم مصطفى", title: "مهندس الموقع", role: "مهندس موقع", email: "karim.mostafa@miyar.eg", phone: "+20 106 555 4321", status: "نشط", color: "bg-[#5F6C61]" },
  { id: "omar", name: "عمر عادل", title: "مهندس الموقع", role: "مهندس موقع", email: "omar.adel@miyar.eg", phone: "+20 101 222 3344", status: "نشط", color: "bg-[#5F6C61]" },
  { id: "youssef", name: "يوسف مدحت", title: "مهندس الموقع", role: "مهندس موقع", email: "youssef.medhat@miyar.eg", phone: "+20 109 888 7766", status: "نشط", color: "bg-[#1E2429]" },
].map((p) => localize({ ...p })).map((p) => ({ ...p, displayName: prefixed(p.name) }));

export const personById = (id) => PEOPLE.find((p) => p.id === id);

/** "أحمد الشناوي" -> "أ.ش" */
export const initialsOf = (name) =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join(".");

/* ───────────── Projects ───────────── */

export const PHASES = ["تصميم", "تأسيس", "تشطيب", "تسليم"];

export const PROJECTS = [
  {
    id: 1,
    code: "YAS-2026",
    name: "فيلا الياسمين - التجمع الخامس",
    category: "سكني فاخر",
    client: "أ. محمد عبد الرحمن",
    engineerId: "karim",
    teamIds: ["sara", "karim", "tarek"],
    phase: "تشطيب",
    phaseTitle: "التشطيب النهائي وأعمال MEP",
    phaseDetail: "تركيب الرخام المستورد والتكييف المركزي المخفي",
    progress: 65,
    status: "جاري العمل",
    startDate: "2026-09-01",
    deadline: "2026-12-30",
    contractValue: 5_400_000,
    budget: 4_200_000,
    collected: 2_700_000,
    spentActual: 2_430_000,
    location: "التجمع الخامس - القاهرة الجديدة",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    code: "ZAY-2026",
    name: "مقر إداري - الشيخ زايد",
    category: "مساحات عمل ومكاتب",
    client: "شركة كابيتال القابضة",
    engineerId: "ahmed",
    teamIds: ["layla", "ahmed"],
    phase: "تأسيس",
    phaseTitle: "أعمال التأسيس والهيكل الداخلي",
    phaseDetail: "قواطع زجاجية عازلة وهياكل أسقف معلقة",
    progress: 42,
    status: "متأخر",
    startDate: "2026-08-15",
    deadline: "2026-11-20",
    contractValue: 3_200_000,
    budget: 2_500_000,
    collected: 1_600_000,
    spentActual: 1_350_000,
    location: "بوليجون سوديك - الشيخ زايد",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    code: "NGZ-2026",
    name: "دوبلكس نيو جيزة - بالم هيلز",
    category: "تجديد بنتهاوس كامل",
    client: "د. طارق السعيد",
    engineerId: "omar",
    teamIds: ["omar", "tarek"],
    phase: "تشطيب",
    phaseTitle: "أعمال النجارة والديكور",
    phaseDetail: "تجليد جدران خشب جوز طبيعي ومطابخ ألمانية",
    progress: 88,
    status: "متقدم عن الجدول",
    startDate: "2026-06-10",
    deadline: "2026-12-05",
    contractValue: 2_850_000,
    budget: 2_200_000,
    collected: 2_280_000,
    spentActual: 1_980_000,
    location: "نيو جيزة - طريق الإسكندرية الصحراوي",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    code: "RIV-2026",
    name: "بنتهاوس ريفيرا - هليوبوليس",
    category: "بنتهاوس فاخر",
    client: "م. شريف والي",
    engineerId: "youssef",
    teamIds: ["youssef", "sara"],
    phase: "تصميم",
    phaseTitle: "التصميم والاعتمادات المبدئية",
    phaseDetail: "مخططات ثلاثية الأبعاد واعتماد المقايسة التعاقدية",
    progress: 15,
    status: "جاري العمل",
    startDate: "2026-10-01",
    deadline: "2027-02-28",
    contractValue: 4_100_000,
    budget: 3_200_000,
    collected: 820_000,
    spentActual: 420_000,
    location: "مصر الجديدة - القاهرة",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
  },
].map(localize);

export const projectById = (id) => PROJECTS.find((p) => p.id === id);

/** The client-portal demo user owns this project. */
export const CLIENT_PROJECT_ID = 1;
export const clientProject = () => projectById(CLIENT_PROJECT_ID);

/* ───────────── Team (derived from PEOPLE + PROJECTS) ───────────── */

export const projectsCountFor = (personId) =>
  PROJECTS.filter((p) => p.teamIds.includes(personId)).length;

/* ───────────── Petty cash ───────────── */

export const ENGINEER_CASH = [
  { id: 1, engineerId: "ahmed", projectId: 2, totalGiven: 50_000, spent: 35_000 },
  { id: 2, engineerId: "karim", projectId: 1, totalGiven: 75_000, spent: 48_000 },
  { id: 3, engineerId: "omar", projectId: 3, totalGiven: 40_000, spent: 34_500 },
  { id: 4, engineerId: "youssef", projectId: 4, totalGiven: 30_000, spent: 12_000 },
];

/* ───────────── Client invoices (client portal project) ───────────── */

export const CLIENT_INVOICES = [
  { id: 1, title: "الدفعة الأولى: التعاقد واعتماد المخططات 3D", milestone: "مقدم التعاقد وبدء أعمال التصميم", amount: 1_350_000, dueDate: "2026/09/01", paidDate: "2026/09/03", status: "مدفوع", receiptNo: "INV-2026-001", dueIso: "2026-09-01" },
  { id: 2, title: "الدفعة الثانية: أعمال التأسيس والمرافق (MEP)", milestone: "استلام شبكات السباكة والكهرباء والعزل", amount: 1_350_000, dueDate: "2026/10/01", paidDate: "2026/10/05", status: "مدفوع", receiptNo: "INV-2026-002", dueIso: "2026-10-01" },
  { id: 3, title: "الدفعة الثالثة: توريد وتركيب الرخام والجبسوم بورد", milestone: "مرحلة أعمال التشطيبات المعمارية الكبرى", amount: 1_350_000, dueDate: "2026/11/15", paidDate: null, status: "مستحق", receiptNo: "INV-2026-003", dueIso: "2026-11-15" },
  { id: 4, title: "الدفعة الرابعة: الدهانات النهائية والأبواب والتجهيزات", milestone: "التشطيبات الدقيقة والألوان والإنارة", amount: 810_000, dueDate: "2026/12/10", paidDate: null, status: "مستحق", receiptNo: "INV-2026-004", dueIso: "2026-12-10" },
  { id: 5, title: "الدفعة الخامسة: التسليم النهائي وشهادة الضمان", milestone: "المعاينة الختامية والتسليم المفتاحي", amount: 540_000, dueDate: "2026/12/30", paidDate: null, status: "مستحق", receiptNo: "INV-2026-005", dueIso: "2026-12-30" },
].map(localize);

/* ───────────── Overdue receivables (office level) ───────────── */

export const OVERDUE = [
  { projectId: 2, amount: 580_000, daysLate: 18 },
  { projectId: 3, amount: 360_000, daysLate: 11 },
  { projectId: 4, amount: 200_000, daysLate: 5 },
];

/* ───────────── Derived totals ───────────── */

const sum = (arr, pick) => arr.reduce((acc, x) => acc + pick(x), 0);

export const getTotals = () => {
  const contractTotal = sum(PROJECTS, (p) => p.contractValue);
  const collectedTotal = sum(PROJECTS, (p) => p.collected);
  const overdueTotal = sum(OVERDUE, (o) => o.amount);
  const cashGiven = sum(ENGINEER_CASH, (c) => c.totalGiven);
  const cashSpent = sum(ENGINEER_CASH, (c) => c.spent);
  const topOverdue = [...OVERDUE].sort((a, b) => b.amount - a.amount)[0];

  return {
    projectCount: PROJECTS.length,
    contractTotal,
    collectedTotal,
    collectedPct: Math.round((collectedTotal / contractTotal) * 100),
    overdueTotal,
    overdueCount: OVERDUE.length,
    overdueAvgDays: Math.round(sum(OVERDUE, (o) => o.daysLate) / OVERDUE.length),
    topOverdue: topOverdue && {
      ...topOverdue,
      projectName: projectById(topOverdue.projectId).name,
      pctOfOverdue: Math.round((topOverdue.amount / overdueTotal) * 100),
    },
    cashGiven,
    cashSpent,
    cashRemaining: cashGiven - cashSpent,
    cashUsedPct: Math.round((cashSpent / cashGiven) * 100),
    cashEngineerCount: ENGINEER_CASH.length,
  };
};

/** Payment summary for a client-portal project. */
export const getClientPayments = (invoices = CLIENT_INVOICES) => {
  const project = clientProject();
  const total = sum(invoices, (i) => i.amount);
  const paid = sum(
    invoices.filter((i) => i.status === "مدفوع"),
    (i) => i.amount
  );
  const next = invoices.find((i) => i.status !== "مدفوع") || null;
  return {
    project,
    total,
    paid,
    paidPct: Math.round((paid / total) * 100),
    paidCount: invoices.filter((i) => i.status === "مدفوع").length,
    next,
  };
};
