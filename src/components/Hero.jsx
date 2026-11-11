import { useState } from "react";
import { ArrowLeft, ArrowDown, Check } from "lucide-react";
import { tr_ as T, money } from "../i18n";
import { formatNumber } from "../data/seed";

const QTY = 120;
const COST = 1400;

/** Live Smart-BOQ line: the margin slider reprices the item in real time. */
function BoqLive() {
  const [margin, setMargin] = useState(30);
  const price = Math.round(COST * (1 + margin / 100));
  const total = price * QTY;
  const profit = (price - COST) * QTY;
  return (
    <div className="rounded-xl border border-[#DDE1E5] bg-white overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#DDE1E5] text-xs text-[#5A646E]">
        <span className="font-semibold text-[#1E2429]">{T("ld.47")}</span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          {T("hero.live")}
        </span>
      </div>

      <div className="p-5 space-y-5">
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <label htmlFor="hero-margin" className="text-sm text-[#5A646E]">{T("hero.margin")}</label>
            <output className="text-2xl font-bold text-[#D9480F] tabular-nums" dir="ltr">{margin}%</output>
          </div>
          <input
            id="hero-margin"
            type="range"
            min="0"
            max="60"
            value={margin}
            onChange={(e) => setMargin(+e.target.value)}
            className="w-full h-1.5 accent-[#D9480F] cursor-pointer"
          />
        </div>

        <dl className="text-sm divide-y divide-[#ECEEF0]">
          <div className="flex justify-between py-2.5"><dt className="text-[#5A646E]">{T("hero.qty")}</dt><dd className="tabular-nums text-[#1E2429]">{formatNumber(QTY)} {T("hero.unit")}</dd></div>
          <div className="flex justify-between py-2.5"><dt className="text-[#5A646E]">{T("ld.49")}</dt><dd className="tabular-nums text-[#1E2429]">{money(COST, { compact: true })}</dd></div>
          <div className="flex justify-between py-2.5"><dt className="text-[#5A646E]">{T("ld.51")}</dt><dd className="tabular-nums text-[#1E2429]">{money(price, { compact: true })}</dd></div>
          <div className="flex justify-between py-2.5"><dt className="text-[#5A646E]">{T("hero.profit")}</dt><dd className="tabular-nums text-emerald-600">{money(profit, { compact: true })}</dd></div>
        </dl>

        <div className="flex items-end justify-between rounded-lg bg-[#F3F4F6] border border-[#DDE1E5] px-4 py-3">
          <span className="text-xs text-[#5A646E]">{T("ld.53")}</span>
          <span className="text-2xl font-bold text-[#1E2429] tabular-nums">{money(total, { compact: true })}</span>
        </div>

        <div className="flex gap-2">
          <span className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-[#D9480F] text-white text-sm font-semibold py-2.5">
            <Check className="w-4 h-4" aria-hidden="true" />{T("ld.56")}
          </span>
          <span className="flex-1 inline-flex items-center justify-center rounded-lg border border-[#DDE1E5] text-[#5A646E] text-sm font-semibold py-2.5">{T("ld.55")}</span>
        </div>
      </div>
    </div>
  );
}

export default function Hero({ onStart, onWhy }) {
  return (
    <section className="relative pt-28 sm:pt-32 pb-0 px-4 sm:px-8 max-w-7xl mx-auto w-full">
      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center min-h-[calc(100dvh-7rem)] pb-16">
        <div className="text-start">
          <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold text-[#1E2429] leading-[1.2] text-balance">{T("ld.4")}</h1>
          <p className="mt-6 text-lg sm:text-xl text-[#5A646E] leading-relaxed max-w-xl">{T("ld.5")}</p>

          <div className="mt-9 flex flex-col sm:flex-row gap-3">
            <button onClick={onStart} className="btn-press inline-flex items-center justify-center gap-3 rounded-lg bg-[#D9480F] hover:bg-[#B83B0A] text-white font-semibold px-7 py-3.5">
              <span>{T("ld.6")}</span>
              <ArrowLeft className="w-4 h-4 ltr:-scale-x-100" aria-hidden="true" />
            </button>
            <button onClick={onWhy} className="btn-press inline-flex items-center justify-center gap-2 rounded-lg border border-[#CBD0D6] text-[#1E2429] hover:bg-[#ECEEF0] font-semibold px-6 py-3.5">
              <span>{T("ld.7")}</span>
              <ArrowDown className="w-4 h-4 text-[#5A646E]" aria-hidden="true" />
            </button>
          </div>

          <ul className="mt-10 grid gap-2.5 text-sm text-[#5A646E]">
            {["ld.8", "ld.9", "ld.10"].map((k) => (
              <li key={k} className="flex items-center gap-2.5"><span className="w-1 h-1 rounded-full bg-[#D9480F]" />{T(k)}</li>
            ))}
          </ul>
        </div>

        <BoqLive />
      </div>
      <div className="ruler" aria-hidden="true" />
    </section>
  );
}
