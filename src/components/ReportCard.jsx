import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { tr_ as T } from "../i18n";
import { photoUrls } from "../data/reports";

/** One daily report: date, author, note, progress and its photos (signed URLs, opened full size on click). */
export default function ReportCard({ r, onRemove, waHref }) {
  const [urls, setUrls] = useState({});
  useEffect(() => { let on = true; photoUrls(r.photos).then((u) => { if (on) setUrls(u); }); return () => { on = false; }; }, [r.photos]);
  return (
    <article className="bg-white rounded-xl border border-[#E2E8F0] p-3 space-y-2 text-xs">
      <div className="flex items-center gap-2">
        <span className="font-bold text-[#0E2A47] tabular-nums">{r.day}</span>
        {r.author && <span className="text-[#64748B]">· {r.author}</span>}
        {r.progress != null && <span className="ms-auto font-bold text-[#0B7C79] tabular-nums">{r.progress}%</span>}
        {waHref && <a href={waHref} target="_blank" rel="noreferrer" className="ms-auto px-2.5 h-7 inline-flex items-center rounded-md text-[11px] font-bold text-white bg-[#1F8F4E]">{T("wa.btn")}</a>}
        {onRemove && <button type="button" onClick={onRemove} aria-label={T("cash.delete")} className={`p-1 rounded text-[#64748B] hover:text-rose-700 cursor-pointer ${r.progress != null || waHref ? "" : "ms-auto"}`}><Trash2 className="w-3.5 h-3.5" /></button>}
      </div>
      {r.note && <p className="text-[#0E2A47] whitespace-pre-wrap leading-relaxed">{r.note}</p>}
      {r.photos.length > 0 && (
        <div className="grid grid-cols-3 gap-1.5">
          {r.photos.map((p) => urls[p]
            ? <a key={p} href={urls[p]} target="_blank" rel="noreferrer"><img src={urls[p]} alt={T("rep.photo")} loading="lazy" className="w-full aspect-square object-cover rounded-lg border border-[#E2E8F0]" /></a>
            : <div key={p} className="w-full aspect-square rounded-lg bg-[#EEF1F5]" />)}
        </div>
      )}
    </article>
  );
}
