import { describe, it, expect } from "vitest";
import { isOverdue, nextNo, rfiCounts } from "./rfi";

describe("rfi", () => {
  const T = "2026-11-19";
  it("overdue only when open and past due", () => {
    expect(isOverdue({ status: "open", due: "2026-11-18" }, T)).toBe(true);
    expect(isOverdue({ status: "open", due: "2026-11-19" }, T)).toBe(false);
    expect(isOverdue({ status: "answered", due: "2026-01-01" }, T)).toBe(false);
    expect(isOverdue({ status: "open", due: "" }, T)).toBe(false);
  });
  it("numbers per project", () => {
    expect(nextNo([{ projectId: 1, no: 2 }, { projectId: 2, no: 9 }], 1)).toBe(3);
    expect(nextNo([], 1)).toBe(1);
  });
  it("counts", () => {
    expect(rfiCounts([{ status: "open", due: "2026-11-01" }, { status: "open" }, { status: "answered" }], T)).toEqual({ open: 2, overdue: 1, answered: 1 });
  });
});
