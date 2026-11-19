import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import LogoMark from "./LogoMark";
import { tr_ as T } from "../i18n";

const KEY = "miyar:intro";
const seen = () => { try { return sessionStorage.getItem(KEY) === "1"; } catch { return false; } };
const reduced = () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
// [x%, y%, side] — where each note points on the villa
const NOTES = [[24, 34, "s"], [72, 26, "e"], [62, 74, "e"], [20, 70, "s"]];

/** Cinematic opening on drafting paper: the villa starts as a pencil sketch, a wipe turns it real, notes point at it, then the Miyar mark. */
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
    const id = setTimeout(close, 4300);
    const key = (e) => { if (e.key === "Escape" || e.key === "Enter") close(); };
    window.addEventListener("keydown", key);
    return () => { clearTimeout(id); window.removeEventListener("keydown", key); document.body.style.overflow = ""; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on]);
  if (!on) return null;
  return createPortal(
    <div role="dialog" aria-label={T("ld.1")} className={`intro ${out ? "intro-out" : ""}`}>
      <div className="intro-grid" aria-hidden="true" />
      <div className="intro-corner start-5 top-4" aria-hidden="true">MIYAR · A-01</div>
      <div className="intro-corner end-5 top-4" aria-hidden="true">SCALE 1:100</div>
      <figure className="intro-shot" aria-hidden="true">
        <img src="/landing/villa.webp" alt="" className="intro-sketch" />
        <img src="/landing/villa.webp" alt="" className="intro-real" />
        <span className="intro-wipe" />
        {NOTES.map(([x, y, side], i) => (
          <span key={i} className={`intro-note intro-note-${side}${i === 0 || i === 3 ? " intro-note-x" : ""}`} style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${1.7 + i * 0.18}s` }}>
            <i className="intro-dot" /><i className="intro-lead" /><b>{T(`intro.n${i + 1}`)}</b>
          </span>
        ))}
      </figure>
      <div className="intro-text">
        <div className="intro-mark"><LogoMark className="w-9 h-9" /></div>
        <h2 className="intro-title">{T("intro.welcome")} <span>{T("ld.1")}</span></h2>
        <p className="intro-small">{T("intro.sub")}</p>
      </div>
      <div className="intro-bar" aria-hidden="true"><i /></div>
      <button onClick={close} className="intro-skip">{T("intro.skip")} <kbd>ESC</kbd></button>
    </div>,
    document.body
  );
}
