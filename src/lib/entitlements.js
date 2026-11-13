// Feature entitlements: a plan's features + extra features the owner grants per office.
export const FEATURES = {
  moodboard: "الموودبورد",
  selections: "الاختيارات وFF&E",
  change_orders: "أوامر التغيير",
  certificates: "المستخلصات والمحتجزات",
  procurement: "الباطن والمشتريات",
  attendance: "الحضور والعمالة",
};
const PRO = ["moodboard", "selections", "change_orders"];
const OFFICE = [...PRO, "certificates", "procurement", "attendance"];
export const PLAN_FEATURES = { free: [], pro: PRO, office: OFFICE, enterprise: OFFICE };

/** Sidebar tab id -> feature key (tabs not listed are always available). */
export const TAB_FEATURE = {
  Moodboard: "moodboard", Selections: "selections", "Change Orders": "change_orders",
  Certificates: "certificates", Procurement: "procurement", Attendance: "attendance",
};

export const orgFeatures = (org) => new Set([...(PLAN_FEATURES[org?.plan] || []), ...(org?.extra_features || [])]);

let active = null; // real office of the signed-in user; null = guest/demo (everything enabled)
export const setActiveOrg = (org) => { active = org || null; };
export const isTabAllowed = (id) => !active || !TAB_FEATURE[id] || orgFeatures(active).has(TAB_FEATURE[id]);
