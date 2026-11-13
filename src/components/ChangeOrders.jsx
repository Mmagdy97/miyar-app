import { valueMoment } from "../lib/nudge";
import { useState } from "react";
import { FilePenLine, Check, X, MessageCircle } from "lucide-react";
import { tr_ as T, E, money } from "../i18n";
import { PROJECTS, CLIENT_PROJECT_ID } from "../data/seed";
import { changeOrdersStore } from "../data/stores";
import { applyChangeOrders, canDecide } from "../lib/changeorders";
import { whatsappLink } from "../lib/share";

const input = "px-3 py-2 rounded-lg border border-[#E6DFD0] text-xs font-bold text-[#1F2421] bg-white min-w-0";
const badge = { draft: "bg-[#F0EADD] text-[#555B53] border-[#E6DFD0]", sent: "bg-amber-50 text-amber-800 border-amber-200", approved: "bg-emerald-50 text-emerald-700 border-emerald-200", rejected: "bg-rose-50 text-rose-700 border-rose-200" };

/** Change orders. Admin raises and sends them; the client approves or rejects in their portal. */
export default function ChangeOrders({ role = "Admin" }) {
  const isClient = role === "Client";
  const [orders, setOrders] = changeOrdersStore.use();
  const [projectId, setProjectId] = useState(isClient ? CLIENT_PROJECT_ID : PROJECTS[0].id);
  const [f, setF] = useState({ title: "", desc: "", cost: "", days: "" });
  const project = PROJECTS.find((p) => p.id === Number(projectId));
  const list = orders.filter((o) => o.projectId === project.id && (!isClient || o.status !== "draft"));
  const adj = applyChangeOrders(project.contractValue, orders.filter((o) => o.projectId === project.id));

  const add = (e) => {
    e.preventDefault();
    if (!f.title.trim() || f.cost === "") return;
    setOrders((a) => [{ id: Date.now(), projectId: project.id, no: a.filter((o) => o.projectId === project.id).length + 1, title: f.title.trim(), desc: f.desc.trim(), cost: Number(f.cost), days: Number(f.days) || 0, status: "draft", date: new Date().toISOString().slice(0, 10) }, ...a]);
    setF({ title: "", desc: "", cost: "", days: "" });
  };
  const setStatus = (id, status) => { valueMoment("co-" + status); setOrders((a) => a.map((o) => (o.id === id ? { ...o, status } : o))); };
  const text = (o) => T("co.msg", { 0: `${o.no}`, 1: o.title, 2: money(o.cost), 3: `${o.days}` });

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent pb-24 font-ibm w-full max-w-full overflow-x-hidden">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-[#1F2421] flex items-center gap-2.5"><FilePenLine className="w-7 h-7" /><span>{T("co.title")}</span></h1>
          <p className="text-xs md:text-sm text-[#555B53] mt-1">{T(isClient ? "co.sub.client" : "co.sub")}</p>
        </div>

        {!isClient && (
          <select value={projectId} onChange={(e) => setProjectId(e.target.value)} className={input + " max-w-md w-full"}>
            {PROJECTS.map((p) => <option key={p.id} value={p.id}>{E(p.name)}</option>)}
          </select>
        )}

        <div className="grid stat-grid grid-cols-3 gap-3">
          {[["co.k.base", money(project.contractValue, { compact: true })], ["co.k.new", money(adj.value, { compact: true })], ["co.k.days", `+${adj.days}`]].map(([k, v]) => (
            <div key={k} className="bg-white rounded-lg p-4 border border-[#E6DFD0] text-center">
              <span className="text-[11px] font-bold text-[#555B53] block mb-1">{T(k)}</span>
              <span className="text-lg md:text-xl font-semibold text-[#1F2421]">{v}</span>
            </div>
          ))}
        </div>

        {!isClient && (
          <form onSubmit={add} className="bg-white rounded-lg border border-[#E6DFD0] p-4 space-y-3">
            <div className="flex flex-wrap gap-2">
              <input required placeholder={T("co.f.title")} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} className={input + " flex-1 min-w-40"} />
              <input required type="number" placeholder={T("co.f.cost")} value={f.cost} onChange={(e) => setF({ ...f, cost: e.target.value })} className={input + " w-36"} />
              <input type="number" min={0} placeholder={T("co.f.days")} value={f.days} onChange={(e) => setF({ ...f, days: e.target.value })} className={input + " w-28"} />
            </div>
            <textarea rows={2} placeholder={T("co.f.desc")} value={f.desc} onChange={(e) => setF({ ...f, desc: e.target.value })} className={input + " w-full"} />
            <button type="submit" className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#17614F] hover:bg-[#17614F] cursor-pointer">{T("co.add")}</button>
          </form>
        )}

        <div className="space-y-3">
          {list.length === 0 && <p className="text-xs text-[#555B53] bg-white rounded-lg border border-[#E6DFD0] p-6 text-center">{T("co.empty")}</p>}
          {list.map((o) => (
            <div key={o.id} className="bg-white rounded-lg border border-[#E6DFD0] p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-[#1F2421]">#{o.no} · {o.title}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${badge[o.status]}`}>{T("co.s." + o.status)}</span>
              </div>
              {o.desc && <p className="text-xs text-[#555B53] mt-1 leading-relaxed">{o.desc}</p>}
              <p className="text-xs font-semibold text-[#1F2421] mt-2">{o.cost >= 0 ? "+" : ""}{money(o.cost)} · {o.days > 0 ? `+${o.days} ${T("co.day")}` : T("co.nodelay")}</p>
              <div className="mt-3 flex flex-wrap gap-2 justify-end">
                {!isClient && o.status === "draft" && <button type="button" onClick={() => setStatus(o.id, "sent")} className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-white bg-[#17614F] hover:bg-[#17614F] cursor-pointer">{T("co.send")}</button>}
                {!isClient && o.status !== "draft" && <a href={whatsappLink(text(o))} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200"><MessageCircle className="w-3.5 h-3.5" />{T("co.wa")}</a>}
                {isClient && canDecide(o) && (
                  <>
                    <button type="button" onClick={() => setStatus(o.id, "rejected")} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 cursor-pointer"><X className="w-3.5 h-3.5" />{T("co.reject")}</button>
                    <button type="button" onClick={() => setStatus(o.id, "approved")} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 cursor-pointer"><Check className="w-3.5 h-3.5" />{T("co.approve")}</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
