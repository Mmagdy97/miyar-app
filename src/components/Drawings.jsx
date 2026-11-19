import { useState } from "react";
import { Layers, Upload, FileText, History, AlertTriangle } from "lucide-react";
import EmptyState from "./EmptyState";
import { tr_ as T, E } from "../i18n";
import { useProjectList } from "../data/projects";
import { drawingsRepo, drawingUrl } from "../data/drawings";
import { groupDrawings, hasPendingRev } from "../lib/drawings";

const input = "px-3 py-2 rounded-lg border border-[#E4DDCE] text-xs font-bold text-[#0E1A1B] bg-white min-w-0";
const btn = "inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#2E6F73] hover:bg-[#245A5E] cursor-pointer disabled:opacity-50";
const BADGE = { review: "bg-amber-50 text-amber-800 border-amber-200", approved: "bg-emerald-50 text-emerald-700 border-emerald-200", rejected: "bg-rose-50 text-rose-700 border-rose-200" };

/** Drawings of a real office with revision history. Admin / technical office upload and approve; site reads the current approved revision. */
export default function Drawings({ role = "Admin" }) {
  const canEdit = role === "Admin" || role === "Technical Office";
  const projects = useProjectList();
  const rows = drawingsRepo.use();
  const [pid, setPid] = useState(null);
  const [f, setF] = useState({ code: "", name: "", note: "", file: null });
  const [open, setOpen] = useState({});
  const [busy, setBusy] = useState(false);
  const project = projects.find((p) => p.id === pid) || projects[0];
  if (!project) return <main className="flex-1 flex items-center justify-center p-8 font-ibm"><p className="text-sm text-[#4A5757] bg-white rounded-xl border border-[#E4DDCE] p-8 text-center max-w-sm">{T("proj.none")}</p></main>;
  const groups = groupDrawings(rows.filter((r) => r.projectId === project.id));
  const prefill = (g) => setF({ code: g.code, name: g.name, note: "", file: null });
  const view = async (v) => { const u = await drawingUrl(v.file); if (u) window.open(u, "_blank", "noopener"); };
  const submit = async (e) => {
    e.preventDefault();
    if (!f.code.trim() || !f.name.trim() || busy) return;
    setBusy(true);
    const ok = await drawingsRepo.add({ projectId: project.id, code: f.code.trim(), name: f.name.trim(), note: f.note.trim(), file: f.file });
    setBusy(false);
    if (ok) setF({ code: "", name: "", note: "", file: null });
  };
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent pb-24 font-ibm w-full max-w-full overflow-x-hidden">
      <div className="max-w-4xl mx-auto space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-[#0E1A1B] flex items-center gap-2"><Layers className="w-6 h-6" /><span>{T("dw.title")}</span></h2>
          <p className="text-xs md:text-sm text-[#4A5757] mt-1">{T("dw.sub")}</p>
        </div>
        {projects.length > 1 && (
          <select value={project.id} onChange={(e) => setPid(Number(e.target.value))} aria-label={T("dw.title")} className={input + " w-full sm:w-64"}>
            {projects.map((p) => <option key={p.id} value={p.id}>{E(p.name)}</option>)}
          </select>
        )}
        {canEdit && (
          <form onSubmit={submit} className="bg-white rounded-2xl border border-[#E4DDCE] p-4 space-y-2">
            <div className="flex flex-wrap gap-2">
              <input required placeholder={T("dw.code")} value={f.code} onChange={(e) => setF({ ...f, code: e.target.value })} className={input + " w-32"} />
              <input required placeholder={T("dw.name")} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className={input + " flex-1 min-w-40"} />
              <label className={input + " cursor-pointer w-44 truncate"}>{f.file ? f.file.name : T("dw.file")}<input type="file" accept="application/pdf,image/*" className="sr-only" onChange={(e) => setF({ ...f, file: e.target.files?.[0] || null })} /></label>
            </div>
            <div className="flex flex-wrap gap-2">
              <input placeholder={T("dw.note")} value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} className={input + " flex-1 min-w-40"} />
              <button type="submit" disabled={busy} className={btn}><Upload className="w-4 h-4" />{T("dw.upload")}</button>
            </div>
            <p className="text-[11px] text-[#64706F]">{T("dw.hint")}</p>
          </form>
        )}
        {groups.length === 0 && <EmptyState title={T("dw.empty")} hint={T("dw.emptyHint")} />}
        <div className="space-y-3">
          {groups.map((g) => (
            <article key={g.code} className="bg-white rounded-2xl border border-[#E4DDCE] p-4 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-[#0E1A1B]">{g.code} · {g.name}</p>
                <span className="text-[11px] font-bold text-[#4A5757]">{T("dw.latest")} Rev. {String(g.latest.rev).padStart(2, "0")}</span>
              </div>
              {g.current
                ? <p className="text-xs font-bold text-emerald-700">{T("dw.current")}: Rev. {String(g.current.rev).padStart(2, "0")}</p>
                : <p className="text-xs font-bold text-amber-800">{T("dw.noneApproved")}</p>}
              {hasPendingRev(g) && g.current && <p role="status" className="flex items-center gap-1.5 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5"><AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />{T("dw.pending", { 0: String(g.latest.rev).padStart(2, "0"), 1: String(g.current.rev).padStart(2, "0") })}</p>}
              <div className="flex flex-wrap gap-2">
                {g.current?.file && <button type="button" onClick={() => view(g.current)} className={btn}><FileText className="w-4 h-4" />{T("dw.open")}</button>}
                {canEdit && <button type="button" onClick={() => prefill(g)} className="px-3 py-2 rounded-lg text-xs font-bold border border-[#E4DDCE] text-[#4A5757] cursor-pointer">{T("dw.newRev")}</button>}
                {g.versions.length > 1 && <button type="button" onClick={() => setOpen((o) => ({ ...o, [g.code]: !o[g.code] }))} className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-bold border border-[#E4DDCE] text-[#4A5757] cursor-pointer"><History className="w-3.5 h-3.5" />{T("dw.history", { 0: String(g.versions.length) })}</button>}
              </div>
              {(open[g.code] || g.versions.length === 1) && (
                <ul className="divide-y divide-[#ECE5D6] border-t border-[#ECE5D6]">
                  {g.versions.map((v) => (
                    <li key={v.id} className="py-2 flex flex-wrap items-center gap-2 text-xs">
                      <b className="text-[#0E1A1B]">Rev. {String(v.rev).padStart(2, "0")}</b>
                      <span className="text-[#64706F] flex-1 min-w-32">{v.date}{v.note && ` · ${v.note}`}</span>
                      {v.file && <button type="button" onClick={() => view(v)} className="text-[#2E6F73] font-bold cursor-pointer">{T("dw.open")}</button>}
                      {canEdit ? (
                        <select value={v.status} onChange={(e) => drawingsRepo.setStatus(v.id, e.target.value)} aria-label={T("dw.status")} className={input}>
                          {["review", "approved", "rejected"].map((s) => <option key={s} value={s}>{T("dw.s." + s)}</option>)}
                        </select>
                      ) : <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${BADGE[v.status]}`}>{T("dw.s." + v.status)}</span>}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
