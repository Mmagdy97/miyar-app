import { describe, it, expect } from "vitest";
import { applyChangeOrders, canDecide } from "./changeorders";

describe("change orders", () => {
  it("sums only approved orders (incl. credits)", () => {
    const r = applyChangeOrders(1000, [{ status: "approved", cost: 200, days: 5 }, { status: "approved", cost: -50, days: 0 }, { status: "sent", cost: 999, days: 9 }, { status: "rejected", cost: 999, days: 9 }]);
    expect(r).toEqual({ value: 1150, days: 5, count: 2 });
  });
  it("only sent orders can be decided", () => {
    expect(canDecide({ status: "sent" })).toBe(true);
    expect(canDecide({ status: "draft" })).toBe(false);
  });
});
