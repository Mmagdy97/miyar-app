import { describe, it, expect } from "vitest";
import { invoiceRows, toCsv } from "./accountant";

describe("accountant export", () => {
  const inv = [{ id: 1, amount: 1000, receiptNo: "INV-1", dueIso: "2026-09-01", status: "مدفوع" }];
  it("adds VAT on top of net", () => {
    const [r] = invoiceRows(inv, { vatRate: 14, currency: "EGP", client: "A", project: "P" });
    expect(r.net).toBe(1000);
    expect(r.vat).toBe(140);
    expect(r.gross).toBe(1140);
  });
  it("handles 3-decimal currencies and zero VAT", () => {
    const [r] = invoiceRows([{ id: 2, amount: 10.5, status: "x" }], { vatRate: 0, currency: "KWD" });
    expect(r.gross).toBe(10.5);
  });
  it("escapes quotes and prefixes a BOM", () => {
    const csv = toCsv(["a"], [{ no: 'x"y' }]);
    expect(csv.startsWith("﻿")).toBe(true);
    expect(csv).toContain('"x""y"');
  });
});
