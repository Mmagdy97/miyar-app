import { useEffect, useRef, useState } from "react";
import { SlidersHorizontal, Check, Sun, Moon, X } from "lucide-react";
import { useI18n, intlLocale } from "../i18n";
import { CURRENCIES } from "../lib/currency";
import { LOCALES } from "../config/locale";
import { getTheme, setTheme } from "../theme";

const SECTION = "text-[11px] font-semibold uppercase tracking-wide text-[#80848B] mb-2";

/** One compact control: language, currency and theme, as a popover on desktop and a bottom sheet on phones. */
export default function SettingsSwitcher() {
  const { t, locale, currency, setLocale, setCurrency } = useI18n();
  const [open, setOpen] = useState(false);
  const [theme, setThemeState] = useState(getTheme());
  const root = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const onDown = (e) => root.current && !root.current.contains(e.target) && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const pickTheme = (n) => { setTheme(n); setThemeState(n); };
  const curName = (code) => {
    try { return new Intl.DisplayNames(intlLocale(), { type: "currency" }).of(code); } catch { return code; }
  };
  const row = (active) =>
    `w-full flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm text-start btn-press ${
      active ? "bg-[#D9480F]/10 text-[#D9480F] font-semibold" : "text-[#16181C] hover:bg-[#EEECE6]"
    }`;

  return (
    <div className="relative" ref={root}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={t("settings.title")}
        className="btn-press inline-flex items-center gap-2 rounded-lg border border-[#E3E0D9] bg-white px-2.5 h-9 text-xs font-semibold text-[#16181C] hover:bg-[#EEECE6]"
      >
        <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
        <span className="tabular-nums" dir="ltr">{locale.toUpperCase()} · {currency}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-[60] bg-[#16181C]/50 sm:hidden" aria-hidden="true" />
          <div
            role="dialog"
            aria-label={t("settings.title")}
            className="fixed z-[70] inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-2xl border-t border-[#E3E0D9] bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:absolute sm:inset-x-auto sm:bottom-auto sm:top-full sm:mt-2 sm:end-0 sm:w-80 sm:max-h-[70vh] sm:rounded-xl sm:border sm:shadow-lg sm:p-3"
          >
            <div className="flex items-center justify-between mb-3 sm:hidden">
              <h2 className="text-base font-bold text-[#16181C]">{t("settings.title")}</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label={t("settings.close")} className="btn-press p-2 -m-2 rounded-lg text-[#5D6168]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className={SECTION}>{t("settings.language")}</p>
            <div className="mb-4 space-y-0.5">
              {Object.entries(LOCALES).map(([k, v]) => (
                <button key={k} type="button" onClick={() => setLocale(k)} className={row(k === locale)}>
                  <span>{v.name}</span>
                  {k === locale && <Check className="w-4 h-4" aria-hidden="true" />}
                </button>
              ))}
            </div>

            <p className={SECTION}>{t("settings.currency")}</p>
            <div className="mb-4 grid grid-cols-2 gap-1.5">
              {Object.values(CURRENCIES).map((c) => (
                <button key={c.code} type="button" onClick={() => setCurrency(c.code)} className={`${row(c.code === currency)} !px-2.5`} title={curName(c.code)}>
                  <span className="flex flex-col items-start leading-tight min-w-0">
                    <span className="font-semibold tabular-nums" dir="ltr">{c.code}</span>
                    <span className="text-[11px] opacity-70 truncate max-w-full">{curName(c.code)}</span>
                  </span>
                  {c.code === currency && <Check className="w-4 h-4 shrink-0" aria-hidden="true" />}
                </button>
              ))}
            </div>

            <p className={SECTION}>{t("settings.theme")}</p>
            <div className="grid grid-cols-2 gap-1.5 rounded-lg bg-[#EEECE6] p-1" role="group">
              {[["light", Sun, t("settings.light")], ["dark", Moon, t("settings.dark")]].map(([k, Icon, label]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => pickTheme(k)}
                  aria-pressed={theme === k}
                  className={`btn-press inline-flex items-center justify-center gap-2 rounded-md py-2 text-sm font-semibold ${
                    theme === k ? "bg-white text-[#16181C] shadow-sm" : "text-[#5D6168]"
                  }`}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />{label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
