import { useState } from "react";
import { Plus, Trash2, AlertTriangle } from "lucide-react";
import { tr_ as T, money } from "../i18n";
import { boqRepo } from "../data/boq";
import { projectVariance } from "../lib/variance";

const input = "h-9 px-2 rounded-lg border border-[#E4DDCE] text-xs font-bold text-[#0E1A1B] bg-white min-w-0";
const TONE = { ok: "bg-[#2E6F73]", warn: "bg-amber-500", over: "bg-rose-600", none: "bg-[#2E6F73]" };

function Line({ r, actuals }) {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ amount: "", qty: "", note: "" });
  const mine = actuals[r.item.id] || [];
  const add = (e) => {
    e.preventDefault();
    if (!Number(f.amount)) return;
    boqRepo.addActual({ itemId: r.item.id, amount: Number(f.amount), qty: Number(f.qty) || 0, note: f.note.trim() });
    setF({ amount: "", qty: "", note: "" });
  };
  const pct = Number.isFinite(r.pct) ? Math.round(r.pct * 100) : 999;
  return (
    <article className="bg-white rounded-xl border border-[#E4DDCE] p-3 space-y-2 text-xs">
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex-1 min-w-44 font-semibold text-[#0E1A1B]">{r.item.name}{(r.level === "warn" || r.level === "over") && <AlertTriangle className={`inline w-3.5 h-3.5 ms-1.5 ${r.level === "over" ? "text-rose-600" : "text-amber-600"}`} aria-label={T("act.alert")} />}</span>
        <span className="tabular-nums text-[#4A5757]">{money(r.actual, { compact: true })} / {money(r.budget, { compact: true })}</span>
        <span className={`tabular-nums font-bold w-14 text-end ${r.level === "over" ? "text-rose-700" : r.level === "warn" ? "text-amber-700" : "text-[#0E1A1B]"}`}>{pct}%</span>
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="px-3 h-8 rounded-lg border border-[#E4DDCE] font-bold cursor-pointer">{T("act.record")}</button>
      </div>
      <div className="h-1.5 rounded-full bg-[#EFE9DC] overflow-hidden"><div className={`h-full ${TONE[r.level]}`} style={{ width: `${Math.min(100, pct)}%` }} /></div>
      {open && (
        <div className="space-y-2 pt-1">
          {mine.map((a) => (
            <div key={a.id} className="flex items-center gap-2 border-t border-[#ECE5D6] pt-1.5">
              <span className="flex-1 min-w-0 truncate">{a.note || "—"}{a.source === "cash" && <span className="text-[#64706F]"> · {T("act.fromCash")}</span>}</span>
              {a.qty > 0 && <span className="tabular-nums text-[#64706F]">{a.qty} {r.item.unit}</span>}
              <span className="tabular-nums font-semibold">{money(a.amount)}</span>
              {a.source === "direct" && <button type="button" onClick={() => boqRepo.removeActual(a.id)} aria-label={T("cash.delete")} className="p-1 rounded text-[#64706F] hover:text-rose-700 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>}
            </div>
          ))}
          <form onSubmit={add} className="flex flex-wrap gap-2">
            <input value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} placeholder={T("act.note")} className={input + " flex-1 min-w-32"} />
            <input type="number" min={0} step="any" value={f.qty} onChange={(e) => setF({ ...f, qty: e.target.value })} placeholder={T("boq.qty")} className={input + " w-24"} />
            <input required type="number" min={1} step="any" value={f.amount} onChange={(e) => setF({ ...f, amount: e.target.value })} placeholder={T("inv.amount")} className={input + " w-28"} />
            <button type="submit" className="inline-flex items-center gap-1 px-3 h-9 rounded-lg text-white bg-[#2E6F73] font-bold cursor-pointer"><Plus className="w-4 h-4" />{T("boq.add")}</button>
          </form>
        </div>
      )}
    </article>
  );
}

/** Budget (BOQ cost) vs actual spend per item, with 90% / over-budget alerts. */
export default function BoqVsActual({ items }) {
  const actuals = boqRepo.actuals();
  const v = projectVariance(items, actuals);
  const cards = [["act.budget", v.budget], ["act.actual", v.actual], [v.diff > 0 ? "act.over" : "act.left", Math.abs(v.diff)]];
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold text-[#0E1A1B]">{T("act.title")}{v.alerts > 0 && <span className="ms-2 text-[11px] font-bold text-rose-700">· {T("act.alerts", { 0: v.alerts })}</span>}</h2>
      <div className="grid grid-cols-3 gap-3">
        {cards.map(([k, n]) => (
          <div key={k} className="bg-white rounded-lg p-4 border border-[#E4DDCE] text-center">
            <span className="text-[11px] font-bold text-[#4A5757] block mb-1">{T(k)}</span>
            <span className={`text-lg font-semibold ${k === "act.over" ? "text-rose-700" : "text-[#0E1A1B]"}`}>{money(n, { compact: true })}</span>
          </div>
        ))}
      </div>
      {v.rows.map((r) => <Line key={r.item.id} r={r} actuals={actuals} />)}
    </section>
  );
}
