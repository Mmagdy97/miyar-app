import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import LogoMark from "./LogoMark";
import { tr_ as T } from "../i18n";

const KEY = "miyar:intro";
const seen = () => { try { return sessionStorage.getItem(KEY) === "1"; } catch { return false; } };
const reduced = () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** Cinematic opening: dark stage, copper glow, scanning line, ticking ring, wordmark. Once per session; skippable. */
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
    const id = setTimeout(close, 3600);
    const key = (e) => { if (e.key === "Escape" || e.key === "Enter") close(); };
    window.addEventListener("keydown", key);
    return () => { clearTimeout(id); window.removeEventListener("keydown", key); document.body.style.overflow = ""; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on]);
  if (!on) return null;
  const ticks = Array.from({ length: 72 }, (_, i) => i);
  return createPortal(
    <div role="dialog" aria-label={T("ld.1")} className={`intro ${out ? "intro-out" : ""}`}>
      <div className="intro-glow" aria-hidden="true" />
      <div className="intro-line" aria-hidden="true" />
      <div className="intro-corner start-5 top-4" aria-hidden="true">MIYAR // PLATFORM</div>
      <div className="intro-corner end-5 top-4" aria-hidden="true">{T("intro.status")}</div>
      <div className="intro-stage">
        <svg viewBox="-100 -100 200 200" className="intro-ring" aria-hidden="true">
          <circle r="92" fill="none" stroke="currentColor" strokeOpacity=".25" />
          {ticks.map((i) => <line key={i} x1="0" y1={i % 6 === 0 ? -86 : -89} x2="0" y2="-92" stroke="currentColor" strokeOpacity={i % 6 === 0 ? 0.8 : 0.4} transform={`rotate(${i * 5})`} />)}
        </svg>
        <div className="intro-logo"><LogoMark className="w-16 h-16" /></div>
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
