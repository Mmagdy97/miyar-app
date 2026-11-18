import { describe, it, expect } from "vitest";
import { DEFAULT_ITEMS, itemsForType, isStructuralItem } from "./boqLibrary";

describe("itemsForType", () => {
  it("architectural hides structural", () => {
    expect(itemsForType(DEFAULT_ITEMS, "architectural", true).some(isStructuralItem)).toBe(false);
  });
  it("structural shows only structural; both shows all", () => {
    expect(itemsForType(DEFAULT_ITEMS, "structural", true).every(isStructuralItem)).toBe(true);
    expect(itemsForType(DEFAULT_ITEMS, "both", true)).toHaveLength(DEFAULT_ITEMS.length);
  });
  it("without the feature it falls back to architectural", () => {
    expect(itemsForType(DEFAULT_ITEMS, "both", false).some(isStructuralItem)).toBe(false);
  });
});
