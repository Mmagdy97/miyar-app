import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { tr_ as T } from "../i18n";

const KEY = "miyar:intro";
const seen = () => { try { return sessionStorage.getItem(KEY) === "1"; } catch { return false; } };
const reduced = () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** Cinematic opening: a dimension line stretches across the page while it measures, then contracts into the Miyar mark. */
export default function LandingIntro() {
  const [on, setOn] = useState(() => typeof window !== "undefined" && !seen() && !reduced());
  const [out, setOut] = useState(false);
  const [m, setM] = useState(0);
  const close = () => {
    setOut(true);
    try { sessionStorage.setItem(KEY, "1"); } catch { /* storage unavailable */ }
    setTimeout(() => setOn(false), 700);
  };
  useEffect(() => {
    if (!on) return;
    document.body.style.overflow = "hidden";
    const id = setTimeout(close, 3700);
    const key = (e) => { if (e.key === "Escape" || e.key === "Enter") close(); };
    window.addEventListener("keydown", key);
    let raf, t0;
    const step = (t) => { t0 ??= t; const p = Math.min(1, (t - t0) / 700); setM(14.6 * (1 - Math.pow(1 - p, 3))); if (p < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
    return () => { clearTimeout(id); cancelAnimationFrame(raf); window.removeEventListener("keydown", key); document.body.style.overflow = ""; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on]);
  if (!on) return null;
  return createPortal(
    <div role="dialog" aria-label={T("ld.1")} className={`intro ${out ? "intro-out" : ""}`}>
      <div className="intro-grid" aria-hidden="true" />
      <div className="intro-corner start-5 top-4" aria-hidden="true">MIYAR · معيار</div>
      <div className="intro-corner end-5 top-4" aria-hidden="true">SCALE 1:100</div>
      <svg viewBox="-168 4 400 60" className="intro-measure" aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <text x="32" y="45" textAnchor="middle" className="intro-num">{m.toFixed(2)} m</text>
        <g className="intro-dimline" stroke="#F47B3B" strokeWidth="3">
          <path d="M12 52h40" vectorEffect="non-scaling-stroke" />
          <path d="M12 47v10M52 47v10" vectorEffect="non-scaling-stroke" />
        </g>
        <path d="M12 38V12l20 20 20-20v26" pathLength="1" className="intro-m" stroke="#0E2A47" strokeWidth="6" />
      </svg>
      <div className="intro-text">
        <h2 className="intro-word">{T("ld.1")}</h2>
        <p className="intro-small">{T("intro.sub")}</p>
      </div>
      <button onClick={close} className="intro-skip">{T("intro.skip")} <kbd>ESC</kbd></button>
    </div>,
    document.body
  );
}
