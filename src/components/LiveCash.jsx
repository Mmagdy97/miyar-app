import { useState } from "react";
import { Plus, Trash2, Wallet } from "lucide-react";
import { tr_ as T, E, money } from "../i18n";
import { useProjectList } from "../data/projects";
import { cashRepo, custodyStats } from "../data/cash";

const input = "px-3 py-2 rounded-lg border border-[#E6DFD0] text-xs font-bold text-[#1F2421] bg-white min-w-0";
const btn = "inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#17614F] hover:bg-[#104A3C] cursor-pointer";

function Custody({ c, expenses, project }) {
  const [f, setF] = useState({ description: "", category: "", amount: "" });
  const { spent, left } = custodyStats(c, expenses);
  const mine = expenses.filter((x) => x.custodyId === c.id);
  const pct = Math.min(100, Math.round((spent / c.amount) * 100));
  const add = (e) => {
    e.preventDefault();
    if (!f.description.trim() || !Number(f.amount)) return;
    cashRepo.addExpense({ custodyId: c.id, description: f.description.trim(), category: f.category.trim(), amount: Number(f.amount) });
    setF({ description: "", category: "", amount: "" });
  };
  return (
    <article className="bg-white rounded-2xl border border-[#E6DFD0] p-4 space-y-3">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#1F2421]">{c.holder}</p>
          <p className="text-[11px] text-[#6F756B]">{project ? E(project.name) : "—"}</p>
        </div>
        <button type="button" onClick={() => cashRepo.removeCustody(c.id)} aria-label={T("cash.delete")} className="p-1.5 rounded-lg text-[#6F756B] hover:text-rose-700 hover:bg-rose-50 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
      </div>
      <div className="h-2 rounded-full bg-[#EFE9DA] overflow-hidden"><div className={`h-full ${left < 0 ? "bg-rose-600" : "bg-[#17614F]"}`} style={{ width: `${pct}%` }} /></div>
      <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-bold text-[#555B53]">
        <span>{T("cash.given")}<b className="block text-sm text-[#1F2421]">{money(c.amount, { compact: true })}</b></span>
        <span>{T("cash.spent")}<b className="block text-sm text-[#1F2421]">{money(spent, { compact: true })}</b></span>
        <span>{T("cash.left")}<b className={`block text-sm ${left < 0 ? "text-rose-700" : "text-[#1F2421]"}`}>{money(left, { compact: true })}</b></span>
      </div>
      {mine.map((x) => (
        <div key={x.id} className="flex items-center gap-2 text-xs border-t border-[#EFE9DA] pt-2">
          <span className="flex-1 min-w-0"><span className="font-semibold text-[#1F2421]">{x.description}</span>{x.category && <span className="text-[#6F756B]"> · {x.category}</span>}</span>
          <span className="tabular-nums font-semibold">{money(x.amount)}</span>
          <button type="button" onClick={() => cashRepo.removeExpense(x.id)} aria-label={T("cash.delete")} className="p-1 rounded text-[#6F756B] hover:text-rose-700 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
        </div>
      ))}
      <form onSubmit={add} className="flex flex-wrap gap-2 pt-1">
        <input required placeholder={T("cash.expPh")} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} className={input + " flex-1 min-w-36"} />
        <input placeholder={T("cash.cat")} value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })} className={input + " w-28"} />
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
      <h2 className="text-xl font-semibold text-[#1F2421] flex items-center gap-2"><Wallet className="w-6 h-6" /><span>{T("cash.title")}</span></h2>
      <div className="grid grid-cols-3 gap-3">
        {[["cash.given", totalGiven], ["cash.spent", totalSpent], ["cash.left", totalGiven - totalSpent]].map(([k, v]) => (
          <div key={k} className="bg-white rounded-lg p-4 border border-[#E6DFD0] text-center">
            <span className="text-[11px] font-bold text-[#555B53] block mb-1">{T(k)}</span>
            <span className="text-lg md:text-xl font-semibold text-[#1F2421]">{money(v, { compact: true })}</span>
          </div>
        ))}
      </div>
      <form onSubmit={add} className="bg-white rounded-2xl border border-[#E6DFD0] p-4 flex flex-wrap gap-2 items-end">
        <input required placeholder={T("cash.holderPh")} value={f.holder} onChange={(e) => setF({ ...f, holder: e.target.value })} className={input + " flex-1 min-w-40"} />
        <select value={f.projectId} onChange={(e) => setF({ ...f, projectId: e.target.value })} className={input + " w-44"}>
          <option value="">{T("cash.noProject")}</option>
          {projects.map((p) => <option key={p.id} value={p.id}>{E(p.name)}</option>)}
        </select>
        <input required type="number" min={1} placeholder={T("inv.amount")} value={f.amount} onChange={(e) => setF({ ...f, amount: e.target.value })} className={input + " w-32"} />
        <button type="submit" className={btn}><Plus className="w-4 h-4" />{T("cash.add")}</button>
      </form>
      {custodies.length === 0 && <p className="text-xs text-[#555B53] bg-white rounded-lg border border-[#E6DFD0] p-6 text-center">{T("cash.empty")}</p>}
      <div className="grid gap-3">
        {custodies.map((c) => <Custody key={c.id} c={c} expenses={expenses} project={projects.find((p) => p.id === c.projectId)} />)}
      </div>
    </div>
  );
}
