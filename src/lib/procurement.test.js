import { describe, it, expect } from "vitest";
import { poTotal, subBalance, procurementTotals } from "./procurement";

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
