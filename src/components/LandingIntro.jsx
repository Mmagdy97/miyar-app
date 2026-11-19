import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import LogoMark from "./LogoMark";
import { tr_ as T } from "../i18n";

const KEY = "miyar:intro";
const seen = () => { try { return sessionStorage.getItem(KEY) === "1"; } catch { return false; } };
const reduced = () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

// Isometric projection: x→ right-down, y→ left-down, z→ up.
const S = 34, C = Math.cos(Math.PI / 6), N = 0.5;
const P = (x, y, z) => `${((x - y) * C * S).toFixed(1)},${((x + y) * N * S - z * S).toFixed(1)}`;
const quad = (...pts) => pts.map((p) => P(...p)).join(" ");
// [x, y, z, w, d, h, glass?, accent?] — slab, three floors (top one cantilevered), roof
const BLOCKS = [
  [0, 0, 0, 6.4, 5.4, 0.35],
  [0.7, 0.7, 0.35, 5, 4, 1.1, true],
  [0.7, 0.7, 1.45, 5, 4, 1.1, true],
  [0.2, 0.4, 2.55, 5.9, 4.4, 1.1, true],
  [0.5, 0.7, 3.65, 4.6, 3.4, 0.28],
  [3.2, 1.2, 3.93, 1.6, 1.4, 0.45, false, true],
];

function Block([x, y, z, w, d, h, glass, accent], i) {
  const left = quad([x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]);
  const right = quad([x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]);
  const top = quad([x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]);
  const g1 = 0.22 * h, g2 = 0.82 * h;
  return (
    <g key={i} className="intro-floor" style={{ animationDelay: `${0.25 + i * 0.36}s` }}>
      <polygon points={left} fill={accent ? "#E0652A" : "#DCE3EA"} />
      <polygon points={right} fill={accent ? "#C4531F" : "#B9C6D3"} />
      <polygon points={top} fill={accent ? "#F47B3B" : "#FFFFFF"} />
      {glass && <>
        <polygon points={quad([x + 0.25, y + d, z + g1], [x + w - 0.25, y + d, z + g1], [x + w - 0.25, y + d, z + g2], [x + 0.25, y + d, z + g2])} fill="#14A3A0" fillOpacity=".75" />
        <polygon points={quad([x + w, y + 0.25, z + g1], [x + w, y + d - 0.25, z + g1], [x + w, y + d - 0.25, z + g2], [x + w, y + 0.25, z + g2])} fill="#0E2A47" fillOpacity=".8" />
        {[1, 2, 3, 4].map((k) => { const xx = x + (w * k) / 5; return <line key={k} x1={P(xx, y + d, z + g1).split(",")[0]} y1={P(xx, y + d, z + g1).split(",")[1]} x2={P(xx, y + d, z + g2).split(",")[0]} y2={P(xx, y + d, z + g2).split(",")[1]} stroke="#fff" strokeOpacity=".6" />; })}
      </>}
      <polygon points={left} fill="none" stroke="#0E2A47" strokeOpacity=".25" />
      <polygon points={right} fill="none" stroke="#0E2A47" strokeOpacity=".25" />
      <polygon points={top} fill="none" stroke="#0E2A47" strokeOpacity=".25" />
    </g>
  );
}

/** Cinematic opening: an isometric villa builds floor by floor while progress counts 0→100%, then the Miyar mark. */
export default function LandingIntro() {
  const [on, setOn] = useState(() => typeof window !== "undefined" && !seen() && !reduced());
  const [out, setOut] = useState(false);
  const [pct, setPct] = useState(0);
  const close = () => {
    setOut(true);
    try { sessionStorage.setItem(KEY, "1"); } catch { /* storage unavailable */ }
    setTimeout(() => setOn(false), 700);
  };
  useEffect(() => {
    if (!on) return;
    document.body.style.overflow = "hidden";
    const id = setTimeout(close, 4400);
    const key = (e) => { if (e.key === "Escape" || e.key === "Enter") close(); };
    window.addEventListener("keydown", key);
    let raf, t0;
    const step = (t) => { t0 ??= t; const p = Math.min(1, (t - t0) / 2700); setPct(Math.round(100 * (1 - Math.pow(1 - p, 2)))); if (p < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
    return () => { clearTimeout(id); cancelAnimationFrame(raf); window.removeEventListener("keydown", key); document.body.style.overflow = ""; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on]);
  if (!on) return null;
  const phase = pct < 25 ? 1 : pct < 60 ? 2 : pct < 100 ? 3 : 4;
  return createPortal(
    <div role="dialog" aria-label={T("ld.1")} className={`intro ${out ? "intro-out" : ""}`}>
      <div className="intro-grid" aria-hidden="true" />
      <div className="intro-corner start-5 top-4" aria-hidden="true">MIYAR · PROJECT 001</div>
      <div className="intro-corner end-5 top-4" aria-hidden="true">SCALE 1:100</div>
      <div className="intro-build" aria-hidden="true">
        <svg viewBox="-200 -150 440 330" className="intro-iso">
          <ellipse cx="20" cy="150" rx="190" ry="26" fill="#0E2A47" opacity=".08" />
          {BLOCKS.map(Block)}
        </svg>
        <div className="intro-meter">
          <div className="intro-pct"><span>{pct}</span>%</div>
          <div className="intro-phase">{T(`intro.p${phase}`)}</div>
          <div className="intro-track"><i style={{ transform: `scaleX(${pct / 100})` }} /></div>
        </div>
      </div>
      <div className="intro-text">
        <div className="intro-mark"><LogoMark className="w-9 h-9" /></div>
        <h2 className="intro-title">{T("intro.welcome")} <span>{T("ld.1")}</span></h2>
        <p className="intro-small">{T("intro.sub")}</p>
      </div>
      <button onClick={close} className="intro-skip">{T("intro.skip")} <kbd>ESC</kbd></button>
    </div>,
    document.body
  );
}
