import { describe, it, expect } from "vitest";
import { PRICES, PLANS, planPrice, projectLimit } from "./pricing";

describe("pricing", () => {
  it("annual = 10 months", () => {
    expect(planPrice("SAR", 1, true)).toBe(1490);
    expect(planPrice("EGP", 2)).toBe(1990);
  });
  it("enterprise and unknown currency have no list price", () => {
    expect(planPrice("USD", 3)).toBeNull();
    expect(planPrice("XXX", 1)).toBeNull();
  });
  it("prices ascend per market", () => {
    for (const l of Object.values(PRICES)) expect(l[0] < l[1] && l[1] < l[2]).toBe(true);
  });
  it("limits by active projects", () => {
    expect(projectLimit("free")).toBe(1);
    expect(projectLimit("pro")).toBe(3);
    expect(projectLimit("office")).toBe(12);
    expect(PLANS.length).toBe(4);
  });
});
