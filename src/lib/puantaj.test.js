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

import { setRate, entryRate } from "./puantaj";
describe("daily rate control", () => {
  const ws = [{ id: 1, rate: 300 }];
  const rec = { "2026-11-01": { 1: { s: "present", ot: 0, r: 300 } }, "2026-11-02": { 1: { s: "present", ot: 0 } } };
  it("changing the rate keeps past days and applies from the chosen day", () => {
    const { workers, records } = setRate(ws, rec, 1, 400, "2026-11-02");
    expect(workers[0].rate).toBe(400);
    expect(entryRate(records["2026-11-01"][1], workers[0])).toBe(300);
    expect(monthSummary(records, workers, "2026-11")[0].wage).toBe(700);
  });
  it("ignores invalid rates", () => {
    expect(setRate(ws, rec, 1, 0, "2026-11-02").workers).toBe(ws);
  });
});
