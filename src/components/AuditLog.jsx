import { useMemo, useState } from "react";
import { History, Plus, Minus, PenLine, Download, Search } from "lucide-react";
import { useI18n, intlLocale } from "../i18n";
import { auditStore } from "../data/audit";
import DataBackup from "./DataBackup";

const SCOPES = ["boq", "cash", "expenses", "invoices", "certs", "changeOrders", "selections", "subs", "pos", "workers"];
const ICON = { add: Plus, del: Minus, upd: PenLine };
const TONE = { add: "bg-[#DDEFE3] text-[#1F6B49]", del: "bg-[#FBE4DF] text-[#9A2E20]", upd: "bg-[#E3ECF7] text-[#2B4A72]" };

/** Who changed what, when: every add / delete / field edit on money and approval lists. */
export default function AuditLog() {
  const { t } = useI18n();
  const [log] = auditStore.use();
  const [scope, setScope] = useState("all");
  const [q, setQ] = useState("");
  const fmt = useMemo(() => new Intl.DateTimeFormat(intlLocale(), { dateStyle: "medium", timeStyle: "short" }), []);
  const fl = (f) => { const k = "audit.f." + f; const v = t(k); return v === k ? f : v; };

  const rows = log.filter((e) => (scope === "all" || e.scope === scope) &&
    (!q || `${e.label} ${(e.changes || []).map((c) => `${c.from} ${c.to}`).join(" ")}`.toLowerCase().includes(q.toLowerCase())));

  const exportCsv = () => {
    const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const lines = [[t("audit.c.at"), t("audit.c.who"), t("audit.c.area"), t("audit.c.action"), t("audit.c.item"), t("audit.c.changes")].map(esc).join(",")];
    for (const e of rows) lines.push([fmt.format(new Date(e.at)), t("audit.role." + e.role), t("audit.s." + e.scope), t("audit.a." + e.action), e.label,
      (e.changes || []).map((c) => `${fl(c.f)}: ${c.from} → ${c.to}`).join(" | ")].map(esc).join(","));
    const url = URL.createObjectURL(new Blob(["﻿" + lines.join("\n")], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a"); a.href = url; a.download = "miyar-audit-log.csv"; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-5 max-w-6xl mx-auto w-full">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 font-display text-2xl md:text-3xl font-semibold text-[#1F2A26]"><History className="w-6 h-6" aria-hidden="true" />{t("audit.title")}</h1>
          <p className="text-sm text-[#56635B] mt-1">{t("audit.sub")}</p>
        </div>
        <button type="button" onClick={exportCsv} disabled={!rows.length} className="btn-press self-start md:self-auto inline-flex items-center gap-2 h-11 px-5 rounded-full lp-pill-dark text-sm font-semibold disabled:opacity-50"><Download className="w-4 h-4" aria-hidden="true" />{t("audit.export")}</button>
      </header>

      <DataBackup />

      <div className="bg-white rounded-[24px] border border-[#DCE4DC] p-3 md:p-4 space-y-3">
        <label className="relative block">
          <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 start-4 text-[#6E7B72]" aria-hidden="true" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("audit.search")} aria-label={t("audit.search")} className="w-full h-11 ps-11 pe-4 rounded-full border border-[#DCE4DC] text-sm" />
        </label>
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
          {["all", ...SCOPES].map((s) => (
            <button key={s} type="button" onClick={() => setScope(s)} aria-pressed={scope === s}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold border ${scope === s ? "lp-pill-dark border-transparent" : "bg-white text-[#1F2A26] border-[#DCE4DC]"}`}>
              {s === "all" ? t("audit.all") : t("audit.s." + s)}
            </button>
          ))}
        </div>
      </div>

      {!rows.length ? (
        <div className="bg-white rounded-[24px] border border-dashed border-[#C9D3CA] p-8 text-center">
          <History className="w-8 h-8 mx-auto text-[#A3AE9F]" aria-hidden="true" />
          <p className="mt-3 font-semibold text-[#1F2A26]">{t("audit.empty")}</p>
          <p className="mt-1 text-sm text-[#56635B]">{t("audit.emptyHint")}</p>
        </div>
      ) : (
        <ol className="space-y-2.5">
          {rows.map((e) => {
            const Icon = ICON[e.action] || PenLine;
            return (
              <li key={e.id} className="bg-white rounded-2xl border border-[#DCE4DC] p-3.5 md:p-4 flex gap-3">
                <span className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center ${TONE[e.action]}`}><Icon className="w-4 h-4" aria-hidden="true" /></span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="font-semibold text-[#1F2A26]">{t("audit.a." + e.action)}</span>
                    <span className="text-[#1F2A26] truncate max-w-full">{e.label}</span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#F2F5F1] text-[#56635B]">{t("audit.s." + e.scope)}</span>
                  </div>
                  {e.changes?.length > 0 && (
                    <ul className="mt-1.5 space-y-0.5 text-xs text-[#56635B]">
                      {e.changes.map((c) => (
                        <li key={c.f}><span className="font-semibold">{fl(c.f)}:</span> <bdi className="line-through opacity-70">{c.from}</bdi> ← <bdi className="font-semibold text-[#1F2A26]">{c.to}</bdi></li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-1.5 text-[11px] text-[#6E7B72]">{t("audit.role." + e.role)}{e.mode === "guest" ? ` · ${t("audit.guest")}` : ""} · <time dateTime={e.at}>{fmt.format(new Date(e.at))}</time></div>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </main>
  );
}
