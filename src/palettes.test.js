import { describe, it, expect } from "vitest";
import { PALETTES, contrastWhite, isValidColor, shades } from "./palettes";

describe("palettes", () => {
  it("every preset keeps white text readable", () => {
    PALETTES.forEach((p) => expect(contrastWhite(p.color)).toBeGreaterThanOrEqual(4.5));
  });
  it("rejects bad or too-light custom colours", () => {
    expect(isValidColor("#ffee00")).toBe(false);
    expect(isValidColor("red")).toBe(false);
    expect(isValidColor("#123456")).toBe(true);
  });
  it("derives a darker deep shade", () => {
    expect(contrastWhite(shades("#3F4FB0").p0)).toBeGreaterThan(contrastWhite("#3F4FB0"));
  });
});
