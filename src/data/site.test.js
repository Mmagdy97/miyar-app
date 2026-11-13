import { describe, it, expect } from "vitest";
import { taskFrom, snagFrom, requestFrom } from "./site";

describe("site mappers", () => {
  it("task", () => expect(taskFrom({ id: 1, project_id: 2, title: "T", priority: null, due_at: "2026-11-20T00:00:00Z", completed: true })).toEqual({ id: 1, projectId: 2, title: "T", priority: "medium", due: "2026-11-20", done: true }));
  it("snag", () => expect(snagFrom({ id: 1, project_id: 2, title: "S", resolved: false })).toMatchObject({ severity: "medium", location: "", resolved: false }));
  it("request", () => expect(requestFrom({ id: 1, project_id: 2, material: "Cement" })).toMatchObject({ status: "review", quantity: "" }));
});
