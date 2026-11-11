import { useState } from "react";
import { HardHat, ShoppingCart, MessageCircle, Plus } from "lucide-react";
import { tr_ as T, E, money } from "../i18n";
import { subsStore, posStore } from "../data/stores";
import { poTotal, subBalance, procurementTotals } from "../lib/procurement";
import { whatsappLink } from "../lib/share";

const PO_NEXT = { draft: "sent", sent: "received" };
const input = "px-3 py-2 rounded-lg border border-[#E3E0D9] text-xs font-bold text-[#16181C] bg-white min-w-0";

/** Admin: subcontractor contracts & payments, and purchase orders sent to suppliers via WhatsApp. */
export default function Procurement() {
  const [subs, setSubs] = subsStore.use();
  const [pos, setPos] = posStore.use();
  const t = procurementTotals(subs, pos);
  const [sf, setSf] = useState({ name: "", trade: "", contract: "" });
  const [pf, setPf] = useState({ supplier: "", item: "", qty: "", price: "" });

  const addSub = (e) => {
    e.preventDefault();
    if (!sf.name.trim() || !Number(sf.contract)) return;
    setSubs((a) => [...a, { id: Date.now(), name: sf.name.trim(), trade: sf.trade.trim(), contract: Number(sf.contract), paid: 0 }]);
    setSf({ name: "", trade: "", contract: "" });
  };
  const paySub = (id, amt) => setSubs((a) => a.map((s) => (s.id === id ? { ...s, paid: Math.min(s.contract, s.paid + amt) } : s)));
  const addPo = (e) => {
    e.preventDefault();
    if (!pf.supplier.trim() || !pf.item.trim() || !Number(pf.qty) || !Number(pf.price)) return;
    setPos((a) => [{ id: Date.now(), no: "PO-" + String(a.length + 1).padStart(3, "0"), supplier: pf.supplier.trim(), item: pf.item.trim(), qty: Number(pf.qty), price: Number(pf.price), status: "draft" }, ...a]);
    setPf({ supplier: "", item: "", qty: "", price: "" });
  };
  const poNext = (id) => setPos((a) => a.map((p) => (p.id === id && PO_NEXT[p.status] ? { ...p, status: PO_NEXT[p.status] } : p)));
  const poText = (p) => T("proc.msg", { 0: p.no, 1: E(p.item), 2: `${p.qty}`, 3: money(poTotal(p)) });

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent pb-24 font-ibm w-full max-w-full overflow-x-hidden">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-[#16181C] flex items-center gap-2.5"><HardHat className="w-7 h-7" /><span>{T("proc.title")}</span></h1>
          <p className="text-xs md:text-sm text-[#5D6168] mt-1">{T("proc.sub")}</p>
        </div>

        <div className="grid stat-grid grid-cols-2 md:grid-cols-4 gap-3">
          {[["proc.k.subs", t.subContracts], ["proc.k.subout", t.subOutstanding], ["proc.k.poopen", t.poOpen], ["proc.k.poall", t.poAll]].map(([k, v]) => (
            <div key={k} className="bg-white rounded-lg p-4 border border-[#E3E0D9] text-center">
              <span className="text-[11px] font-bold text-[#5D6168] block mb-1">{T(k)}</span>
              <span className="text-lg md:text-xl font-black text-[#16181C]">{money(v, { compact: true })}</span>
            </div>
          ))}
        </div>

        <section className="space-y-3">
          <h2 className="text-base font-black text-[#16181C] flex items-center gap-2"><HardHat className="w-5 h-5" />{T("proc.subs")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {subs.map((s) => {
              const pctPaid = s.contract ? Math.round((s.paid / s.contract) * 100) : 0;
              return (
                <div key={s.id} className="bg-white rounded-lg border border-[#E3E0D9] p-4">
                  <div className="flex justify-between gap-2"><p className="text-sm font-extrabold text-[#16181C]">{E(s.name)}</p><span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#EEECE6] border border-[#E3E0D9] h-fit">{E(s.trade)}</span></div>
                  <div className="h-2 rounded-full bg-[#EEECE6] mt-3 overflow-hidden"><div className="h-full bg-[#2B3138]" style={{ width: pctPaid + "%" }} /></div>
                  <div className="flex justify-between text-[11px] font-bold text-[#5D6168] mt-2">
                    <span>{T("proc.paid")}: {money(s.paid, { compact: true })} / {money(s.contract, { compact: true })}</span>
                    <span>{T("proc.balance")}: {money(subBalance(s), { compact: true })}</span>
                  </div>
                  {subBalance(s) > 0 && (
                    <button type="button" onClick={() => paySub(s.id, Math.min(subBalance(s), Math.round(s.contract * 0.1)))} className="mt-3 px-3 py-1.5 rounded-lg text-[11px] font-bold text-white bg-[#2B3138] hover:bg-[#16181C] cursor-pointer">{T("proc.pay10")}</button>
                  )}
                </div>
              );
            })}
          </div>
          <form onSubmit={addSub} className="flex flex-wrap gap-2 items-end">
            <input required placeholder={T("proc.name")} value={sf.name} onChange={(e) => setSf({ ...sf, name: e.target.value })} className={input} />
            <input placeholder={T("proc.trade")} value={sf.trade} onChange={(e) => setSf({ ...sf, trade: e.target.value })} className={input + " w-28"} />
            <input required type="number" min={1} placeholder={T("proc.contract")} value={sf.contract} onChange={(e) => setSf({ ...sf, contract: e.target.value })} className={input + " w-36"} />
            <button type="submit" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#2B3138] hover:bg-[#16181C] cursor-pointer"><Plus className="w-4 h-4" />{T("proc.addsub")}</button>
          </form>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-black text-[#16181C] flex items-center gap-2"><ShoppingCart className="w-5 h-5" />{T("proc.pos")}</h2>
          <form onSubmit={addPo} className="flex flex-wrap gap-2 items-end">
            <input required placeholder={T("proc.supplier")} value={pf.supplier} onChange={(e) => setPf({ ...pf, supplier: e.target.value })} className={input} />
            <input required placeholder={T("proc.item")} value={pf.item} onChange={(e) => setPf({ ...pf, item: e.target.value })} className={input} />
            <input required type="number" min={1} placeholder={T("proc.qty")} value={pf.qty} onChange={(e) => setPf({ ...pf, qty: e.target.value })} className={input + " w-24"} />
            <input required type="number" min={1} placeholder={T("proc.price")} value={pf.price} onChange={(e) => setPf({ ...pf, price: e.target.value })} className={input + " w-28"} />
            <button type="submit" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#2B3138] hover:bg-[#16181C] cursor-pointer"><Plus className="w-4 h-4" />{T("proc.addpo")}</button>
          </form>
          <div className="space-y-2">
            {pos.map((p) => (
              <div key={p.id} className="bg-white rounded-lg border border-[#E3E0D9] p-3 md:p-4 flex flex-col md:flex-row md:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-extrabold text-[#16181C]">{p.no} · {E(p.item)}</p>
                  <p className="text-[11px] font-bold text-[#5D6168]">{E(p.supplier)} · {p.qty} × {money(p.price)} = {money(poTotal(p))}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border w-fit ${p.status === "received" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : p.status === "sent" ? "bg-amber-50 text-amber-800 border-amber-200" : "bg-[#EEECE6] text-[#5D6168] border-[#E3E0D9]"}`}>{T("proc.s." + p.status)}</span>
                <div className="flex gap-2">
                  <a href={whatsappLink(poText(p))} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100"><MessageCircle className="w-3.5 h-3.5" />{T("proc.wa")}</a>
                  {PO_NEXT[p.status] && <button type="button" onClick={() => poNext(p.id)} className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-white bg-[#2B3138] hover:bg-[#16181C] cursor-pointer">{T("proc.to." + PO_NEXT[p.status])}</button>}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
