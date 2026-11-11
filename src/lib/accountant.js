// Accountant export: net / VAT / gross per invoice, as CSV (opens in Excel) or JSON.
// Amounts are treated as NET (excluding VAT); the office VAT rate is applied on top.
import { withVat, isSupportedCurrency } from "./currency";

export function invoiceRows(invoices, { vatRate, currency, client = "", project = "" }) {
  const cur = isSupportedCurrency(currency) ? currency : "EGP";
  return invoices.map((inv) => {
    const { net, vat, gross } = withVat(inv.amount, vatRate / 100, cur);
    return {
      no: inv.receiptNo || `INV-${inv.id}`,
      dueDate: inv.dueIso || "",
      client,
      project,
      net,
      vatRate,
      vat,
      gross,
      status: inv.status,
      currency: cur,
    };
  });
}

const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;

/** UTF-8 BOM so Excel reads Arabic/Turkish correctly. */
export function toCsv(headers, rows) {
  const keys = ["no", "dueDate", "client", "project", "net", "vatRate", "vat", "gross", "status", "currency"];
  return "﻿" + [headers, ...rows.map((r) => keys.map((k) => r[k]))].map((r) => r.map(esc).join(",")).join("\r\n");
}

export function download(filename, text, mime) {
  const url = URL.createObjectURL(new Blob([text], { type: `${mime};charset=utf-8` }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
