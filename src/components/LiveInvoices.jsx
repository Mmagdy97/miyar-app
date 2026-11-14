import { useState } from "react";
import EmptyState from "./EmptyState";
import { Plus, Printer, Check, Trash2, Receipt } from "lucide-react";
import { tr_ as T, E, money, intlLocale } from "../i18n";
import { useProjectList } from "../data/projects";
import { invoicesRepo, invoiceTotals, isOverdue } from "../data/invoices";
import { printReceipt } from "../lib/receipt";

const input = "px-3 py-2 rounded-lg border border-[#DCE4DC] text-xs font-bold text-[#1F2A26] bg-white min-w-0";
const fmt = (d) => (d ? new Date(d).toLocaleDateString(intlLocale(), { day: "numeric", month: "short", year: "numeric" }) : "—");

/** Admin of a real office: invoices / payment milestones per project. */
export default function LiveInvoices({ readOnly = false }) {
  const projects = useProjectList();
  const all = invoicesRepo.use();
  const [pid, setPid] = useState(null);
  const [f, setF] = useState({ title: "", amount: "", dueDate: "" });
  const project = projects.find((p) => p.id === pid) || projects[0];
  if (!project) return <main className="flex-1 flex items-center justify-center p-8 font-ibm"><p className="text-sm text-[#56635B] bg-white rounded-xl border border-[#DCE4DC] p-8 text-center max-w-sm">{T("proj.none")}</p></main>;
  const rows = all.filter((i) => i.projectId === project.id);
  const t = invoiceTotals(rows);
  const submit = (e) => {
    e.preventDefault();
    if (!f.title.trim() || !Number(f.amount)) return;
    invoicesRepo.add({ projectId: project.id, title: f.title.trim(), amount: Number(f.amount), dueDate: f.dueDate });
    setF({ title: "", amount: "", dueDate: "" });
  };
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent pb-24 font-ibm w-full max-w-full overflow-x-hidden">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-[#1F2A26] flex items-center gap-2.5"><Receipt className="w-7 h-7" /><span>{T("inv.title")}</span></h1>
          <p className="text-xs md:text-sm text-[#56635B] mt-1">{readOnly ? "" : T("inv.sub")}</p>
        </div>
        <select value={project.id} onChange={(e) => setPid(Number(e.target.value))} className={input + " max-w-md w-full"}>
          {projects.map((p) => <option key={p.id} value={p.id}>{E(p.name)}</option>)}
        </select>
        <div className="grid grid-cols-3 gap-3">
          {[["inv.total", t.total], ["inv.paidTotal", t.paid], ["inv.dueTotal", t.due]].map(([k, v]) => (
            <div key={k} className="bg-white rounded-lg p-4 border border-[#DCE4DC] text-center">
              <span className="text-[11px] font-bold text-[#56635B] block mb-1">{T(k)}</span>
              <span className="text-lg md:text-xl font-semibold text-[#1F2A26]">{money(v, { compact: true })}</span>
            </div>
          ))}
        </div>
        {!readOnly && <form onSubmit={submit} className="bg-white rounded-2xl border border-[#DCE4DC] p-4 flex flex-wrap gap-2 items-end">
          <input required placeholder={T("inv.titlePh")} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} className={input + " flex-1 min-w-44"} />
          <input required type="number" min={1} placeholder={T("inv.amount")} value={f.amount} onChange={(e) => setF({ ...f, amount: e.target.value })} className={input + " w-32"} />
          <label className="flex items-center gap-1.5 text-[11px] font-bold text-[#56635B]">{T("inv.due")}<input type="date" value={f.dueDate} onChange={(e) => setF({ ...f, dueDate: e.target.value })} className={input} /></label>
          <button type="submit" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#5F6C61] hover:bg-[#4B574D] cursor-pointer"><Plus className="w-4 h-4" />{T("inv.add")}</button>
        </form>}
        {rows.length === 0 && <EmptyState title={T("inv.empty")} hint={T("inv.emptyHint")} />}
        <div className="grid gap-2">
          {rows.map((i) => {
            const late = isOverdue(i);
            return (
              <article key={i.id} className="bg-white rounded-2xl border border-[#DCE4DC] p-4 flex flex-wrap items-center gap-3">
                <div className="flex-1 min-w-48">
                  <p className="text-sm font-semibold text-[#1F2A26]">{i.title}</p>
                  <p className="text-[11px] text-[#6E7B72]">{i.paid ? T("inv.paidOn", { d: fmt(i.paidDate) }) : T("inv.dueOn", { d: fmt(i.dueDate) })}</p>
                </div>
                <span className="text-sm font-semibold tabular-nums text-[#1F2A26]">{money(i.amount)}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${i.paid ? "bg-emerald-50 text-emerald-700 border-emerald-200" : late ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-amber-50 text-amber-800 border-amber-200"}`}>{T(i.paid ? "inv.s.paid" : late ? "inv.s.late" : "inv.s.due")}</span>
                <div className="flex items-center gap-2">
                  {!readOnly && !i.paid && <button type="button" onClick={() => invoicesRepo.markPaid(i.id)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#5F6C61] hover:bg-[#4B574D] cursor-pointer"><Check className="w-4 h-4" />{T("inv.markPaid")}</button>}
                  {i.paid && <button type="button" onClick={() => printReceipt({ ...i, paidDate: i.paidDate }, project.name)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-[#1F2A26] bg-white border border-[#DCE4DC] cursor-pointer"><Printer className="w-4 h-4" />{T("inv.receipt")}</button>}
                  {!readOnly && !i.paid && <button type="button" onClick={() => invoicesRepo.remove(i.id)} aria-label={T("inv.delete")} className="p-1.5 rounded-lg text-[#6E7B72] hover:text-rose-700 hover:bg-rose-50 cursor-pointer"><Trash2 className="w-4 h-4" /></button>}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
