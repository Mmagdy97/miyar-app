export const poTotal = (po) => Math.round((Number(po.qty) || 0) * (Number(po.price) || 0));

export const subBalance = (s) => Math.max(0, (Number(s.contract) || 0) - (Number(s.paid) || 0));

export const procurementTotals = (subs, pos) => ({
  subContracts: subs.reduce((a, s) => a + (Number(s.contract) || 0), 0),
  subOutstanding: subs.reduce((a, s) => a + subBalance(s), 0),
  poOpen: pos.filter((p) => p.status !== "received").reduce((a, p) => a + poTotal(p), 0),
  poAll: pos.reduce((a, p) => a + poTotal(p), 0),
});

/** Payment history of a subcontractor. Legacy records (only `paid`) become one opening entry. */
export const subPayments = (s) =>
  Array.isArray(s.payments) ? s.payments : Number(s.paid) > 0 ? [{ id: 0, amount: Number(s.paid), date: "" }] : [];

const withPayments = (s, payments) => ({ ...s, payments, paid: payments.reduce((a, p) => a + p.amount, 0) });

export const addPayment = (s, amount, id = Date.now(), date = new Date().toISOString().slice(0, 10)) => {
  const amt = Math.min(Math.round(Number(amount) || 0), subBalance(s));
  return amt > 0 ? withPayments(s, [...subPayments(s), { id, amount: amt, date }]) : s;
};

export const editPayment = (s, pid, amount) => {
  const list = subPayments(s);
  const others = list.filter((p) => p.id !== pid).reduce((a, p) => a + p.amount, 0);
  const amt = Math.min(Math.round(Number(amount) || 0), Math.max(0, (Number(s.contract) || 0) - others));
  return amt > 0 ? withPayments(s, list.map((p) => (p.id === pid ? { ...p, amount: amt } : p))) : s;
};

export const removePayment = (s, pid) => withPayments(s, subPayments(s).filter((p) => p.id !== pid));
