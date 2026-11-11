// E-invoice readiness helpers. These build the data an accountant or certified integrator needs;
// they do NOT submit anything to ZATCA / ETA / GIB (that needs official onboarding and signing).

const enc = new TextEncoder();

function tlv(tag, value) {
  const v = enc.encode(String(value));
  return [tag, v.length, ...v];
}

/** ZATCA Phase-1 style QR payload: TLV (seller, VAT no., ISO timestamp, total, VAT) as base64. */
export function zatcaTlv({ seller, vatNo, timestamp, total, vat }) {
  const bytes = [...tlv(1, seller), ...tlv(2, vatNo), ...tlv(3, timestamp), ...tlv(4, Number(total).toFixed(2)), ...tlv(5, Number(vat).toFixed(2))];
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

const x = (s) => String(s ?? "").replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]);

/** Simplified UBL 2.1 invoice draft (basis for ZATCA / e-Arsiv integrators). */
export function ublInvoiceXml({ no, issueDate, currency, seller, vatNo, buyer, description, net, vat, gross, vatRate }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
  <cbc:UBLVersionID>2.1</cbc:UBLVersionID>
  <cbc:ID>${x(no)}</cbc:ID>
  <cbc:IssueDate>${x(issueDate)}</cbc:IssueDate>
  <cbc:InvoiceTypeCode>380</cbc:InvoiceTypeCode>
  <cbc:DocumentCurrencyCode>${x(currency)}</cbc:DocumentCurrencyCode>
  <cac:AccountingSupplierParty><cac:Party><cac:PartyTaxScheme><cbc:CompanyID>${x(vatNo)}</cbc:CompanyID></cac:PartyTaxScheme><cac:PartyLegalEntity><cbc:RegistrationName>${x(seller)}</cbc:RegistrationName></cac:PartyLegalEntity></cac:Party></cac:AccountingSupplierParty>
  <cac:AccountingCustomerParty><cac:Party><cac:PartyLegalEntity><cbc:RegistrationName>${x(buyer)}</cbc:RegistrationName></cac:PartyLegalEntity></cac:Party></cac:AccountingCustomerParty>
  <cac:TaxTotal><cbc:TaxAmount currencyID="${x(currency)}">${Number(vat).toFixed(2)}</cbc:TaxAmount><cac:TaxSubtotal><cbc:TaxableAmount currencyID="${x(currency)}">${Number(net).toFixed(2)}</cbc:TaxableAmount><cbc:TaxAmount currencyID="${x(currency)}">${Number(vat).toFixed(2)}</cbc:TaxAmount><cac:TaxCategory><cbc:Percent>${Number(vatRate)}</cbc:Percent><cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme></cac:TaxCategory></cac:TaxSubtotal></cac:TaxTotal>
  <cac:LegalMonetaryTotal><cbc:LineExtensionAmount currencyID="${x(currency)}">${Number(net).toFixed(2)}</cbc:LineExtensionAmount><cbc:TaxExclusiveAmount currencyID="${x(currency)}">${Number(net).toFixed(2)}</cbc:TaxExclusiveAmount><cbc:TaxInclusiveAmount currencyID="${x(currency)}">${Number(gross).toFixed(2)}</cbc:TaxInclusiveAmount><cbc:PayableAmount currencyID="${x(currency)}">${Number(gross).toFixed(2)}</cbc:PayableAmount></cac:LegalMonetaryTotal>
  <cac:InvoiceLine><cbc:ID>1</cbc:ID><cbc:InvoicedQuantity>1</cbc:InvoicedQuantity><cbc:LineExtensionAmount currencyID="${x(currency)}">${Number(net).toFixed(2)}</cbc:LineExtensionAmount><cac:Item><cbc:Name>${x(description)}</cbc:Name></cac:Item><cac:Price><cbc:PriceAmount currencyID="${x(currency)}">${Number(net).toFixed(2)}</cbc:PriceAmount></cac:Price></cac:InvoiceLine>
</Invoice>
`;
}

/** Simplified Egyptian ETA-style JSON draft (issuer/receiver/lines/tax totals, tax type T1 = VAT). */
export function etaJson({ no, issueDate, currency, seller, vatNo, buyer, description, net, vat, gross, vatRate }) {
  return {
    documentType: "I",
    documentTypeVersion: "1.0",
    internalID: no,
    dateTimeIssued: `${issueDate}T00:00:00Z`,
    issuer: { name: seller, id: vatNo },
    receiver: { name: buyer },
    documentCurrency: currency,
    invoiceLines: [{ description, quantity: 1, unitValue: { currencySold: currency, amountEGP: Number(net) }, salesTotal: Number(net), netTotal: Number(net), taxableItems: [{ taxType: "T1", rate: Number(vatRate), amount: Number(vat) }], total: Number(gross) }],
    totalSalesAmount: Number(net),
    netAmount: Number(net),
    taxTotals: [{ taxType: "T1", amount: Number(vat) }],
    totalAmount: Number(gross),
    note: "DRAFT - not signed or submitted to the Egyptian Tax Authority",
  };
}

export const marketOf = (currency) => ({ SAR: "ksa", EGP: "egypt", TRY: "turkey" })[currency] || null;

/** What the office still needs before an integrator can issue compliant e-invoices. */
export function readiness(office, currency) {
  const market = marketOf(currency);
  const checks = [
    { id: "taxId", ok: Boolean(office.taxId && String(office.taxId).trim()) },
    { id: "name", ok: Boolean(office.name && String(office.name).trim()) },
    { id: "vat", ok: office.vatRate !== null && office.vatRate !== undefined ? true : market !== null },
  ];
  return { market, checks, ready: checks.every((c) => c.ok) };
}
