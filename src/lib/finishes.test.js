import { describe, it, expect } from "vitest";
import { compareFinishes, categoriesOf } from "./finishes";

const O = [{ id: 1, category: "floor", name: "porcelain", price: 450 }, { id: 2, category: "floor", name: "ceramic", price: 280 }, { id: 3, category: "paint", name: "plastic", price: 60 }];
describe("finishes", () => {
  it("sorts by total and shows the gap", () => {
    const r = compareFinishes(O, "floor", 100);
    expect(r.map((x) => x.name)).toEqual(["ceramic", "porcelain"]);
    expect(r[1].diff).toBe(17000);
  });
  it("lists categories", () => { expect(categoriesOf(O)).toEqual(["floor", "paint"]); });
});
