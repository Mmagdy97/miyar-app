import { useState } from "react";
import { MessageCircleQuestion, Plus, AlertTriangle, Check } from "lucide-react";
import EmptyState from "./EmptyState";
import { tr_ as T, E } from "../i18n";
import { useProjectList, projectsStore } from "../data/projects";
import { rfiRepo } from "../data/rfi";
import { rfiStore } from "../data/stores";
import { isOverdue, nextNo, rfiCounts } from "../lib/rfi";

const input = "px-3 py-2 rounded-lg border border-[#E2E8F0] text-xs font-bold text-[#0E2A47] bg-white min-w-0";
const btn = "inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#0B7C79] hover:bg-[#086663] cursor-pointer";
const BADGE = { open: "bg-amber-50 text-amber-800 border-amber-200", answered: "bg-emerald-50 text-emerald-700 border-emerald-200", closed: "bg-[#EEF1F5] text-[#475569] border-[#E2E8F0]" };
const today = () => new Date().toISOString().slice(0, 10);

/** RFI: site or office raises a technical query; technical office / admin answers it. */
export default function Rfi({ role = "Admin", by = "" }) {
  const canAnswer = role === "Admin" || role === "Technical Office";
  const projects = useProjectList();
  const live = projectsStore.isLive;
  const liveList = rfiRepo.use();
  const [demo, setDemo] = rfiStore.use();
  const [pid, setPid] = useState(null);
  const [f, setF] = useState({ title: "", question: "", due: "" });
  const [ans, setAns] = useState({});
  const project = projects.find((p) => p.id === pid) || projects[0];
  if (!project) return <main className="flex-1 flex items-center justify-center p-8 font-ibm"><p className="text-sm text-[#475569] bg-white rounded-xl border border-[#E2E8F0] p-8 text-center max-w-sm">{T("proj.none")}</p></main>;
  const all = live ? liveList : demo;
  const list = all.filter((r) => r.projectId === project.id);
  const c = rfiCounts(all);

  const add = (e) => {
    e.preventDefault();
    if (!f.title.trim()) return;
    const v = { projectId: project.id, no: nextNo(all, project.id), title: f.title.trim(), question: f.question.trim(), due: f.due, by };
    if (live) rfiRepo.add(v); else setDemo((a) => [{ id: Date.now(), ...v, answer: "", status: "open", date: today() }, ...a]);
    setF({ title: "", question: "", due: "" });
  };
  const answer = (r) => {
    const text = (ans[r.id] || "").trim();
    if (!text) return;
    if (live) rfiRepo.answer(r.id, text); else setDemo((a) => a.map((x) => (x.id === r.id ? { ...x, answer: text, status: "answered" } : x)));
    setAns((a) => ({ ...a, [r.id]: "" }));
  };
  const close = (r) => (live ? rfiRepo.close(r.id) : setDemo((a) => a.map((x) => (x.id === r.id ? { ...x, status: "closed" } : x))));

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent pb-24 font-ibm w-full max-w-full overflow-x-hidden">
      <div className="max-w-4xl mx-auto space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-[#0E2A47] flex items-center gap-2"><MessageCircleQuestion className="w-6 h-6" /><span>{T("rfi.title")}</span></h2>
          <p className="text-xs md:text-sm text-[#475569] mt-1">{T("rfi.sub")}</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[["rfi.k.open", c.open], ["rfi.k.overdue", c.overdue], ["rfi.k.answered", c.answered]].map(([k, v]) => (
            <div key={k} className="bg-white rounded-lg p-4 border border-[#E2E8F0] text-center">
              <span className="text-[11px] font-bold text-[#475569] block mb-1">{T(k)}</span>
              <span className="text-lg md:text-xl font-semibold text-[#0E2A47]">{v}</span>
            </div>
          ))}
        </div>
        {projects.length > 1 && (
          <select value={project.id} onChange={(e) => setPid(Number(e.target.value))} aria-label={T("rfi.title")} className={input + " w-full sm:w-64"}>
            {projects.map((p) => <option key={p.id} value={p.id}>{E(p.name)}</option>)}
          </select>
        )}
        <form onSubmit={add} className="bg-white rounded-2xl border border-[#E2E8F0] p-4 space-y-2">
          <div className="flex flex-wrap gap-2">
            <input required placeholder={T("rfi.f.title")} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} className={input + " flex-1 min-w-40"} />
            <label className="text-[11px] font-bold text-[#475569] flex items-center gap-2">{T("rfi.f.due")}<input type="date" value={f.due} onChange={(e) => setF({ ...f, due: e.target.value })} className={input} /></label>
          </div>
          <textarea rows={2} placeholder={T("rfi.f.question")} value={f.question} onChange={(e) => setF({ ...f, question: e.target.value })} className={input + " w-full"} />
          <button type="submit" className={btn}><Plus className="w-4 h-4" />{T("rfi.add")}</button>
        </form>
        {list.length === 0 && <EmptyState title={T("rfi.empty")} hint={T("rfi.emptyHint")} />}
        <div className="space-y-3">
          {list.map((r) => (
            <article key={r.id} className="bg-white rounded-2xl border border-[#E2E8F0] p-4 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-[#0E2A47]">#{r.no} · {r.title}</p>
                <span className="flex items-center gap-1.5">
                  {isOverdue(r) && <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border bg-rose-50 text-rose-700 border-rose-200"><AlertTriangle className="w-3 h-3" aria-hidden="true" />{T("rfi.overdue")}</span>}
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${BADGE[r.status]}`}>{T("rfi.s." + r.status)}</span>
                </span>
              </div>
              {r.question && <p className="text-xs text-[#475569] leading-relaxed">{r.question}</p>}
              <p className="text-[11px] text-[#64748B]">{r.by && `${r.by} · `}{r.date}{r.due && ` · ${T("rfi.f.due")} ${r.due}`}</p>
              {r.answer && <p className="text-xs text-[#0E2A47] bg-emerald-50/60 border border-emerald-200 rounded-lg p-2.5 leading-relaxed"><b>{T("rfi.answer")}:</b> {r.answer}</p>}
              {canAnswer && r.status === "open" && (
                <div className="flex gap-2">
                  <input placeholder={T("rfi.answerPh")} value={ans[r.id] || ""} onChange={(e) => setAns((a) => ({ ...a, [r.id]: e.target.value }))} className={input + " flex-1"} />
                  <button type="button" onClick={() => answer(r)} className={btn}>{T("rfi.reply")}</button>
                </div>
              )}
              {canAnswer && r.status === "answered" && <div className="flex justify-end"><button type="button" onClick={() => close(r)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold border border-[#E2E8F0] text-[#475569] cursor-pointer"><Check className="w-3.5 h-3.5" />{T("rfi.close")}</button></div>}
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
