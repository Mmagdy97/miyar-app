import { describe, it, expect } from "vitest";
import { custodyStats } from "./cash";

describe("custodyStats", () => {
  it("sums expenses of that custody only", () => {
    const ex = [{ custodyId: 1, amount: 300 }, { custodyId: 1, amount: 200 }, { custodyId: 2, amount: 999 }];
    expect(custodyStats({ id: 1, amount: 1000 }, ex)).toEqual({ spent: 500, left: 500 });
  });
});
