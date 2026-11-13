const line = (i, k) => Math.round((Number(i.qty) || 0) * (Number(i[k]) || 0));
export const linePrice = (i) => line(i, "price");
export const lineCost = (i) => line(i, "cost");

export const COMMITTED = ["approved", "ordered", "delivered", "installed"];
export const STEPS = ["approved", "ordered", "delivered", "installed"];

const DAY = 86400000;
const iso = (d) => d.toISOString().slice(0, 10);
export const today = () => iso(new Date());

/** Expected delivery date (ISO) = order date + lead days; "" when unknown. */
export function etaOf(i) {
  if (!i.orderedAt || !(Number(i.leadDays) > 0)) return "";
  return iso(new Date(new Date(i.orderedAt).getTime() + Number(i.leadDays) * DAY));
}
/** Ordered, not yet delivered, and past its ETA. */
export const isLate = (i, now = today()) => i.status === "ordered" && !!etaOf(i) && etaOf(i) < now;
/** Index of the item's current step in STEPS (-1 when not yet approved). */
export const stepIndex = (i) => STEPS.indexOf(i.status);

/** Purchase orders: approved items (not yet ordered) or already-ordered ones grouped per supplier. */
export function groupBySupplier(items, statuses = ["approved", "ordered", "delivered", "installed"]) {
  return Object.entries(
    items.filter((i) => statuses.includes(i.status)).reduce((m, i) => ((m[i.supplier || ""] ||= []).push(i), m), {}),
  ).map(([supplier, list]) => ({ supplier, list, total: list.reduce((s, i) => s + lineCost(i), 0), phone: list.find((i) => i.phone)?.phone || "" }));
}

/** Totals for FF&E / client selections. Only approved or ordered lines count as committed. */
export function selectionTotals(items) {
  const committed = items.filter((i) => COMMITTED.includes(i.status));
  const price = committed.reduce((s, i) => s + linePrice(i), 0);
  const cost = committed.reduce((s, i) => s + lineCost(i), 0);
  return {
    price,
    cost,
    margin: price - cost,
    marginPct: price ? Math.round(((price - cost) / price) * 100) : 0,
    pending: items.filter((i) => i.status === "proposed").reduce((s, i) => s + linePrice(i), 0),
  };
}

export const groupByRoom = (items) =>
  items.reduce((m, i) => {
    (m[i.room || ""] ||= []).push(i);
    return m;
  }, {});

/** wa.me link to a supplier (digits only; Egyptian local 01xxxxxxxxx -> 20 prefix). */
export function supplierWa(phone, text = "") {
  let d = String(phone || "").replace(/\D/g, "");
  if (!d) return "";
  if (d.startsWith("00")) d = d.slice(2);
  else if (d.startsWith("0")) d = "20" + d.slice(1);
  return `https://wa.me/${d}${text ? "?text=" + encodeURIComponent(text) : ""}`;
}
