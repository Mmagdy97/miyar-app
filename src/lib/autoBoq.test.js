import { describe, it, expect } from "vitest";
import { generateBoq } from "./autoBoq";

const q = (l, n) => l.find((x) => x.name === n)?.quantity;
describe("generateBoq", () => {
  it("returns nothing without area", () => { expect(generateBoq({})).toEqual([]); });
  it("scales with area, rooms and bathrooms", () => {
    const a = generateBoq({ area: 100, rooms: 3, baths: 2, height: 2.8, type: "apartment", finish: "mid" });
    expect(q(a, "بياض أسقف")).toBe(100);
    expect(q(a, "نقاط تغذية مياه")).toBe(11);
    expect(q(a, "أبواب داخلية خشب")).toBe(5);
    const b = generateBoq({ area: 200, rooms: 3, baths: 2, height: 2.8, type: "apartment", finish: "mid" });
    expect(q(b, "بياض أسقف")).toBe(200);
    expect(q(b, "نقاط تغذية مياه")).toBe(11);
  });
  it("economy has no false ceiling; luxury uses marble floors", () => {
    expect(q(generateBoq({ area: 100, rooms: 2, baths: 1, finish: "eco" }), "أسقف جبس بورد مسطحة")).toBeUndefined();
    expect(q(generateBoq({ area: 100, rooms: 2, baths: 1, finish: "lux" }), "أرضيات رخام / جرانيت")).toBe(100);
  });
  it("no kitchen items for an office", () => {
    expect(q(generateBoq({ area: 80, rooms: 3, baths: 1, type: "office" }), "تكسية حوائط مطبخ")).toBeUndefined();
  });
});
