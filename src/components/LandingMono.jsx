import { useState, useEffect } from "react";
import { waLink } from "../lib/nudge";
import { ArrowUpRight, Plus } from "lucide-react";
import SettingsSwitcher from "./SettingsSwitcher";
import LandingWhy from "./LandingWhy";
import { PricingSection } from "./PublicPages";
import { tr_ as T, useI18n } from "../i18n";
import { getTheme, setTheme } from "../theme";

const ROLES = [["Admin", "admin"], ["Site Engineer", "site"], ["Technical Office", "tech"], ["Accountant", "accountant"], ["Secretary", "secretary"], ["Client", "client"]];
const num = (i) => String(i + 1).padStart(2, "0");

/** Monochrome Swiss landing: giant wordmark, hairline grid, small labels, huge quiet headlines, invert toggle. */
export default function LandingMono({ openModal, openApp, setLegalPage, scrollToSection }) {
  const { t } = useI18n();
  const [dark, setDark] = useState(() => typeof document !== "undefined" && document.documentElement.classList.contains("dark"));
  useEffect(() => {
    const o = new MutationObserver(() => setDark(document.documentElement.classList.contains("dark")));
    o.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => o.disconnect();
  }, []);
  const invert = () => setTheme(dark || getTheme() === "dark" ? "light" : "dark");
  const nav = [["roles", T("lp.st4")], ["features", t("landing.features")], ["pricing", t("landing.pricing")]];
  const label = "text-[11px] tracking-[.12em] uppercase";

  return (
    <>
      {/* hairline grid */}
      <div aria-hidden="true" className="mono-grid pointer-events-none fixed inset-0 z-0" />

      <header className="sticky top-0 z-[95] mono-bar">
        <div className="flex items-center justify-between gap-3 px-4 sm:px-8 h-12">
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label={T("ld.1")} className="cursor-pointer"><Plus className="w-5 h-5" strokeWidth={3} aria-hidden="true" /></button>
          <nav className="hidden md:flex items-center gap-10 text-[13px] font-semibold">
            {nav.map(([id, text]) => <button key={id} onClick={() => scrollToSection(id)} className="mono-tick cursor-pointer">{text}</button>)}
          </nav>
          <div className="flex items-center gap-2">
            <SettingsSwitcher />
            <button onClick={() => openApp("in")} className="text-[13px] font-semibold underline underline-offset-4 cursor-pointer whitespace-nowrap">{t("landing.login")}</button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 border-b border-[var(--mono-line)]">
        <h1 aria-label={T("ld.1")} className="mono-word select-none">{T("ld.1")}</h1>
        <div className="grid md:grid-cols-4 gap-y-10 px-4 sm:px-8 pt-10 sm:pt-16 pb-14 sm:pb-24">
          <p className={`${label} font-semibold md:col-span-1 max-w-[16rem] leading-relaxed`}>{T("lp.kicker")}</p>
          <div className="md:col-span-3 md:col-start-2">
            <h2 className="mono-h2">{T("lp.h1a")}<br />{T("lp.h1b")}</h2>
            <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-[var(--md-on-surface-variant)]">{T("ld.5")}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button onClick={() => openApp("up")} className="m3-btn m3-filled">{T("ld.6")}<ArrowUpRight className="w-[18px] h-[18px] rtl:-scale-x-100" aria-hidden="true" /></button>
              <button onClick={() => openModal("Admin")} className="m3-btn m3-outlined">{T("lp.explore")}</button>
            </div>
          </div>
        </div>
      </section>

      {/* Roles */}
      <section id="roles" className="relative z-10 border-b border-[var(--mono-line)]">
        <div className="grid md:grid-cols-4 gap-y-6 px-4 sm:px-8 py-12 sm:py-20">
          <p className={`${label} font-semibold`}>{T("lp.st4")}</p>
          <div className="md:col-span-3">
            <h2 className="mono-h2">{T("lp.roles.t")}</h2>
            <p className="mt-3 text-base text-[var(--md-on-surface-variant)]">{T("lp.roles.d")}</p>
          </div>
        </div>
        <ul className="border-t border-[var(--mono-line)]">
          {ROLES.map(([id, key], i) => (
            <li key={id} className="border-b border-[var(--mono-line)] last:border-b-0">
              <button onClick={() => openModal(id)} className="mono-row w-full grid grid-cols-[2.5rem_1fr] md:grid-cols-4 gap-x-4 gap-y-1 items-baseline px-4 sm:px-8 py-5 text-start cursor-pointer">
                <span className={`${label} font-semibold`}>{num(i)}</span>
                <span className="text-2xl sm:text-4xl font-medium tracking-tight md:col-span-1">{T("login.role." + key)}</span>
                <span className="col-start-2 md:col-start-3 md:col-span-2 text-sm sm:text-base opacity-70 leading-relaxed">{T("login.desc." + key)}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 border-b border-[var(--mono-line)]">
        <div className="grid md:grid-cols-4 gap-y-6 px-4 sm:px-8 py-12 sm:py-20">
          <p className={`${label} font-semibold`}>{t("landing.features")}</p>
          <h2 className="mono-h2 md:col-span-3">{T("lp.f.t")}</h2>
        </div>
        <ul className="border-t border-[var(--mono-line)]">
          {[1, 2, 3, 4, 5, 6].map((n, i) => (
            <li key={n} className="grid grid-cols-[2.5rem_1fr] md:grid-cols-4 gap-x-4 gap-y-1 px-4 sm:px-8 py-6 border-b border-[var(--mono-line)] last:border-b-0 items-baseline">
              <span className={`${label} font-semibold`}>{num(i)}</span>
              <h3 className="text-xl sm:text-2xl font-medium tracking-tight">{T(`lp.f${n}.t`)}</h3>
              <p className="col-start-2 md:col-start-3 md:col-span-2 text-sm sm:text-base opacity-70 leading-relaxed">{T(`lp.f${n}.d`)}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* How it works */}
      <section className="relative z-10 border-b border-[var(--mono-line)]">
        <div className="grid md:grid-cols-4 gap-y-6 px-4 sm:px-8 py-12 sm:py-20">
          <p className={`${label} font-semibold`}>{T("lp.how.k")}</p>
          <div className="md:col-span-3">
            <h2 className="mono-h2">{T("lp.how.t")}</h2>
            <p className="mt-3 max-w-xl text-base text-[var(--md-on-surface-variant)]">{T("lp.how.d")}</p>
          </div>
        </div>
        <ol className="grid md:grid-cols-3 border-t border-[var(--mono-line)]">
          {[1, 2, 3].map((n) => (
            <li key={n} className="px-4 sm:px-8 py-8 border-b md:border-b-0 md:border-e border-[var(--mono-line)] last:border-0">
              <span className={`${label} font-semibold`}>{num(n - 1)} · {T(`lp.how${n}.time`)}</span>
              <h3 className="mt-6 text-xl sm:text-2xl font-medium tracking-tight">{T(`lp.how${n}.t`)}</h3>
              <p className="mt-2 text-sm sm:text-base opacity-70 leading-relaxed">{T(`lp.how${n}.d`)}</p>
            </li>
          ))}
        </ol>
      </section>

      <div className="relative z-10"><LandingWhy /></div>
      <div className="relative z-10"><PricingSection onStart={() => openApp("up")} /></div>

      {/* FAQ */}
      <section id="faq" className="relative z-10 border-t border-[var(--mono-line)]">
        <div className="grid md:grid-cols-4 gap-y-6 px-4 sm:px-8 py-12 sm:py-20">
          <p className={`${label} font-semibold`}>FAQ</p>
          <h2 className="mono-h2 md:col-span-3">{T("lp.faq.t")}</h2>
        </div>
        <div className="border-t border-[var(--mono-line)]">
          {[1, 2, 3, 4, 5].map((n) => (
            <details key={n} className="group border-b border-[var(--mono-line)] px-4 sm:px-8">
              <summary className="flex items-center justify-between gap-4 py-5 cursor-pointer list-none text-lg sm:text-xl font-medium">
                {T(`lp.q${n}`)}<Plus className="w-5 h-5 shrink-0 transition-transform group-open:rotate-45" aria-hidden="true" />
              </summary>
              <p className="pb-6 max-w-2xl text-base leading-relaxed opacity-70">{T(`lp.a${n}`)}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="relative z-10 border-b border-[var(--mono-line)] px-4 sm:px-8 py-16 sm:py-28">
        <h2 className="mono-h2 max-w-4xl">{T("ld.139")}</h2>
        <p className="mt-5 max-w-xl text-base sm:text-lg opacity-70 leading-relaxed">{T("ld.140")}</p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button onClick={() => openApp("up")} className="m3-btn m3-filled">{T("ld.141")}<ArrowUpRight className="w-[18px] h-[18px] rtl:-scale-x-100" aria-hidden="true" /></button>
          <a href={waLink(T("nudge.msgLanding"))} target="_blank" rel="noopener noreferrer" className="m3-btn m3-outlined">{T("nudge.cta")}</a>
        </div>
      </section>

      <footer className="relative z-10 px-4 sm:px-8 py-8 pb-20 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 text-xs">
        <span className="font-semibold">{T("ld.1")}</span>
        <div className="flex flex-wrap gap-x-6 gap-y-2 opacity-70">
          <button onClick={() => scrollToSection("features")} className="hover:opacity-100 cursor-pointer">{t("landing.footerFeatures")}</button>
          <button onClick={() => scrollToSection("pricing")} className="cursor-pointer">{t("landing.pricing")}</button>
          <button onClick={() => openApp("in")} className="cursor-pointer">{t("landing.clientPortal")}</button>
          <button onClick={() => { setLegalPage("privacy"); window.scrollTo(0, 0); }} className="cursor-pointer">{t("landing.privacy")}</button>
          <button onClick={() => { setLegalPage("terms"); window.scrollTo(0, 0); }} className="cursor-pointer">{t("landing.terms")}</button>
        </div>
        <span className="opacity-60">{T("ld.143")}</span>
      </footer>

      <button onClick={invert} className="fixed bottom-4 start-4 z-[96] text-[11px] font-semibold underline underline-offset-4 cursor-pointer mono-bar px-2 py-1">{t("mono.invert")}</button>
    </>
  );
}
