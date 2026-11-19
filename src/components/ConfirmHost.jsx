import { useEffect, useRef, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { tr_ as T } from "../i18n";
import { bindConfirm } from "../lib/confirm";

export default function ConfirmHost() {
  const [q, setQ] = useState(null); // { message, opts, done }
  const yesRef = useRef(null);
  useEffect(() => bindConfirm((message, opts) => new Promise((done) => setQ({ message, opts, done }))), []);
  useEffect(() => { if (q) yesRef.current?.focus(); }, [q]);
  if (!q) return null;
  const close = (v) => { q.done(v); setQ(null); };
  const danger = q.opts.danger !== false;
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-[#0E2A47]/50" onMouseDown={(e) => { if (e.target === e.currentTarget) close(false); }} onKeyDown={(e) => { if (e.key === "Escape") close(false); }}>
      <div role="alertdialog" aria-modal="true" aria-label={q.message} className="w-full max-w-sm bg-white rounded-2xl border border-[#E2E8F0] shadow-xl p-5 font-ibm">
        <div className="flex items-start gap-3">
          <span className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${danger ? "bg-rose-50 text-rose-700" : "bg-[#F4F5F7] text-[#0E2A47]"}`}><AlertTriangle className="w-5 h-5" aria-hidden="true" /></span>
          <p className="text-sm font-semibold text-[#0E2A47] leading-relaxed pt-1.5">{q.message}</p>
        </div>
        <div className="mt-5 flex gap-2 justify-end">
          <button type="button" onClick={() => close(false)} className="h-10 px-4 rounded-xl text-xs font-bold bg-white border border-[#E2E8F0] text-[#0E2A47] cursor-pointer">{q.opts.no || T("boq.cancel")}</button>
          <button type="button" ref={yesRef} onClick={() => close(true)} className={`h-10 px-5 rounded-xl text-xs font-bold text-white cursor-pointer ${danger ? "bg-[#E8692A] hover:bg-[#92400E]" : "bg-[#0B7C79] hover:bg-[#086663]"}`}>{q.opts.yes || (danger ? T("cash.delete") : "OK")}</button>
        </div>
      </div>
    </div>
  );
}
