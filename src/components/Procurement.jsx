import { useState } from "react";
import { HardHat, ShoppingCart, MessageCircle, Plus, Pencil, Trash2, Undo2, Check, X } from "lucide-react";
import { tr_ as T, E, money } from "../i18n";
import { subsStore, posStore } from "../data/stores";
import { poTotal, subBalance, procurementTotals, subPayments, addPayment, editPayment, removePayment } from "../lib/procurement";
import { whatsappLink } from "../lib/share";
import { procurementRepo } from "../data/procurement";
import { projectsStore } from "../data/projects";

const PO_NEXT = { draft: "sent", sent: "received" };
const input = "px-3 py-2 rounded-lg border border-[#DCE4DC] text-xs font-bold text-[#1F2A26] bg-white min-w-0";

function useDemoData() {
  const [subs, setSubs] = subsStore.use();
  const [pos, setPos] = posStore.use();
  return {
    subs, pos, canUndo: true, restore: setSubs,
    addSub: (v) => setSubs((a) => [...a, { id: Date.now(), ...v, paid: 0 }]),
    pay: (id, amt) => setSubs((a) => a.map((s) => (s.id === id ? addPayment(s, amt) : s))),
    editPay: (id, pid, v) => setSubs((a) => a.map((s) => (s.id === id ? editPayment(s, pid, v) : s))),
    delPay: (id, pid) => setSubs((a) => a.map((s) => (s.id === id ? removePayment(s, pid) : s))),
    addPo: (po) => setPos((a) => [{ id: Date.now(), no: "PO-" + String(a.length + 1).padStart(3, "0"), ...po, status: "draft" }, ...a]),
    poNext: (id, status) => setPos((a) => a.map((p) => (p.id === id ? { ...p, status } : p))),
  };
}

function useLiveData() {
  const { subs, pos } = procurementRepo.use();
  const sub = (id) => subs.find((s) => s.id === id);
  return {
    subs, pos, canUndo: false, restore: () => {},
    addSub: (v) => procurementRepo.addSub(v),
    pay: (id, amt) => sub(id) && procurementRepo.pay(sub(id), amt),
    editPay: (id, pid, v) => sub(id) && procurementRepo.editPay(sub(id), pid, v),
    delPay: (id, pid) => procurementRepo.delPay(pid),
    addPo: (po) => procurementRepo.addPo(po, pos.length),
    poNext: (id, status) => procurementRepo.setPoStatus(id, status),
  };
}

const Live = () => <ProcurementView data={useLiveData()} />;
const Demo = () => <ProcurementView data={useDemoData()} />;

/** Admin: subcontractor contracts & payments, and purchase orders sent to suppliers via WhatsApp. */
export default function Procurement() {
  return projectsStore.isLive ? <Live /> : <Demo />;
}

function ProcurementView({ data }) {
  const { subs, pos } = data;
  const t = procurementTotals(subs, pos);
  const [sf, setSf] = useState({ name: "", trade: "", contract: "" });
  const [pf, setPf] = useState({ supplier: "", item: "", qty: "", price: "" });

  const addSub = (e) => {
    e.preventDefault();
    if (!sf.name.trim() || !Number(sf.contract)) return;
    data.addSub({ name: sf.name.trim(), trade: sf.trade.trim(), contract: Number(sf.contract) });
    setSf({ name: "", trade: "", contract: "" });
  };
  // every payment change keeps a snapshot so the last action can be undone
  const [undo, setUndo] = useState(null);
  const [payIn, setPayIn] = useState({});
  const [editing, setEditing] = useState(null); // { sid, pid, v }
  const snap = () => data.canUndo && setUndo(subs);
  const paySub = (id, amt) => { snap(); data.pay(id, amt); };
  const delPay = (id, pid) => { snap(); data.delPay(id, pid); };
  const savePay = () => { if (editing) { snap(); data.editPay(editing.sid, editing.pid, editing.v); setEditing(null); } };
  const addPo = (e) => {
    e.preventDefault();
    if (!pf.supplier.trim() || !pf.item.trim() || !Number(pf.qty) || !Number(pf.price)) return;
    data.addPo({ supplier: pf.supplier.trim(), item: pf.item.trim(), qty: Number(pf.qty), price: Number(pf.price) });
    setPf({ supplier: "", item: "", qty: "", price: "" });
  };
  const poNext = (id) => { const p = pos.find((x) => x.id === id); if (p && PO_NEXT[p.status]) data.poNext(id, PO_NEXT[p.status]); };
  const poText = (p) => T("proc.msg", { 0: p.no, 1: E(p.item), 2: `${p.qty}`, 3: money(poTotal(p)) });

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent pb-24 font-ibm w-full max-w-full overflow-x-hidden">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-[#1F2A26] flex items-center gap-2.5"><HardHat className="w-7 h-7" /><span>{T("proc.title")}</span></h1>
          <p className="text-xs md:text-sm text-[#56635B] mt-1">{T("proc.sub")}</p>
        </div>

        <div className="grid stat-grid grid-cols-2 md:grid-cols-4 gap-3">
          {[["proc.k.subs", t.subContracts], ["proc.k.subout", t.subOutstanding], ["proc.k.poopen", t.poOpen], ["proc.k.poall", t.poAll]].map(([k, v]) => (
            <div key={k} className="bg-white rounded-lg p-4 border border-[#DCE4DC] text-center">
              <span className="text-[11px] font-bold text-[#56635B] block mb-1">{T(k)}</span>
              <span className="text-lg md:text-xl font-semibold text-[#1F2A26]">{money(v, { compact: true })}</span>
            </div>
          ))}
        </div>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-[#1F2A26] flex items-center gap-2"><HardHat className="w-5 h-5" />{T("proc.subs")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {subs.map((s) => {
              const pctPaid = s.contract ? Math.round((s.paid / s.contract) * 100) : 0;
              return (
                <div key={s.id} className="bg-white rounded-lg border border-[#DCE4DC] p-4">
                  <div className="flex justify-between gap-2"><p className="text-sm font-semibold text-[#1F2A26]">{E(s.name)}</p><span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#E8EFE9] border border-[#DCE4DC] h-fit">{E(s.trade)}</span></div>
                  <div className="h-2 rounded-full bg-[#E8EFE9] mt-3 overflow-hidden"><div className="h-full bg-[#5F6C61]" style={{ width: pctPaid + "%" }} /></div>
                  <div className="flex justify-between text-[11px] font-bold text-[#56635B] mt-2">
                    <span>{T("proc.paid")}: {money(s.paid, { compact: true })} / {money(s.contract, { compact: true })}</span>
                    <span>{T("proc.balance")}: {money(subBalance(s), { compact: true })}</span>
                  </div>
                  <div className="mt-3 border-t border-[#DCE4DC] pt-3 space-y-2">
                    <p className="text-[11px] font-bold text-[#56635B]">{T("proc.payHist")}</p>
                    {subPayments(s).length === 0 && <p className="text-[11px] text-[#6E7B72]">{T("proc.noPay")}</p>}
                    {subPayments(s).map((p) => (
                      <div key={p.id} className="flex items-center gap-2 text-xs">
                        <span className="text-[#6E7B72] tabular-nums w-20 shrink-0">{p.date || T("proc.opening")}</span>
                        {editing && editing.sid === s.id && editing.pid === p.id ? (
                          <>
                            <input type="number" min={1} value={editing.v} autoFocus onChange={(e) => setEditing({ ...editing, v: e.target.value })} className={input + " w-28"} />
                            <button type="button" onClick={savePay} aria-label={T("proc.save")} className="p-2 rounded-lg bg-[#5F6C61] text-white cursor-pointer"><Check className="w-4 h-4" /></button>
                            <button type="button" onClick={() => setEditing(null)} aria-label={T("proc.cancel")} className="p-2 rounded-lg border border-[#DCE4DC] cursor-pointer"><X className="w-4 h-4" /></button>
                          </>
                        ) : (
                          <>
                            <span className="flex-1 font-bold text-[#1F2A26] tabular-nums">{money(p.amount)}</span>
                            <button type="button" onClick={() => setEditing({ sid: s.id, pid: p.id, v: p.amount })} aria-label={T("proc.edit")} className="p-2 rounded-lg text-[#56635B] hover:bg-[#E8EFE9] cursor-pointer"><Pencil className="w-4 h-4" /></button>
                            <button type="button" onClick={() => delPay(s.id, p.id)} aria-label={T("proc.del")} className="p-2 rounded-lg text-[#B23A2B] hover:bg-[#E8EFE9] cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                          </>
                        )}
                      </div>
                    ))}
                    {subBalance(s) > 0 && (
                      <form onSubmit={(e) => { e.preventDefault(); paySub(s.id, payIn[s.id]); setPayIn({ ...payIn, [s.id]: "" }); }} className="flex flex-wrap gap-2 pt-1">
                        <input type="number" min={1} max={subBalance(s)} placeholder={T("proc.payAmt")} value={payIn[s.id] || ""} onChange={(e) => setPayIn({ ...payIn, [s.id]: e.target.value })} className={input + " flex-1 w-32"} />
                        <button type="submit" className="px-3 py-2 rounded-lg text-xs font-bold text-white bg-[#5F6C61] cursor-pointer">{T("proc.record")}</button>
                        <button type="button" onClick={() => paySub(s.id, Math.round(s.contract * 0.1))} className="px-3 py-2 rounded-lg text-xs font-bold border border-[#DCE4DC] text-[#1F2A26] cursor-pointer">10%</button>
                      </form>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <form onSubmit={addSub} className="flex flex-wrap gap-2 items-end">
            <input required placeholder={T("proc.name")} value={sf.name} onChange={(e) => setSf({ ...sf, name: e.target.value })} className={input} />
            <input placeholder={T("proc.trade")} value={sf.trade} onChange={(e) => setSf({ ...sf, trade: e.target.value })} className={input + " w-28"} />
            <input required type="number" min={1} placeholder={T("proc.contract")} value={sf.contract} onChange={(e) => setSf({ ...sf, contract: e.target.value })} className={input + " w-36"} />
            <button type="submit" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#5F6C61] hover:bg-[#5F6C61] cursor-pointer"><Plus className="w-4 h-4" />{T("proc.addsub")}</button>
          </form>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-[#1F2A26] flex items-center gap-2"><ShoppingCart className="w-5 h-5" />{T("proc.pos")}</h2>
          <form onSubmit={addPo} className="flex flex-wrap gap-2 items-end">
            <input required placeholder={T("proc.supplier")} value={pf.supplier} onChange={(e) => setPf({ ...pf, supplier: e.target.value })} className={input} />
            <input required placeholder={T("proc.item")} value={pf.item} onChange={(e) => setPf({ ...pf, item: e.target.value })} className={input} />
            <input required type="number" min={1} placeholder={T("proc.qty")} value={pf.qty} onChange={(e) => setPf({ ...pf, qty: e.target.value })} className={input + " w-24"} />
            <input required type="number" min={1} placeholder={T("proc.price")} value={pf.price} onChange={(e) => setPf({ ...pf, price: e.target.value })} className={input + " w-28"} />
            <button type="submit" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#5F6C61] hover:bg-[#5F6C61] cursor-pointer"><Plus className="w-4 h-4" />{T("proc.addpo")}</button>
          </form>
          <div className="space-y-2">
            {pos.map((p) => (
              <div key={p.id} className="bg-white rounded-lg border border-[#DCE4DC] p-3 md:p-4 flex flex-col md:flex-row md:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1F2A26]">{p.no} · {E(p.item)}</p>
                  <p className="text-[11px] font-bold text-[#56635B]">{E(p.supplier)} · {p.qty} × {money(p.price)} = {money(poTotal(p))}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border w-fit ${p.status === "received" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : p.status === "sent" ? "bg-amber-50 text-amber-800 border-amber-200" : "bg-[#E8EFE9] text-[#56635B] border-[#DCE4DC]"}`}>{T("proc.s." + p.status)}</span>
                <div className="flex gap-2">
                  <a href={whatsappLink(poText(p))} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100"><MessageCircle className="w-3.5 h-3.5" />{T("proc.wa")}</a>
                  {PO_NEXT[p.status] && <button type="button" onClick={() => poNext(p.id)} className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-white bg-[#5F6C61] hover:bg-[#5F6C61] cursor-pointer">{T("proc.to." + PO_NEXT[p.status])}</button>}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      {undo && (
        <div role="status" className="fixed z-40 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 bottom-20 md:bottom-6 flex items-center gap-3 rounded-lg bg-[#5F6C61] text-white text-xs font-semibold ps-4 pe-2 py-2 shadow-lg">
          <span>{T("proc.undoMsg")}</span>
          <button type="button" onClick={() => { data.restore(undo); setUndo(null); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/15 hover:bg-white/25 cursor-pointer"><Undo2 className="w-4 h-4" />{T("proc.undo")}</button>
          <button type="button" onClick={() => setUndo(null)} aria-label={T("proc.cancel")} className="p-1.5 cursor-pointer"><X className="w-4 h-4" /></button>
        </div>
      )}
    </main>
  );
}
