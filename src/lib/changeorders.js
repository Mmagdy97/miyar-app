/** Approved change orders adjust the contract value and deadline. */
export function applyChangeOrders(contractValue, orders) {
  const ok = orders.filter((o) => o.status === "approved");
  return {
    value: (Number(contractValue) || 0) + ok.reduce((s, o) => s + (Number(o.cost) || 0), 0),
    days: ok.reduce((s, o) => s + (Number(o.days) || 0), 0),
    count: ok.length,
    pendingDays: orders.filter((o) => o.status === "sent").reduce((s, o) => s + (Number(o.days) || 0), 0),
  };
}

/** ISO deadline (YYYY-MM-DD) pushed by `days`; "" when no valid deadline. */
export function shiftDeadline(deadline, days) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(deadline || "");
  if (!m) return "";
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3] + (Number(days) || 0)));
  return d.toISOString().slice(0, 10);
}

export const canDecide = (o) => o.status === "sent";
