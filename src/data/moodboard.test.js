import { describe, it, expect } from "vitest";
import { fromRow } from "./moodboard";

describe("moodboard fromRow", () => {
  it("maps row", () => {
    expect(fromRow({ id: 1, project_id: 2, kind: "color", value: "#aabbcc", caption: null, liked: true })).toEqual({ id: 1, projectId: 2, kind: "color", value: "#aabbcc", caption: "", liked: true });
  });
});
