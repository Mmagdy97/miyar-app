import Photo from "./Photo";
import { useProjectList } from "../data/projects";
import { useState } from "react";
import { Palette, Heart, Trash2, Plus } from "lucide-react";
import { tr_ as T, E } from "../i18n";
import { CLIENT_PROJECT_ID } from "../data/seed";
import { moodStore } from "../data/stores";
import { cleanTile } from "../lib/moodboard";

const input = "px-3 py-2 rounded-lg border border-[#E6DFD0] text-xs font-bold text-[#1F2421] bg-white min-w-0";

/** Moodboard: the designer pins images, colours and notes; the client likes the ones they love. */
function MoodboardInner({ role = "Admin", projects }) {
  const isClient = role === "Client";
  const [tiles, setTiles] = moodStore.use();
  const [projectId, setProjectId] = useState(isClient ? (projects.find((p) => p.id === CLIENT_PROJECT_ID)?.id ?? projects[0].id) : projects[0].id);
  const [kind, setKind] = useState("image");
  const [value, setValue] = useState("#c8a27a");
  const [caption, setCaption] = useState("");
  const [bad, setBad] = useState(false);
  const project = (projects.find((p) => p.id === Number(projectId)) || projects[0]);
  const mine = tiles.filter((t) => t.projectId === project.id);

  const add = (e) => {
    e.preventDefault();
    const t = cleanTile({ kind, value, caption });
    if (!t) return setBad(true);
    setBad(false);
    setTiles((a) => [{ id: Date.now(), projectId: project.id, liked: false, ...t }, ...a]);
    setCaption("");
    if (kind !== "color") setValue("");
  };
  const like = (id) => setTiles((a) => a.map((t) => (t.id === id ? { ...t, liked: !t.liked } : t)));
  const del = (id) => setTiles((a) => a.filter((t) => t.id !== id));

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent pb-24 font-ibm w-full max-w-full overflow-x-hidden">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-[#1F2421] flex items-center gap-2.5"><Palette className="w-7 h-7" /><span>{T("mood.title")}</span></h1>
          <p className="text-xs md:text-sm text-[#555B53] mt-1">{T(isClient ? "mood.sub.client" : "mood.sub")}</p>
        </div>
        {!isClient && (
          <>
            <select value={projectId} onChange={(e) => setProjectId(e.target.value)} className={input + " max-w-md w-full"}>
              {projects.map((p) => <option key={p.id} value={p.id}>{E(p.name)}</option>)}
            </select>
            <form onSubmit={add} className="bg-white rounded-lg border border-[#E6DFD0] p-4 flex flex-wrap gap-2 items-end">
              <select value={kind} onChange={(e) => { setKind(e.target.value); setValue(e.target.value === "color" ? "#c8a27a" : ""); }} className={input}>
                {["image", "color", "note"].map((k) => <option key={k} value={k}>{T("mood.k." + k)}</option>)}
              </select>
              {kind === "color" ? (
                <input type="color" value={value} onChange={(e) => setValue(e.target.value)} className="h-9 w-14 rounded-lg border border-[#E6DFD0] cursor-pointer" />
              ) : (
                <input required value={value} onChange={(e) => setValue(e.target.value)} placeholder={T(kind === "image" ? "mood.ph.image" : "mood.ph.note")} className={input + " flex-1 min-w-48"} />
              )}
              <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder={T("mood.caption")} maxLength={120} className={input + " w-40"} />
              <button type="submit" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#17614F] hover:bg-[#17614F] cursor-pointer"><Plus className="w-4 h-4" />{T("mood.add")}</button>
              {bad && <p className="w-full text-[11px] font-bold text-rose-700">{T("mood.bad")}</p>}
            </form>
          </>
        )}
        {mine.length === 0 && <p className="text-xs text-[#555B53] bg-white rounded-lg border border-[#E6DFD0] p-6 text-center">{T("mood.empty")}</p>}
        <div className="columns-2 md:columns-3 gap-3 [&>*]:mb-3">
          {mine.map((t) => (
            <figure key={t.id} className="break-inside-avoid bg-white rounded-lg border border-[#E6DFD0] overflow-hidden">
              {t.kind === "image" && <div className="aspect-[4/3]"><Photo src={t.value} alt={t.caption} className="w-full h-full object-cover" /></div>}
              {t.kind === "color" && <div className="h-28 flex items-end p-2" style={{ background: t.value }}><span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/80 text-black">{t.value}</span></div>}
              {t.kind === "note" && <p className="p-4 text-sm font-bold text-[#1F2421] leading-relaxed">{t.value}</p>}
              <figcaption className="flex items-center justify-between gap-2 px-3 py-2 text-[11px] font-bold text-[#555B53]">
                <span className="truncate">{t.caption}</span>
                <span className="flex items-center gap-1.5 shrink-0">
                  <button type="button" onClick={() => like(t.id)} aria-label={T("mood.like")} className="cursor-pointer"><Heart className={`w-4 h-4 ${t.liked ? "fill-rose-500 text-rose-500" : ""}`} /></button>
                  {!isClient && <button type="button" onClick={() => del(t.id)} aria-label={T("mood.del")} className="cursor-pointer hover:text-rose-600"><Trash2 className="w-4 h-4" /></button>}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </main>
  );
}

function NoProjects() {
  return (
    <main className="flex-1 flex items-center justify-center p-8 font-ibm">
      <p className="text-sm text-[#555B53] bg-white rounded-xl border border-[#E6DFD0] p-8 text-center max-w-sm">{T("proj.none")}</p>
    </main>
  );
}

export default function Moodboard(props) {
  const projects = useProjectList();
  return projects.length ? <MoodboardInner {...props} projects={projects} /> : <NoProjects />;
}
