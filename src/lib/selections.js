const line = (i, k) => Math.round((Number(i.qty) || 0) * (Number(i[k]) || 0));
export const linePrice = (i) => line(i, "price");
export const lineCost = (i) => line(i, "cost");

/** Totals for FF&E / client selections. Only approved or ordered lines count as committed. */
export function selectionTotals(items) {
  const committed = items.filter((i) => i.status === "approved" || i.status === "ordered");
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
