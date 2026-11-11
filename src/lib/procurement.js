export const poTotal = (po) => Math.round((Number(po.qty) || 0) * (Number(po.price) || 0));

export const subBalance = (s) => Math.max(0, (Number(s.contract) || 0) - (Number(s.paid) || 0));

export const procurementTotals = (subs, pos) => ({
  subContracts: subs.reduce((a, s) => a + (Number(s.contract) || 0), 0),
  subOutstanding: subs.reduce((a, s) => a + subBalance(s), 0),
  poOpen: pos.filter((p) => p.status !== "received").reduce((a, p) => a + poTotal(p), 0),
  poAll: pos.reduce((a, p) => a + poTotal(p), 0),
});
