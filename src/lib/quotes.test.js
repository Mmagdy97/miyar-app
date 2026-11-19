import { describe, it, expect } from "vitest";
import { compareQuotes, committedCost } from "./procurement";

describe("supplier quotes", () => {
  const Q = [
    { id: 1, item: "Ceramic", qty: 100, supplier: "A", price: 300, status: "open" },
    { id: 2, item: "ceramic ", qty: 100, supplier: "B", price: 250, leadDays: 10, status: "open" },
    { id: 3, item: "Paint", qty: 10, supplier: "C", price: 90, status: "open" },
  ];
  it("groups by item, cheapest first, with the gap", () => {
    const g = compareQuotes(Q);
    expect(g).toHaveLength(2);
    expect(g[0].quotes.map((q) => q.supplier)).toEqual(["B", "A"]);
    expect(g[0].quotes[0].best).toBe(true);
    expect(g[0].quotes[1].diff).toBe(5000);
  });
  it("committed cost vs budget", () => {
    const c = committedCost(100000, [{ contract: 60000, paid: 20000 }], [{ qty: 10, price: 5000, status: "received" }]);
    expect(c.committed).toBe(110000);
    expect(c.spent).toBe(70000);
    expect(c.uncommitted).toBe(-10000);
    expect(c.over).toBe(true);
  });
});
