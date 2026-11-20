import { useEffect, useRef, useState } from "react";
import { tr_ as T } from "../i18n";
import { Bidi, N } from "./Bidi";

const STATS = [[16, "lp.st1", "+"], [8, "lp.st2"], [3, "lp.st3"], [6, "lp.st4"]];

function Count({ to }) {
  const ref = useRef(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now(), D = 1400;
      const step = (t) => { const p = Math.min(1, (t - t0) / D); setN(Math.round(to * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{n}</span>;
}

/** Product facts as animated counters + the questions an owner asks, answered in one line. */
export default function LandingProof() {
  return (
    <section className="px-5 sm:px-8 py-14 sm:py-20 max-w-6xl mx-auto w-full">
      <dl className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-[28px] overflow-hidden bg-[var(--md-outline-variant)] border border-[var(--md-outline-variant)]">
        {STATS.map(([n, k, plus]) => (
          <div key={k} className="bg-[var(--md-surface-container-low)] p-5 sm:p-8 text-start">
            <dd className="font-display text-5xl sm:text-7xl font-semibold text-[var(--md-primary)] tabular-nums leading-none"><N><Count to={n} />{plus && <span className="text-[var(--md-tertiary)]">{plus}</span>}</N></dd>
            <dt className="mt-3 text-sm sm:text-base text-[var(--md-on-surface-variant)]">{T(k)}</dt>
          </div>
        ))}
      </dl>
      <div className="mt-14 sm:mt-20 text-start">
        <h2 className="font-display text-3xl sm:text-5xl font-semibold leading-tight text-[var(--md-on-surface)] text-balance max-w-3xl">{T("proof.t1")} <span className="text-[var(--md-tertiary)]">{T("proof.t2")}</span></h2>
        <ul className="mt-8 border-t border-[var(--md-outline-variant)]">
          {[1, 2, 3, 4].map((n) => (
            <li key={n} className="grid md:grid-cols-2 gap-x-10 gap-y-2 py-6 border-b border-[var(--md-outline-variant)]">
              <p className="font-display text-xl sm:text-2xl font-semibold text-[var(--md-on-surface)]"><span className="text-[var(--md-tertiary)] tabular-nums me-3 text-base">0{n}</span>{T("proof.q" + n)}</p>
              <p className="text-base leading-relaxed text-[var(--md-on-surface-variant)]"><Bidi>{T("proof.a" + n)}</Bidi></p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
