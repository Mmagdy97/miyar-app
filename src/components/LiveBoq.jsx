import { useState } from "react";
import { Plus, Trash2, ClipboardCheck, Pencil, Check, X } from "lucide-react";
import { tr_ as T, E, money } from "../i18n";
import { useProjectList } from "../data/projects";
import { boqRepo, boqTotals, itemPrice } from "../data/boq";

const input = "px-3 py-2 rounded-lg border border-[#E6DFD0] text-xs font-bold text-[#1F2421] bg-white min-w-0";
const empty = { category: "", name: "", unit: "", quantity: "", unitCost: "", margin: "20" };

function Row({ i }) {
  const [e, setE] = useState(null);
  const set = (k) => (ev) => setE({ ...e, [k]: ev.target.value });
  const save = () => {
    if (!e.name.trim() || !Number(e.quantity)) return;
    boqRepo.update(i.id, { category: e.category.trim(), name: e.name.trim(), unit: e.unit.trim(), quantity: Number(e.quantity), unitCost: Number(e.unitCost) || 0, margin: Number(e.margin) || 0 });
    setE(null);
  };
  const ib = "p-1.5 rounded-lg text-[#6F756B] hover:bg-[#F7F3EA] cursor-pointer";
  if (e) return (
    <article className="bg-white rounded-xl border border-[#17614F] p-3 flex flex-wrap items-center gap-2 text-xs">
      <input value={e.category} onChange={set("category")} placeholder={T("boq.cat")} className={input + " w-32"} />
      <input value={e.name} onChange={set("name")} className={input + " flex-1 min-w-40"} />
      <input value={e.unit} onChange={set("unit")} className={input + " w-20"} />
      <input type="number" min={0} step="any" value={e.quantity} onChange={set("quantity")} className={input + " w-20"} />
      <input type="number" min={0} step="any" value={e.unitCost} onChange={set("unitCost")} className={input + " w-24"} />
      <input type="number" min={0} step="any" value={e.margin} onChange={set("margin")} className={input + " w-16"} />
      <button type="button" onClick={save} aria-label={T("boq.save")} className={ib + " text-[#17614F]"}><Check className="w-4 h-4" /></button>
      <button type="button" onClick={() => setE(null)} aria-label={T("boq.cancel")} className={ib}><X className="w-4 h-4" /></button>
    </article>
  );
  return (
    <article className="bg-white rounded-xl border border-[#E6DFD0] p-3 flex flex-wrap items-center gap-3 text-xs">
      <span className="flex-1 min-w-48 font-semibold text-[#1F2421]">{i.name}</span>
      <span className="text-[#555B53] tabular-nums">{i.quantity} {i.unit} × {money(i.unitCost)}</span>
      <span className="text-[#6F756B]">+{i.margin}%</span>
      <span className="font-semibold tabular-nums text-[#1F2421]">{money(itemPrice(i))}</span>
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
  const project = projects.find((p) => p.id === pid) || projects[0];
  if (!project) return <main className="flex-1 flex items-center justify-center p-8 font-ibm"><p className="text-sm text-[#555B53] bg-white rounded-xl border border-[#E6DFD0] p-8 text-center max-w-sm">{T("proj.none")}</p></main>;
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
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 font-ibm w-full max-w-full overflow-x-hidden">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-[#1F2421] flex items-center gap-2.5"><ClipboardCheck className="w-7 h-7" /><span>{T("boq.title")}</span></h1>
          <p className="text-xs md:text-sm text-[#555B53] mt-1">{T("boq.sub")}</p>
        </div>
        <select value={project.id} onChange={(e) => setPid(Number(e.target.value))} className={input + " max-w-md w-full"}>
          {projects.map((p) => <option key={p.id} value={p.id}>{E(p.name)}</option>)}
        </select>
        <div className="grid grid-cols-3 gap-3">
          {[["boq.cost", t.cost], ["boq.price", t.price], ["boq.profit", t.profit]].map(([k, v]) => (
            <div key={k} className="bg-white rounded-lg p-4 border border-[#E6DFD0] text-center">
              <span className="text-[11px] font-bold text-[#555B53] block mb-1">{T(k)}</span>
              <span className="text-lg md:text-xl font-semibold text-[#1F2421]">{money(v, { compact: true })}</span>
            </div>
          ))}
        </div>
        <form onSubmit={submit} className="bg-white rounded-2xl border border-[#E6DFD0] p-4 flex flex-wrap gap-2 items-end">
          <input placeholder={T("boq.cat")} value={f.category} onChange={set("category")} className={input + " w-40"} />
          <input required placeholder={T("boq.name")} value={f.name} onChange={set("name")} className={input + " flex-1 min-w-48"} />
          <input placeholder={T("boq.unit")} value={f.unit} onChange={set("unit")} className={input + " w-24"} />
          <input required type="number" min={0} step="any" placeholder={T("boq.qty")} value={f.quantity} onChange={set("quantity")} className={input + " w-24"} />
          <input required type="number" min={0} step="any" placeholder={T("boq.unitCost")} value={f.unitCost} onChange={set("unitCost")} className={input + " w-28"} />
          <label className="flex items-center gap-1 text-[11px] font-bold text-[#555B53]">{T("boq.margin")}<input type="number" min={0} step="any" value={f.margin} onChange={set("margin")} className={input + " w-20"} />%</label>
          <button type="submit" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#17614F] hover:bg-[#104A3C] cursor-pointer"><Plus className="w-4 h-4" />{T("boq.add")}</button>
        </form>
        {rows.length === 0 && <p className="text-xs text-[#555B53] bg-white rounded-lg border border-[#E6DFD0] p-6 text-center">{T("boq.empty")}</p>}
        {groups.map((g) => (
          <section key={g} className="space-y-2">
            <h2 className="text-sm font-semibold text-[#1F2421]">{g || T("boq.noCat")}</h2>
            {rows.filter((r) => r.category === g).map((i) => <Row key={i.id} i={i} />)}
          </section>
        ))}
      </div>
    </main>
  );
}
