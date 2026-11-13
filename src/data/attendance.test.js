import { describe, it, expect } from "vitest";
import { toState } from "./attendance";

describe("attendance toState", () => {
  it("builds records by day and worker", () => {
    const s = toState([{ id: 1, name: "A", trade: null, rate: "300" }], [{ day: "2026-11-01", worker_id: 1, status: "half", ot: "2", rate: "300" }]);
    expect(s.workers[0]).toEqual({ id: 1, name: "A", trade: "", rate: 300 });
    expect(s.records["2026-11-01"][1]).toEqual({ s: "half", ot: 2, r: 300 });
  });
});
