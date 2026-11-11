import { describe, it, expect } from "vitest";
import { dayWage, monthSummary } from "./puantaj";

describe("puantaj", () => {
  it("pays full, half and overtime", () => {
    expect(dayWage(400, "present", 0)).toBe(400);
    expect(dayWage(400, "half", 0)).toBe(200);
    expect(dayWage(400, "present", 2)).toBe(550);
    expect(dayWage(400, "absent", 3)).toBe(0);
  });
  it("sums a month per worker", () => {
    const rec = { "2026-11-01": { 1: { s: "present", ot: 0 } }, "2026-11-02": { 1: { s: "half", ot: 0 } }, "2026-10-30": { 1: { s: "present", ot: 0 } } };
    expect(monthSummary(rec, [{ id: 1, rate: 400 }], "2026-11")[0]).toEqual({ id: 1, days: 1.5, ot: 0, wage: 600 });
  });
});
