/** Approved change orders adjust the contract value and deadline. */
export function applyChangeOrders(contractValue, orders) {
  const ok = orders.filter((o) => o.status === "approved");
  return {
    value: (Number(contractValue) || 0) + ok.reduce((s, o) => s + (Number(o.cost) || 0), 0),
    days: ok.reduce((s, o) => s + (Number(o.days) || 0), 0),
    count: ok.length,
  };
}

export const canDecide = (o) => o.status === "sent";
