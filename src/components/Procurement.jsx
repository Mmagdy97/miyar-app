import { useState } from "react";
import { HardHat, ShoppingCart, MessageCircle, Plus, Pencil, Trash2, Undo2, Check, X, Scale, Award, AlertTriangle } from "lucide-react";
import { tr_ as T, E, money } from "../i18n";
import { subsStore, posStore, quotesStore, boqStore } from "../data/stores";
import { poTotal, subBalance, procurementTotals, subPayments, addPayment, editPayment, removePayment, compareQuotes, committedCost } from "../lib/procurement";
import { boqRepo, boqTotals } from "../data/boq";
import { askConfirm } from "../lib/confirm";
import { whatsappLink } from "../lib/share";
import { procurementRepo } from "../data/procurement";
import { projectsStore, useProjectList } from "../data/projects";

const PO_NEXT = { draft: "sent", sent: "received" };
const input = "px-3 py-2 rounded-lg border border-[#E4DDCE] text-xs font-bold text-[#0E1A1B] bg-white min-w-0";

function useDemoData() {
  const [subs, setSubs] = subsStore.use();
  const [pos, setPos] = posStore.use();
  const [quotes, setQuotes] = quotesStore.use();
  const [boq] = boqStore.use();
  const newPo = (a, po) => [{ id: Date.now(), no: "PO-" + String(a.length + 1).padStart(3, "0"), ...po, status: "draft" }, ...a];
  return {
    subs, pos, quotes, canUndo: true, restore: setSubs,
    budget: () => boqTotals(boq).cost,
    addQuote: (q) => setQuotes((a) => [...a, { id: Date.now(), ...q, status: "open" }]),
    delQuote: (id) => setQuotes((a) => a.filter((x) => x.id !== id)),
    award: (q, group) => {
      const ids = new Set(group.map((x) => x.id));
      setQuotes((a) => a.map((x) => (x.id === q.id ? { ...x, status: "awarded" } : ids.has(x.id) && x.status === "open" ? { ...x, status: "rejected" } : x)));
      setPos((a) => newPo(a, { projectId: q.projectId ?? null, supplier: q.supplier, item: q.item, qty: q.qty, price: q.price }));
    },
    addSub: (v) => setSubs((a) => [...a, { id: Date.now(), ...v, paid: 0 }]),
    pay: (id, amt) => setSubs((a) => a.map((s) => (s.id === id ? addPayment(s, amt) : s))),
    editPay: (id, pid, v) => setSubs((a) => a.map((s) => (s.id === id ? editPayment(s, pid, v) : s))),
    delPay: (id, pid) => setSubs((a) => a.map((s) => (s.id === id ? removePayment(s, pid) : s))),
    addPo: (po) => setPos((a) => newPo(a, po)),
    poNext: (id, status) => setPos((a) => a.map((p) => (p.id === id ? { ...p, status } : p))),
  };
}

function useLiveData() {
  const { subs, pos, quotes } = procurementRepo.use();
  const boq = boqRepo.use();
  const sub = (id) => subs.find((s) => s.id === id);
  return {
    subs, pos, quotes, canUndo: false, restore: () => {},
    budget: (pid) => boqTotals(pid == null ? boq : boq.filter((i) => i.projectId === pid)).cost,
    addQuote: (q) => procurementRepo.addQuote(q),
    delQuote: (id) => procurementRepo.delQuote(id),
    award: (q, group) => procurementRepo.award(q, group, pos.length),
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
  const projects = useProjectList();
  const [pid, setPid] = useState(null); // null = all projects
  const inP = (x) => pid == null || x.projectId === pid;
  const subs = data.subs.filter(inP);
  const pos = data.pos.filter(inP);
  const quotes = (data.quotes || []).filter(inP);
  const t = procurementTotals(subs, pos);
  const cc = committedCost(data.budget(pid), subs, pos);
  const groups = compareQuotes(quotes);
  const [qf, setQf] = useState({ item: "", qty: "", supplier: "", price: "", leadDays: "" });
  const addQuote = (e) => {
    e.preventDefault();
    if (!qf.item.trim() || !qf.supplier.trim() || !Number(qf.qty) || qf.price === "") return;
    data.addQuote({ projectId: pid, item: qf.item.trim(), qty: Number(qf.qty), supplier: qf.supplier.trim(), price: Number(qf.price), leadDays: qf.leadDays === "" ? null : Number(qf.leadDays) });
    setQf({ ...qf, supplier: "", price: "", leadDays: "" });
  };
  const award = async (q, g) => { if (await askConfirm(T("rfq.awardConfirm", { s: E(q.supplier), t: money(q.total) }), { yes: T("rfq.award") })) data.award(q, g.quotes); };
  const [sf, setSf] = useState({ name: "", trade: "", contract: "" });
  const [pf, setPf] = useState({ supplier: "", item: "", qty: "", price: "" });

  const addSub = (e) => {
    e.preventDefault();
    if (!sf.name.trim() || !Number(sf.contract)) return;
    data.addSub({ name: sf.name.trim(), trade: sf.trade.trim(), contract: Number(sf.contract), projectId: pid });
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
    data.addPo({ supplier: pf.supplier.trim(), item: pf.item.trim(), qty: Number(pf.qty), price: Number(pf.price), projectId: pid });
    setPf({ supplier: "", item: "", qty: "", price: "" });
  };
  const poNext = (id) => { const p = pos.find((x) => x.id === id); if (p && PO_NEXT[p.status]) data.poNext(id, PO_NEXT[p.status]); };
  const poText = (p) => T("proc.msg", { 0: p.no, 1: E(p.item), 2: `${p.qty}`, 3: money(poTotal(p)) });

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent pb-24 font-ibm w-full max-w-full overflow-x-hidden">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-[#0E1A1B] flex items-center gap-2.5"><HardHat className="w-7 h-7" /><span>{T("proc.title")}</span></h1>
          <p className="text-xs md:text-sm text-[#4A5757] mt-1">{T("proc.sub")}</p>
        </div>

        {projects.length > 0 && (
          <select value={pid ?? ""} onChange={(e) => setPid(e.target.value === "" ? null : Number(e.target.value))} aria-label={T("rfq.project")} className={input + " max-w-md w-full"}>
            <option value="">{T("rfq.allProjects")}</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{E(p.name)}</option>)}
          </select>
        )}

        <section className="bg-white rounded-2xl border border-[#E4DDCE] p-4 space-y-3">
          <h2 className="text-sm font-semibold text-[#0E1A1B]">{T("cc.title")}</h2>
          <div className="grid stat-grid grid-cols-2 md:grid-cols-4 gap-3">
            {[["cc.budget", cc.budget], ["cc.committed", cc.committed], ["cc.spent", cc.spent], ["cc.left", cc.uncommitted]].map(([k, v]) => (
              <div key={k} className="rounded-lg p-3 bg-[#F6F3EC] text-center">
                <span className="text-[11px] font-bold text-[#4A5757] block mb-1">{T(k)}</span>
                <span className={`text-base md:text-lg font-semibold tabular-nums ${k === "cc.left" && v < 0 ? "text-rose-700" : "text-[#0E1A1B]"}`}>{money(v, { compact: true })}</span>
              </div>
            ))}
          </div>
          {cc.budget > 0 && <div className="h-2 rounded-full bg-[#EFE9DC] overflow-hidden"><div className={`h-full ${cc.over ? "bg-rose-600" : "bg-[#2E6F73]"}`} style={{ width: Math.min(100, cc.pct) + "%" }} /></div>}
          <p className={`text-[11px] font-bold flex items-center gap-1.5 ${cc.over ? "text-rose-700" : "text-[#64706F]"}`}>{cc.over && <AlertTriangle className="w-4 h-4" aria-hidden="true" />}{cc.budget > 0 ? T(cc.over ? "cc.over" : "cc.pct", { n: cc.pct }) : T("cc.noBudget")}</p>
        </section>

        <div className="grid stat-grid grid-cols-2 md:grid-cols-4 gap-3">
          {[["proc.k.subs", t.subContracts], ["proc.k.subout", t.subOutstanding], ["proc.k.poopen", t.poOpen], ["proc.k.poall", t.poAll]].map(([k, v]) => (
            <div key={k} className="bg-white rounded-lg p-4 border border-[#E4DDCE] text-center">
              <span className="text-[11px] font-bold text-[#4A5757] block mb-1">{T(k)}</span>
              <span className="text-lg md:text-xl font-semibold text-[#0E1A1B]">{money(v, { compact: true })}</span>
            </div>
          ))}
        </div>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-[#0E1A1B] flex items-center gap-2"><HardHat className="w-5 h-5" />{T("proc.subs")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {subs.map((s) => {
              const pctPaid = s.contract ? Math.round((s.paid / s.contract) * 100) : 0;
              return (
                <div key={s.id} className="bg-white rounded-lg border border-[#E4DDCE] p-4">
                  <div className="flex justify-between gap-2"><p className="text-sm font-semibold text-[#0E1A1B]">{E(s.name)}</p><span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#EFE9DC] border border-[#E4DDCE] h-fit">{E(s.trade)}</span></div>
                  <div className="h-2 rounded-full bg-[#EFE9DC] mt-3 overflow-hidden"><div className="h-full bg-[#2E6F73]" style={{ width: pctPaid + "%" }} /></div>
                  <div className="flex justify-between text-[11px] font-bold text-[#4A5757] mt-2">
                    <span>{T("proc.paid")}: {money(s.paid, { compact: true })} / {money(s.contract, { compact: true })}</span>
                    <span>{T("proc.balance")}: {money(subBalance(s), { compact: true })}</span>
                  </div>
                  <div className="mt-3 border-t border-[#E4DDCE] pt-3 space-y-2">
                    <p className="text-[11px] font-bold text-[#4A5757]">{T("proc.payHist")}</p>
                    {subPayments(s).length === 0 && <p className="text-[11px] text-[#64706F]">{T("proc.noPay")}</p>}
                    {subPayments(s).map((p) => (
                      <div key={p.id} className="flex items-center gap-2 text-xs">
                        <span className="text-[#64706F] tabular-nums w-20 shrink-0">{p.date || T("proc.opening")}</span>
                        {editing && editing.sid === s.id && editing.pid === p.id ? (
                          <>
                            <input type="number" min={1} value={editing.v} autoFocus onChange={(e) => setEditing({ ...editing, v: e.target.value })} className={input + " w-28"} />
                            <button type="button" onClick={savePay} aria-label={T("proc.save")} className="p-2 rounded-lg bg-[#2E6F73] text-white cursor-pointer"><Check className="w-4 h-4" /></button>
                            <button type="button" onClick={() => setEditing(null)} aria-label={T("proc.cancel")} className="p-2 rounded-lg border border-[#E4DDCE] cursor-pointer"><X className="w-4 h-4" /></button>
                          </>
                        ) : (
                          <>
                            <span className="flex-1 font-bold text-[#0E1A1B] tabular-nums">{money(p.amount)}</span>
                            <button type="button" onClick={() => setEditing({ sid: s.id, pid: p.id, v: p.amount })} aria-label={T("proc.edit")} className="p-2 rounded-lg text-[#4A5757] hover:bg-[#EFE9DC] cursor-pointer"><Pencil className="w-4 h-4" /></button>
                            <button type="button" onClick={() => delPay(s.id, p.id)} aria-label={T("proc.del")} className="p-2 rounded-lg text-[#B23A2B] hover:bg-[#EFE9DC] cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                          </>
                        )}
                      </div>
                    ))}
                    {subBalance(s) > 0 && (
                      <form onSubmit={(e) => { e.preventDefault(); paySub(s.id, payIn[s.id]); setPayIn({ ...payIn, [s.id]: "" }); }} className="flex flex-wrap gap-2 pt-1">
                        <input type="number" min={1} max={subBalance(s)} placeholder={T("proc.payAmt")} value={payIn[s.id] || ""} onChange={(e) => setPayIn({ ...payIn, [s.id]: e.target.value })} className={input + " flex-1 w-32"} />
                        <button type="submit" className="px-3 py-2 rounded-lg text-xs font-bold text-white bg-[#2E6F73] cursor-pointer">{T("proc.record")}</button>
                        <button type="button" onClick={() => paySub(s.id, Math.round(s.contract * 0.1))} className="px-3 py-2 rounded-lg text-xs font-bold border border-[#E4DDCE] text-[#0E1A1B] cursor-pointer">10%</button>
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
            <button type="submit" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#2E6F73] hover:bg-[#2E6F73] cursor-pointer"><Plus className="w-4 h-4" />{T("proc.addsub")}</button>
          </form>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-[#0E1A1B] flex items-center gap-2"><Scale className="w-5 h-5" />{T("rfq.title")}</h2>
          <p className="text-[11px] text-[#64706F]">{T("rfq.hint")}</p>
          <form onSubmit={addQuote} className="flex flex-wrap gap-2 items-end">
            <input required placeholder={T("proc.item")} value={qf.item} onChange={(e) => setQf({ ...qf, item: e.target.value })} className={input + " flex-1 min-w-40"} />
            <input required type="number" min={0} step="any" placeholder={T("proc.qty")} value={qf.qty} onChange={(e) => setQf({ ...qf, qty: e.target.value })} className={input + " w-24"} />
            <input required placeholder={T("proc.supplier")} value={qf.supplier} onChange={(e) => setQf({ ...qf, supplier: e.target.value })} className={input + " w-40"} />
            <input required type="number" min={0} step="any" placeholder={T("proc.price")} value={qf.price} onChange={(e) => setQf({ ...qf, price: e.target.value })} className={input + " w-28"} />
            <input type="number" min={0} placeholder={T("rfq.lead")} value={qf.leadDays} onChange={(e) => setQf({ ...qf, leadDays: e.target.value })} className={input + " w-28"} />
            <button type="submit" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#2E6F73] hover:bg-[#245A5E] cursor-pointer"><Plus className="w-4 h-4" />{T("rfq.add")}</button>
          </form>
          {groups.length === 0 && <p className="text-xs text-[#64706F]">{T("rfq.none")}</p>}
          {groups.map((g) => (
            <div key={g.key} className="bg-white rounded-lg border border-[#E4DDCE] p-4 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-[#0E1A1B] flex-1">{E(g.item)} <span className="text-[11px] font-bold text-[#64706F]">· {T("rfq.count", { n: g.quotes.length })}</span></p>
                {g.awarded && <span className="text-[10px] font-bold px-2 py-0.5 rounded-md border bg-emerald-50 text-emerald-700 border-emerald-200">{T("rfq.awardedTo", { s: E(g.awarded.supplier) })}</span>}
              </div>
              {g.quotes.map((q) => (
                <div key={q.id} className={`flex flex-wrap items-center gap-2 text-xs rounded-lg p-2 ${q.status === "awarded" ? "bg-emerald-50" : q.status === "rejected" ? "opacity-60" : q.best ? "bg-[#F6F3EC]" : ""}`}>
                  <span className="flex-1 min-w-32 font-semibold text-[#0E1A1B]">{E(q.supplier)}{q.leadDays != null && <span className="text-[11px] font-normal text-[#64706F]"> · {T("rfq.days", { n: q.leadDays })}</span>}</span>
                  <span className="text-[#4A5757] tabular-nums">{q.qty} × {money(q.price)}</span>
                  <span className="font-semibold tabular-nums w-24 text-end">{money(q.total)}</span>
                  <span className={`w-40 text-end text-[11px] font-bold ${q.best ? "text-emerald-700" : "text-[#4A5757]"}`}>{[q.best ? T("rfq.best") : "+" + money(q.diff), q.status === "awarded" && T("rfq.awarded"), q.status === "rejected" && T("rfq.rejected")].filter(Boolean).join(" · ")}</span>
                  {!g.awarded && q.status === "open" && <button type="button" onClick={() => award(q, g)} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-white bg-[#2E6F73] cursor-pointer"><Award className="w-3.5 h-3.5" aria-hidden="true" />{T("rfq.award")}</button>}
                  {!g.awarded && <button type="button" onClick={() => data.delQuote(q.id)} aria-label={T("proc.del")} className="p-1.5 rounded-lg text-[#64706F] hover:text-rose-700 hover:bg-rose-50 cursor-pointer"><Trash2 className="w-4 h-4" /></button>}
                </div>
              ))}
            </div>
          ))}
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-[#0E1A1B] flex items-center gap-2"><ShoppingCart className="w-5 h-5" />{T("proc.pos")}</h2>
          <form onSubmit={addPo} className="flex flex-wrap gap-2 items-end">
            <input required placeholder={T("proc.supplier")} value={pf.supplier} onChange={(e) => setPf({ ...pf, supplier: e.target.value })} className={input} />
            <input required placeholder={T("proc.item")} value={pf.item} onChange={(e) => setPf({ ...pf, item: e.target.value })} className={input} />
            <input required type="number" min={1} placeholder={T("proc.qty")} value={pf.qty} onChange={(e) => setPf({ ...pf, qty: e.target.value })} className={input + " w-24"} />
            <input required type="number" min={1} placeholder={T("proc.price")} value={pf.price} onChange={(e) => setPf({ ...pf, price: e.target.value })} className={input + " w-28"} />
            <button type="submit" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#2E6F73] hover:bg-[#2E6F73] cursor-pointer"><Plus className="w-4 h-4" />{T("proc.addpo")}</button>
          </form>
          <div className="space-y-2">
            {pos.map((p) => (
              <div key={p.id} className="bg-white rounded-lg border border-[#E4DDCE] p-3 md:p-4 flex flex-col md:flex-row md:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#0E1A1B]">{p.no} · {E(p.item)}</p>
                  <p className="text-[11px] font-bold text-[#4A5757]">{E(p.supplier)} · {p.qty} × {money(p.price)} = {money(poTotal(p))}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border w-fit ${p.status === "received" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : p.status === "sent" ? "bg-amber-50 text-amber-800 border-amber-200" : "bg-[#EFE9DC] text-[#4A5757] border-[#E4DDCE]"}`}>{T("proc.s." + p.status)}</span>
                <div className="flex gap-2">
                  <a href={whatsappLink(poText(p))} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100"><MessageCircle className="w-3.5 h-3.5" />{T("proc.wa")}</a>
                  {PO_NEXT[p.status] && <button type="button" onClick={() => poNext(p.id)} className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-white bg-[#2E6F73] hover:bg-[#2E6F73] cursor-pointer">{T("proc.to." + PO_NEXT[p.status])}</button>}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      {undo && (
        <div role="status" className="fixed z-40 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 bottom-20 md:bottom-6 flex items-center gap-3 rounded-lg bg-[#2E6F73] text-white text-xs font-semibold ps-4 pe-2 py-2 shadow-lg">
          <span>{T("proc.undoMsg")}</span>
          <button type="button" onClick={() => { data.restore(undo); setUndo(null); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/15 hover:bg-white/25 cursor-pointer"><Undo2 className="w-4 h-4" />{T("proc.undo")}</button>
          <button type="button" onClick={() => setUndo(null)} aria-label={T("proc.cancel")} className="p-1.5 cursor-pointer"><X className="w-4 h-4" /></button>
        </div>
      )}
    </main>
  );
}
