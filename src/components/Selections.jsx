import { useState } from "react";
import { Armchair, Check, X, Download, Plus } from "lucide-react";
import { tr_ as T, E, money } from "../i18n";
import { PROJECTS, CLIENT_PROJECT_ID } from "../data/seed";
import { selectionsStore } from "../data/stores";
import { selectionTotals, groupByRoom, linePrice, lineCost } from "../lib/selections";
import { toCsv, download } from "../lib/accountant";

const input = "px-3 py-2 rounded-lg border border-[#E3E0D9] text-xs font-bold text-[#16181C] bg-white min-w-0";
const badge = { proposed: "bg-amber-50 text-amber-800 border-amber-200", approved: "bg-emerald-50 text-emerald-700 border-emerald-200", rejected: "bg-rose-50 text-rose-700 border-rose-200", ordered: "bg-sky-50 text-sky-700 border-sky-200" };
const empty = { room: "", name: "", supplier: "", qty: "1", cost: "", price: "" };

/** Client selections & FF&E schedule. Admin proposes items per room; the client approves or rejects. */
export default function Selections({ role = "Admin", restricted = false }) {
  const isClient = role === "Client";
  const [items, setItems] = selectionsStore.use();
  const [projectId, setProjectId] = useState(isClient ? CLIENT_PROJECT_ID : PROJECTS[0].id);
  const [f, setF] = useState(empty);
  const project = PROJECTS.find((p) => p.id === Number(projectId));
  const mine = items.filter((i) => i.projectId === project.id);
  const t = selectionTotals(mine);
  const groups = groupByRoom(mine);

  const add = (e) => {
    e.preventDefault();
    if (!f.name.trim() || !Number(f.price)) return;
    setItems((a) => [...a, { id: Date.now(), projectId: project.id, room: f.room.trim(), name: f.name.trim(), supplier: f.supplier.trim(), qty: Number(f.qty) || 1, cost: Number(f.cost) || 0, price: Number(f.price), status: "proposed" }]);
    setF(empty);
  };
  const setStatus = (id, status) => setItems((a) => a.map((i) => (i.id === id ? { ...i, status } : i)));
  const exportCsv = () =>
    download(`ffe-${project.code}.csv`, toCsv([T("sel.room"), T("sel.item"), T("sel.supplier"), T("sel.qty"), T("sel.price"), T("sel.total"), T("sel.status")], mine.map((i) => [i.room, i.name, i.supplier, i.qty, i.price, linePrice(i), T("sel.s." + i.status)])), "text/csv");

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent pb-24 font-ibm w-full max-w-full overflow-x-hidden">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-[#16181C] flex items-center gap-2.5"><Armchair className="w-7 h-7" /><span>{T(isClient ? "sel.title.client" : "sel.title")}</span></h1>
            <p className="text-xs md:text-sm text-[#5D6168] mt-1">{T(isClient ? "sel.sub.client" : "sel.sub")}</p>
          </div>
          {!isClient && <button type="button" onClick={exportCsv} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-[#16181C] bg-white border border-[#E3E0D9] hover:bg-[#F6F5F1] cursor-pointer w-fit"><Download className="w-4 h-4" />{T("sel.export")}</button>}
        </div>

        {!isClient && (
          <select value={projectId} onChange={(e) => setProjectId(e.target.value)} className={input + " max-w-md w-full"}>
            {PROJECTS.map((p) => <option key={p.id} value={p.id}>{E(p.name)}</option>)}
          </select>
        )}

        <div className="grid stat-grid grid-cols-2 md:grid-cols-4 gap-3">
          {[["sel.k.approved", t.price], ["sel.k.pending", t.pending], ...(isClient || restricted ? [] : [["sel.k.cost", t.cost], ["sel.k.margin", t.margin]])].map(([k, v]) => (
            <div key={k} className="bg-white rounded-lg p-4 border border-[#E3E0D9] text-center">
              <span className="text-[11px] font-bold text-[#5D6168] block mb-1">{T(k)}</span>
              <span className="text-lg md:text-xl font-black text-[#16181C]">{money(v, { compact: true })}</span>
              {k === "sel.k.margin" && <span className="block text-[10px] font-bold text-[#5D6168]">{t.marginPct}%</span>}
            </div>
          ))}
        </div>

        {!isClient && (
          <form onSubmit={add} className="bg-white rounded-lg border border-[#E3E0D9] p-4 flex flex-wrap gap-2 items-end">
            <input placeholder={T("sel.room")} value={f.room} onChange={(e) => setF({ ...f, room: e.target.value })} className={input + " w-32"} />
            <input required placeholder={T("sel.item")} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className={input + " flex-1 min-w-36"} />
            <input placeholder={T("sel.supplier")} value={f.supplier} onChange={(e) => setF({ ...f, supplier: e.target.value })} className={input + " w-32"} />
            <input type="number" min={1} placeholder={T("sel.qty")} value={f.qty} onChange={(e) => setF({ ...f, qty: e.target.value })} className={input + " w-20"} />
            {!restricted && <input type="number" min={0} placeholder={T("sel.cost")} value={f.cost} onChange={(e) => setF({ ...f, cost: e.target.value })} className={input + " w-28"} />}
            <input required type="number" min={1} placeholder={T("sel.price")} value={f.price} onChange={(e) => setF({ ...f, price: e.target.value })} className={input + " w-28"} />
            <button type="submit" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#2B3138] hover:bg-[#16181C] cursor-pointer"><Plus className="w-4 h-4" />{T("sel.add")}</button>
          </form>
        )}

        {mine.length === 0 && <p className="text-xs text-[#5D6168] bg-white rounded-lg border border-[#E3E0D9] p-6 text-center">{T("sel.empty")}</p>}
        {Object.entries(groups).map(([room, list]) => (
          <section key={room} className="space-y-2">
            <h2 className="text-sm font-black text-[#16181C]">{room || T("sel.general")}</h2>
            {list.map((i) => (
              <div key={i.id} className="bg-white rounded-lg border border-[#E3E0D9] p-3 md:p-4 flex flex-col md:flex-row md:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-extrabold text-[#16181C]">{i.name}</p>
                  <p className="text-[11px] font-bold text-[#5D6168]">{i.supplier && i.supplier + " · "}{i.qty} × {money(i.price)} = {money(linePrice(i))}{!isClient && !restricted && ` · ${T("sel.cost")}: ${money(lineCost(i))}`}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border w-fit ${badge[i.status]}`}>{T("sel.s." + i.status)}</span>
                <div className="flex gap-2">
                  {isClient && i.status === "proposed" && (
                    <>
                      <button type="button" onClick={() => setStatus(i.id, "rejected")} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 cursor-pointer"><X className="w-3.5 h-3.5" />{T("sel.reject")}</button>
                      <button type="button" onClick={() => setStatus(i.id, "approved")} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 cursor-pointer"><Check className="w-3.5 h-3.5" />{T("sel.approve")}</button>
                    </>
                  )}
                  {!isClient && i.status === "approved" && <button type="button" onClick={() => setStatus(i.id, "ordered")} className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-white bg-[#2B3138] hover:bg-[#16181C] cursor-pointer">{T("sel.order")}</button>}
                  {!isClient && i.status === "rejected" && <button type="button" onClick={() => setStatus(i.id, "proposed")} className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-[#16181C] bg-white border border-[#E3E0D9] cursor-pointer">{T("sel.repropose")}</button>}
                </div>
              </div>
            ))}
          </section>
        ))}
      </div>
    </main>
  );
}
