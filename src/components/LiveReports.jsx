import { useRef, useState } from "react";
import EmptyState from "./EmptyState";
import { FileText, Camera, Plus } from "lucide-react";
import { tr_ as T, E } from "../i18n";
import { askConfirm } from "../lib/confirm";
import { useProjectList } from "../data/projects";
import { reportsRepo, MAX_PHOTOS } from "../data/reports";
import ReportCard from "./ReportCard";
import { reportWa } from "../lib/notify";

const input = "px-3 py-2 rounded-lg border border-[#E4DDCE] text-xs font-bold text-[#0E1A1B] bg-white min-w-0";

/** Staff of a real office: daily site report with photos, per project. The client sees these in their portal. */
export default function LiveReports() {
  const projects = useProjectList();
  const all = reportsRepo.use();
  const [pid, setPid] = useState(null);
  const [f, setF] = useState({ note: "", progress: "" });
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);
  const project = projects.find((p) => p.id === pid) || projects[0];
  if (!project) return <main className="flex-1 flex items-center justify-center p-8 font-ibm"><p className="text-sm text-[#4A5757] bg-white rounded-xl border border-[#E4DDCE] p-8 text-center max-w-sm">{T("proj.none")}</p></main>;
  const mine = all.filter((r) => r.projectId === project.id);
  const submit = async (e) => {
    e.preventDefault();
    if (!f.note.trim() && !files.length) return;
    setBusy(true);
    const ok = await reportsRepo.add({ projectId: project.id, note: f.note.trim(), progress: f.progress, files });
    setBusy(false);
    if (ok) { setF({ note: "", progress: "" }); setFiles([]); if (fileRef.current) fileRef.current.value = ""; }
  };
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 font-ibm w-full max-w-full overflow-x-hidden">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-[#0E1A1B] flex items-center gap-2.5"><FileText className="w-7 h-7" /><span>{T("rep.title")}</span></h1>
          <p className="text-xs md:text-sm text-[#4A5757] mt-1">{T("rep.sub")}</p>
        </div>
        <select value={project.id} onChange={(e) => setPid(Number(e.target.value))} className={input + " max-w-md w-full"}>
          {projects.map((p) => <option key={p.id} value={p.id}>{E(p.name)}</option>)}
        </select>
        <form onSubmit={submit} className="bg-white rounded-2xl border border-[#E4DDCE] p-4 space-y-3">
          <textarea value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} rows={3} placeholder={T("rep.notePh")} className={input + " w-full font-semibold"} />
          <div className="flex flex-wrap items-center gap-2">
            <input ref={fileRef} type="file" accept="image/*" multiple capture="environment" onChange={(e) => setFiles([...e.target.files].slice(0, MAX_PHOTOS))} className="sr-only" id="rep-photos" />
            <label htmlFor="rep-photos" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border border-[#E4DDCE] cursor-pointer"><Camera className="w-4 h-4" aria-hidden="true" />{files.length ? T("rep.photos", { 0: files.length }) : T("rep.addPhotos")}</label>
            <input type="number" min={0} max={100} value={f.progress} onChange={(e) => setF({ ...f, progress: e.target.value })} placeholder={T("rep.progress")} aria-label={T("rep.progress")} className={input + " w-32"} />
            <button type="submit" disabled={busy} className="ms-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#2E6F73] hover:bg-[#245A5E] disabled:opacity-50 cursor-pointer"><Plus className="w-4 h-4" />{busy ? T("rep.uploading") : T("rep.add")}</button>
          </div>
        </form>
        {mine.length === 0 && <EmptyState title={T("rep.empty")} hint={T("rep.emptyHint")} />}
        <div className="grid gap-3">{mine.map((r) => <ReportCard key={r.id} r={r} waHref={reportWa(project, r)} onRemove={async () => { if (await askConfirm(T("rep.rmConfirm"))) reportsRepo.remove(r); }} />)}</div>
      </div>
    </main>
  );
}
