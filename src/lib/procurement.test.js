import { describe, it, expect } from "vitest";
import { poTotal, subBalance, procurementTotals, addPayment, editPayment, removePayment, subPayments } from "./procurement";

describe("procurement", () => {
  it("totals PO and balance", () => {
    expect(poTotal({ qty: 10, price: 25.5 })).toBe(255);
    expect(subBalance({ contract: 100, paid: 130 })).toBe(0);
  });
  it("splits open vs received", () => {
    const t = procurementTotals([{ contract: 100, paid: 40 }], [{ qty: 1, price: 50, status: "sent" }, { qty: 1, price: 70, status: "received" }]);
    expect(t).toEqual({ subContracts: 100, subOutstanding: 60, poOpen: 50, poAll: 120 });
  });
});

describe("subcontractor payments are reversible", () => {
  const s = { id: 1, contract: 1000, paid: 300 };
  it("migrates legacy paid into an opening payment", () => {
    expect(subPayments(s)).toEqual([{ id: 0, amount: 300, date: "" }]);
  });
  it("adds, caps at balance, edits and removes", () => {
    const a = addPayment(s, 5000, 7, "2026-01-01");
    expect(a.paid).toBe(1000);
    const e = editPayment(a, 7, 200);
    expect(e.paid).toBe(500);
    expect(removePayment(e, 7).paid).toBe(300);
    expect(removePayment(removePayment(e, 7), 0).paid).toBe(0);
  });
  it("ignores invalid amounts", () => {
    expect(addPayment(s, 0)).toBe(s);
    expect(editPayment(s, 0, -5)).toBe(s);
  });
});
