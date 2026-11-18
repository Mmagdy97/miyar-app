import { useState } from "react";
import { Calculator, Plus, Trash2 } from "lucide-react";
import { tr_ as T, money } from "../i18n";
import { projectsStore } from "../data/projects";
import { finishesRepo } from "../data/finishes";
import { compareFinishes, categoriesOf } from "../lib/finishes";
import { hasFeature, getActiveOrg } from "../lib/entitlements";

const input = "px-3 py-2 rounded-lg border border-[#E4DDCE] text-xs font-bold text-[#0E1A1B] bg-white min-w-0";
const SEED = [
  { id: 1, category: "أرضيات", name: "بورسلين", price: 450 }, { id: 2, category: "أرضيات", name: "سيراميك", price: 280 }, { id: 3, category: "أرضيات", name: "باركيه", price: 700 },
  { id: 4, category: "دهانات", name: "بلاستيك", price: 60 }, { id: 5, category: "دهانات", name: "زيتي", price: 95 },
];

/** Client-facing calculator: pick a category + area and compare what each finish would cost. Staff manage the price list. */
export default function FinishCalculator({ isClient, area }) {
  const live = projectsStore.isLive;
  const liveOpts = finishesRepo.use();
  const [demo, setDemo] = useState(SEED);
  const opts = live ? liveOpts : demo;
  const cats = categoriesOf(opts);
  const [cat, setCat] = useState("");
  const [m2, setM2] = useState(area || "");
  const [n, setN] = useState({ category: "", name: "", price: "" });
  if (!hasFeature(getActiveOrg(), "client_calculator")) return null;
  const c = cats.includes(cat) ? cat : cats[0];
  const rows = c ? compareFinishes(opts, c, m2) : [];
  const add = (e) => {
    e.preventDefault();
    const o = { category: n.category.trim() || c || "", name: n.name.trim(), price: Number(n.price) };
    if (!o.category || !o.name || !(o.price >= 0)) return;
    if (live) finishesRepo.add(o); else setDemo((a) => [...a, { id: Date.now(), ...o }]);
    setN({ category: "", name: "", price: "" });
  };
  const del = (id) => (live ? finishesRepo.remove(id) : setDemo((a) => a.filter((x) => x.id !== id)));
  if (isClient && opts.length === 0) return null;
  return (
    <section className="bg-white rounded-2xl border border-[#E4DDCE] p-4 space-y-3">
      <h2 className="text-sm font-semibold text-[#0E1A1B] flex items-center gap-2"><Calculator className="w-5 h-5" />{T("fin.calc.title")}</h2>
      <p className="text-[11px] text-[#64706F]">{T("fin.calc.hint")}</p>
      {cats.length > 0 && (
        <div className="flex flex-wrap gap-2 items-end">
          <label className="text-[11px] font-bold text-[#4A5757] space-y-1">{T("fin.calc.cat")}
            <select value={c} onChange={(e) => setCat(e.target.value)} className={input + " block"}>{cats.map((x) => <option key={x} value={x}>{x}</option>)}</select>
          </label>
          <label className="text-[11px] font-bold text-[#4A5757] space-y-1">{T("fin.calc.area")}
            <input type="number" min={0} value={m2} onChange={(e) => setM2(e.target.value)} className={input + " block w-28"} dir="ltr" />
          </label>
        </div>
      )}
      {Number(m2) > 0 && rows.length > 0 && (
        <div className="space-y-2">
          {rows.map((r, i) => (
            <div key={r.id} className="flex items-center gap-2 text-xs border-t border-[#ECE5D6] pt-2">
              <span className="flex-1 min-w-0"><b className="text-[#0E1A1B]">{r.name}</b><span className="text-[#64706F]"> · {money(r.price)} / {T("fin.calc.m2")}</span></span>
              <span className="tabular-nums font-semibold">{money(r.total)}</span>
              <span className={`w-28 text-end text-[11px] font-bold ${i === 0 ? "text-emerald-700" : "text-[#4A5757]"}`}>{i === 0 ? T("fin.calc.cheapest") : `+${money(r.diff)}`}</span>
              {!isClient && <button type="button" onClick={() => del(r.id)} aria-label={T("mood.del")} className="p-1 text-[#64706F] hover:text-rose-700 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>}
            </div>
          ))}
        </div>
      )}
      {!isClient && (
        <form onSubmit={add} className="flex flex-wrap gap-2 items-end border-t border-[#ECE5D6] pt-3">
          <input placeholder={T("fin.calc.cat")} value={n.category} onChange={(e) => setN({ ...n, category: e.target.value })} className={input + " w-32"} />
          <input required placeholder={T("fin.calc.name")} value={n.name} onChange={(e) => setN({ ...n, name: e.target.value })} className={input + " flex-1 min-w-32"} />
          <input required type="number" min={0} placeholder={T("fin.calc.price")} value={n.price} onChange={(e) => setN({ ...n, price: e.target.value })} className={input + " w-28"} />
          <button type="submit" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#2E6F73] cursor-pointer"><Plus className="w-4 h-4" />{T("mood.add")}</button>
        </form>
      )}
    </section>
  );
}
