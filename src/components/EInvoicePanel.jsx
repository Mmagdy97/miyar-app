import { useState } from "react";
import { createPortal } from "react-dom";
import { QrCode, FileCode2, CheckCircle2, AlertTriangle, X } from "lucide-react";
import { tr_ as T, getCurrency } from "../i18n";
import { invoicesStore } from "../data/stores";
import { officeStore, defaultVat } from "../data/office";
import { clientProject } from "../data/seed";
import { invoiceRows, download } from "../lib/accountant";
import { zatcaTlv, ublInvoiceXml, etaJson, readiness } from "../lib/einvoice";

/** Admin: e-invoice readiness checklist, per-invoice draft export (UBL XML / ETA JSON) and ZATCA QR. */
export default function EInvoicePanel() {
  const [invoices] = invoicesStore.use();
  const [office] = officeStore.use();
  const currency = getCurrency();
  const vatRate = office.vatRate ?? defaultVat(currency);
  const cp = clientProject();
  const rd = readiness(office, currency);
  const rows = invoiceRows(invoices, { vatRate, currency, client: cp.client, project: cp.name });
  const [qr, setQr] = useState(null);

  const base = (r, inv) => ({ no: r.no, issueDate: r.dueDate || new Date().toISOString().slice(0, 10), currency, seller: office.name, vatNo: office.taxId, buyer: r.client, description: inv.title || r.project, net: r.net, vat: r.vat, gross: r.gross, vatRate });
  const draft = (r, inv) => {
    const d = base(r, inv);
    if (rd.market === "egypt") download(`${r.no}.eta.json`, JSON.stringify(etaJson(d), null, 2), "application/json");
    else download(`${r.no}.xml`, ublInvoiceXml(d), "application/xml");
  };
  const showQr = async (r) => {
    const QR = (await import("qrcode")).default;
    const payload = zatcaTlv({ seller: office.name, vatNo: office.taxId, timestamp: `${r.dueDate || new Date().toISOString().slice(0, 10)}T00:00:00Z`, total: r.gross, vat: r.vat });
    setQr({ no: r.no, img: await QR.toDataURL(payload, { margin: 1, width: 240 }) });
  };

  if (!rd.market) {
    return <p className="no-print text-xs text-[#5D6168] bg-white border border-[#E3E0D9] rounded-xl p-4">{T("ei.nomarket")}</p>;
  }
  const btn = "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E3E0D9] bg-white hover:bg-[#F6F5F1] text-[11px] font-bold cursor-pointer";
  return (
    <section className="no-print bg-white border border-[#E3E0D9] rounded-xl p-5 space-y-4">
      <div>
        <h2 className="text-base font-black">{T("ei.title")} · {T("ei.m." + rd.market)}</h2>
        <p className="text-xs text-[#5D6168] mt-1 leading-relaxed">{T("ei.note." + rd.market)}</p>
      </div>
      <ul className="grid sm:grid-cols-3 gap-2">
        {rd.checks.map((c) => (
          <li key={c.id} className={`flex items-center gap-2 text-xs font-bold rounded-lg px-3 py-2 border ${c.ok ? "text-emerald-700 bg-emerald-50 border-emerald-200" : "text-amber-800 bg-amber-50 border-amber-200"}`}>
            {c.ok ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            {T("ei.c." + c.id)}
          </li>
        ))}
      </ul>
      <ul className="divide-y divide-[#EEECE6]">
        {rows.map((r, i) => (
          <li key={r.no} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
            <span className="text-sm font-bold">{r.no}</span>
            <span className="flex gap-2">
              {rd.market === "ksa" && <button type="button" disabled={!rd.ready} onClick={() => showQr(r)} className={btn + " disabled:opacity-40"}><QrCode className="w-3.5 h-3.5" />{T("ei.qr")}</button>}
              <button type="button" disabled={!rd.ready} onClick={() => draft(r, invoices[i])} className={btn + " disabled:opacity-40"}><FileCode2 className="w-3.5 h-3.5" />{T(rd.market === "egypt" ? "ei.json" : "ei.xml")}</button>
            </span>
          </li>
        ))}
      </ul>
      {qr && createPortal(
        <div className="no-print fixed inset-0 z-[70] bg-[#16181C]/50 flex items-center justify-center p-4" onClick={() => setQr(null)}>
          <div className="bg-white rounded-xl p-5 text-center space-y-2" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between gap-6"><b className="text-sm text-[#16181C]">{qr.no}</b><button type="button" onClick={() => setQr(null)} aria-label="close" className="cursor-pointer text-[#16181C]"><X className="w-4 h-4" /></button></div>
            <img src={qr.img} alt="QR" className="mx-auto" width={240} height={240} />
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
