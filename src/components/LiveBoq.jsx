import { useEffect, useRef, useState } from "react";
import EmptyState from "./EmptyState";
import { Plus, Trash2, ClipboardCheck, Pencil, Check, X } from "lucide-react";
import { tr_ as T, E, money } from "../i18n";
import { useProjectList, updateProjectSpec } from "../data/projects";
import { pricesRepo, priceFor } from "../data/prices";
import SpecFields from "./SpecFields";
import PriceList from "./PriceList";
import { BOQ_LIBRARY } from "../data/boqLibrary";
import { generateBoq } from "../lib/autoBoq";
import { boqRepo, boqTotals, itemPrice, applyAutoBoq } from "../data/boq";

const input = "px-3 py-2 rounded-lg border border-[#E0D6C2] text-xs font-bold text-[#1E223D] bg-white min-w-0";
const empty = { category: "", name: "", unit: "", quantity: "", unitCost: "", margin: "20" };

function Row({ i }) {
  const [e, setE] = useState(null);
  const set = (k) => (ev) => setE({ ...e, [k]: ev.target.value });
  const save = () => {
    if (!e.name.trim() || !Number(e.quantity)) return;
    boqRepo.update(i.id, { category: e.category.trim(), name: e.name.trim(), unit: e.unit.trim(), quantity: Number(e.quantity), unitCost: Number(e.unitCost) || 0, margin: Number(e.margin) || 0 });
    setE(null);
  };
  const ib = "p-1.5 rounded-lg text-[#666B86] hover:bg-[#F6F1E7] cursor-pointer";
  if (e) return (
    <article className="bg-white rounded-xl border border-[#2B3052] p-3 flex flex-wrap items-center gap-2 text-xs">
      <input value={e.category} onChange={set("category")} placeholder={T("boq.cat")} className={input + " w-32"} />
      <input value={e.name} onChange={set("name")} className={input + " flex-1 min-w-40"} />
      <input value={e.unit} onChange={set("unit")} className={input + " w-20"} />
      <input type="number" min={0} step="any" value={e.quantity} onChange={set("quantity")} className={input + " w-20"} />
      <input type="number" min={0} step="any" value={e.unitCost} onChange={set("unitCost")} className={input + " w-24"} />
      <input type="number" min={0} step="any" value={e.margin} onChange={set("margin")} className={input + " w-16"} />
      <button type="button" onClick={save} aria-label={T("boq.save")} className={ib + " text-[#2B3052]"}><Check className="w-4 h-4" /></button>
      <button type="button" onClick={() => setE(null)} aria-label={T("boq.cancel")} className={ib}><X className="w-4 h-4" /></button>
    </article>
  );
  return (
    <article className="bg-white rounded-xl border border-[#E0D6C2] p-3 flex flex-wrap items-center gap-3 text-xs">
      <span className="flex-1 min-w-48 font-semibold text-[#1E223D]">{i.name}{i.note === "auto" && <span className="ms-2 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#F6F1E7] text-[#4F5470] border border-[#E0D6C2]">{T("boq.auto")}</span>}</span>
      <span className="text-[#4F5470] tabular-nums">{i.quantity} {i.unit} × {money(i.unitCost)}</span>
      <span className="text-[#666B86]">+{i.margin}%</span>
      <span className="font-semibold tabular-nums text-[#1E223D]">{money(itemPrice(i))}</span>
      <button type="button" onClick={() => setE({ ...i })} aria-label={T("boq.edit")} className={ib}><Pencil className="w-4 h-4" /></button>
      <button type="button" onClick={() => boqRepo.remove(i.id)} aria-label={T("cash.delete")} className={ib + " hover:text-rose-700 hover:bg-rose-50"}><Trash2 className="w-4 h-4" /></button>
    </article>
  );
}

/** Staff of a real office: bill of quantities per project. */
export default function LiveBoq() {
  const projects = useProjectList();
  const all = boqRepo.use();
  const [pid, setPid] = useState(null);
  const [f, setF] = useState(empty);
  const prices = pricesRepo.use();
  const [spec, setSpec] = useState(null);
  const [specMsg, setSpecMsg] = useState("");
  const qtyRef = useRef(null);
  const [picked, setPicked] = useState(false);
  const project = projects.find((p) => p.id === pid) || projects[0];
  useEffect(() => { setSpec(project ? { ...project.spec } : null); setSpecMsg(""); }, [project?.id]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!project) return <main className="flex-1 flex items-center justify-center p-8 font-ibm"><p className="text-sm text-[#4F5470] bg-white rounded-xl border border-[#E0D6C2] p-8 text-center max-w-sm">{T("proj.none")}</p></main>;
  const rows = all.filter((i) => i.projectId === project.id);
  const t = boqTotals(rows);
  const groups = [...new Set(rows.map((r) => r.category))];
  const submit = (e) => {
    e.preventDefault();
    if (!f.name.trim() || !Number(f.quantity)) return;
    boqRepo.add({ projectId: project.id, category: f.category.trim(), name: f.name.trim(), unit: f.unit.trim(), quantity: Number(f.quantity), unitCost: Number(f.unitCost) || 0, margin: Number(f.margin) || 0 });
    setF({ ...empty, category: f.category, margin: f.margin });
  };
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const pick = (e) => {
    const [ci, ii] = e.target.value.split("|").map(Number);
    if (Number.isNaN(ci)) return;
    const g = BOQ_LIBRARY[ci]; const [name, unit] = g.items[ii];
    setF({ ...f, category: g.cat, name, unit, unitCost: String(priceFor(prices, name, project.spec?.finish || "mid") || "") });
    setPicked(true);
    setTimeout(() => qtyRef.current?.focus(), 0);
  };
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 font-ibm w-full max-w-full overflow-x-hidden">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-[#1E223D] flex items-center gap-2.5"><ClipboardCheck className="w-7 h-7" /><span>{T("boq.title")}</span></h1>
          <p className="text-xs md:text-sm text-[#4F5470] mt-1">{T("boq.sub")}</p>
        </div>
        <select value={project.id} onChange={(e) => setPid(Number(e.target.value))} className={input + " max-w-md w-full"}>
          {projects.map((p) => <option key={p.id} value={p.id}>{E(p.name)}</option>)}
        </select>
        <div className="grid grid-cols-3 gap-3">
          {[["boq.cost", t.cost], ["boq.price", t.price], ["boq.profit", t.profit]].map(([k, v]) => (
            <div key={k} className="bg-white rounded-lg p-4 border border-[#E0D6C2] text-center">
              <span className="text-[11px] font-bold text-[#4F5470] block mb-1">{T(k)}</span>
              <span className="text-lg md:text-xl font-semibold text-[#1E223D]">{money(v, { compact: true })}</span>
            </div>
          ))}
        </div>
        {spec && (
          <section className="bg-white rounded-2xl border border-[#E0D6C2] p-4 space-y-3">
            <h2 className="text-sm font-semibold text-[#1E223D]">{T("spec.title")}</h2>
            <SpecFields spec={spec} onChange={setSpec} />
            <div className="flex items-center gap-3">
              <button type="button" onClick={async () => { try {
                  await updateProjectSpec(project.id, spec);
                  const n = await applyAutoBoq(project.id, generateBoq(spec), (nm) => priceFor(prices, nm, spec.finish || "mid"), { create: false });
                  setSpecMsg(T("spec.saved") + (n ? " · " + T("boq.synced", { 0: n }) : ""));
                } catch (err) { setSpecMsg(err.message || String(err)); } }} className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#2B3052] hover:bg-[#3A4070] cursor-pointer">{T("boq.save")}</button>
              <button type="button" disabled={!Number(spec.area)} onClick={async () => {
                try {
                  await updateProjectSpec(project.id, spec);
                  const n = await applyAutoBoq(project.id, generateBoq(spec), (nm) => priceFor(prices, nm, spec.finish || "mid"));
                  setSpecMsg(T("boq.generated", { 0: n }));
                } catch (err) { setSpecMsg(err.message || String(err)); }
              }} className="px-4 py-2 rounded-lg text-xs font-bold text-[#1E223D] bg-[#F4A27E] hover:bg-[#E8532A] hover:text-white disabled:opacity-40 cursor-pointer">{T("boq.generate")}</button>
              {specMsg && <span role="status" className="text-xs text-[#4F5470]">{specMsg}</span>}
            </div>
          </section>
        )}
        <PriceList />
        <select value="" onChange={pick} aria-label={T("boq.lib")} className={input + " max-w-md w-full"}>
          <option value="">{T("boq.lib")}</option>
          {BOQ_LIBRARY.map((g, ci) => <optgroup key={g.cat} label={g.cat}>{g.items.map(([n, u], ii) => <option key={n} value={ci + "|" + ii}>{n} ({u})</option>)}</optgroup>)}
        </select>
        {picked && <p role="status" className="text-xs font-bold text-[#C03A12]">{T("boq.picked")}</p>}
        <form onSubmit={submit} className="bg-white rounded-2xl border border-[#E0D6C2] p-4 flex flex-wrap gap-2 items-end">
          <input placeholder={T("boq.cat")} value={f.category} onChange={set("category")} className={input + " w-40"} />
          <input required placeholder={T("boq.name")} value={f.name} onChange={set("name")} className={input + " flex-1 min-w-48"} />
          <input placeholder={T("boq.unit")} value={f.unit} onChange={set("unit")} className={input + " w-24"} />
          <input ref={qtyRef} required type="number" min={0} step="any" placeholder={T("boq.qty")} value={f.quantity} onChange={(e) => { setPicked(false); set("quantity")(e); }} className={input + " w-24 " + (picked ? "ring-2 ring-[#E8532A]" : "")} />
          <input required type="number" min={0} step="any" placeholder={T("boq.unitCost")} value={f.unitCost} onChange={set("unitCost")} className={input + " w-28"} />
          <label className="flex items-center gap-1 text-[11px] font-bold text-[#4F5470]">{T("boq.margin")}<input type="number" min={0} step="any" value={f.margin} onChange={set("margin")} className={input + " w-20"} />%</label>
          <button type="submit" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#2B3052] hover:bg-[#3A4070] cursor-pointer"><Plus className="w-4 h-4" />{T("boq.add")}</button>
        </form>
        {rows.length === 0 && <EmptyState title={T("boq.empty")} hint={T("boq.emptyHint")} />}
        {groups.map((g) => (
          <section key={g} className="space-y-2">
            <h2 className="text-sm font-semibold text-[#1E223D]">{g || T("boq.noCat")}</h2>
            {rows.filter((r) => r.category === g).map((i) => <Row key={i.id} i={i} />)}
          </section>
        ))}
      </div>
    </main>
  );
}
