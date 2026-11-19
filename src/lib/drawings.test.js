import { describe, it, expect } from "vitest";
import { groupDrawings, nextRev, hasPendingRev } from "./drawings";

const R = (o) => ({ projectId: 1, code: "A-01", name: "Plan", discipline: "arch", status: "approved", ...o });
describe("drawings", () => {
  const rows = [R({ rev: 1 }), R({ rev: 2, status: "review" }), R({ code: "E-01", name: "Elec", rev: 1, status: "review" }), R({ projectId: 2, rev: 5 })];
  it("groups per project+code, newest first, current = newest approved", () => {
    const g = groupDrawings(rows);
    expect(g).toHaveLength(3);
    const a = g.find((x) => x.code === "A-01" && x.projectId === 1);
    expect(a.versions.map((v) => v.rev)).toEqual([2, 1]);
    expect(a.latest.rev).toBe(2);
    expect(a.current.rev).toBe(1);
    expect(hasPendingRev(a)).toBe(true);
    expect(hasPendingRev(g.find((x) => x.projectId === 2))).toBe(false);
  });
  it("no approved revision -> current null, pending", () => {
    const e = groupDrawings(rows).find((x) => x.code === "E-01");
    expect(e.current).toBeNull();
    expect(hasPendingRev(e)).toBe(true);
  });
  it("next revision number", () => {
    expect(nextRev(rows, 1, "A-01")).toBe(3);
    expect(nextRev(rows, 1, "NEW")).toBe(1);
  });
});
