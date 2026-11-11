import { Download, MessageCircle, FileJson } from "lucide-react";
import { tr_ as T, E, money, getCurrency } from "../i18n";
import { invoicesStore } from "../data/stores";
import { officeStore, defaultVat } from "../data/office";
import { OVERDUE, projectById, clientProject } from "../data/seed";
import { whatsappLink } from "../lib/share";
import { invoiceRows, toCsv, download } from "../lib/accountant";
import OfficeDetails from "./OfficeDetails";
import EInvoicePanel from "./EInvoicePanel";

/** Admin: one-tap WhatsApp payment reminders + accountant export (Excel/JSON with VAT). */
export default function ReceivablesPanel() {
  const [invoices] = invoicesStore.use();
  const [office] = officeStore.use();
  const currency = getCurrency();
  const vatRate = office.vatRate ?? defaultVat(currency);
  const cp = clientProject();

  const rows = () => invoiceRows(invoices, { vatRate, currency, client: cp.client, project: cp.name });
  const headers = [T("exp.no"), T("exp.date"), T("exp.client"), T("exp.project"), T("exp.net"), T("exp.rate"), T("exp.vat"), T("exp.gross"), T("exp.status"), T("exp.cur")];
  const stamp = new Date().toISOString().slice(0, 10);
  const exportCsv = () => download(`miyar-invoices-${stamp}.csv`, toCsv(headers, rows()), "text/csv");
  const exportJson = () => download(`miyar-invoices-${stamp}.json`, JSON.stringify(rows(), null, 2), "application/json");

  const reminder = (o) => {
    const p = projectById(o.projectId);
    return whatsappLink(
      T("share.msg.reminder", { 0: p.client, 1: p.name, 2: money(o.amount, { compact: true }), 3: `${o.daysLate}` })
    );
  };

  const btn = "inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#E3E0D9] bg-white hover:bg-[#F6F5F1] text-xs font-bold cursor-pointer";

  return (
    <section className="no-print bg-white border border-[#E3E0D9] rounded-xl p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-black">{T("recv.title")}</h2>
        <div className="flex items-center gap-2">
          <button type="button" onClick={exportCsv} className={btn}><Download className="w-3.5 h-3.5" />{T("exp.csv")}</button>
          <button type="button" onClick={exportJson} className={btn}><FileJson className="w-3.5 h-3.5" />{T("exp.json")}</button>
        </div>
      </div>
      <ul className="divide-y divide-[#EEECE6]">
        {OVERDUE.map((o) => {
          const p = projectById(o.projectId);
          return (
            <li key={o.projectId} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
              <div className="min-w-0">
                <p className="text-sm font-bold truncate">{E(p.name)}</p>
                <p className="text-xs text-[#5D6168]">{E(p.client)} · {money(o.amount, { compact: true })}</p>
              </div>
              <a href={reminder(o)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 text-white text-xs font-bold px-3 py-1.5">
                <MessageCircle className="w-3.5 h-3.5" />{T("share.whatsapp")}
              </a>
            </li>
          );
        })}
      </ul>
      <OfficeDetails />
      <EInvoicePanel />
    </section>
  );
}
