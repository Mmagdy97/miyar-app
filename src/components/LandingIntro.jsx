import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { tr_ as T } from "../i18n";

const KEY = "miyar:intro";
const seen = () => { try { return sessionStorage.getItem(KEY) === "1"; } catch { return false; } };
const reduced = () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
// [left%, bottom%, width vw, drift direction, delay s]
const CLOUDS = [[-10, -6, 70, 1, 0], [40, -8, 75, -1, 0.1], [10, 4, 55, -1, 0.2], [60, 2, 50, 1, 0.15], [-5, 14, 40, 1, 0.3], [70, 12, 42, -1, 0.25], [30, -14, 80, 1, 0]];

/** Cinematic opening: a sky, the headline, and the villa rising out of the clouds as they drift apart. */
export default function LandingIntro() {
  const [on, setOn] = useState(() => typeof window !== "undefined" && !seen() && !reduced());
  const [out, setOut] = useState(false);
  const close = () => {
    setOut(true);
    try { sessionStorage.setItem(KEY, "1"); } catch { /* storage unavailable */ }
    setTimeout(() => setOn(false), 800);
  };
  useEffect(() => {
    if (!on) return;
    document.body.style.overflow = "hidden";
    const id = setTimeout(close, 4200);
    const key = (e) => { if (e.key === "Escape" || e.key === "Enter") close(); };
    window.addEventListener("keydown", key);
    return () => { clearTimeout(id); window.removeEventListener("keydown", key); document.body.style.overflow = ""; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on]);
  if (!on) return null;
  return createPortal(
    <div role="dialog" aria-label={T("ld.1")} className={`sky ${out ? "sky-out" : ""}`}>
      <div className="sky-top">
        <span className="sky-brand">{T("ld.1")}</span>
        <button onClick={close} className="sky-skip">{T("intro.skip")}</button>
      </div>
      <div className="sky-head">
        <h2>{T("lp.h1a")} {T("lp.h1b")}</h2>
        <p>{T("intro.sub")}</p>
      </div>
      <img src="/landing/villa-cut.webp" alt="" className="sky-villa" />
      <div className="sky-clouds" aria-hidden="true">
        {CLOUDS.map(([l, b, w, dir, d], i) => (
          <span key={i} style={{ left: `${l}%`, bottom: `${b}%`, width: `${w}vw`, "--dx": `${dir * 18}vw`, animationDelay: `${d}s` }} />
        ))}
      </div>
    </div>,
    document.body
  );
}
