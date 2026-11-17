import { describe, it, expect } from "vitest";
import { itemVariance, projectVariance } from "./variance";

const item = { id: 1, quantity: 10, unitCost: 100 };
describe("variance", () => {
  it("levels", () => {
    expect(itemVariance(item, []).level).toBe("none");
    expect(itemVariance(item, [{ amount: 500 }]).level).toBe("ok");
    expect(itemVariance(item, [{ amount: 900 }]).level).toBe("warn");
    expect(itemVariance(item, [{ amount: 600 }, { amount: 500 }]).level).toBe("over");
  });
  it("spend on a zero-budget item is over", () => {
    expect(itemVariance({ quantity: 0, unitCost: 0 }, [{ amount: 10 }]).level).toBe("over");
  });
  it("project totals and alerts", () => {
    const p = projectVariance([item, { id: 2, quantity: 1, unitCost: 1000 }], { 1: [{ amount: 950 }], 2: [{ amount: 100 }] });
    expect(p.budget).toBe(2000); expect(p.actual).toBe(1050); expect(p.alerts).toBe(1);
  });
});
