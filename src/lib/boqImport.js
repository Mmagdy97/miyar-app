// Map spreadsheet rows (array of arrays) to BOQ items. Header names in Arabic, English or Turkish.
const ALIASES = {
  category: ["category", "trade", "section", "القسم", "التصنيف", "نوع الأعمال", "الأعمال", "kategori", "bölüm", "iş kalemi grubu"],
  name: ["item", "description", "name", "البند", "الوصف", "البيان", "اسم البند", "kalem", "açıklama", "tanım"],
  unit: ["unit", "uom", "الوحدة", "birim"],
  quantity: ["qty", "quantity", "الكمية", "الكميه", "miktar"],
  unitCost: ["unit cost", "cost", "rate", "unit price", "price", "سعر الوحدة", "التكلفة", "سعر التكلفة", "السعر", "birim fiyat", "maliyet", "fiyat"],
  margin: ["margin", "margin %", "markup", "هامش الربح", "الهامش", "نسبة الربح", "kâr", "kar", "kâr marjı", "marj"],
  note: ["note", "notes", "spec", "remarks", "ملاحظات", "المواصفات", "ملاحظة", "not", "notlar", "şartname"],
};
const AR = "٠١٢٣٤٥٦٧٨٩", FA = "۰۱۲۳۴۵۶۷۸۹";
const norm = (s) => String(s ?? "").trim().toLowerCase().replace(/[()%:*]/g, "").replace(/\s+/g, " ").trim();

export const toNumber = (v) => {
  if (typeof v === "number") return Number.isFinite(v) ? v : NaN;
  let s = String(v ?? "").trim().replace(/[٠-٩]/g, (d) => AR.indexOf(d)).replace(/[۰-۹]/g, (d) => FA.indexOf(d));
  s = s.replace(/[٫]/g, ".").replace(/[٬،\s]/g, "").replace(/[^\d.,-]/g, "");
  if (!s) return NaN;
  // "1.234,5" (tr/eu) vs "1,234.5" (en): the last separator is the decimal one.
  // A single separator followed by exactly 3 digits is a thousands separator ("4,500", "4.500").
  if (/^-?\d{1,3}([.,])\d{3}$/.test(s)) return Number(s.replace(/[.,]/, ""));
  const lc = s.lastIndexOf(","), ld = s.lastIndexOf(".");
  if (lc > ld) s = s.replace(/\./g, "").replace(",", ".");
  else s = s.replace(/,/g, "");
  return Number(s);
};

export function detectColumns(header) {
  const cols = {};
  const taken = new Set();
  // Exact header names first, then "starts with" (so "Unit price" is a price, not a unit).
  for (const exact of [true, false]) {
    header.forEach((h, i) => {
      const n = norm(h);
      if (!n || taken.has(i)) return;
      for (const [field, names] of Object.entries(ALIASES)) {
        if (cols[field] != null) continue;
        if (names.some((a) => (exact ? n === norm(a) : n.startsWith(norm(a) + " ")))) { cols[field] = i; taken.add(i); return; }
      }
    });
  }
  return cols;
}

/** rows: first non-empty row with recognisable headers is the header. Returns { items, errors, missing }. */
export function mapRows(rows, { defaultMargin = 20, defaultCategory = "", startId = Date.now() } = {}) {
  const clean = (rows || []).filter((r) => Array.isArray(r) && r.some((c) => String(c ?? "").trim() !== ""));
  let hi = clean.findIndex((r) => { const c = detectColumns(r); return c.name != null && (c.quantity != null || c.unitCost != null); });
  if (hi < 0) return { items: [], errors: [], missing: ["name", "quantity", "unitCost"].filter(Boolean) };
  const cols = detectColumns(clean[hi]);
  const missing = ["name", "quantity", "unitCost"].filter((f) => cols[f] == null);
  const items = [], errors = [];
  let lastCategory = defaultCategory;
  clean.slice(hi + 1).forEach((r, k) => {
    const get = (f) => (cols[f] != null ? r[cols[f]] : undefined);
    const name = String(get("name") ?? "").trim();
    const qty = toNumber(get("quantity"));
    const cost = toNumber(get("unitCost"));
    const cat = String(get("category") ?? "").trim();
    if (cat) lastCategory = cat;
    // A row with only a category (section heading) sets the category for following rows.
    if (!name && cat && !Number.isFinite(qty) && !Number.isFinite(cost)) return;
    if (!name) return;
    if (!(qty > 0) || !(cost >= 0) || !Number.isFinite(cost)) { errors.push({ row: hi + k + 2, name }); return; }
    const m = toNumber(get("margin"));
    items.push({
      id: startId + items.length,
      category: lastCategory || defaultCategory,
      name,
      unit: String(get("unit") ?? "").trim(),
      quantity: qty,
      unitCost: cost,
      margin: Number.isFinite(m) ? (m > 0 && m < 1 ? Math.round(m * 1000) / 10 : m) : defaultMargin,
      note: String(get("note") ?? "").trim(),
    });
  });
  return { items, errors, missing };
}

export function parseCsv(text) {
  const t = String(text).replace(/^﻿/, "");
  const delim = (t.split("\n")[0].match(/;/g) || []).length > (t.split("\n")[0].match(/,/g) || []).length ? ";" : ",";
  const rows = []; let row = [], cell = "", q = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (q) { if (c === '"' && t[i + 1] === '"') { cell += '"'; i++; } else if (c === '"') q = false; else cell += c; continue; }
    if (c === '"') q = true;
    else if (c === delim) { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") { if (c === "\r" && t[i + 1] === "\n") i++; row.push(cell); rows.push(row); row = []; cell = ""; }
    else cell += c;
  }
  if (cell !== "" || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

export const TEMPLATE_HEADER = ["القسم", "البند", "الوحدة", "الكمية", "سعر الوحدة", "هامش الربح", "ملاحظات"];
export function toCsv(items) {
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return "﻿" + [TEMPLATE_HEADER, ...items.map((i) => [i.category, i.name, i.unit, i.quantity, i.unitCost, i.margin, i.note])].map((r) => r.map(esc).join(",")).join("\n");
}
