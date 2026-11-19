import { useState } from "react";
import { Check, Minus, X, XCircle, CheckCircle2 } from "lucide-react";
import { tr_ as T, useI18n, intlLocale } from "../i18n";
import { PRICES, LAUNCH_FACTOR } from "../lib/pricing";
import { formatMoney } from "../lib/currency";
import { Bidi, N } from "./Bidi";
import { useViewCurrency } from "../lib/viewCurrency";

// 1 = yes, 0.5 = partly, 0 = no. Columns: general tools, global contractor software, local ERP, Miyar.
const ROWS = [
  [0.5, 0, 1, 1], [0, 0.5, 0.5, 1], [0, 0, 0.5, 1], [0, 0.5, 0.5, 1], [0.5, 1, 1, 1],
  [0.5, 0.5, 0.5, 1], [0, 0, 0, 1], [0, 0, 0.5, 1], [1, 0, 0, 1],
];

function Cell({ v }) {
  const [Icon, cls, label] = v === 1 ? [Check, "text-[var(--md-primary)]", "cmp.yes"] : v === 0.5 ? [Minus, "text-amber-600", "cmp.part"] : [X, "text-[var(--ink-3)]", "cmp.no"];
  return <span className={`inline-flex ${cls}`}><Icon className="w-5 h-5" aria-hidden="true" /><span className="sr-only">{T(label)}</span></span>;
}

function Calculator() {
  const [team, setTeam] = useState(8);
  const [proj, setProj] = useState(3);
  useI18n();
  const currency = useViewCurrency();
  const cur = PRICES[currency] ? currency : "USD";
  // Competitor USD list prices scaled to the market the same way our regional price list is.
  const k = PRICES[cur][1] / PRICES.USD[1];
  const perSeat = Math.round(60 * k), perGen = Math.round(10 * k);
  const fmt = (n) => formatMoney(n, cur, intlLocale(), { compact: true });
  const seat = team * perSeat, gen = team * perGen;
  // Monthly billing: regular price (the launch offer is for 3, 6 and 12-month subscriptions).
  const miyar = proj <= 1 ? 0 : proj <= 4 ? PRICES[cur][1] * LAUNCH_FACTOR : proj <= 8 ? PRICES[cur][2] * LAUNCH_FACTOR : null;
  const save = miyar == null ? null : (seat - miyar) * 12;
  const rows = [
    ["calc.seat", T("calc.seatd", { p: fmt(perSeat) }), fmt(seat), false],
    ["calc.gen", T("calc.gend", { p: fmt(perGen) }), fmt(gen), false],
    ["calc.miyar", T("calc.miyard"), miyar == null ? T("calc.custom") : miyar === 0 ? T("calc.free") : fmt(miyar), true],
  ];
  let curName = cur;
  try { curName = new Intl.DisplayNames(intlLocale(), { type: "currency" }).of(cur); } catch { /* old browsers */ }
  return (
    <div className="lp-card p-5 sm:p-8 text-start">
      <h3 className="font-display text-2xl sm:text-3xl font-semibold">{T("calc.t")}</h3>
      <div className="mt-6 grid sm:grid-cols-2 gap-5">
        {[[T("calc.team"), team, setTeam, 1, 30], [T("calc.proj"), proj, setProj, 1, 15]].map(([l, v, set, mn, mx]) => (
          <label key={l} className="block">
            <span className="flex justify-between text-sm font-semibold"><span>{l}</span><N className="text-[var(--md-primary)]">{v}{v === 15 ? "+" : ""}</N></span>
            <input type="range" min={mn} max={mx} value={v} onChange={(e) => set(+e.target.value)} aria-label={l} className="mt-2 w-full accent-[#0B7C79]" />
          </label>
        ))}
      </div>
      <div className="mt-7 grid sm:grid-cols-3 gap-3">
        {rows.map(([k, d, price, me]) => (
          <div key={k} className={`rounded-[22px] p-5 ${me ? "bg-[#0E2A47] text-white" : "bg-[var(--paper-2)]"}`}>
            <p className="text-sm font-semibold opacity-90">{T(k)}</p>
            <p className="mt-2 font-display text-3xl sm:text-4xl font-semibold"><N>{price}</N><span className="text-sm font-medium opacity-70 ms-1">{miyar === 0 && me ? "" : T("calc.per")}</span></p>
            <p className="mt-2 text-xs leading-relaxed opacity-75"><Bidi>{d}</Bidi></p>
          </div>
        ))}
      </div>
      {save > 0 && <p className="mt-5 text-base sm:text-lg font-semibold">{T("calc.save1")} <N className="text-[var(--md-primary)]">{fmt(save)}</N> {T("calc.save2")}</p>}
      <p className="mt-3 text-xs text-[var(--ink-3)]">{T("calc.note", { c: curName })}</p>
    </div>
  );
}

export default function LandingWhy() {
  return (
    <section id="why" className="px-5 sm:px-8 py-14 sm:py-20 max-w-6xl mx-auto w-full">
      <div className="text-start reveal">
        <p className="text-[12px] tracking-[.16em] uppercase font-semibold text-[var(--md-primary)]">{T("why.kick")}</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl sm:text-5xl font-semibold leading-tight text-balance">{T("why.t")}</h2>
      </div>

      <div className="reveal mt-10 grid md:grid-cols-2 gap-3 sm:gap-4 text-start">
        <div className="lp-card p-5 sm:p-7">
          <h3 className="text-sm font-bold uppercase tracking-wide text-[var(--ink-3)]">{T("why.before")}</h3>
          <ul className="mt-4 space-y-3.5">{[1, 2, 3, 4, 5].map((n) => <li key={n} className="flex gap-3 text-[15px] text-[var(--ink-2)]"><XCircle className="w-5 h-5 shrink-0 text-[#DC2626]" aria-hidden="true" /><span><Bidi>{T(`why.b${n}`)}</Bidi></span></li>)}</ul>
        </div>
        <div className="rounded-[28px] p-5 sm:p-7 bg-[#0E2A47] text-white border border-[#0E2A47]">
          <h3 className="text-sm font-bold uppercase tracking-wide text-[#7FD3D1]">{T("why.after")}</h3>
          <ul className="mt-4 space-y-3.5">{[1, 2, 3, 4, 5].map((n) => <li key={n} className="flex gap-3 text-[15px]"><CheckCircle2 className="w-5 h-5 shrink-0 text-[#4ADE80]" aria-hidden="true" /><span><Bidi>{T(`why.a${n}`)}</Bidi></span></li>)}</ul>
        </div>
      </div>

      <div className="reveal mt-4 sm:mt-6"><Calculator /></div>

      <div className="reveal mt-4 sm:mt-6 lp-card p-4 sm:p-8 text-start">
        <h3 className="font-display text-2xl sm:text-3xl font-semibold">{T("cmp.t")}</h3>
        <div className="mt-5">
          <table className="w-full table-fixed text-xs sm:text-sm">
            <thead><tr className="text-[var(--ink-2)]">
              <th className="text-start font-medium pb-3 w-[34%] sm:w-[36%]" />
              {[1, 2, 3, 4].map((n) => <th key={n} className={`pb-3 px-0.5 sm:px-2 align-bottom text-[10px] sm:text-sm leading-tight font-semibold text-center ${n === 4 ? "text-[var(--md-primary)]" : ""}`}>{T(`cmp.c${n}`)}</th>)}
            </tr></thead>
            <tbody>{ROWS.map((r, i) => (
              <tr key={i} className="border-t border-[var(--line)]">
                <th scope="row" className="text-start font-medium py-3 pe-2 leading-snug"><Bidi>{T(`cmp.r${i + 1}`)}</Bidi></th>
                {r.map((v, j) => <td key={j} className={`py-3 px-2 text-center ${j === 3 ? "bg-[var(--md-primary)]/[.07]" : ""}`}><Cell v={v} /></td>)}
              </tr>))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-[var(--ink-3)]">{T("cmp.note")}</p>
      </div>
    </section>
  );
}
