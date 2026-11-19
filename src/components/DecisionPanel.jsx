import { useState } from "react";
import { AlertTriangle, TrendingDown, TrendingUp, CheckCircle2, Clock, FileDown, ChevronLeft } from "lucide-react";
import { useI18n, currencySymbol, E, intlLocale } from "../i18n";
import { printDocument, brandHeader, esc } from "../lib/printDoc";
import { formatCompact } from "../data/seed";
import { portfolio } from "../lib/insights";
import { Bidi } from "./Bidi";

// Semantic status colours: risk = rose, watch = amber, ok = emerald.
const TONE = {
  risk: "bg-rose-50 text-rose-700 border border-rose-200",
  watch: "bg-amber-50 text-amber-700 border border-amber-200",
  ok: "bg-emerald-50 text-emerald-700 border border-emerald-200",
};
// Wraps only the number runs, so "-14 ألف ج.م." keeps its sign and Arabic word order.
const LTR = ({ children }) => <Bidi>{[].concat(children).join("")}</Bidi>;

/** "What needs a decision": per-project forecast margin, overrun and schedule slip. */
export default function DecisionPanel({ projects, onOpen }) {
  const { t } = useI18n();
  const [now] = useState(() => Date.now());
  const pf = portfolio(projects, now);
  const needs = pf.rows.filter(({ i }) => i.level !== "ok");
  const [onlyNeeds, setOnlyNeeds] = useState(needs.length > 0);
  const shown = onlyNeeds ? needs : pf.rows;
  const cur = currencySymbol();
  const marginDrop = pf.plannedMargin - pf.forecastMargin;

  const reasonsOf = (i) => {
    const r = [];
    if (i.overrun > 0) r.push(t("dp.r.over", { v: formatCompact(i.overrun), c: cur, p: Math.round(i.overrunPct * 100) }));
    if (i.slip > 10) r.push(t("dp.r.slip", { n: i.slip }));
    if (i.forecastMargin < 0) r.push(t("dp.r.loss"));
    if (!r.length) r.push(t("dp.r.ok"));
    return r;
  };

  const printReport = () => {
    const money = (v) => `${formatCompact(v)} ${cur}`;
    const contract = projects.reduce((s, p) => s + (p.contractValue || 0), 0);
    const collected = projects.reduce((s, p) => s + (p.collected || 0), 0);
    const kpi = (k, v, c = "") => `<div class="kpi"><span class="muted">${esc(k)}</span><b class="${c}">${esc(v)}</b></div>`;
    const rows = pf.rows.map(({ p, i }) => `<tr>
      <td><b>${esc(E(p.name))}</b><div class="muted">${esc(E(p.client || ""))}</div></td>
      <td class="${i.level}">${esc(t("dp.l." + i.level))}</td>
      <td class="n">${Math.round(p.progress)}%</td>
      <td class="n">${esc(formatCompact(i.spent))} / ${esc(formatCompact(i.budget))}</td>
      <td class="n">${esc(money(i.eac))}</td>
      <td class="n ${i.forecastMargin < i.plannedMargin ? "risk" : "ok"}">${esc(money(i.forecastMargin))}</td>
      <td>${esc(reasonsOf(i).join(" · "))}</td></tr>`).join("");
    printDocument(t("rep.title"), `${brandHeader(t("rep.title"), [t("rep.date", { d: new Date().toLocaleDateString(intlLocale()) })])}
      <div class="kpis">${kpi(t("rep.contract"), money(contract))}${kpi(t("rep.collected"), money(collected))}${kpi(t("dp.fm"), money(pf.forecastMargin), pf.forecastMargin < pf.plannedMargin ? "risk" : "ok")}${kpi(t("dp.risk"), String(pf.atRisk), pf.atRisk ? "risk" : "ok")}</div>
      <h2>${esc(t("dp.title"))}</h2>
      <table><thead><tr><th>${esc(t("rep.project"))}</th><th>${esc(t("rep.status"))}</th><th class="n">${esc(t("rep.prog"))}</th><th class="n">${esc(t("dp.c.budget"))}</th><th class="n">${esc(t("dp.c.eac"))}</th><th class="n">${esc(t("dp.c.margin"))}</th><th>${esc(t("rep.notes"))}</th></tr></thead><tbody>${rows}</tbody></table>
      <div class="foot">${esc(t("rep.foot"))}</div>`);
  };

  return (
    <section aria-labelledby="dp-title" className="bg-white rounded-[28px] border border-[#E2E8F0] p-5 md:p-7">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5">
        <div>
          <h2 id="dp-title" className="font-display text-xl md:text-2xl font-semibold text-[#0E2A47]">{t("dp.title")}</h2>
          <p className="text-sm text-[#475569] mt-1">{t("dp.sub")}</p>
          <button type="button" onClick={printReport} className="btn-press mt-3 inline-flex items-center gap-2 h-10 px-4 rounded-full border border-[#E2E8F0] text-sm font-semibold text-[#0E2A47] hover:bg-[#F4F5F7]"><FileDown className="w-4 h-4" aria-hidden="true" />{t("dp.pdf")}</button>
        </div>
        <div className="grid grid-cols-3 gap-2 text-start">
          {[
            [t("dp.fm"), <LTR key="f">{formatCompact(pf.forecastMargin)} {cur}</LTR>, pf.forecastMargin < pf.plannedMargin ? "text-rose-700" : "text-emerald-700"],
            [t("dp.drop"), <LTR key="d">{`${marginDrop > 0 ? "-" : "+"}${formatCompact(Math.abs(marginDrop))} ${cur}`}</LTR>, marginDrop > 0 ? "text-rose-700" : "text-emerald-700"],
            [t("dp.risk"), String(pf.atRisk), pf.atRisk ? "text-rose-700" : "text-emerald-700"],
          ].map(([k, v, c]) => (
            <div key={k} className="rounded-2xl bg-[#F4F5F7] px-3 py-2.5 min-w-0">
              <div className="text-[11px] text-[#475569] font-semibold truncate">{k}</div>
              <div className={`font-display text-base md:text-lg font-semibold whitespace-nowrap ${c}`}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div role="tablist" className="mb-3 inline-flex gap-1 rounded-full bg-[#F4F5F7] p-1 text-xs font-semibold">
        {[[true, t("dp.tab.needs", { n: needs.length })], [false, t("dp.tab.all", { n: pf.rows.length })]].map(([v, label]) => (
          <button key={String(v)} type="button" role="tab" aria-selected={onlyNeeds === v} onClick={() => setOnlyNeeds(v)} className={`px-3.5 py-1.5 rounded-full cursor-pointer ${onlyNeeds === v ? "bg-white text-[#0E2A47] shadow-xs" : "text-[#64748B] hover:text-[#0E2A47]"}`}>{label}</button>
        ))}
      </div>
      <ul className="space-y-2.5">
        {shown.map(({ p, i }) => {
          const Icon = i.level === "risk" ? AlertTriangle : i.level === "watch" ? Clock : CheckCircle2;
          const reasons = reasonsOf(i);
          return (
            <li key={p.id}>
              <button type="button" onClick={() => onOpen?.(p)} className="group w-full text-start rounded-2xl border border-[#E2E8F0] hover:bg-slate-50 hover:border-teal-600/30 transition-colors p-3.5 md:p-4 grid gap-3 md:grid-cols-[1.4fr_1fr_1fr_1fr_auto] md:items-center cursor-pointer">
                <div className="flex items-start gap-3 min-w-0">
                  <span className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center ${TONE[i.level]}`}><Icon className="w-4 h-4" aria-hidden="true" /></span>
                  <span className="min-w-0">
                    <span className="block font-semibold text-[#0E2A47] truncate">{E(p.name)}</span>
                    <span className={`inline-block mt-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${TONE[i.level]}`}>{t("dp.l." + i.level)}</span>
                    <span className="block mt-1 text-xs text-[#475569]">{reasons.map((r, k) => <span key={k}>{k ? " · " : ""}{r}</span>)}</span>
                  </span>
                </div>
                <Metric label={t("dp.c.budget")} value={<LTR>{formatCompact(i.spent)} / {formatCompact(i.budget)}</LTR>} sub={t("dp.c.prog", { n: Math.round(p.progress) })} />
                <Metric label={t("dp.c.eac")} value={<LTR>{formatCompact(i.eac)} {cur}</LTR>} tone={i.overrun > 0 ? "text-rose-700" : ""} />
                <Metric label={t("dp.c.margin")} value={<LTR>{formatCompact(i.forecastMargin)} {cur}</LTR>} tone={i.forecastMargin < i.plannedMargin ? "text-rose-700" : "text-emerald-700"}
                  icon={i.forecastMargin < i.plannedMargin ? TrendingDown : TrendingUp} sub={t("dp.c.plan", { v: formatCompact(i.plannedMargin) })} />
                <span className="hidden md:flex w-8 h-8 rounded-full border border-[#E2E8F0] text-[#64748B] group-hover:text-[#0E2A47] group-hover:border-teal-600/40 items-center justify-center"><ChevronLeft className="w-4 h-4 ltr:-scale-x-100" aria-hidden="true" /></span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Metric({ label, value, sub, tone = "", icon: Icon }) {
  return (
    <div className="min-w-0 grid grid-cols-[auto_1fr] md:block gap-x-3 items-baseline">
      <div className="text-[11px] font-semibold text-[#475569]">{label}</div>
      <div className={`font-semibold whitespace-nowrap flex items-center gap-1 ${tone}`}>{Icon && <Icon className="w-3.5 h-3.5" aria-hidden="true" />}{value}</div>
      {sub && <div className="col-span-2 text-[11px] text-[#64748B]">{sub}</div>}
    </div>
  );
}
