import { describe, it, expect } from "vitest";
import { fromRow } from "./rfi";

describe("rfi fromRow", () => {
  it("maps row to ui shape", () => {
    expect(fromRow({ id: 1, project_id: 2, no: 3, title: "T", question: null, answer: null, due_date: null, status: "open", asked_name: "A", created_at: "2026-11-01T10:00:00Z" }))
      .toEqual({ id: 1, projectId: 2, no: 3, title: "T", question: "", answer: "", due: "", status: "open", by: "A", date: "2026-11-01" });
  });
});
