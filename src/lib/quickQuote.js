const n = (v) => Math.max(0, Number(v) || 0);

/** One BOQ line priced from its direct costs: unit cost = materials + labour + transport; price = cost × (1 + markup). */
export function quickQuote({ qty, materials, labour, transport, markup, vat }) {
  const unitCost = n(materials) + n(labour) + n(transport);
  const unitPrice = Math.round(unitCost * (1 + n(markup) / 100));
  const q = n(qty);
  const subtotal = unitPrice * q;
  const cost = unitCost * q;
  const profit = subtotal - cost;
  const tax = Math.round(subtotal * n(vat) / 100);
  return { unitCost, unitPrice, subtotal, cost, profit, tax, total: subtotal + tax, margin: subtotal > 0 ? Math.round((profit / subtotal) * 1000) / 10 : 0 };
}
