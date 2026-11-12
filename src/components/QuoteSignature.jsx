import { useState } from "react";
import { createPortal } from "react-dom";
import { PenLine, CheckCircle2, X } from "lucide-react";
import { tr_ as T } from "../i18n";
import { signaturesStore } from "../data/stores";
import SignaturePad from "./SignaturePad";

/** Electronic acceptance of a quote: typed name + drawn signature, bound to the quote number and total. */
export default function QuoteSignature({ quoteNo, total, defaultName = "" }) {
  const [sigs, setSigs] = signaturesStore.use();
  const sig = sigs[quoteNo];
  const valid = sig && sig.total === total;
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(defaultName);
  const [img, setImg] = useState(null);

  const save = () => {
    if (!name.trim() || !img) return;
    setSigs((s) => ({ ...s, [quoteNo]: { name: name.trim(), img, total, at: new Date().toISOString() } }));
    setOpen(false);
  };

  return (
    <div className="no-print">
      {valid ? (
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{T("sign.done", { 0: sig.name, 1: new Date(sig.at).toLocaleDateString() })}</span>
          <button type="button" onClick={() => setSigs((s) => { const n = { ...s }; delete n[quoteNo]; return n; })} className="ms-auto text-[#535E78] hover:text-[#1A2236] cursor-pointer"><X className="w-3.5 h-3.5" /></button>
        </div>
      ) : (
        <button type="button" onClick={() => { setName(defaultName); setImg(null); setOpen(true); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#24304D] hover:bg-[#1A2236] cursor-pointer">
          <PenLine className="w-4 h-4" />{T(sig ? "sign.resign" : "sign.btn")}
        </button>
      )}
      {open && createPortal(
        <div className="no-print fixed inset-0 z-[70] bg-[#1A2236]/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 space-y-4 text-start">
            <h3 className="text-base font-black text-[#1A2236]">{T("sign.title")} · {quoteNo}</h3>
            <p className="text-xs text-[#535E78] leading-relaxed">{T("sign.terms")}</p>
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={80} placeholder={T("sign.name")} className="w-full px-3 py-2 rounded-lg border border-[#DAD3C2] text-sm font-bold" />
            <SignaturePad onChange={setImg} label={T("sign.pad")} clearLabel={T("sign.clear")} />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 rounded-lg text-xs font-bold text-[#535E78] hover:bg-[#E9E3D5] cursor-pointer">{T("se.124")}</button>
              <button type="button" disabled={!name.trim() || !img} onClick={save} className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-[#24304D] disabled:opacity-40 cursor-pointer">{T("sign.confirm")}</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
