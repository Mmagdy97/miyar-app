import { withVat } from "./currency";

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, Number(n) || 0));

/**
 * Progress-billing certificate (مستخلص / hakediş).
 * cumPct = cumulative % of contract completed to date; prevCum = already certified before this one.
 * VAT is charged on the gross work value; retention and advance recovery are deducted from the payable.
 */
export function computeCertificate({ contractValue, cumPct, prevCumValue = 0, retentionPct = 5, advanceRecovery = 0, vatRate = 0, currency = "EGP" }) {
  const contract = Math.max(0, Number(contractValue) || 0);
  const cumValue = Math.round((contract * clamp(cumPct, 0, 100)) / 100);
  const gross = Math.max(0, cumValue - Math.max(0, Number(prevCumValue) || 0));
  const retention = Math.round((gross * clamp(retentionPct, 0, 20)) / 100);
  const advance = Math.min(gross - retention, Math.max(0, Number(advanceRecovery) || 0));
  const { vat } = withVat(gross, clamp(vatRate, 0, 100) / 100, currency);
  const net = gross - retention - advance + vat;
  return { cumValue, gross, retention, advance, vat, net };
}

export const totals = (certs) => ({
  gross: certs.reduce((s, c) => s + c.gross, 0),
  retentionHeld: certs.reduce((s, c) => s + (c.retentionReleased ? 0 : c.retention), 0),
  paid: certs.filter((c) => c.status === "paid").reduce((s, c) => s + c.net, 0),
  outstanding: certs.filter((c) => c.status !== "paid").reduce((s, c) => s + c.net, 0),
});
