import { describe, it, expect } from "vitest";
import { buildQuote } from "./quote";

describe("buildQuote", () => {
  it("keeps selling prices only and totals them", () => {
    const q = buildQuote([{ category: "A", name: "x", unit: "م²", quantity: 10, unitCost: 100, margin: 20 }, { category: "A", name: "y", unit: "عدد", quantity: 2, unitCost: 50, margin: 0 }]);
    expect(q.lines[0]).toEqual({ cat: "A", name: "x", unit: "م²", qty: 10, unitPrice: 120, total: 1200 });
    expect(q.total).toBe(1300);
    expect(JSON.stringify(q)).not.toContain("margin");
  });
});
