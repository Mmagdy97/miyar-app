import { useState } from "react";
import { History, Save, RotateCcw, Trash2, GitCompare } from "lucide-react";
import { tr_ as T, money } from "../i18n";
import { askConfirm } from "../lib/confirm";
import { boqTotals } from "../data/boq";
import { diffVersions, restorePlan, snapshot } from "../lib/boqVersions";

const input = "px-3 py-2 rounded-lg border border-[#E2E8F0] text-xs font-bold text-[#0E2A47] bg-white min-w-0";
const ib = "inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold border border-[#E2E8F0] cursor-pointer hover:bg-[#F4F5F7]";
const signed = (v) => (v > 0 ? "+" : v < 0 ? "−" : "") + money(Math.abs(v));

/**
 * Frozen copies of a BOQ: save, compare with the current one, restore.
 * repo = { list: Version[], save(v), remove(id), restore(plan) }; keep = ids that must not be removed (they have actual costs).
 */
export default function BoqVersions({ items, repo, keep = new Set(), canEdit = true }) {
  const [label, setLabel] = useState("");
  const [open, setOpen] = useState(null);
  const [busy, setBusy] = useState(false);
  const list = repo.list;
  const save = async (e) => {
    e.preventDefault();
    if (!items.length || busy) return;
    setBusy(true);
    const t = boqTotals(items);
    await repo.save({ label: label.trim() || T("ver.default", { n: list.length + 1 }), items: snapshot(items), cost: t.cost, price: t.price });
    setLabel(""); setBusy(false);
  };
  const restore = async (v) => {
    const plan = restorePlan(items, v.items, keep);
    const msg = T("ver.restoreConfirm", { name: v.label }) + (plan.kept.length ? " " + T("ver.kept", { n: plan.kept.length }) : "");
    if (!(await askConfirm(msg, { yes: T("ver.restore"), danger: true }))) return;
    setBusy(true); await repo.restore(plan); setBusy(false); setOpen(null);
  };
  const remove = async (v) => { if (await askConfirm(T("ver.delConfirm", { name: v.label }), { yes: T("ver.del"), danger: true })) repo.remove(v.id); };
  const cur = boqTotals(items);
  return (
    <section className="bg-white rounded-2xl border border-[#E2E8F0] px-4 py-3 space-y-2">
      {/* Compact single row: title, version name, save; the hint lives in the tooltip. */}
      <div className="flex flex-wrap items-center gap-2">
        <h2 title={T("ver.hint")} className="text-sm font-semibold text-[#0E2A47] flex items-center gap-2 me-auto"><History className="w-4 h-4" aria-hidden="true" />{T("ver.title")}
          <span className="text-[11px] font-medium text-[#64748B]">{list.length ? T("ver.count", { n: list.length }) : T("ver.none")}</span>
        </h2>
        {canEdit && (
          <form onSubmit={save} className="flex items-center gap-2 flex-1 sm:flex-none min-w-0">
            <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder={T("ver.default", { n: list.length + 1 })} aria-label={T("ver.label")} className={input + " flex-1 sm:w-56"} />
            <button type="submit" disabled={!items.length || busy} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-white bg-[#0B7C79] hover:bg-[#086663] disabled:opacity-40 cursor-pointer whitespace-nowrap"><Save className="w-4 h-4" aria-hidden="true" />{T("ver.save")}</button>
          </form>
        )}
      </div>
      <div className="space-y-2">
        {list.map((v) => {
          const d = open === v.id ? diffVersions(v.items, items) : null;
          return (
            <div key={v.id} className="border border-[#E0F2F1] rounded-xl p-3 space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="flex-1 min-w-32"><b className="text-[#0E2A47]">{v.label}</b><span className="block text-[11px] text-[#64748B]">{String(v.at || "").slice(0, 10)} · {T("ver.items", { n: v.items.length })}</span></span>
                <span className="tabular-nums font-semibold">{money(v.price)}</span>
                <span className="w-28 text-end text-[11px] font-bold text-[#475569] tabular-nums" title={T("ver.vsNow")}>{T("ver.now")} {signed(cur.price - v.price)}</span>
                <button type="button" onClick={() => setOpen(open === v.id ? null : v.id)} aria-expanded={open === v.id} className={ib}><GitCompare className="w-3.5 h-3.5" aria-hidden="true" />{T("ver.compare")}</button>
                {canEdit && <button type="button" disabled={busy} onClick={() => restore(v)} className={ib}><RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />{T("ver.restore")}</button>}
                {canEdit && <button type="button" onClick={() => remove(v)} aria-label={T("ver.del")} title={T("ver.del")} className="p-1.5 rounded-lg text-[#64748B] hover:text-rose-700 hover:bg-rose-50 cursor-pointer"><Trash2 className="w-4 h-4" /></button>}
              </div>
              {d && (
                <div className="text-[11px] space-y-1 border-t border-[#E0F2F1] pt-2">
                  <p className="font-bold text-[#475569]">{T("ver.diffHead", { name: v.label })} · {T("boq.cost")} {signed(d.delta.cost)} · {T("boq.price")} {signed(d.delta.price)} · {T("boq.profit")} {signed(d.delta.profit)}</p>
                  {!d.added.length && !d.removed.length && !d.changed.length && <p className="text-[#64748B]">{T("ver.same")}</p>}
                  {d.added.map((i) => <p key={"a" + i.id} className="text-emerald-700">+ {i.name} · {i.quantity} {i.unit}</p>)}
                  {d.removed.map((i) => <p key={"r" + i.id} className="text-rose-700">− {i.name} · {i.quantity} {i.unit}</p>)}
                  {d.changed.map(({ before: b, after: a }) => (
                    <p key={"c" + a.id} className="text-[#0E2A47]">~ {a.name}: {b.quantity !== a.quantity && `${T("boq.qty")} ${b.quantity} → ${a.quantity} `}{b.unitCost !== a.unitCost && `${T("boq.unitCost")} ${money(b.unitCost)} → ${money(a.unitCost)} `}{b.margin !== a.margin && `${T("boq.margin")} ${b.margin}% → ${a.margin}%`}</p>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
