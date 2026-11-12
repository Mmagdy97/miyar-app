import { describe, it, expect } from "vitest";
import { shouldNudge, waLink } from "./nudge";

const base = { start: 0, tabs: [], wins: [], dismissed: false };
describe("contact nudge timing", () => {
  it("waits for engagement", () => {
    expect(shouldNudge(10_000, base, false)).toBe(false);
    expect(shouldNudge(30_000, { ...base, wins: ["print"] }, false)).toBe(false);
  });
  it("shows after a value moment, wide exploration or 3 minutes", () => {
    expect(shouldNudge(46_000, { ...base, wins: ["print"] }, false)).toBe(true);
    expect(shouldNudge(5_000, { ...base, tabs: ["a", "b", "c", "d", "e"] }, false)).toBe(true);
    expect(shouldNudge(181_000, base, false)).toBe(true);
  });
  it("never after dismiss or contact", () => {
    expect(shouldNudge(999_000, { ...base, dismissed: true }, false)).toBe(false);
    expect(shouldNudge(999_000, base, true)).toBe(false);
  });
  it("builds a WhatsApp link to sales", () => {
    expect(waLink("hi")).toBe("https://wa.me/201557788744?text=hi");
  });
});
