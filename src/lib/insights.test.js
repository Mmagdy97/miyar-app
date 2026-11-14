import { describe, it, expect } from "vitest";
import { projectInsight, portfolio } from "./insights";
const base = { id: 1, budget: 1000, contractValue: 1300, startDate: "2026-01-01", deadline: "2026-12-31", collected: 0 };
const now = Date.parse("2026-07-02");
describe("insights", () => {
  it("on-budget project is ok", () => {
    const i = projectInsight({ ...base, progress: 50, spentActual: 500 }, now);
    expect(i.eac).toBe(1000); expect(i.forecastMargin).toBe(300); expect(i.level).toBe("ok");
  });
  it("flags overrun as risk", () => {
    const i = projectInsight({ ...base, progress: 40, spentActual: 600 }, now);
    expect(i.eac).toBe(1500); expect(i.forecastMargin).toBe(-200); expect(i.level).toBe("risk");
  });
  it("flags schedule slip", () => {
    const i = projectInsight({ ...base, progress: 20, spentActual: 200 }, now);
    expect(i.slip).toBeGreaterThan(20); expect(i.level).toBe("risk");
  });
  it("portfolio sorts risk first", () => {
    const r = portfolio([{ ...base, id: 1, progress: 50, spentActual: 500 }, { ...base, id: 2, progress: 40, spentActual: 600 }], now);
    expect(r.rows[0].p.id).toBe(2); expect(r.atRisk).toBe(1);
  });
});
