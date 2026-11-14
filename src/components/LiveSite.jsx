import { useState } from "react";
import EmptyState from "./EmptyState";
import { Plus, Trash2, ListTodo, AlertTriangle, PackageSearch, Check } from "lucide-react";
import { tr_ as T, E } from "../i18n";
import { useProjectList } from "../data/projects";
import { siteRepo } from "../data/site";

const input = "px-3 py-2 rounded-lg border border-[#DCE4DC] text-xs font-bold text-[#1F2A26] bg-white min-w-0";
const btn = "inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#5F6C61] hover:bg-[#4B574D] cursor-pointer";
const LEVEL = { high: "bg-rose-50 text-rose-700 border-rose-200", medium: "bg-amber-50 text-amber-800 border-amber-200", low: "bg-[#E8EFE9] text-[#56635B] border-[#DCE4DC]" };
const NEXT = { review: "shipping", shipping: "delivered" };
const STATUS = { review: "bg-amber-50 text-amber-800 border-amber-200", shipping: "bg-sky-50 text-sky-700 border-sky-200", delivered: "bg-emerald-50 text-emerald-700 border-emerald-200" };
const ICON = { tasks: ListTodo, snags: AlertTriangle, requests: PackageSearch };

const Del = ({ onClick }) => <button type="button" onClick={onClick} aria-label={T("cash.delete")} className="p-1.5 rounded-lg text-[#6E7B72] hover:text-rose-700 hover:bg-rose-50 cursor-pointer"><Trash2 className="w-4 h-4" /></button>;
const Level = ({ v }) => <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${LEVEL[v]}`}>{T("site.lv." + v)}</span>;
const Card = ({ children, done }) => <article className={`bg-white rounded-xl border border-[#DCE4DC] p-3 flex flex-wrap items-center gap-3 text-xs ${done ? "opacity-60" : ""}`}>{children}</article>;

/** Site work of a real office (staff): tasks, snag list and material requests, per project. */
export default function LiveSite({ kind }) {
  const projects = useProjectList();
  const { tasks, snags, requests } = siteRepo.use();
  const [pid, setPid] = useState(null);
  const [f, setF] = useState({ title: "", level: "medium", due: "", location: "", responsible: "", quantity: "", notes: "" });
  const project = projects.find((p) => p.id === pid) || projects[0];
  const Icon = ICON[kind];
  if (!project) return <main className="flex-1 flex items-center justify-center p-8 font-ibm"><p className="text-sm text-[#56635B] bg-white rounded-xl border border-[#DCE4DC] p-8 text-center max-w-sm">{T("proj.none")}</p></main>;
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const reset = () => setF({ ...f, title: "", due: "", location: "", responsible: "", quantity: "", notes: "" });
  const submit = (e) => {
    e.preventDefault();
    const title = f.title.trim();
    if (!title) return;
    if (kind === "tasks") siteRepo.addTask({ projectId: project.id, title, priority: f.level, due: f.due });
    if (kind === "snags") siteRepo.addSnag({ projectId: project.id, title, location: f.location.trim(), severity: f.level, responsible: f.responsible.trim() });
    if (kind === "requests") siteRepo.addRequest({ projectId: project.id, material: title, quantity: f.quantity.trim(), date: f.due, notes: f.notes.trim() });
    reset();
  };
  const mine = (kind === "tasks" ? tasks : kind === "snags" ? snags : requests).filter((x) => x.projectId === project.id);
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 font-ibm w-full max-w-full overflow-x-hidden">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-[#1F2A26] flex items-center gap-2.5"><Icon className="w-7 h-7" /><span>{T("site.title." + kind)}</span></h1>
          <p className="text-xs md:text-sm text-[#56635B] mt-1">{T("site.sub." + kind)}</p>
        </div>
        <select value={project.id} onChange={(e) => setPid(Number(e.target.value))} className={input + " max-w-md w-full"}>
          {projects.map((p) => <option key={p.id} value={p.id}>{E(p.name)}</option>)}
        </select>
        <form onSubmit={submit} className="bg-white rounded-2xl border border-[#DCE4DC] p-4 flex flex-wrap gap-2 items-end">
          <input required placeholder={T("site.ph." + kind)} value={f.title} onChange={set("title")} className={input + " flex-1 min-w-48"} />
          {kind === "snags" && <><input placeholder={T("site.location")} value={f.location} onChange={set("location")} className={input + " w-32"} /><input placeholder={T("site.responsible")} value={f.responsible} onChange={set("responsible")} className={input + " w-32"} /></>}
          {kind === "requests" && <><input placeholder={T("site.qty")} value={f.quantity} onChange={set("quantity")} className={input + " w-32"} /><input placeholder={T("site.notes")} value={f.notes} onChange={set("notes")} className={input + " w-40"} /></>}
          {kind !== "snags" && <label className="flex items-center gap-1 text-[11px] font-bold text-[#56635B]">{T(kind === "tasks" ? "site.due" : "site.needBy")}<input type={kind === "tasks" ? "date" : "text"} value={f.due} onChange={set("due")} className={input + (kind === "tasks" ? "" : " w-28")} /></label>}
          {kind !== "requests" && <select value={f.level} onChange={set("level")} className={input}>{["high", "medium", "low"].map((l) => <option key={l} value={l}>{T("site.lv." + l)}</option>)}</select>}
          <button type="submit" className={btn}><Plus className="w-4 h-4" />{T("site.add")}</button>
        </form>
        {mine.length === 0 && <EmptyState title={T("site.empty")} hint={T("site.emptyHint")} />}
        <div className="grid gap-2">
          {kind === "tasks" && mine.map((x) => (
            <Card key={x.id} done={x.done}>
              <button type="button" onClick={() => siteRepo.toggleTask(x.id, !x.done)} aria-label={T("site.toggle")} className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer ${x.done ? "bg-[#5F6C61] border-[#5F6C61] text-white" : "border-[#C6D0C6]"}`}>{x.done && <Check className="w-3.5 h-3.5" />}</button>
              <span className={`flex-1 min-w-40 font-semibold text-[#1F2A26] ${x.done ? "line-through" : ""}`}>{x.title}</span>
              {x.due && <span className="text-[#6E7B72] tabular-nums">{x.due}</span>}
              <Level v={x.priority} /><Del onClick={() => siteRepo.removeTask(x.id)} />
            </Card>
          ))}
          {kind === "snags" && mine.map((x) => (
            <Card key={x.id} done={x.resolved}>
              <button type="button" onClick={() => siteRepo.toggleSnag(x.id, !x.resolved)} aria-label={T("site.toggle")} className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer ${x.resolved ? "bg-[#5F6C61] border-[#5F6C61] text-white" : "border-[#C6D0C6]"}`}>{x.resolved && <Check className="w-3.5 h-3.5" />}</button>
              <span className="flex-1 min-w-40"><b className={`text-[#1F2A26] ${x.resolved ? "line-through" : ""}`}>{x.title}</b><span className="text-[#6E7B72]">{[x.location, x.responsible].filter(Boolean).map((v) => ` · ${v}`).join("")}</span></span>
              <Level v={x.severity} /><Del onClick={() => siteRepo.removeSnag(x.id)} />
            </Card>
          ))}
          {kind === "requests" && mine.map((x) => (
            <Card key={x.id}>
              <span className="flex-1 min-w-40"><b className="text-[#1F2A26]">{x.material}</b><span className="text-[#6E7B72]">{[x.quantity, x.date, x.notes].filter(Boolean).map((v) => ` · ${v}`).join("")}</span></span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${STATUS[x.status] || STATUS.review}`}>{T("site.st." + x.status)}</span>
              {NEXT[x.status] && <button type="button" onClick={() => siteRepo.setRequestStatus(x.id, NEXT[x.status])} className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-white bg-[#5F6C61] hover:bg-[#4B574D] cursor-pointer">{T("site.to." + NEXT[x.status])}</button>}
              <Del onClick={() => siteRepo.removeRequest(x.id)} />
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
