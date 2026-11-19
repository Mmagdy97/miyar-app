import { useState } from "react";
import { ShieldCheck, Plus, AlertTriangle } from "lucide-react";
import EmptyState from "./EmptyState";
import { tr_ as T, E } from "../i18n";
import { useProjectList, projectsStore } from "../data/projects";
import { warrantyRepo } from "../data/warranty";
import { warrantyStatus } from "../lib/warranty";

const input = "px-3 py-2 rounded-lg border border-[#E2E8F0] text-xs font-bold text-[#0E2A47] bg-white min-w-0";
const btn = "inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#0B7C79] hover:bg-[#086663] cursor-pointer";
const STATE = { active: "bg-emerald-50 text-emerald-700 border-emerald-200", soon: "bg-amber-50 text-amber-800 border-amber-200", expired: "bg-rose-50 text-rose-700 border-rose-200" };
const today = () => new Date().toISOString().slice(0, 10);

/** Warranty period per project + maintenance requests. The client raises requests while the warranty is active. */
export default function Warranty({ role = "Admin" }) {
  const isClient = role === "Client";
  const projects = useProjectList();
  const live = projectsStore.isLive;
  const data = warrantyRepo.use();
  const [demo, setDemo] = useState({ warranties: [], requests: [] });
  const [pid, setPid] = useState(null);
  const [w, setW] = useState({ start: today(), months: 12 });
  const [r, setR] = useState({ title: "", desc: "" });
  const project = projects.find((p) => p.id === pid) || projects[0];
  if (!project) return <main className="flex-1 flex items-center justify-center p-8 font-ibm"><p className="text-sm text-[#475569] bg-white rounded-xl border border-[#E2E8F0] p-8 text-center max-w-sm">{T("proj.none")}</p></main>;
  const d = live ? data : demo;
  const war = d.warranties.find((x) => x.projectId === project.id);
  const st = war ? warrantyStatus(war) : null;
  const reqs = d.requests.filter((x) => x.projectId === project.id);
  const expiring = d.warranties.filter((x) => warrantyStatus(x).state === "soon").length;
  const saveWar = (e) => {
    e.preventDefault();
    const v = { projectId: project.id, start: w.start, months: Math.min(120, Math.max(1, Number(w.months) || 12)), notes: "" };
    if (live) warrantyRepo.save(v); else setDemo((x) => ({ ...x, warranties: [...x.warranties.filter((y) => y.projectId !== project.id), v] }));
  };
  const addReq = (e) => {
    e.preventDefault();
    if (!r.title.trim() || !st || st.state === "expired") return;
    const v = { projectId: project.id, title: r.title.trim(), desc: r.desc.trim() };
    if (live) warrantyRepo.request(v); else setDemo((x) => ({ ...x, requests: [{ id: Date.now(), ...v, status: "open", date: today() }, ...x.requests] }));
    setR({ title: "", desc: "" });
  };
  const setStatus = (id, status) => (live ? warrantyRepo.setStatus(id, status) : setDemo((x) => ({ ...x, requests: x.requests.map((q) => (q.id === id ? { ...q, status } : q)) })));
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent pb-24 font-ibm w-full max-w-full overflow-x-hidden">
      <div className="max-w-4xl mx-auto space-y-4">
        <h2 className="text-xl font-semibold text-[#0E2A47] flex items-center gap-2"><ShieldCheck className="w-6 h-6" /><span>{T("war.title")}</span></h2>
        {!isClient && expiring > 0 && <p role="status" className="flex items-center gap-2 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3"><AlertTriangle className="w-4 h-4" aria-hidden="true" />{T("war.expiring", { n: expiring })}</p>}
        {projects.length > 1 && (
          <select value={project.id} onChange={(e) => setPid(Number(e.target.value))} aria-label={T("war.title")} className={input + " w-full sm:w-64"}>
            {projects.map((p) => <option key={p.id} value={p.id}>{E(p.name)}</option>)}
          </select>
        )}
        <section className="bg-white rounded-2xl border border-[#E2E8F0] p-4 space-y-3">
          {st ? (
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-40 text-xs text-[#475569]">
                <b className="block text-sm text-[#0E2A47]">{T("war.period", { m: war.months })}</b>
                {T("war.from")} {war.start} · {T("war.to")} {st.end}
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md border ${STATE[st.state]}`}>
                {st.state === "expired" ? T("war.s.expired") : T("war.left", { n: st.daysLeft })}
              </span>
            </div>
          ) : <p className="text-xs text-[#64748B]">{T(isClient ? "war.noneClient" : "war.none")}</p>}
          {!isClient && (
            <form onSubmit={saveWar} className="flex flex-wrap gap-2 items-end border-t border-[#E0F2F1] pt-3">
              <label className="text-[11px] font-bold text-[#475569] space-y-1">{T("war.start")}<input type="date" required value={w.start} onChange={(e) => setW({ ...w, start: e.target.value })} className={input + " block"} /></label>
              <label className="text-[11px] font-bold text-[#475569] space-y-1">{T("war.months")}<input type="number" min={1} max={120} required value={w.months} onChange={(e) => setW({ ...w, months: e.target.value })} className={input + " block w-24"} /></label>
              <button type="submit" className={btn}>{T("war.save")}</button>
            </form>
          )}
        </section>
        {st && st.state !== "expired" && (
          <form onSubmit={addReq} className="bg-white rounded-2xl border border-[#E2E8F0] p-4 flex flex-wrap gap-2 items-end">
            <input required placeholder={T("war.reqTitle")} value={r.title} onChange={(e) => setR({ ...r, title: e.target.value })} className={input + " flex-1 min-w-40"} />
            <input placeholder={T("war.reqDesc")} value={r.desc} onChange={(e) => setR({ ...r, desc: e.target.value })} className={input + " flex-1 min-w-40"} />
            <button type="submit" className={btn}><Plus className="w-4 h-4" />{T("war.req")}</button>
          </form>
        )}
        {reqs.length === 0 && st && <EmptyState title={T("war.noReq")} hint={T("war.noReqHint")} />}
        <div className="grid gap-3">
          {reqs.map((q) => (
            <article key={q.id} className="bg-white rounded-2xl border border-[#E2E8F0] p-4 flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-40"><p className="text-sm font-semibold text-[#0E2A47]">{q.title}</p>{q.desc && <p className="text-[11px] text-[#64748B]">{q.desc}</p>}<p className="text-[11px] text-[#64748B]">{q.date}</p></div>
              {isClient ? <span className="text-[11px] font-bold px-2.5 py-1 rounded-md border border-[#E2E8F0]">{T("war.st." + q.status)}</span> : (
                <select value={q.status} onChange={(e) => setStatus(q.id, e.target.value)} aria-label={T("war.status")} className={input}>
                  {["open", "in_progress", "done"].map((s) => <option key={s} value={s}>{T("war.st." + s)}</option>)}
                </select>
              )}
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
