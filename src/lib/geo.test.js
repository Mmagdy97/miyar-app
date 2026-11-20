import { describe, it, expect } from "vitest";
import { currencyForCountry } from "./geo";

describe("currencyForCountry", () => {
  it("maps supported markets, euro area and the rest", () => {
    expect(currencyForCountry("EG")).toBe("EGP");
    expect(currencyForCountry("SA")).toBe("SAR");
    expect(currencyForCountry("IT")).toBe("EUR");
    expect(currencyForCountry("DE")).toBe("EUR");
    expect(currencyForCountry("US")).toBe("USD");
    expect(currencyForCountry("QA")).toBe("USD");
    expect(currencyForCountry(null)).toBeNull();
  });
});
