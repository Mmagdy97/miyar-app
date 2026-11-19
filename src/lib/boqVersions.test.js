import { describe, it, expect } from "vitest";
import { diffVersions, restorePlan, snapshot } from "./boqVersions";

const A = [{ id: 1, name: "Paint", unit: "m2", category: "f", quantity: 10, unitCost: 100, margin: 20 }, { id: 2, name: "Tiles", unit: "m2", category: "f", quantity: 5, unitCost: 200, margin: 20 }];
const B = [{ ...A[0], quantity: 20 }, { id: 3, name: "Doors", unit: "pc", category: "w", quantity: 2, unitCost: 500, margin: 10 }];

describe("boq versions", () => {
  it("diffs added, removed, changed and totals", () => {
    const d = diffVersions(A, B);
    expect(d.added.map((i) => i.name)).toEqual(["Doors"]);
    expect(d.removed.map((i) => i.name)).toEqual(["Tiles"]);
    expect(d.changed[0].after.quantity).toBe(20);
    expect(d.delta.cost).toBe(1000);
  });
  it("plans a restore and keeps rows with actuals", () => {
    const p = restorePlan(B, snapshot(A), new Set([3]));
    expect(p.update.map((i) => i.id)).toEqual([1]);
    expect(p.insert.map((i) => i.id)).toEqual([2]);
    expect(p.remove).toEqual([]);
    expect(p.kept.map((i) => i.id)).toEqual([3]);
  });
});
