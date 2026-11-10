import { describe, it, expect } from "vitest";
import { CURRENCIES, formatMoney, toMinor, fromMinor, withVat, isSupportedCurrency } from "./currency";

const stripMarks = (s) => s.replace(/[‎‏؜  ]/g, " ");

describe("formatMoney", () => {
  it.each(Object.keys(CURRENCIES))("formats %s in ar/en/tr without throwing", (c) => {
    for (const l of ["ar-EG", "en-US", "tr-TR"]) expect(formatMoney(1234.5, c, l)).toBeTruthy();
  });

  it("uses 3 decimals for KWD and JOD, 2 for the rest", () => {
    expect(formatMoney(1.5, "KWD", "en-US")).toContain("1.500");
    expect(formatMoney(1.5, "JOD", "en-US")).toContain("1.500");
    expect(formatMoney(1.5, "EGP", "en-US")).toContain("1.50");
  });

  it("compact drops decimals for whole numbers only", () => {
    expect(formatMoney(29, "USD", "en-US", { compact: true })).toBe("$29");
    expect(formatMoney(29.5, "USD", "en-US", { compact: true })).toBe("$29.50");
  });

  it("Arabic locale uses Arabic-Indic digits, English uses Latin", () => {
    expect(stripMarks(formatMoney(1200, "EGP", "ar-EG", { compact: true }))).toMatch(/[٠-٩]/);
    expect(formatMoney(1200, "EGP", "en-US", { compact: true })).toMatch(/1,200/);
  });

  it("Turkish locale formats lira with Turkish separators", () => {
    expect(stripMarks(formatMoney(1234.5, "TRY", "tr-TR"))).toMatch(/1\.234,50/);
  });

  it("rejects unsupported currency and non-finite amounts", () => {
    expect(() => formatMoney(1, "XXX")).toThrow();
    expect(() => formatMoney(NaN, "EGP")).toThrow();
    expect(isSupportedCurrency("USD")).toBe(true);
    expect(isSupportedCurrency("EUR")).toBe(false);
  });
});

describe("minor units", () => {
  it("round-trips without float drift", () => {
    expect(toMinor(0.1 + 0.2, "EGP")).toBe(30);
    expect(toMinor(1.234, "KWD")).toBe(1234);
    expect(fromMinor(1234, "KWD")).toBe(1.234);
  });
});

describe("VAT", () => {
  it.each([
    ["EGP", 0.14, 1000, 140, 1140],
    ["SAR", 0.15, 1000, 150, 1150],
    ["AED", 0.05, 1000, 50, 1050],
    ["TRY", 0.2, 1000, 200, 1200],
  ])("%s at %d", (cur, rate, net, vat, gross) => {
    expect(withVat(net, rate, cur)).toEqual({ net, vat, gross });
  });

  it("KWD keeps 3 decimals", () => {
    expect(withVat(10, 0.05, "KWD")).toEqual({ net: 10, vat: 0.5, gross: 10.5 });
  });
});
