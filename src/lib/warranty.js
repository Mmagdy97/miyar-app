/** Warranty end date (YYYY-MM-DD) from a start date and a number of months. */
export const warrantyEnd = (start, months) => {
  const d = new Date(`${start}T00:00:00Z`);
  const day = d.getUTCDate();
  d.setUTCMonth(d.getUTCMonth() + Number(months));
  if (d.getUTCDate() !== day) d.setUTCDate(0); // Jan 31 + 1 month -> end of Feb
  return d.toISOString().slice(0, 10);
};
/** { end, daysLeft, state } where state = active | soon (<=30 days) | expired. */
export const warrantyStatus = (w, today = new Date().toISOString().slice(0, 10)) => {
  const end = warrantyEnd(w.start, w.months);
  const daysLeft = Math.round((Date.parse(end) - Date.parse(today)) / 86400000);
  return { end, daysLeft, state: daysLeft < 0 ? "expired" : daysLeft <= 30 ? "soon" : "active" };
};
