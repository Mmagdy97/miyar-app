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
    <div className="min-h-screen bg-[#F3EFE6] text-[#1A2236]">
      <header className="h-14 px-4 flex items-center justify-between border-b border-[#DAD3C2] bg-white/80">
        <a href="/" className="flex items-center gap-2 font-black">
          <span className="w-8 h-8 rounded-lg bg-[#B5452B] text-white flex items-center justify-center">
            <LogoMark className="w-5 h-5" />
          </span>
          <span>{T("brand")}</span>
        </a>
        <span className="text-[11px] font-bold text-[#535E78]">{T("shared.readonly")}</span>
      </header>

      <main className="max-w-2xl mx-auto p-4 md:p-8 space-y-4">
        {!s || !s.name ? (
          <p className="text-center text-sm text-[#535E78] py-20">{T("shared.invalid")}</p>
        ) : (
          <>
            <section className="bg-white rounded-2xl border border-[#DAD3C2] p-5 space-y-4">
              {s.office && <p className="text-xs font-bold text-[#535E78]">{s.office}</p>}
              <div>
                <p className="text-xs font-bold text-[#535E78]">{T("shared.title")}</p>
                <h1 className="text-xl font-black mt-0.5">{s.name}</h1>
                {s.client && <p className="text-sm text-[#535E78] mt-0.5">{s.client}</p>}
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
                  <div className="rounded-xl bg-[#F3EFE6] p-3 min-w-0">
                    <dt className="text-[11px] font-bold text-[#535E78]">{T("shared.phase")}</dt>
                    <dd className="font-bold truncate">{E(s.phase)}</dd>
                  </div>
                )}
                {s.status && (
                  <div className="rounded-xl bg-[#F3EFE6] p-3 min-w-0">
                    <dt className="text-[11px] font-bold text-[#535E78]">{T("shared.status")}</dt>
                    <dd className="font-bold truncate">{E(s.status)}</dd>
                  </div>
                )}
              </dl>
              <div className="space-y-1.5 text-xs text-[#535E78]">
                {s.deadline && (
                  <p className="flex items-center gap-2"><CalendarDays className="w-4 h-4" />{T("shared.deadline")}: <strong className="text-[#1A2236]">{s.deadline}</strong></p>
                )}
                {s.location && (
                  <p className="flex items-center gap-2"><MapPin className="w-4 h-4" />{s.location}</p>
                )}
                {s.updated && <p>{T("shared.updated")}: {s.updated}</p>}
              </div>
              {s.note && <p className="text-sm leading-relaxed border-t border-[#E9E3D5] pt-3">{s.note}</p>}
            </section>

            {s.phases.length > 1 && (
              <section className="bg-white rounded-2xl border border-[#DAD3C2] p-5">
                <h2 className="text-sm font-black mb-4">{T("shared.stages")}</h2>
                <ol className="flex items-start justify-between gap-1">
                  {s.phases.map((ph, i) => {
                    const cur = s.phases.indexOf(s.phase);
                    const done = cur > i, now = cur === i;
                    return (
                      <li key={ph + i} className="flex-1 flex flex-col items-center gap-1.5 text-center min-w-0">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${done || now ? "bg-[#24304D] text-white" : "bg-white border-2 border-[#DAD3C2] text-[#535E78]"} ${now ? "ring-4 ring-[#24304D]/10" : ""}`}>
                          {done ? <Check className="w-4 h-4" /> : i + 1}
                        </span>
                        <span className={`text-[11px] leading-tight ${now ? "font-black" : "font-bold text-[#535E78]"}`}>{ph}</span>
                      </li>
                    );
                  })}
                </ol>
              </section>
            )}

            {s.timeline.length > 0 && (
              <section className="bg-white rounded-2xl border border-[#DAD3C2] p-5">
                <h2 className="text-sm font-black mb-3">{T("shared.stages")}</h2>
                <ul className="space-y-3">
                  {s.timeline.map((t, i) => (
                    <li key={i} className="text-sm">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="flex items-center gap-1.5 font-bold min-w-0">
                          {t.pct >= 100 && <Check className="w-4 h-4 text-emerald-700 shrink-0" />}
                          <span className="truncate">{t.title}</span>
                        </span>
                        <span className="text-xs font-mono text-[#535E78]">{pct(t.pct)}</span>
                      </div>
                      <ProgressBar value={t.pct} />
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {s.contract > 0 && isSupportedCurrency(s.currency) && (
              <section className="bg-white rounded-2xl border border-[#DAD3C2] p-5">
                <h2 className="text-sm font-black mb-3">{T("shared.payments")}</h2>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-[#F3EFE6] p-3">
                    <p className="text-[11px] font-bold text-[#535E78]">{T("shared.collected")}</p>
                    <p className="font-black">{formatMoney(s.collected, s.currency, intlLocale(), { compact: true })}</p>
                  </div>
                  <div className="rounded-xl bg-[#F3EFE6] p-3">
                    <p className="text-[11px] font-bold text-[#535E78]">{T("shared.remaining")}</p>
                    <p className="font-black">{formatMoney(Math.max(0, s.contract - s.collected), s.currency, intlLocale(), { compact: true })}</p>
                  </div>
                </div>
              </section>
            )}

            {s.phone && (
              <a
                href={whatsappLink("", s.phone)}
                className="flex items-center justify-center gap-2 rounded-full bg-[#24304D] text-white text-sm font-bold py-3"
              >
                <Phone className="w-4 h-4" />
                {T("shared.contact")}
              </a>
            )}
          </>
        )}
        <p className="text-center text-[11px] text-[#535E78] pt-4">{T("shared.by")}</p>
      </main>
    </div>
  );
}
