import { describe, it, expect } from "vitest";
import { toState } from "./procurement";

describe("procurement toState", () => {
  it("attaches payments and totals paid", () => {
    const { subs, pos } = toState(
      [{ id: 1, name: "S", trade: null, contract: "1000" }],
      [{ id: 5, sub_id: 1, amount: "300", paid_on: "2026-11-01" }, { id: 6, sub_id: 1, amount: "200", paid_on: "2026-11-02" }, { id: 7, sub_id: 2, amount: "9", paid_on: "2026-11-02" }],
      [{ id: 1, no: "PO-001", supplier: "X", item: "Y", qty: "2", price: "10", status: "sent" }],
    );
    expect(subs[0].paid).toBe(500);
    expect(subs[0].payments).toHaveLength(2);
    expect(pos[0]).toMatchObject({ qty: 2, price: 10, status: "sent" });
  });
});
