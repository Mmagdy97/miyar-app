import { describe, it, expect } from "vitest";
import { selectionTotals, groupByRoom } from "./selections";

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
});
