import { useState } from "react";
import { ChevronDown, Plus, Trash2, Check, Pencil, X } from "lucide-react";
import { tr_ as T } from "../i18n";
import { askConfirm } from "../lib/confirm";
import { useLibrary, libraryRepo, libraryIsCustom } from "../data/library";
import { BASIS_KEYS } from "../lib/autoBoq";
import { FINISH } from "./SpecFields";

const input = "h-9 px-2 rounded-lg border border-[#E2E8F0] text-xs font-bold text-[#0E2A47] bg-white min-w-0";
const blank = { cat: "", name: "", unit: "م²", terms: [], finishes: ["eco", "mid", "lux"] };

function Form({ init, onSave, onCancel }) {
  const [v, setV] = useState({ ...init, terms: init.terms.map((t) => [...t]) });
  const setTerm = (i, k, x) => setV({ ...v, terms: v.terms.map((t, j) => (j === i ? (k === 0 ? [x, t[1]] : [t[0], x]) : t)) });
  const toggle = (f) => setV({ ...v, finishes: v.finishes.includes(f) ? v.finishes.filter((x) => x !== f) : [...v.finishes, f] });
  const ok = v.cat.trim() && v.name.trim();
  return (
    <div className="rounded-xl border border-[#0B7C79] p-3 space-y-2 text-xs bg-white">
      <div className="flex flex-wrap gap-2">
        <input value={v.cat} onChange={(e) => setV({ ...v, cat: e.target.value })} placeholder={T("boq.cat")} className={input + " w-40"} />
        <input value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} placeholder={T("boq.name")} className={input + " flex-1 min-w-44"} />
        <input value={v.unit} onChange={(e) => setV({ ...v, unit: e.target.value })} placeholder={T("boq.unit")} className={input + " w-20"} />
      </div>
      <p className="font-bold text-[#475569]">{T("lib.formula")}</p>
      {v.terms.map((t, i) => (
        <div key={i} className="flex items-center gap-2">
          <input type="number" step="any" min={0} value={t[1]} onChange={(e) => setTerm(i, 1, e.target.value)} className={input + " w-20"} aria-label={T("lib.coef")} />
          <span>×</span>
          <select value={t[0]} onChange={(e) => setTerm(i, 0, e.target.value)} className={input + " flex-1"}>
            {BASIS_KEYS.map((b) => <option key={b} value={b}>{T("lib.b." + b)}</option>)}
          </select>
          <button type="button" onClick={() => setV({ ...v, terms: v.terms.filter((_, j) => j !== i) })} aria-label={T("cash.delete")} className="p-1.5 rounded-lg text-[#64748B] hover:text-rose-700 hover:bg-rose-50 cursor-pointer"><X className="w-4 h-4" /></button>
        </div>
      ))}
      <button type="button" onClick={() => setV({ ...v, terms: [...v.terms, [v.terms.length ? "area" : "area", 1]] })} className="inline-flex items-center gap-1 font-bold text-[#0B7C79] cursor-pointer"><Plus className="w-3.5 h-3.5" />{T("lib.addTerm")}</button>
      {v.terms.length === 0 && <p className="text-[11px] text-[#64748B]">{T("lib.noFormula")}</p>}
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-bold text-[#475569]">{T("lib.finishes")}</span>
        {FINISH.map((f) => <label key={f} className="inline-flex items-center gap-1"><input type="checkbox" checked={v.finishes.includes(f)} onChange={() => toggle(f)} />{T("spec.f." + f)}</label>)}
      </div>
      <div className="flex gap-2">
        <button type="button" disabled={!ok} onClick={() => onSave({ ...v, terms: v.terms.map(([b, c]) => [b, Number(c) || 0]) })} className="inline-flex items-center gap-1 px-3 h-9 rounded-lg text-white bg-[#0B7C79] font-bold disabled:opacity-40 cursor-pointer"><Check className="w-4 h-4" />{T("boq.save")}</button>
        <button type="button" onClick={onCancel} className="px-3 h-9 rounded-lg border border-[#E2E8F0] font-bold cursor-pointer">{T("boq.cancel")}</button>
      </div>
    </div>
  );
}

/** Edit the office's item library and the quantity formula of each item. */
export default function LibraryEditor() {
  const groups = useLibrary();
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null); // item name being edited, or "" for new
  const save = async (v) => { if (edit === "") await libraryRepo.add(v); else await libraryRepo.update(edit, v); setEdit(null); };
  const desc = (it) => (it.terms.length ? it.terms.map(([b, c]) => `${c}×${T("lib.b." + b)}`).join(" + ") : T("lib.manual"));
  return (
    <section className="bg-white rounded-2xl border border-[#E2E8F0]">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="w-full flex items-center justify-between gap-2 p-4 text-sm font-semibold text-[#0E2A47] cursor-pointer">
        {T("lib.title")}<ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3">
          <p className="text-[11px] text-[#64748B]">{T("lib.hint")}</p>
          <div className="flex gap-2">
            <button type="button" onClick={() => setEdit("")} className="inline-flex items-center gap-1.5 px-3 h-9 rounded-lg text-xs font-bold text-white bg-[#0B7C79] cursor-pointer"><Plus className="w-4 h-4" />{T("lib.add")}</button>
            {libraryIsCustom() && <button type="button" onClick={async () => { if (await askConfirm(T("lib.resetConfirm"))) libraryRepo.resetToDefaults(); }} className="px-3 h-9 rounded-lg text-xs font-bold border border-[#E2E8F0] cursor-pointer">{T("lib.reset")}</button>}
          </div>
          {edit === "" && <Form init={blank} onSave={save} onCancel={() => setEdit(null)} />}
          {groups.map((g) => (
            <div key={g.cat} className="space-y-1.5">
              <h3 className="text-xs font-bold text-[#475569]">{g.cat}</h3>
              {g.items.map((it) => edit === it.name ? <Form key={it.name} init={it} onSave={save} onCancel={() => setEdit(null)} /> : (
                <div key={it.name} className="flex flex-wrap items-center gap-2 text-xs border-t border-[#E2E8F0]/60 pt-1.5">
                  <span className="flex-1 min-w-44 font-semibold text-[#0E2A47]">{it.name} <span className="text-[#64748B] font-normal">({it.unit})</span></span>
                  <span className="text-[11px] text-[#64748B]">{desc(it)}</span>
                  <button type="button" onClick={() => setEdit(it.name)} aria-label={T("boq.edit")} className="p-1.5 rounded-lg text-[#64748B] hover:bg-[#F4F5F7] cursor-pointer"><Pencil className="w-4 h-4" /></button>
                  <button type="button" onClick={async () => { if (await askConfirm(T("lib.rmConfirm", { 0: it.name }))) libraryRepo.remove(it.name); }} aria-label={T("cash.delete")} className="p-1.5 rounded-lg text-[#64748B] hover:text-rose-700 hover:bg-rose-50 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
