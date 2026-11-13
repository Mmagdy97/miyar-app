import { describe, it, expect } from "vitest";
import { fromRow } from "./selections";

describe("selections fromRow", () => {
  it("tolerates the client view (no cost/supplier)", () => {
    const i = fromRow({ id: 1, project_id: 2, name: "Sofa", qty: "2", price: "500", status: "ordered", ordered_at: "2026-11-05", lead_days: 7 });
    expect(i).toMatchObject({ cost: 0, supplier: "", price: 500, qty: 2, orderedAt: "2026-11-05", leadDays: 7 });
  });
});
