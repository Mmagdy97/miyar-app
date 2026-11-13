import { describe, it, expect } from "vitest";
import { boqTotals, itemPrice } from "./boq";

describe("boq", () => {
  it("applies margin to cost", () => {
    expect(itemPrice({ quantity: 10, unitCost: 100, margin: 20 })).toBe(1200);
  });
  it("totals", () => {
    expect(boqTotals([{ quantity: 10, unitCost: 100, margin: 20 }, { quantity: 1, unitCost: 500, margin: 0 }])).toEqual({ cost: 1500, price: 1700, profit: 200 });
  });
});
