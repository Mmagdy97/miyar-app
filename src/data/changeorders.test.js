import { describe, it, expect } from "vitest";
import { fromRow } from "./changeorders";

describe("changeorders fromRow", () => {
  it("maps row to ui shape", () => {
    expect(fromRow({ id: 1, project_id: 2, no: 3, title: "T", descr: null, cost: "150.5", days: 4, status: "sent", created_at: "2026-11-01T10:00:00Z" }))
      .toEqual({ id: 1, projectId: 2, no: 3, title: "T", desc: "", cost: 150.5, days: 4, status: "sent", date: "2026-11-01" });
  });
});
