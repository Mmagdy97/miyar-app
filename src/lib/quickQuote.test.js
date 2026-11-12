import { describe, it, expect } from "vitest";
import { quickQuote } from "./quickQuote";

describe("landing quick quote", () => {
  it("prices from direct costs and markup", () => {
    const r = quickQuote({ qty: 120, materials: 1000, labour: 300, transport: 100, markup: 30, vat: 14 });
    expect(r.unitCost).toBe(1400);
    expect(r.unitPrice).toBe(1820);
    expect(r.subtotal).toBe(218400);
    expect(r.profit).toBe(50400);
    expect(r.tax).toBe(30576);
    expect(r.total).toBe(248976);
    expect(r.margin).toBe(23.1);
  });
  it("treats empty or negative input as zero", () => {
    const r = quickQuote({ qty: "", materials: -5, labour: "", transport: "", markup: "", vat: "" });
    expect(r.total).toBe(0);
    expect(r.margin).toBe(0);
  });
});
