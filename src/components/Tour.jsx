import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { tr_ as T } from "../i18n";
import { stepsFor, roleKey } from "../data/tourSteps";

const doneKey = (id) => `tour:done:${id}`;
const find = (nav) => {
  if (!nav) return null;
  for (const el of document.querySelectorAll(`[data-tour="${nav}"]`)) { const r = el.getBoundingClientRect(); if (r.width > 0 && r.height > 0) return el; }
  return null;
};

/** First-run product tour for a signed-in account; restart with window.dispatchEvent(new Event("miyar:tour")). */
export default function Tour({ role, userId }) {
  const steps = stepsFor(role);
  const [i, setI] = useState(-1);
  const [rect, setRect] = useState(null);
  useEffect(() => {
    let seen = true; try { seen = localStorage.getItem(doneKey(userId)) === "1"; } catch { /* ignore */ }
    if (!seen && steps.length) { const t = setTimeout(() => setI(0), 900); return () => clearTimeout(t); }
  }, [userId, role]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { const on = () => setI(0); window.addEventListener("miyar:tour", on); return () => window.removeEventListener("miyar:tour", on); }, []);
  const measure = useCallback(() => { const el = i >= 0 ? find(steps[i]) : null; setRect(el ? el.getBoundingClientRect() : null); }, [i, steps]);
  useLayoutEffect(() => { measure(); window.addEventListener("resize", measure); return () => window.removeEventListener("resize", measure); }, [measure]);
  if (i < 0 || !steps.length) return null;
  const close = () => { try { localStorage.setItem(doneKey(userId), "1"); } catch { /* ignore */ } setI(-1); };
  const last = i === steps.length - 1;
  const k = `tour.${roleKey(role)}.${i}`;
  const pad = 6;
  const rtl = document.documentElement.dir === "rtl";
  // Card sits beside the spotlight when there is one, else centred.
  const style = rect
    ? { top: Math.min(Math.max(12, rect.top - 8), window.innerHeight - 220), ...(rtl ? { right: window.innerWidth - rect.left + 16 } : { left: rect.right + 16 }) }
    : { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
  return (
    <div className="fixed inset-0 z-[400]" role="dialog" aria-modal="true" aria-label={T(k + ".t")}>
      {rect
        ? <div className="absolute rounded-2xl pointer-events-none transition-all duration-300" style={{ top: rect.top - pad, left: rect.left - pad, width: rect.width + pad * 2, height: rect.height + pad * 2, boxShadow: "0 0 0 9999px rgba(14, 42, 71,0.62), 0 0 0 3px #D97706" }} />
        : <div className="absolute inset-0 bg-[#0E2A47]/60" />}
      <div className="absolute w-[min(22rem,calc(100vw-2rem))] bg-white rounded-2xl border border-[#E2E8F0] shadow-xl p-5 font-ibm" style={style}>
        <p className="text-[11px] font-bold text-[#64748B] tabular-nums">{i + 1} / {steps.length}</p>
        <h2 className="text-base font-semibold text-[#0E2A47] mt-1">{T(k + ".t")}</h2>
        <p className="text-sm text-[#475569] leading-relaxed mt-1.5">{T(k + ".b")}</p>
        <div className="mt-4 flex items-center gap-2">
          {!last && <button type="button" onClick={close} className="text-xs font-bold text-[#64748B] cursor-pointer">{T("tour.skip")}</button>}
          <button type="button" onClick={() => (last ? close() : setI(i + 1))} className="ms-auto h-10 px-5 rounded-xl text-xs font-bold text-white bg-[#0B7C79] hover:bg-[#086663] cursor-pointer">{T(last ? "tour.done" : "tour.next")}</button>
        </div>
      </div>
    </div>
  );
}
