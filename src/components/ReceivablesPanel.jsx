import { Download, MessageCircle, FileJson } from "lucide-react";
import { tr_ as T, E, money, getCurrency } from "../i18n";
import { invoicesStore } from "../data/stores";
import { officeStore, defaultVat } from "../data/office";
import { OVERDUE, projectById, clientProject, formatDateAr } from "../data/seed";
import { whatsappLink } from "../lib/share";
import { invoiceRows, toCsv, download } from "../lib/accountant";

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

  const btn = "inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F4F5F7] text-xs font-bold cursor-pointer";

  return (
    <section className="no-print bg-white border border-[#E2E8F0] rounded-xl p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold">{T("recv.title")}</h2>
        <div className="flex items-center gap-2">
          <button type="button" onClick={exportCsv} className={btn}><Download className="w-3.5 h-3.5" />{T("exp.csv")}</button>
          <button type="button" onClick={exportJson} className={btn}><FileJson className="w-3.5 h-3.5" />{T("exp.json")}</button>
        </div>
      </div>
      <div className="hidden md:grid grid-cols-[1.6fr_1fr_1fr_1fr_auto] gap-3 px-1 text-[11px] font-semibold text-[#64748B]">
        <span>{T("exp.project")}</span><span>{T("recv.ref")}</span><span>{T("recv.due")}</span><span>{T("recv.amount")}</span><span className="w-24" />
      </div>
      <ul className="divide-y divide-[#E0F2F1]">
        {OVERDUE.map((o, n) => {
          const p = projectById(o.projectId);
          const due = new Date(Date.UTC(2026, 10, 19) - o.daysLate * 86400000).toISOString().slice(0, 10);
          return (
            <li key={o.projectId} className="grid grid-cols-2 md:grid-cols-[1.6fr_1fr_1fr_1fr_auto] items-center gap-x-3 gap-y-1.5 py-3 px-1">
              <div className="min-w-0 col-span-2 md:col-span-1">
                <p className="text-sm font-bold truncate">{E(p.name)}</p>
                <p className="text-xs text-[#475569] truncate">{E(p.client)}</p>
              </div>
              <span dir="ltr" className="inline-block tabular-nums text-xs font-semibold text-[#0E2A47] text-start">{T("recv.certNo")} #{n + 2}</span>
              <span className="text-xs text-[#475569]">{formatDateAr(due)} <span className="ms-1 inline-flex rounded-full bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap">{T("recv.late", { n: o.daysLate })}</span></span>
              <span dir="ltr" className="inline-block tabular-nums text-sm font-bold text-[#0E2A47] text-start">{money(o.amount, { compact: true })}</span>
              <a href={reminder(o)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 text-white text-xs font-bold px-3 py-1.5">
                <MessageCircle className="w-3.5 h-3.5" />{T("share.whatsapp")}
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
