import { waLink } from "../lib/nudge";
import { ChevronRight, Check, LogIn, MessageCircle, Globe, Coins, SunMoon } from "lucide-react";
import LogoMark from "./LogoMark";
import SettingsSwitcher from "./SettingsSwitcher";
import Capabilities from "./Capabilities";
import RoleModules from "./RoleModules";
import { BoqLive } from "./Hero";
import PlanArt from "./PlanArt";
import ScrollArt from "./ScrollArt";
import { PricingSection } from "./PublicPages";
import { tr_ as T, useI18n } from "../i18n";

const Link = ({ onClick, children }) => (
  <button onClick={onClick} className="group inline-flex items-center gap-1 text-base sm:text-lg font-medium text-[#5F6C61] hover:underline underline-offset-4 cursor-pointer">
    {children}
    <ChevronRight className="w-5 h-5 ltr:group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5 transition-transform" aria-hidden="true" />
  </button>
);

// kicker, title, desc, bullets, demo-link text, role to open
const PILLARS = [
  { id: "features", kicker: "ld.38", title: "ld.39", desc: "ld.40", pts: ["ld.41", "ld.42", "ld.43"], link: "ld.44", role: "Technical Office", dark: false },
  { id: "pillars", kicker: "ld.70", title: "ld.71", desc: "ld.72", pts: ["ld.73", "ld.74", "ld.75"], link: "ld.76", role: "Admin", dark: true },
  { kicker: "ld.77", title: "ld.78", desc: "ld.79", pts: ["ld.80", "ld.81", "ld.82"], link: "ld.83", role: "Client", dark: false },
  { kicker: "ld.101", title: "ld.102", desc: "ld.103", pts: ["ld.104", "ld.105", "ld.106"], link: "ld.107", role: "Site Engineer", dark: true },
];

const ROWS = [[116, 117, 118, 119], [120, 121, 122, 123], [124, 125, 126, 127], [128, 129, 130, 131], [132, 133, 134, 135]];

export default function LandingBody({ openModal, setLegalPage, scrollToSection }) {
  const { t } = useI18n();
  return (
    <>
      <ScrollArt />
      {/* Nav */}
      <header className="fixed top-0 inset-x-0 z-40 bg-[#F2F5F1]/90 glass">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[10px] bg-[#5F6C61] text-white flex items-center justify-center"><LogoMark className="w-4.5 h-4.5 text-white" /></div>
            <span className="font-display text-lg font-semibold text-[#1F2A26]">{T("ld.1")}</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium text-[#56635B]">
            <button onClick={() => scrollToSection("features")} className="hover:text-[#1F2A26] cursor-pointer">{t("landing.features")}</button>
            <button onClick={() => scrollToSection("comparison")} className="hover:text-[#1F2A26] cursor-pointer">{t("landing.why")}</button>
            <button onClick={() => scrollToSection("pricing")} className="hover:text-[#1F2A26] cursor-pointer">{t("landing.pricing")}</button>
          </nav>
          <div className="flex items-center gap-2">
            <SettingsSwitcher />
            <button onClick={() => openModal("Admin")} className="btn-press inline-flex items-center gap-1.5 h-9 px-4 rounded-xl bg-[#5F6C61] text-white text-[13px] font-semibold cursor-pointer">
              <LogIn className="w-3.5 h-3.5 ltr:-scale-x-0 rtl:-scale-x-100" aria-hidden="true" />{t("landing.login")}
            </button>
          </div>
        </div>
      </header>

      {/* Hero: deep-pine stage, calculator floats on it */}
      <section className="pt-[4.5rem] sm:pt-[5.25rem] px-3 sm:px-6 w-full">
        <div className="relative max-w-7xl mx-auto rounded-[28px] bg-[var(--sand)] text-[var(--sand-ink)] border border-[var(--sand-line)] overflow-hidden zellige">
          <PlanArt className="plan-parallax pointer-events-none absolute -top-6 start-[34%] w-[760px] max-w-none text-[#1F2A26]/[.2] hidden sm:block" />
          <div aria-hidden="true" className="absolute -top-32 -end-24 w-[34rem] h-[34rem] rounded-full bg-[var(--sand-2)] blur-3xl opacity-90" />
          <div aria-hidden="true" className="absolute -bottom-40 -start-20 w-[26rem] h-[26rem] rounded-full bg-[var(--brass)]/15 blur-3xl" />
          <div className="relative grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center px-5 sm:px-12 pt-12 sm:pt-16 pb-14 sm:pb-20">
            <div className="hero-in text-start">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--sand-line)] bg-white/70 px-3 py-1 text-xs font-semibold text-[#9A4F35]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--brass)]" aria-hidden="true" />{T("ld.1")}
              </span>
              <h1 className="mt-5 max-w-xl font-display text-[2rem] sm:text-5xl xl:text-[3.4rem] font-semibold leading-[1.18] text-[var(--sand-ink)] text-balance">{T("ld.4")}</h1>
              <p className="mt-5 max-w-lg text-base sm:text-lg leading-relaxed text-[#56635B]">{T("ld.5")}</p>
              <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                <button onClick={() => openModal("Admin")} className="btn-press h-12 px-7 rounded-xl bg-[#5F6C61] hover:bg-[#4B574D] text-white text-[15px] whitespace-nowrap shrink-0 font-semibold cursor-pointer shadow-[0_10px_26px_-10px_rgba(23,97,79,.6)]">{T("ld.6")}</button>
                <button onClick={() => scrollToSection("comparison")} className="group inline-flex items-center gap-1 text-base font-medium text-[#1F2A26] hover:text-[#5F6C61] cursor-pointer">
                  {T("ld.7")}
                  <ChevronRight className="w-5 h-5 rtl:-scale-x-100 transition-transform ltr:group-hover:translate-x-0.5 rtl:group-hover:translate-x-0.5" aria-hidden="true" />
                </button>
              </div>
              <ul className="mt-9 grid gap-2.5 text-sm text-[#56635B]">
                {["ld.8", "ld.9", "ld.10"].map((k) => (
                  <li key={k} className="flex items-center gap-2.5"><Check className="w-4 h-4 text-[#D98E73] shrink-0" aria-hidden="true" />{T(k)}</li>
                ))}
              </ul>
              <div className="mt-6">
                <ul className="flex flex-wrap gap-2 text-xs font-semibold text-[#1F2A26]">
                  {[[Globe, "ld.chip.lang"], [Coins, "ld.chip.cur"], [SunMoon, "ld.chip.theme"]].map(([Ic, k]) => (
                    <li key={k} className="inline-flex items-center gap-1.5 rounded-full border border-[var(--sand-line)] bg-white/70 px-3 py-1.5"><Ic className="w-3.5 h-3.5 text-[#D98E73]" aria-hidden="true" />{T(k)}</li>
                  ))}
                </ul>
                <p className="mt-2 text-[11px] text-[#6E7B72]">{T("ld.chip.hint")}</p>
              </div>
            </div>
            <div className="hero-card-in text-start lg:-rotate-[0.6deg] rtl:lg:rotate-[0.6deg]"><div className="rounded-2xl shadow-[0_30px_60px_-28px_rgba(31,42,38,.35)]"><BoqLive /></div></div>
          </div>
          <div className="ruler text-[#1F2A26]/40 absolute bottom-0 inset-x-0" aria-hidden="true" />
        </div>
      </section>

      {/* Pillars: numbered, one idea each */}
      <div className="mt-6 sm:mt-10">
        {PILLARS.map((p, i) => (
          <section key={i} id={p.id} className="py-10 sm:py-16 px-5 sm:px-8">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-16 items-start">
              <div className="text-start">
                <div className="dim reveal max-w-sm"><span>{String(i + 1).padStart(2, "0")} · {T(p.kicker).split("•").pop().trim()}</span></div>
                <h2 className="mt-5 max-w-xl text-3xl sm:text-[2.4rem] font-semibold leading-[1.2] text-[#1F2A26] text-balance">{T(p.title)}</h2>
                <p className="mt-4 max-w-lg text-base sm:text-lg leading-relaxed text-[#56635B]">{T(p.desc)}</p>
                <div className="mt-6"><Link onClick={() => openModal(p.role)}>{T(p.link)}</Link></div>
              </div>
              <ul className="grid gap-3">
                {p.pts.map((k, j) => (
                  <li key={k} style={{ transitionDelay: `${j * 90}ms` }} className="reveal flex items-start gap-4 rounded-2xl bg-white border border-[#DCE4DC] p-5 sm:p-6 shadow-[var(--shadow-1)]">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-soft)] text-[#5F6C61]"><Check className="w-4 h-4" aria-hidden="true" /></span>
                    <p className="text-base sm:text-[17px] leading-snug font-medium text-[#1F2A26]">{T(k)}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>

      <RoleModules openModal={openModal} />
      <Capabilities />

      {/* Comparison */}
      <section id="comparison" className="py-12 sm:py-20 px-5 sm:px-8 max-w-6xl mx-auto w-full">
        <div className="text-start mb-8 sm:mb-10">
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#1F2A26] text-balance">{T("ld.109")}</h2>
          <p className="mt-4 max-w-2xl text-base sm:text-lg text-[#56635B] leading-relaxed">{T("ld.110")}</p>
        </div>
        <div className="space-y-4">
          {ROWS.map(([f, m, a, b]) => (
            <div key={f} className="rounded-xl bg-white border border-[#DCE4DC] p-5 sm:p-6 text-start">
              <h3 className="text-sm font-semibold text-[#5F6C61]">{T(`ld.${f}`)}</h3>
              <p className="mt-2 text-lg sm:text-xl font-semibold text-[#1F2A26] leading-snug">{T(`ld.${m}`)}</p>
              <div className="mt-5 pt-5 border-t border-[#E8EFE9] grid sm:grid-cols-2 gap-3 text-sm text-[#6E7B72] leading-relaxed">
                <p><span className="font-semibold text-[#56635B]">{T("ld.114")} — </span>{T(`ld.${a}`)}</p>
                <p><span className="font-semibold text-[#56635B]">{T("ld.115")} — </span>{T(`ld.${b}`)}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-8 text-start text-lg font-medium text-[#1F2A26] text-balance">{T("ld.136")} <span className="text-[#56635B] font-normal">{T("ld.137")}</span></p>
      </section>

      <PricingSection onStart={() => openModal("Admin")} />

      {/* CTA */}
      <section id="cta" className="px-4 sm:px-6 pb-16 sm:pb-24 max-w-6xl mx-auto w-full">
        <div className="relative overflow-hidden zellige rounded-[28px] bg-[var(--sand)] border border-[var(--sand-line)] text-[var(--sand-ink)] text-start px-6 sm:px-14 py-12 sm:py-16">
          <h2 className="max-w-3xl font-display text-3xl sm:text-[2.6rem] font-semibold leading-tight text-balance">{T("ld.139")}</h2>
          <p className="mt-4 max-w-xl text-base sm:text-lg text-[#56635B] leading-relaxed">{T("ld.140")}</p>
          <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
            <button onClick={() => openModal("Admin")} className="btn-press h-12 px-7 rounded-xl bg-[#5F6C61] hover:bg-[#4B574D] text-white text-base font-semibold cursor-pointer">{T("ld.141")}</button>
            <a href={waLink(T("nudge.msgLanding"))} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 h-11 text-base font-medium text-[#1F2A26] hover:text-[#5F6C61] underline-offset-4 hover:underline"><MessageCircle className="w-4 h-4" aria-hidden="true" />{T("nudge.cta")}</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#DCE4DC] py-10 px-5 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-5 text-center">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#5F6C61] text-white flex items-center justify-center"><LogoMark className="w-4 h-4 text-white" /></div>
            <span className="font-semibold text-[#1F2A26]">{T("ld.1")}</span>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-[#56635B]">
            <button onClick={() => scrollToSection("features")} className="hover:text-[#1F2A26] cursor-pointer">{t("landing.footerFeatures")}</button>
            <button onClick={() => scrollToSection("comparison")} className="hover:text-[#1F2A26] cursor-pointer">{t("landing.footerCompare")}</button>
            <button onClick={() => openModal("Client")} className="hover:text-[#1F2A26] cursor-pointer">{t("landing.clientPortal")}</button>
            <button onClick={() => { setLegalPage("privacy"); window.scrollTo(0, 0); }} className="hover:text-[#1F2A26] cursor-pointer">{t("landing.privacy")}</button>
            <button onClick={() => { setLegalPage("terms"); window.scrollTo(0, 0); }} className="hover:text-[#1F2A26] cursor-pointer">{t("landing.terms")}</button>
          </div>
          <p className="text-xs text-[#6E7B72]">{T("ld.143")}</p>
        </div>
      </footer>
    </>
  );
}
