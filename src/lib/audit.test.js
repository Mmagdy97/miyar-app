import { describe, it, expect } from "vitest";
import { diffEvents, labelOf } from "./audit";
describe("audit diff", () => {
  const a = [{ id: 1, name: "رخام", price: 100 }, { id: 2, name: "جبس", price: 50 }];
  it("detects price change", () => {
    const e = diffEvents("boq", a, [{ ...a[0], price: 120 }, a[1]]);
    expect(e).toEqual([{ scope: "boq", action: "upd", label: "رخام", changes: [{ f: "price", from: "100", to: "120" }] }]);
  });
  it("detects add and delete", () => {
    const e = diffEvents("boq", a, [a[0], { id: 3, name: "دهان" }]);
    expect(e.map((x) => x.action)).toEqual(["add", "del"]);
  });
  it("ignores unchanged and non-arrays", () => {
    expect(diffEvents("boq", a, a)).toEqual([]);
    expect(diffEvents("att", {}, { x: 1 })).toEqual([]);
  });
  it("labels fall back to id", () => expect(labelOf({ id: 7 })).toBe("#7"));
});
