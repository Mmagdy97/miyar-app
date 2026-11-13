import { describe, it, expect } from "vitest";
import { selectionTotals, groupByRoom, supplierWa, etaOf, isLate, groupBySupplier } from "./selections";

const items = [
  { room: "A", qty: 2, price: 1000, cost: 700, status: "approved" },
  { room: "A", qty: 1, price: 500, cost: 300, status: "proposed" },
  { room: "B", qty: 1, price: 400, cost: 300, status: "rejected" },
  { room: "B", qty: 1, price: 600, cost: 400, status: "ordered" },
];
describe("selections", () => {
  it("counts approved/ordered as committed", () => {
    expect(selectionTotals(items)).toEqual({ price: 2600, cost: 1800, margin: 800, marginPct: 31, pending: 500 });
  });
  it("groups by room", () => {
    expect(Object.keys(groupByRoom(items))).toEqual(["A", "B"]);
  });
  it("builds supplier whatsapp links", () => {
    expect(supplierWa("01001234567")).toBe("https://wa.me/201001234567");
    expect(supplierWa("+966 50 123 4567", "hi")).toBe("https://wa.me/966501234567?text=hi");
    expect(supplierWa("")).toBe("");
  });
  it("counts delivered/installed as committed", () => {
    expect(selectionTotals([{ qty: 1, price: 100, cost: 60, status: "delivered" }, { qty: 1, price: 50, cost: 20, status: "installed" }]).price).toBe(150);
  });
  it("computes ETA and lateness", () => {
    const i = { status: "ordered", orderedAt: "2026-11-01", leadDays: 10 };
    expect(etaOf(i)).toBe("2026-11-11");
    expect(isLate(i, "2026-11-12")).toBe(true);
    expect(isLate(i, "2026-11-11")).toBe(false);
    expect(isLate({ ...i, status: "delivered" }, "2026-12-01")).toBe(false);
    expect(etaOf({ status: "ordered", leadDays: 0 })).toBe("");
  });
  it("groups purchase orders per supplier", () => {
    const g = groupBySupplier([{ supplier: "X", qty: 2, cost: 100, status: "approved", phone: "1" }, { supplier: "X", qty: 1, cost: 50, status: "ordered" }, { supplier: "Y", qty: 1, cost: 5, status: "proposed" }]);
    expect(g).toHaveLength(1);
    expect(g[0]).toMatchObject({ supplier: "X", total: 250, phone: "1" });
  });
});
