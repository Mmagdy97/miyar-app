import { useMemo } from "react";
import { decodeSnapshot, whatsappLink } from "../lib/share";
import { tr_ as T, E, intlLocale } from "../i18n";
import { formatMoney, isSupportedCurrency } from "../lib/currency";
import { pct } from "../data/dataI18n";
import LogoMark from "./LogoMark";
import ProgressBar from "./ProgressBar";
import { MapPin, CalendarDays, Phone, Check } from "lucide-react";

/** Public, read-only client view opened from a share link (?share=...). No login, no app chrome. */
export default function SharedView({ payload }) {
  const s = useMemo(() => decodeSnapshot(payload), [payload]);

  return (
    <div className="min-h-screen bg-[#F7F3EA] text-[#1F2421]">
      <header className="h-14 px-4 flex items-center justify-between border-b border-[#E6DFD0] bg-white/80">
        <a href="/" className="flex items-center gap-2 font-semibold">
          <span className="w-8 h-8 rounded-lg bg-[#17614F] text-white flex items-center justify-center">
            <LogoMark className="w-5 h-5" />
          </span>
          <span>{T("brand")}</span>
        </a>
        <span className="text-[11px] font-bold text-[#555B53]">{T("shared.readonly")}</span>
      </header>

      <main className="max-w-2xl mx-auto p-4 md:p-8 space-y-4">
        {!s || !s.name ? (
          <p className="text-center text-sm text-[#555B53] py-20">{T("shared.invalid")}</p>
        ) : (
          <>
            <section className="bg-white rounded-2xl border border-[#E6DFD0] p-5 space-y-4">
              {s.office && <p className="text-xs font-bold text-[#555B53]">{s.office}</p>}
              <div>
                <p className="text-xs font-bold text-[#555B53]">{T("shared.title")}</p>
                <h1 className="text-xl font-semibold mt-0.5">{s.name}</h1>
                {s.client && <p className="text-sm text-[#555B53] mt-0.5">{s.client}</p>}
              </div>
              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  <span>{T("shared.progress")}</span>
                  <span className="font-mono">{pct(s.progress)}</span>
                </div>
                <ProgressBar value={s.progress} />
              </div>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                {s.phase && (
                  <div className="rounded-xl bg-[#F7F3EA] p-3 min-w-0">
                    <dt className="text-[11px] font-bold text-[#555B53]">{T("shared.phase")}</dt>
                    <dd className="font-bold truncate">{E(s.phase)}</dd>
                  </div>
                )}
                {s.status && (
                  <div className="rounded-xl bg-[#F7F3EA] p-3 min-w-0">
                    <dt className="text-[11px] font-bold text-[#555B53]">{T("shared.status")}</dt>
                    <dd className="font-bold truncate">{E(s.status)}</dd>
                  </div>
                )}
              </dl>
              <div className="space-y-1.5 text-xs text-[#555B53]">
                {s.deadline && (
                  <p className="flex items-center gap-2"><CalendarDays className="w-4 h-4" />{T("shared.deadline")}: <strong className="text-[#1F2421]">{s.deadline}</strong></p>
                )}
                {s.location && (
                  <p className="flex items-center gap-2"><MapPin className="w-4 h-4" />{s.location}</p>
                )}
                {s.updated && <p>{T("shared.updated")}: {s.updated}</p>}
              </div>
              {s.note && <p className="text-sm leading-relaxed border-t border-[#F0EADD] pt-3">{s.note}</p>}
            </section>

            {s.phases.length > 1 && (
              <section className="bg-white rounded-2xl border border-[#E6DFD0] p-5">
                <h2 className="text-sm font-semibold mb-4">{T("shared.stages")}</h2>
                <ol className="flex items-start justify-between gap-1">
                  {s.phases.map((ph, i) => {
                    const cur = s.phases.indexOf(s.phase);
                    const done = cur > i, now = cur === i;
                    return (
                      <li key={ph + i} className="flex-1 flex flex-col items-center gap-1.5 text-center min-w-0">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${done || now ? "bg-[#17614F] text-white" : "bg-white border-2 border-[#E6DFD0] text-[#555B53]"} ${now ? "ring-4 ring-[#17614F]/10" : ""}`}>
                          {done ? <Check className="w-4 h-4" /> : i + 1}
                        </span>
                        <span className={`text-[11px] leading-tight ${now ? "font-semibold" : "font-bold text-[#555B53]"}`}>{ph}</span>
                      </li>
                    );
                  })}
                </ol>
              </section>
            )}

            {s.timeline.length > 0 && (
              <section className="bg-white rounded-2xl border border-[#E6DFD0] p-5">
                <h2 className="text-sm font-semibold mb-3">{T("shared.stages")}</h2>
                <ul className="space-y-3">
                  {s.timeline.map((t, i) => (
                    <li key={i} className="text-sm">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="flex items-center gap-1.5 font-bold min-w-0">
                          {t.pct >= 100 && <Check className="w-4 h-4 text-emerald-700 shrink-0" />}
                          <span className="truncate">{t.title}</span>
                        </span>
                        <span className="text-xs font-mono text-[#555B53]">{pct(t.pct)}</span>
                      </div>
                      <ProgressBar value={t.pct} />
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {s.contract > 0 && isSupportedCurrency(s.currency) && (
              <section className="bg-white rounded-2xl border border-[#E6DFD0] p-5">
                <h2 className="text-sm font-semibold mb-3">{T("shared.payments")}</h2>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-[#F7F3EA] p-3">
                    <p className="text-[11px] font-bold text-[#555B53]">{T("shared.collected")}</p>
                    <p className="font-semibold">{formatMoney(s.collected, s.currency, intlLocale(), { compact: true })}</p>
                  </div>
                  <div className="rounded-xl bg-[#F7F3EA] p-3">
                    <p className="text-[11px] font-bold text-[#555B53]">{T("shared.remaining")}</p>
                    <p className="font-semibold">{formatMoney(Math.max(0, s.contract - s.collected), s.currency, intlLocale(), { compact: true })}</p>
                  </div>
                </div>
              </section>
            )}

            {s.phone && (
              <a
                href={whatsappLink("", s.phone)}
                className="flex items-center justify-center gap-2 rounded-full bg-[#17614F] text-white text-sm font-bold py-3"
              >
                <Phone className="w-4 h-4" />
                {T("shared.contact")}
              </a>
            )}
          </>
        )}
        <p className="text-center text-[11px] text-[#555B53] pt-4">{T("shared.by")}</p>
      </main>
    </div>
  );
}
