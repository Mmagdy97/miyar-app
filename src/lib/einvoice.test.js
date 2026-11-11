import { describe, it, expect } from "vitest";
import { zatcaTlv, ublInvoiceXml, etaJson, marketOf, readiness } from "./einvoice";

describe("einvoice", () => {
  it("builds ZATCA TLV base64 with 5 tags", () => {
    const b64 = zatcaTlv({ seller: "Acme", vatNo: "310122393500003", timestamp: "2026-11-11T10:00:00Z", total: 115, vat: 15 });
    const bytes = [...atob(b64)].map((c) => c.charCodeAt(0));
    expect(bytes[0]).toBe(1);
    expect(bytes[1]).toBe(4);
    expect(String.fromCharCode(...bytes.slice(2, 6))).toBe("Acme");
    expect(atob(b64)).toContain("115.00");
  });
  it("escapes XML", () => {
    const xml = ublInvoiceXml({ no: "1", issueDate: "2026-01-01", currency: "SAR", seller: "A & B <x>", vatNo: "1", buyer: "C", description: "d", net: 100, vat: 15, gross: 115, vatRate: 15 });
    expect(xml).toContain("A &amp; B &lt;x&gt;");
    expect(xml).toContain("<cbc:PayableAmount currencyID=\"SAR\">115.00");
  });
  it("marks ETA draft and maps markets", () => {
    expect(etaJson({ no: "1", issueDate: "2026-01-01", currency: "EGP", seller: "A", vatNo: "1", buyer: "B", description: "d", net: 100, vat: 14, gross: 114, vatRate: 14 }).note).toMatch(/DRAFT/);
    expect(marketOf("TRY")).toBe("turkey");
    expect(marketOf("USD")).toBeNull();
  });
  it("requires tax id", () => {
    expect(readiness({ name: "X", taxId: "", vatRate: null }, "SAR").ready).toBe(false);
    expect(readiness({ name: "X", taxId: "123", vatRate: null }, "SAR").ready).toBe(true);
  });
});
