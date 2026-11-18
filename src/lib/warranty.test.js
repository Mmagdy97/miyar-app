import { describe, it, expect } from "vitest";
import { warrantyEnd, warrantyStatus } from "./warranty";

describe("warranty", () => {
  it("adds months and clamps to month end", () => {
    expect(warrantyEnd("2026-01-15", 12)).toBe("2027-01-15");
    expect(warrantyEnd("2026-01-31", 1)).toBe("2026-02-28");
  });
  it("states", () => {
    const w = { start: "2026-01-01", months: 12 };
    expect(warrantyStatus(w, "2026-06-01").state).toBe("active");
    expect(warrantyStatus(w, "2026-12-15").state).toBe("soon");
    expect(warrantyStatus(w, "2027-02-01").state).toBe("expired");
  });
});
