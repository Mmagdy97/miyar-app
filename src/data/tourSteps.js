// Product tour: per role, ordered steps. `nav` = sidebar item id to spotlight (falls back to a centred card when not visible, e.g. mobile).
// Texts live in i18n as tour.<RoleKey>.<n>.t / .b ; RoleKey = role without spaces.
export const TOUR = {
  Admin: [null, "Team", "Projects", "BOQ & Approvals", "Financials & Petty Cash", null],
  "Technical Office": [null, "BOQ Management", "Drawings & Docs", null],
  "Site Engineer": [null, "Daily Reports", "Attendance", null],
  Accountant: [null, "Financials & Petty Cash", "Certificates", null],
  Secretary: [null, "Projects", "Team", null],
  Client: [null, "My Projects", "Invoices & Payments", null],
};
export const roleKey = (r) => String(r || "").replace(/\s+/g, "");
export const stepsFor = (role) => TOUR[role] || [];
