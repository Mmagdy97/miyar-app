import { describe, it, expect } from "vitest";
import { cleanTile } from "./moodboard";

describe("moodboard tiles", () => {
  it("accepts https images and hex colours only", () => {
    expect(cleanTile({ kind: "image", value: "https://x.com/a.jpg" })?.kind).toBe("image");
    expect(cleanTile({ kind: "image", value: "javascript:alert(1)" })).toBeNull();
    expect(cleanTile({ kind: "image", value: "http://x.com/a.jpg" })).toBeNull();
    expect(cleanTile({ kind: "color", value: "#A1B2C3" })?.value).toBe("#a1b2c3");
    expect(cleanTile({ kind: "color", value: "red" })).toBeNull();
  });
  it("rejects empty notes", () => {
    expect(cleanTile({ kind: "note", value: "  " })).toBeNull();
  });
});
