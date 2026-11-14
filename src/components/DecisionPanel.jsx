import { useState } from "react";
import { AlertTriangle, TrendingDown, TrendingUp, CheckCircle2, Clock } from "lucide-react";
import { useI18n, currencySymbol, E } from "../i18n";
import { formatCompact } from "../data/seed";
import { portfolio } from "../lib/insights";

const TONE = {
  risk: "bg-[#FBE4DF] text-[#9A2E20]",
  watch: "bg-[#FBEFD9] text-[#7A4B0C]",
  ok: "bg-[#DDEFE3] text-[#1F6B49]",
};

/** "What needs a decision": per-project forecast margin, overrun and schedule slip. */
export default function DecisionPanel({ projects, onOpen }) {
  const { t } = useI18n();
  const [now] = useState(() => Date.now());
  const pf = portfolio(projects, now);
  const cur = currencySymbol();
  const marginDrop = pf.plannedMargin - pf.forecastMargin;

  return (
    <section aria-labelledby="dp-title" className="bg-white rounded-[28px] border border-[#DCE4DC] p-5 md:p-7">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5">
        <div>
          <h2 id="dp-title" className="font-display text-xl md:text-2xl font-semibold text-[#1F2A26]">{t("dp.title")}</h2>
          <p className="text-sm text-[#56635B] mt-1">{t("dp.sub")}</p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-start">
          {[
            [t("dp.fm"), `${formatCompact(pf.forecastMargin)} ${cur}`, pf.forecastMargin < pf.plannedMargin ? "text-[#9A2E20]" : "text-[#1F6B49]"],
            [t("dp.drop"), `${marginDrop > 0 ? "-" : "+"}${formatCompact(Math.abs(marginDrop))} ${cur}`, marginDrop > 0 ? "text-[#9A2E20]" : "text-[#1F6B49]"],
            [t("dp.risk"), String(pf.atRisk), pf.atRisk ? "text-[#9A2E20]" : "text-[#1F6B49]"],
          ].map(([k, v, c]) => (
            <div key={k} className="rounded-2xl bg-[#F2F5F1] px-3 py-2.5 min-w-0">
              <div className="text-[11px] text-[#56635B] font-semibold truncate">{k}</div>
              <div className={`font-display text-base md:text-lg font-semibold whitespace-nowrap ${c}`}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      <ul className="space-y-2.5">
        {pf.rows.map(({ p, i }) => {
          const Icon = i.level === "risk" ? AlertTriangle : i.level === "watch" ? Clock : CheckCircle2;
          const reasons = [];
          if (i.overrun > 0) reasons.push(t("dp.r.over", { v: formatCompact(i.overrun), c: cur, p: Math.round(i.overrunPct * 100) }));
          if (i.slip > 10) reasons.push(t("dp.r.slip", { n: i.slip }));
          if (i.forecastMargin < 0) reasons.push(t("dp.r.loss"));
          if (!reasons.length) reasons.push(t("dp.r.ok"));
          return (
            <li key={p.id}>
              <button type="button" onClick={() => onOpen?.(p)} className="w-full text-start rounded-2xl border border-[#DCE4DC] hover:border-[#A3AE9F] p-3.5 md:p-4 grid gap-3 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:items-center cursor-pointer">
                <div className="flex items-start gap-3 min-w-0">
                  <span className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center ${TONE[i.level]}`}><Icon className="w-4 h-4" aria-hidden="true" /></span>
                  <span className="min-w-0">
                    <span className="block font-semibold text-[#1F2A26] truncate">{E(p.name)}</span>
                    <span className={`inline-block mt-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${TONE[i.level]}`}>{t("dp.l." + i.level)}</span>
                    <span className="block mt-1 text-xs text-[#56635B]">{reasons.join(" · ")}</span>
                  </span>
                </div>
                <Metric label={t("dp.c.budget")} value={`${formatCompact(i.spent)} / ${formatCompact(i.budget)}`} sub={t("dp.c.prog", { n: Math.round(p.progress) })} />
                <Metric label={t("dp.c.eac")} value={`${formatCompact(i.eac)} ${cur}`} tone={i.overrun > 0 ? "text-[#9A2E20]" : ""} />
                <Metric label={t("dp.c.margin")} value={`${formatCompact(i.forecastMargin)} ${cur}`} tone={i.forecastMargin < i.plannedMargin ? "text-[#9A2E20]" : "text-[#1F6B49]"}
                  icon={i.forecastMargin < i.plannedMargin ? TrendingDown : TrendingUp} sub={t("dp.c.plan", { v: formatCompact(i.plannedMargin) })} />
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
      <div className="text-[11px] font-semibold text-[#56635B]">{label}</div>
      <div className={`font-semibold whitespace-nowrap flex items-center gap-1 ${tone}`}>{Icon && <Icon className="w-3.5 h-3.5" aria-hidden="true" />}{value}</div>
      {sub && <div className="col-span-2 text-[11px] text-[#6E7B72]">{sub}</div>}
    </div>
  );
}
