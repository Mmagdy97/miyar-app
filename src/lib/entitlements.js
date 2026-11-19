// Feature entitlements: a plan's features + extra features the owner grants per office.
export const FEATURES = {
  moodboard: "الموودبورد",
  selections: "الاختيارات وFF&E",
  change_orders: "أوامر التغيير",
  certificates: "المستخلصات والمحتجزات",
  procurement: "الباطن والمشتريات",
  attendance: "الحضور والعمالة",
  purchase_invoices: "فواتير الشراء ورؤية العميل",
  client_calculator: "حاسبة العميل في الموودبورد",
  warranty: "الضمان وطلبات الصيانة",
  rfi: "الاستفسارات الفنية (RFI)",
  drawings: "المخططات ونسخها",
  structural: "القسم الإنشائي",
  mobile_app: "تطبيق موبايل باسم المكتب",
  custom_theme: "ثيم خاص بهوية المكتب",
};
const PRO = ["moodboard", "selections", "change_orders", "purchase_invoices", "client_calculator"];
const OFFICE = [...PRO, "certificates", "procurement", "attendance", "warranty", "rfi", "drawings", "structural"];
// Enterprise also gets the custom theme free (paid add-on on the other plans).
const ENTERPRISE = [...OFFICE, "custom_theme"];
export const PLAN_FEATURES = { free: [], pro: PRO, office: OFFICE, enterprise: ENTERPRISE };

/** Numeric limits per plan. Infinity = unlimited. Exceeding one means upgrading or buying an add-on. */
export const PLAN_LIMITS = {
  free:       { projects: 1,        cashEngineers: 1,        themes: 1,        archiveDays: 30 },
  pro:        { projects: 4,        cashEngineers: 5,        themes: 3,        archiveDays: 365 },
  office:     { projects: 8,        cashEngineers: Infinity, themes: Infinity, archiveDays: Infinity },
  enterprise: { projects: Infinity, cashEngineers: Infinity, themes: Infinity, archiveDays: Infinity },
};

/** Paid add-ons, sold by request until online payment exists. kind: once | monthly | per_project. */
export const ADDONS = {
  custom_theme: { kind: "once", feature: "custom_theme" },
  mobile_app: { kind: "monthly", feature: "mobile_app" },
  extra_project: { kind: "per_project" },
  structural: { kind: "monthly", feature: "structural" },
};

/** Effective limit: plan limit, plus purchased extra projects. */
export const orgLimit = (org, key) => {
  const base = (PLAN_LIMITS[org?.plan] || PLAN_LIMITS.free)[key];
  return key === "projects" ? base + (Number(org?.extra_projects) || 0) : base;
};
/** True when the office may add one more of `key` given its current count. */
export const withinLimit = (org, key, count) => !org || count < orgLimit(org, key);
export const hasFeature = (org, f) => !org || orgFeatures(org).has(f);

/** Sidebar tab id -> feature key (tabs not listed are always available). */
export const TAB_FEATURE = {
  Moodboard: "moodboard", Selections: "selections", "Change Orders": "change_orders",
  "Purchase Invoices": "purchase_invoices", Warranty: "warranty", RFI: "rfi", "Drawings & Docs": "drawings", Certificates: "certificates", Procurement: "procurement", Attendance: "attendance",
};

export const orgFeatures = (org) => new Set([...(PLAN_FEATURES[org?.plan] || []), ...(org?.extra_features || [])]);

let active = null; // real office of the signed-in user; null = guest/demo (everything enabled)
export const setActiveOrg = (org) => { active = org || null; };
export const isTabAllowed = (id) => !active || !TAB_FEATURE[id] || orgFeatures(active).has(TAB_FEATURE[id]);
export const getActiveOrg = () => active;
