import { describe, it, expect } from "vitest";
import { computeCertificate, totals } from "./hakedis";

describe("hakedis", () => {
  it("computes gross, retention, VAT and net", () => {
    const r = computeCertificate({ contractValue: 1_000_000, cumPct: 30, prevCumValue: 100_000, retentionPct: 5, advanceRecovery: 20_000, vatRate: 14, currency: "EGP" });
    expect(r.gross).toBe(200_000);
    expect(r.retention).toBe(10_000);
    expect(r.advance).toBe(20_000);
    expect(r.vat).toBe(28_000);
    expect(r.net).toBe(198_000);
  });
  it("never goes negative when progress did not advance", () => {
    expect(computeCertificate({ contractValue: 1000, cumPct: 10, prevCumValue: 500 }).gross).toBe(0);
  });
  it("totals held retention", () => {
    expect(totals([{ gross: 10, retention: 1, net: 9, status: "paid" }, { gross: 10, retention: 1, net: 9, status: "draft", retentionReleased: true }]).retentionHeld).toBe(1);
  });
});
