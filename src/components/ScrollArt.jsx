import { useEffect, useRef } from "react";

/** Blueprint that keeps drawing as the page scrolls: a wall-path along the edge + a measuring tape with a brass gauge. */
export default function ScrollArt({ bare = false }) {
  const path = useRef(null), gauge = useRef(null), label = useRef(null);
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = Math.max(1, root.scrollHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, window.scrollY / max));
      root.style.setProperty("--sy", String(window.scrollY));
      if (path.current) path.current.style.strokeDashoffset = String(1 - p);
      if (gauge.current) gauge.current.style.transform = `translateY(${p * 100}%)`;
      if (label.current) label.current.textContent = (p * (root.scrollHeight / 1000)).toFixed(1);
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    if (!reduce) { window.addEventListener("scroll", on, { passive: true }); window.addEventListener("resize", on); }
    else if (path.current) path.current.style.strokeDashoffset = "0";
    // reveal-on-scroll for section drawings
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.25 });
    document.querySelectorAll(".reveal").forEach((el) => (reduce ? el.classList.add("in") : io.observe(el)));
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); io.disconnect(); if (raf) cancelAnimationFrame(raf); };
  }, []);

  if (bare) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-y-0 end-0 z-30 hidden w-14 xl:block text-[#1F2A26]/30">
      {/* wall path: draws with scroll */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 56 1000" preserveAspectRatio="none" fill="none">
        <path ref={path} pathLength="1" d="M28 0V140H10V330H46V540H14V760H40V1000" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="miter" style={{ strokeDasharray: 1, strokeDashoffset: 1 }} />
      </svg>
      {/* tape + gauge */}
      <div className="absolute inset-y-16 end-1.5 w-3" style={{ background: "repeating-linear-gradient(to bottom, currentColor 0 1px, transparent 1px 12px) right/6px 100% no-repeat, repeating-linear-gradient(to bottom, currentColor 0 1px, transparent 1px 60px) right/12px 100% no-repeat" }}>
        <div ref={gauge} className="absolute -top-px end-0 will-change-transform" style={{ height: "100%", width: "100%" }}>
          <div className="absolute end-3 -translate-y-1/2 flex items-center gap-1" style={{ top: 0 }}>
            <span className="rounded-md bg-[var(--brass)] px-1.5 py-0.5 font-display text-[10px] font-semibold text-[#1F2A26] tabular-nums"><span ref={label}>0.0</span></span>
            <span className="h-px w-3 bg-[var(--brass)]" />
          </div>
        </div>
      </div>
    </div>
  );
}
