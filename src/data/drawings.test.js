import { describe, it, expect } from "vitest";
import { fromRow } from "./drawings";

describe("drawings fromRow", () => {
  it("maps row to ui shape", () => {
    expect(fromRow({ id: 1, project_id: 2, code: "A-01", name: "N", discipline: null, rev: 3, status: "review", note: null, file_path: null, uploaded_by: null, created_at: "2026-11-01T10:00:00Z" }))
      .toEqual({ id: 1, projectId: 2, code: "A-01", name: "N", discipline: "", rev: 3, status: "review", note: "", file: "", by: "", date: "2026-11-01" });
  });
});
