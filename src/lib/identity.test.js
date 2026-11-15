import { describe, it, expect } from "vitest";
import { normalizePhone, toAuthEmail, displayId, isPhoneEmail } from "./identity";

describe("identity", () => {
  it("normalises local, international and 00-prefixed numbers", () => {
    expect(normalizePhone("01001234567")).toBe("201001234567");
    expect(normalizePhone("0100 123 4567")).toBe("201001234567");
    expect(normalizePhone("+20 100 123 4567")).toBe("201001234567");
    expect(normalizePhone("00201001234567")).toBe("201001234567");
    expect(normalizePhone("+966501234567")).toBe("966501234567");
  });
  it("rejects non-phones", () => {
    expect(normalizePhone("abc")).toBeNull();
    expect(normalizePhone("123")).toBeNull();
  });
  it("keeps emails, maps phones, round-trips display", () => {
    expect(toAuthEmail(" a@b.com ")).toBe("a@b.com");
    const e = toAuthEmail("01001234567");
    expect(isPhoneEmail(e)).toBe(true);
    expect(displayId(e)).toBe("+201001234567");
    expect(displayId("a@b.com")).toBe("a@b.com");
    expect(() => toAuthEmail("nope")).toThrow("INVALID_ID");
  });
});
