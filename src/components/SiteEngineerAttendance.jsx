import { useState } from "react";
import { UsersRound, Plus, Download, Pencil, Check, X } from "lucide-react";
import { tr_ as T, E, money } from "../i18n";
import { workersStore, attendanceStore } from "../data/stores";
import { dayWage, monthSummary, entryRate, setRate } from "../lib/puantaj";
import { toCsv, download } from "../lib/accountant";

const STATES = ["present", "half", "absent"];
const today = () => new Date().toISOString().slice(0, 10);

/** Site engineer: daily labour attendance (puantaj) with overtime and monthly wage totals. */
export default function SiteEngineerAttendance() {
  const [workers, setWorkers] = workersStore.use();
  const [records, setRecords] = attendanceStore.use();
  const [date, setDate] = useState(today());
  const [name, setName] = useState("");
  const [trade, setTrade] = useState("");
  const [rate, setRateIn] = useState("");
  const [edit, setEdit] = useState(null); // { id, v }
  const day = records[date] || {};
  const month = date.slice(0, 7);
  const sums = monthSummary(records, workers, month);
  const monthTotal = sums.reduce((s, x) => s + x.wage, 0);
  const dayTotal = workers.reduce((s, w) => s + dayWage(entryRate(day[w.id], w), day[w.id]?.s, day[w.id]?.ot), 0);
  const present = workers.filter((w) => day[w.id] && day[w.id].s !== "absent").length;

  // each entry stores the rate of that day, so a later rate change never rewrites history
  const mark = (id, patch) => {
    const w = workers.find((x) => x.id === id);
    setRecords((r) => ({ ...r, [date]: { ...(r[date] || {}), [id]: { s: "absent", ot: 0, r: w?.rate, ...(r[date]?.[id] || {}), ...patch } } }));
  };
  const saveRate = () => {
    if (!edit) return;
    const res = setRate(workers, records, edit.id, edit.v, date);
    setWorkers(res.workers); setRecords(res.records); setEdit(null);
  };
  const addWorker = (e) => {
    e.preventDefault();
    if (!name.trim() || !Number(rate)) return;
    setWorkers((w) => [...w, { id: Date.now(), name: name.trim(), trade: trade.trim(), rate: Number(rate) }]);
    setName(""); setTrade(""); setRateIn("");
  };
  const exportCsv = () =>
    download(`puantaj-${month}.csv`, toCsv([T("att.worker"), T("att.trade"), T("att.days"), T("att.ot"), T("att.wage")], workers.map((w, i) => [w.name, w.trade, sums[i].days, sums[i].ot, sums[i].wage])), "text/csv");

  const input = "px-3 py-2 rounded-lg border border-[#E6DFD0] text-xs font-bold text-[#1F2421] bg-white";
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent pb-24 font-ibm w-full max-w-full overflow-x-hidden">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-[#1F2421] flex items-center gap-2.5"><UsersRound className="w-7 h-7" /><span>{T("att.title")}</span></h1>
            <p className="text-xs md:text-sm text-[#555B53] mt-1">{T("att.sub")}</p>
          </div>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value || today())} className={input} />
        </div>

        <div className="grid stat-grid grid-cols-3 gap-3">
          {[["att.k.present", `${present}/${workers.length}`], ["att.k.day", money(dayTotal, { compact: true })], ["att.k.month", money(monthTotal, { compact: true })]].map(([k, v]) => (
            <div key={k} className="bg-white rounded-lg p-4 border border-[#E6DFD0] text-center">
              <span className="text-[11px] font-bold text-[#555B53] block mb-1">{T(k)}</span>
              <span className="text-lg md:text-xl font-semibold text-[#1F2421]">{v}</span>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          {workers.map((w, i) => {
            const e = day[w.id] || { s: "absent", ot: 0 };
            return (
              <div key={w.id} className="bg-white rounded-lg border border-[#E6DFD0] p-3 md:p-4 flex flex-col md:flex-row md:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1F2421]">{E(w.name)}</p>
                  {edit && edit.id === w.id ? (
                    <form onSubmit={(ev) => { ev.preventDefault(); saveRate(); }} className="mt-1.5 flex flex-wrap items-center gap-2">
                      <input type="number" min={1} autoFocus value={edit.v} onChange={(ev) => setEdit({ ...edit, v: ev.target.value })} aria-label={T("att.rate")} className={input + " w-28"} />
                      <button type="submit" aria-label={T("att.save")} className="p-2 rounded-lg bg-[#17614F] text-white cursor-pointer"><Check className="w-4 h-4" /></button>
                      <button type="button" onClick={() => setEdit(null)} aria-label={T("att.cancel")} className="p-2 rounded-lg border border-[#E6DFD0] cursor-pointer"><X className="w-4 h-4" /></button>
                      <span className="w-full text-[11px] text-[#6F756B]">{T("att.rateNote", { 0: date })}</span>
                    </form>
                  ) : (
                    <p className="text-[11px] text-[#555B53] font-bold flex flex-wrap items-center gap-x-1">
                      <span>{E(w.trade)} ·</span>
                      <button type="button" onClick={() => setEdit({ id: w.id, v: w.rate })} className="inline-flex items-center gap-1 text-[#17614F] underline-offset-2 hover:underline cursor-pointer">{money(w.rate)} / {T("att.perday")}<Pencil className="w-3 h-3" aria-hidden="true" /></button>
                      <span>· {T("att.days")}: {sums[i].days}</span>
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {STATES.map((s) => (
                    <button key={s} type="button" onClick={() => mark(w.id, { s })} className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border cursor-pointer ${e.s === s ? (s === "absent" ? "bg-rose-600 text-white border-rose-600" : "bg-[#17614F] text-white border-[#17614F]") : "bg-white text-[#555B53] border-[#E6DFD0]"}`}>{T("att.s." + s)}</button>
                  ))}
                  <label className="flex items-center gap-1 text-[11px] font-bold text-[#555B53]">
                    {T("att.ot")}
                    <input type="number" min={0} max={8} value={e.ot} disabled={e.s === "absent"} onChange={(ev) => mark(w.id, { ot: ev.target.value })} className={input + " w-16 !py-1"} />
                  </label>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-end justify-between">
          <form onSubmit={addWorker} className="flex flex-wrap gap-2 items-end">
            <input required placeholder={T("att.worker")} value={name} onChange={(e) => setName(e.target.value)} className={input} />
            <input placeholder={T("att.trade")} value={trade} onChange={(e) => setTrade(e.target.value)} className={input + " w-28"} />
            <input required type="number" min={1} placeholder={T("att.rate")} value={rate} onChange={(e) => setRateIn(e.target.value)} className={input + " w-28"} />
            <button type="submit" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#17614F] hover:bg-[#17614F] cursor-pointer"><Plus className="w-4 h-4" />{T("att.add")}</button>
          </form>
          <button type="button" onClick={exportCsv} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-[#1F2421] bg-white border border-[#E6DFD0] hover:bg-[#F7F3EA] cursor-pointer"><Download className="w-4 h-4" />{T("att.export")}</button>
        </div>
      </div>
    </main>
  );
}
