import { useState } from "react";
import EmptyState from "./EmptyState";
import { Plus, Trash2, Wallet } from "lucide-react";
import { tr_ as T, E, money } from "../i18n";
import { useProjectList } from "../data/projects";
import { boqRepo, refreshBoq } from "../data/boq";
import { cashRepo, custodyStats } from "../data/cash";

const input = "px-3 py-2 rounded-lg border border-[#E4DDCE] text-xs font-bold text-[#0E1A1B] bg-white min-w-0";
const btn = "inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#2E6F73] hover:bg-[#245A5E] cursor-pointer";

function Custody({ c, expenses, project }) {
  const [f, setF] = useState({ description: "", category: "", amount: "", boqItemId: "" });
  const boqItems = boqRepo.use().filter((i) => i.projectId === c.projectId);
  const { spent, left } = custodyStats(c, expenses);
  const mine = expenses.filter((x) => x.custodyId === c.id);
  const pct = Math.min(100, Math.round((spent / c.amount) * 100));
  const add = (e) => {
    e.preventDefault();
    if (!f.description.trim() || !Number(f.amount)) return;
    cashRepo.addExpense({ custodyId: c.id, description: f.description.trim(), category: f.category.trim(), amount: Number(f.amount), boqItemId: f.boqItemId ? Number(f.boqItemId) : null }).then(() => { if (f.boqItemId) refreshBoq(); });
    setF({ description: "", category: "", amount: "", boqItemId: "" });
  };
  return (
    <article className="bg-white rounded-2xl border border-[#E4DDCE] p-4 space-y-3">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#0E1A1B]">{c.holder}</p>
          <p className="text-[11px] text-[#64706F]">{project ? E(project.name) : "—"}</p>
        </div>
        <button type="button" onClick={() => cashRepo.removeCustody(c.id)} aria-label={T("arch.do")} title={T("arch.do")} className="p-1.5 rounded-lg text-[#64706F] hover:text-rose-700 hover:bg-rose-50 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
      </div>
      <div className="h-2 rounded-full bg-[#EFE9DC] overflow-hidden"><div className={`h-full ${left < 0 ? "bg-rose-600" : "bg-[#2E6F73]"}`} style={{ width: `${pct}%` }} /></div>
      <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-bold text-[#4A5757]">
        <span>{T("cash.given")}<b className="block text-sm text-[#0E1A1B]">{money(c.amount, { compact: true })}</b></span>
        <span>{T("cash.spent")}<b className="block text-sm text-[#0E1A1B]">{money(spent, { compact: true })}</b></span>
        <span>{T("cash.left")}<b className={`block text-sm ${left < 0 ? "text-rose-700" : "text-[#0E1A1B]"}`}>{money(left, { compact: true })}</b></span>
      </div>
      {mine.map((x) => (
        <div key={x.id} className="flex items-center gap-2 text-xs border-t border-[#ECE5D6] pt-2">
          <span className="flex-1 min-w-0"><span className="font-semibold text-[#0E1A1B]">{x.description}</span>{x.category && <span className="text-[#64706F]"> · {x.category}</span>}</span>
          <span className="tabular-nums font-semibold">{money(x.amount)}</span>
          <button type="button" onClick={() => cashRepo.removeExpense(x.id)} aria-label={T("arch.do")} title={T("arch.do")} className="p-1 rounded text-[#64706F] hover:text-rose-700 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
        </div>
      ))}
      <form onSubmit={add} className="flex flex-wrap gap-2 pt-1">
        <input required placeholder={T("cash.expPh")} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} className={input + " flex-1 min-w-36"} />
        <input placeholder={T("cash.cat")} value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })} className={input + " w-28"} />
        {boqItems.length > 0 && <select value={f.boqItemId} onChange={(e) => setF({ ...f, boqItemId: e.target.value })} aria-label={T("act.link")} className={input + " w-40"}><option value="">{T("act.link")}</option>{boqItems.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}</select>}
        <input required type="number" min={1} placeholder={T("inv.amount")} value={f.amount} onChange={(e) => setF({ ...f, amount: e.target.value })} className={input + " w-28"} />
        <button type="submit" className={btn}><Plus className="w-4 h-4" />{T("cash.addExp")}</button>
      </form>
    </article>
  );
}

/** Admin of a real office: custodies (العهد) per holder and their expenses. */
export default function LiveCash() {
  const projects = useProjectList();
  const { custodies, expenses } = cashRepo.use();
  const arch = cashRepo.useArchived();
  const [f, setF] = useState({ holder: "", amount: "", projectId: "" });
  const add = (e) => {
    e.preventDefault();
    if (!f.holder.trim() || !Number(f.amount)) return;
    cashRepo.addCustody({ holder: f.holder.trim(), amount: Number(f.amount), projectId: f.projectId ? Number(f.projectId) : null });
    setF({ holder: "", amount: "", projectId: "" });
  };
  const totalGiven = custodies.reduce((s, c) => s + c.amount, 0);
  const totalSpent = expenses.filter((x) => custodies.some((c) => c.id === x.custodyId)).reduce((s, x) => s + x.amount, 0);
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-[#0E1A1B] flex items-center gap-2"><Wallet className="w-6 h-6" /><span>{T("cash.title")}</span></h2>
      <div className="grid grid-cols-3 gap-3">
        {[["cash.given", totalGiven], ["cash.spent", totalSpent], ["cash.left", totalGiven - totalSpent]].map(([k, v]) => (
          <div key={k} className="bg-white rounded-lg p-4 border border-[#E4DDCE] text-center">
            <span className="text-[11px] font-bold text-[#4A5757] block mb-1">{T(k)}</span>
            <span className="text-lg md:text-xl font-semibold text-[#0E1A1B]">{money(v, { compact: true })}</span>
          </div>
        ))}
      </div>
      <form onSubmit={add} className="bg-white rounded-2xl border border-[#E4DDCE] p-4 flex flex-wrap gap-2 items-end">
        <input required placeholder={T("cash.holderPh")} value={f.holder} onChange={(e) => setF({ ...f, holder: e.target.value })} className={input + " flex-1 min-w-40"} />
        <select value={f.projectId} onChange={(e) => setF({ ...f, projectId: e.target.value })} className={input + " w-44"}>
          <option value="">{T("cash.noProject")}</option>
          {projects.map((p) => <option key={p.id} value={p.id}>{E(p.name)}</option>)}
        </select>
        <input required type="number" min={1} placeholder={T("inv.amount")} value={f.amount} onChange={(e) => setF({ ...f, amount: e.target.value })} className={input + " w-32"} />
        <button type="submit" className={btn}><Plus className="w-4 h-4" />{T("cash.add")}</button>
      </form>
      {custodies.length === 0 && <EmptyState title={T("cash.empty")} hint={T("cash.emptyHint")} />}
      <div className="grid gap-3">
        {custodies.map((c) => <Custody key={c.id} c={c} expenses={expenses} project={projects.find((p) => p.id === c.projectId)} />)}
      </div>
      {(arch.custodies.length > 0 || arch.expenses.length > 0) && (
        <details className="bg-white rounded-2xl border border-[#E4DDCE] p-4 text-xs">
          <summary className="font-bold text-[#4A5757] cursor-pointer">{T("arch.title")} ({arch.custodies.length + arch.expenses.length})</summary>
          <div className="mt-3 space-y-2">
            {arch.custodies.map((c) => (
              <div key={"c" + c.id} className="flex items-center gap-2">
                <span className="flex-1 min-w-0 font-semibold text-[#0E1A1B]">{c.holder}</span>
                <span className="tabular-nums">{money(c.amount)}</span>
                <button type="button" onClick={() => cashRepo.restoreCustody(c.id)} className="px-3 py-1.5 rounded-lg font-bold border border-[#E4DDCE] cursor-pointer">{T("arch.restore")}</button>
              </div>
            ))}
            {arch.expenses.map((x) => (
              <div key={"e" + x.id} className="flex items-center gap-2">
                <span className="flex-1 min-w-0">{x.description}</span>
                <span className="tabular-nums">{money(x.amount)}</span>
                <button type="button" onClick={() => cashRepo.restoreExpense(x.id)} className="px-3 py-1.5 rounded-lg font-bold border border-[#E4DDCE] cursor-pointer">{T("arch.restore")}</button>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
