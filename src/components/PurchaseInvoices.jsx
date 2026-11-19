import { useState } from "react";
import { ShoppingCart, Plus, Eye, EyeOff, Archive, FileText, Download } from "lucide-react";
import EmptyState from "./EmptyState";
import { tr_ as T, E, money, getCurrency } from "../i18n";
import { officeStore, defaultVat } from "../data/office";
import { billRows, toCsv, download, BILL_KEYS } from "../lib/accountant";
import { useProjectList, projectsStore } from "../data/projects";
import { purchasesRepo, purchaseFileUrl } from "../data/purchases";

const input = "px-3 py-2 rounded-lg border border-[#E4DDCE] text-xs font-bold text-[#0E1A1B] bg-white min-w-0";
const btn = "inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#2E6F73] hover:bg-[#245A5E] cursor-pointer";

/** Supplier invoices per project. Staff upload; each invoice can be shown to the client or kept private. */
export default function PurchaseInvoices({ role = "Admin" }) {
  const isClient = role === "Client";
  const projects = useProjectList();
  const live = projectsStore.isLive;
  const rows = purchasesRepo.use();
  const archived = purchasesRepo.useArchived();
  const [demo, setDemo] = useState([]);
  const [office] = officeStore.use();
  const [pid, setPid] = useState(null);
  const [f, setF] = useState({ title: "", supplier: "", amount: "", file: null });
  const [busy, setBusy] = useState(false);
  const project = projects.find((p) => p.id === pid) || projects[0];
  if (!project) return <main className="flex-1 flex items-center justify-center p-8 font-ibm"><p className="text-sm text-[#4A5757] bg-white rounded-xl border border-[#E4DDCE] p-8 text-center max-w-sm">{T("proj.none")}</p></main>;
  const all = live ? rows : demo;
  const mine = all.filter((i) => i.projectId === project.id && (!isClient || i.visible));
  const total = mine.reduce((s, i) => s + i.amount, 0);
  const exportBills = () => {
    const currency = getCurrency();
    const rows = billRows(all, { vatRate: office.vatRate ?? defaultVat(currency), currency, projectName: (id) => E(projects.find((p) => p.id === id)?.name || "") });
    download(`miyar-supplier-bills-${new Date().toISOString().slice(0, 10)}.csv`, toCsv([T("exp.no"), T("pinv.date"), T("pinv.supplier"), T("exp.project"), T("pinv.titlePh"), T("exp.net"), T("exp.rate"), T("exp.vat"), T("exp.gross"), T("exp.cur")], rows, BILL_KEYS), "text/csv");
  };
  const open = async (i) => { const u = await purchaseFileUrl(i.file); if (u) window.open(u, "_blank", "noopener"); };
  const submit = async (e) => {
    e.preventDefault();
    if (!f.title.trim() || !Number(f.amount) || busy) return;
    setBusy(true);
    const v = { projectId: project.id, title: f.title.trim(), supplier: f.supplier.trim(), amount: Number(f.amount), file: f.file };
    const ok = live ? await purchasesRepo.add(v) : (setDemo((a) => [{ id: Date.now(), ...v, file: "", visible: false, at: new Date().toISOString() }, ...a]), true);
    setBusy(false);
    if (ok) setF({ title: "", supplier: "", amount: "", file: null });
  };
  const toggle = (i) => (live ? purchasesRepo.setVisible(i.id, !i.visible) : setDemo((a) => a.map((x) => (x.id === i.id ? { ...x, visible: !x.visible } : x))));
  const arch = (i) => (live ? purchasesRepo.archive(i.id) : setDemo((a) => a.filter((x) => x.id !== i.id)));
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent pb-24 font-ibm w-full max-w-full overflow-x-hidden">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-semibold text-[#0E1A1B] flex items-center gap-2"><ShoppingCart className="w-6 h-6" /><span>{T("pinv.title")}</span></h2>
          {!isClient && all.length > 0 && <button type="button" onClick={exportBills} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#E4DDCE] bg-white hover:bg-[#F6F3EC] text-xs font-bold cursor-pointer"><Download className="w-3.5 h-3.5" />{T("pinv.export")}</button>}
        </div>
        {projects.length > 1 && (
          <select value={project.id} onChange={(e) => setPid(Number(e.target.value))} aria-label={T("pinv.title")} className={input + " w-full sm:w-64"}>
            {projects.map((p) => <option key={p.id} value={p.id}>{E(p.name)}</option>)}
          </select>
        )}
        <div className="bg-white rounded-lg p-4 border border-[#E4DDCE] text-center">
          <span className="text-[11px] font-bold text-[#4A5757] block mb-1">{T("pinv.total")}</span>
          <span className="text-lg font-semibold text-[#0E1A1B]">{money(total, { compact: true })}</span>
        </div>
        {!isClient && (
          <form onSubmit={submit} className="bg-white rounded-2xl border border-[#E4DDCE] p-4 flex flex-wrap gap-2 items-end">
            <input required placeholder={T("pinv.titlePh")} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} className={input + " flex-1 min-w-40"} />
            <input placeholder={T("pinv.supplier")} value={f.supplier} onChange={(e) => setF({ ...f, supplier: e.target.value })} className={input + " w-36"} />
            <input required type="number" min={1} placeholder={T("inv.amount")} value={f.amount} onChange={(e) => setF({ ...f, amount: e.target.value })} className={input + " w-28"} />
            <label className={input + " cursor-pointer w-44 truncate"}>{f.file ? f.file.name : T("pinv.file")}<input type="file" accept="application/pdf,image/*" className="sr-only" onChange={(e) => setF({ ...f, file: e.target.files?.[0] || null })} /></label>
            <button type="submit" disabled={busy} className={btn + " disabled:opacity-50"}><Plus className="w-4 h-4" />{T("pinv.add")}</button>
          </form>
        )}
        {mine.length === 0 && <EmptyState title={T("pinv.empty")} hint={T(isClient ? "pinv.emptyClient" : "pinv.emptyHint")} />}
        <div className="grid gap-3">
          {mine.map((i) => (
            <article key={i.id} className="bg-white rounded-2xl border border-[#E4DDCE] p-4 flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-40">
                <p className="text-sm font-semibold text-[#0E1A1B]">{i.title}</p>
                {i.supplier && <p className="text-[11px] text-[#64706F]">{i.supplier}</p>}
              </div>
              <span className="text-sm font-semibold tabular-nums">{money(i.amount)}</span>
              {i.file && <button type="button" onClick={() => open(i)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border border-[#E4DDCE] cursor-pointer"><FileText className="w-4 h-4" />{T("pinv.open")}</button>}
              {!isClient && (
                <>
                  <button type="button" onClick={() => toggle(i)} aria-pressed={i.visible} className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${i.visible ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-white text-[#4A5757] border-[#E4DDCE]"}`}>
                    {i.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}{T(i.visible ? "pinv.shown" : "pinv.hidden")}
                  </button>
                  <button type="button" onClick={() => arch(i)} aria-label={T("arch.do")} title={T("arch.do")} className="p-1.5 rounded-lg text-[#64706F] hover:text-rose-700 hover:bg-rose-50 cursor-pointer"><Archive className="w-4 h-4" /></button>
                </>
              )}
            </article>
          ))}
        </div>
        {!isClient && live && archived.filter((i) => i.projectId === project.id).length > 0 && (
          <details className="bg-white rounded-2xl border border-[#E4DDCE] p-4 text-xs">
            <summary className="font-bold text-[#4A5757] cursor-pointer">{T("arch.title")} ({archived.filter((i) => i.projectId === project.id).length})</summary>
            <div className="mt-3 space-y-2">
              {archived.filter((i) => i.projectId === project.id).map((i) => (
                <div key={i.id} className="flex items-center gap-2">
                  <span className="flex-1 min-w-0 font-semibold">{i.title}</span>
                  <span className="tabular-nums">{money(i.amount)}</span>
                  <button type="button" onClick={() => purchasesRepo.restore(i.id)} className="px-3 py-1.5 rounded-lg font-bold border border-[#E4DDCE] cursor-pointer">{T("arch.restore")}</button>
                </div>
              ))}
            </div>
          </details>
        )}
      </div>
    </main>
  );
}
