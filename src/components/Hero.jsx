import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowDown, Check, Copy, Send } from "lucide-react";
import { tr_ as T, money } from "../i18n";
import { formatNumber } from "../data/seed";
import { quickQuote } from "../lib/quickQuote";

/** Eases a displayed number toward its target (interruptible, no keyframes). */
function useTween(target, ms = 260) {
  const [v, setV] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { from.current = target; setV(target); return undefined; }
    const start = performance.now(); const a = from.current; let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / ms); const e = 1 - (1 - t) ** 3;
      const cur = a + (target - a) * e; from.current = cur; setV(cur);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return Math.round(v);
}

const UNITS = ["m2", "lm", "m3", "pc", "pt"];
const DEFAULTS = { item: "", qty: 120, unit: "m2", materials: 1000, labour: 300, transport: 100, markup: 30, vat: 0 };

/** Fully editable Smart-BOQ line: the visitor enters every value and sees price, profit and margin live. */
export function BoqLive() {
  const [f, setF] = useState(DEFAULTS);
  const [copied, setCopied] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const r = quickQuote(f);
  const priceT = useTween(r.unitPrice), totalT = useTween(r.total), profitT = useTween(r.profit);
  const name = f.item.trim() || T("hero.itemPh");
  const unit = T("hero.u." + f.unit);
  const summary = T("hero.summary", { item: name, qty: formatNumber(Number(f.qty) || 0), unit, price: money(r.unitPrice), total: money(r.total) });
  const copy = async () => { try { await navigator.clipboard.writeText(summary); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* ignore */ } };

  const field = "w-full h-10 px-3 rounded-lg border border-[#E3E7EE] bg-white text-sm text-[#0F172A] tabular-nums focus:outline-none focus:ring-2 focus:ring-[#0F766E]/30 focus:border-[#0F766E]";
  const lab = "block text-xs font-medium text-[#475569] mb-1";
  const num = (k, label, extra = {}) => (
    <div>
      <label htmlFor={"q-" + k} className={lab}>{label}</label>
      <input id={"q-" + k} type="number" inputMode="decimal" min="0" value={f[k]} onChange={set(k)} className={field} {...extra} />
    </div>
  );

  return (
    <div className="rounded-xl border border-[#E3E7EE] bg-white overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#E3E7EE] text-xs text-[#475569]">
        <span className="font-semibold text-[#0F172A]">{T("hero.calc")}</span>
        <button type="button" onClick={() => setF(DEFAULTS)} className="text-[#0F766E] font-semibold hover:underline cursor-pointer">{T("hero.reset")}</button>
      </div>

      <div className="p-5 space-y-4">
        <div>
          <label htmlFor="q-item" className={lab}>{T("hero.item")}</label>
          <input id="q-item" value={f.item} onChange={set("item")} placeholder={T("hero.itemPh")} className={field} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {num("qty", T("hero.qty"))}
          <div>
            <label htmlFor="q-unit" className={lab}>{T("hero.unitL")}</label>
            <select id="q-unit" value={f.unit} onChange={set("unit")} className={field}>
              {UNITS.map((u) => <option key={u} value={u}>{T("hero.u." + u)}</option>)}
            </select>
          </div>
        </div>
        <fieldset>
          <legend className={lab}>{T("hero.costs")}</legend>
          <div className="grid grid-cols-3 gap-2">
            {num("materials", T("hero.mat"))}
            {num("labour", T("hero.lab"))}
            {num("transport", T("hero.trn"))}
          </div>
        </fieldset>
        <div>
          <div className="flex items-center justify-between gap-3 mb-1.5">
            <label htmlFor="q-markup" className="text-xs font-medium text-[#475569]">{T("hero.margin")}</label>
            <div className="flex items-center gap-1.5">
              <input aria-label={T("hero.margin")} type="number" min="0" max="300" value={f.markup} onChange={set("markup")} className="w-16 h-8 px-2 rounded-md border border-[#E3E7EE] text-sm font-bold text-[#0F766E] text-center tabular-nums" />
              <span className="text-sm text-[#475569]">%</span>
            </div>
          </div>
          <input id="q-markup" type="range" min="0" max="100" value={Math.min(100, Number(f.markup) || 0)} onChange={set("markup")} className="w-full h-1.5 accent-[#0F766E] cursor-pointer" />
        </div>
        {num("vat", T("hero.vat"), { max: 30 })}

        <dl className="text-sm divide-y divide-[#EEF1F5]">
          <div className="flex justify-between py-2"><dt className="text-[#475569]">{T("hero.unitCost")}</dt><dd className="tabular-nums text-[#0F172A]">{money(r.unitCost)}</dd></div>
          <div className="flex justify-between py-2"><dt className="text-[#475569]">{T("hero.unitPrice")}</dt><dd className="tabular-nums font-semibold text-[#0F172A]">{money(priceT)}</dd></div>
          <div className="flex justify-between py-2"><dt className="text-[#475569]">{T("hero.profit")}</dt><dd className="tabular-nums text-emerald-700">{money(profitT)} <span className="text-xs text-[#64748B]">({T("hero.ofSale", { p: r.margin })})</span></dd></div>
          {Number(f.vat) > 0 && <div className="flex justify-between py-2"><dt className="text-[#475569]">{T("hero.tax")}</dt><dd className="tabular-nums text-[#0F172A]">{money(r.tax)}</dd></div>}
        </dl>

        <div className="flex items-end justify-between rounded-lg bg-[#F4F6F9] border border-[#E3E7EE] px-4 py-3">
          <span className="text-xs text-[#475569]">{T("hero.total")}</span>
          <output className="text-2xl font-bold text-[#0F172A] tabular-nums">{money(totalT)}</output>
        </div>

        <div className="flex gap-2">
          <a href={"https://wa.me/?text=" + encodeURIComponent(summary)} target="_blank" rel="noopener noreferrer" className="btn-press flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-[#0F766E] hover:bg-[#0B5F58] text-white text-sm font-semibold py-2.5">
            <Send className="w-4 h-4" aria-hidden="true" />{T("hero.share")}
          </a>
          <button type="button" onClick={copy} className="btn-press flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-[#E3E7EE] text-[#0F172A] hover:bg-[#EEF1F5] text-sm font-semibold py-2.5 cursor-pointer">
            {copied ? <Check className="w-4 h-4 text-emerald-600" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
            <span aria-live="polite">{copied ? T("hero.copied") : T("hero.copy")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Hero({ onStart, onWhy }) {
  return (
    <section className="relative pt-28 sm:pt-32 pb-0 px-4 sm:px-8 max-w-7xl mx-auto w-full">
      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center min-h-[calc(100dvh-7rem)] pb-16">
        <div className="text-start hero-in">
          <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold text-[#0F172A] leading-[1.2] text-balance">{T("ld.4")}</h1>
          <p className="mt-6 text-lg sm:text-xl text-[#475569] leading-relaxed max-w-xl">{T("ld.5")}</p>

          <div className="mt-9 flex flex-col sm:flex-row gap-3">
            <button onClick={onStart} className="btn-press inline-flex items-center justify-center gap-3 rounded-lg bg-[#0F766E] hover:bg-[#0B5F58] text-white font-semibold px-7 py-3.5">
              <span>{T("ld.6")}</span>
              <ArrowLeft className="w-4 h-4 ltr:-scale-x-100" aria-hidden="true" />
            </button>
            <button onClick={onWhy} className="btn-press inline-flex items-center justify-center gap-2 rounded-lg border border-[#CBD2DC] text-[#0F172A] hover:bg-[#EEF1F5] font-semibold px-6 py-3.5">
              <span>{T("ld.7")}</span>
              <ArrowDown className="w-4 h-4 text-[#475569]" aria-hidden="true" />
            </button>
          </div>

          <ul className="mt-10 grid gap-2.5 text-sm text-[#475569]">
            {["ld.8", "ld.9", "ld.10"].map((k) => (
              <li key={k} className="flex items-center gap-2.5"><span className="w-1 h-1 rounded-full bg-[#0F766E]" />{T(k)}</li>
            ))}
          </ul>
        </div>

        <div className="hero-card-in"><BoqLive /></div>
      </div>
      <div className="ruler" aria-hidden="true" />
    </section>
  );
}
