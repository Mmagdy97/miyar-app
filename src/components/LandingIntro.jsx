import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import LogoMark from "./LogoMark";
import { tr_ as T } from "../i18n";

const KEY = "miyar:intro";
const seen = () => { try { return sessionStorage.getItem(KEY) === "1"; } catch { return false; } };
const reduced = () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** Cinematic opening: a blueprint floor plan draws itself, dimensions appear, then the Miyar mark. Once per session; skippable. */
export default function LandingIntro() {
  const [on, setOn] = useState(() => typeof window !== "undefined" && !seen() && !reduced());
  const [out, setOut] = useState(false);
  const close = () => {
    setOut(true);
    try { sessionStorage.setItem(KEY, "1"); } catch { /* storage unavailable */ }
    setTimeout(() => setOn(false), 700);
  };
  useEffect(() => {
    if (!on) return;
    document.body.style.overflow = "hidden";
    const id = setTimeout(close, 4000);
    const key = (e) => { if (e.key === "Escape" || e.key === "Enter") close(); };
    window.addEventListener("keydown", key);
    return () => { clearTimeout(id); window.removeEventListener("keydown", key); document.body.style.overflow = ""; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on]);
  if (!on) return null;
  const W = (d, i) => <path key={i} d={d} pathLength="1" className="intro-draw" style={{ animationDelay: `${0.15 + i * 0.09}s` }} />;
  const walls = ["M20 20H380V220H20Z", "M150 20V120", "M150 150V220", "M150 120H260", "M260 20V95", "M260 125V220", "M20 140H110", "M290 160H380"];
  return createPortal(
    <div role="dialog" aria-label={T("ld.1")} className={`intro ${out ? "intro-out" : ""}`}>
      <div className="intro-grid" aria-hidden="true" />
      <div className="intro-glow" aria-hidden="true" />
      <div className="intro-corner start-5 top-4" aria-hidden="true">MIYAR // A-01 PLAN</div>
      <div className="intro-corner end-5 top-4" aria-hidden="true">SCALE 1:100</div>
      <div className="intro-corner start-5 bottom-5" aria-hidden="true">650 M² · {T("intro.status")}</div>
      <div className="intro-stage">
        <svg viewBox="-10 -30 430 290" className="intro-plan" aria-hidden="true" fill="none" stroke="currentColor">
          <g strokeWidth="4" strokeLinecap="square">{walls.map(W)}</g>
          <g strokeWidth="1.2" className="intro-fine">
            <path d="M150 120A30 30 0 0 1 180 150" pathLength="1" className="intro-draw" style={{ animationDelay: ".9s" }} />
            <path d="M260 95A30 30 0 0 0 290 125" pathLength="1" className="intro-draw" style={{ animationDelay: "1s" }} />
            <path d="M60 20H110M60 14V26M110 14V26M310 220H350" pathLength="1" className="intro-draw" style={{ animationDelay: "1.05s" }} />
          </g>
          <g className="intro-dim" strokeWidth="1">
            <path d="M20 -12H380M20 -18V-6M380 -18V-6" />
            <path d="M400 20V220M394 20H406M394 220H406" />
            <text x="200" y="-17" textAnchor="middle" fill="currentColor" stroke="none">14.60</text>
            <text x="412" y="124" fill="currentColor" stroke="none" transform="rotate(90 412 124)" textAnchor="middle">9.20</text>
          </g>
        </svg>
        <div className="intro-logo"><LogoMark className="w-20 h-20" /></div>
      </div>
      <div className="intro-text">
        <p className="intro-small">{T("intro.sub")}</p>
        <h2 className="intro-title">{T("intro.welcome")} <span>{T("ld.1")}</span></h2>
        <div className="intro-bar" aria-hidden="true"><i /></div>
      </div>
      <button onClick={close} className="intro-skip">{T("intro.skip")} <kbd>ESC</kbd></button>
    </div>,
    document.body
  );
}
