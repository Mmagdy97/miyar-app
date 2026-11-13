import { describe, it, expect } from "vitest";
import { fromRow } from "./certificates";

describe("certificates fromRow", () => {
  it("maps numerics and flags", () => {
    const c = fromRow({ id: 1, project_id: 2, no: 1, cum_pct: "40", retention_pct: "5", vat_rate: "14", cum_value: "400", gross: "400", retention: "20", advance: "0", vat: "56", net: "436", status: "draft", retention_released: false, created_at: "2026-11-02T00:00:00Z" });
    expect(c).toMatchObject({ projectId: 2, cumPct: 40, net: 436, status: "draft", retentionReleased: false, date: "2026-11-02" });
  });
});
