import { describe, it, expect } from "vitest";
import { applyChangeOrders, canDecide, shiftDeadline } from "./changeorders";

describe("change orders", () => {
  it("sums only approved orders (incl. credits)", () => {
    const r = applyChangeOrders(1000, [{ status: "approved", cost: 200, days: 5 }, { status: "approved", cost: -50, days: 0 }, { status: "sent", cost: 999, days: 9 }, { status: "rejected", cost: 999, days: 9 }]);
    expect(r).toEqual({ value: 1150, days: 5, count: 2, pendingDays: 9 });
  });
  it("only sent orders can be decided", () => {
    expect(canDecide({ status: "sent" })).toBe(true);
    expect(canDecide({ status: "draft" })).toBe(false);
  });
  it("shifts the deadline across month ends", () => {
    expect(shiftDeadline("2026-12-30", 5)).toBe("2027-01-04");
    expect(shiftDeadline("2026-12-30", 0)).toBe("2026-12-30");
    expect(shiftDeadline("", 5)).toBe("");
  });
});
