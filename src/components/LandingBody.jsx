import { ChevronRight, Check, LogIn } from "lucide-react";
import LogoMark from "./LogoMark";
import SettingsSwitcher from "./SettingsSwitcher";
import Capabilities from "./Capabilities";
import RoleModules from "./RoleModules";
import { BoqLive } from "./Hero";
import { PricingSection } from "./PublicPages";
import { tr_ as T, useI18n } from "../i18n";

const Link = ({ onClick, children }) => (
  <button onClick={onClick} className="group inline-flex items-center gap-1 text-base sm:text-lg font-medium text-[#B5452B] hover:underline underline-offset-4 cursor-pointer">
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
      {/* Nav */}
      <header className="fixed top-0 inset-x-0 z-40 bg-[#F3EFE6]/80 glass border-b border-[#DAD3C2]/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[9px] bg-[#B5452B] text-white flex items-center justify-center"><LogoMark className="w-4.5 h-4.5 text-white" /></div>
            <span className="text-lg font-semibold tracking-tight text-[#1A2236]">{T("ld.1")}</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium text-[#535E78]">
            <button onClick={() => scrollToSection("features")} className="hover:text-[#1A2236] cursor-pointer">{t("landing.features")}</button>
            <button onClick={() => scrollToSection("comparison")} className="hover:text-[#1A2236] cursor-pointer">{t("landing.why")}</button>
            <button onClick={() => scrollToSection("pricing")} className="hover:text-[#1A2236] cursor-pointer">{t("landing.pricing")}</button>
          </nav>
          <div className="flex items-center gap-2">
            <SettingsSwitcher />
            <button onClick={() => openModal("Admin")} className="btn-press inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#1A2236] text-white text-[13px] font-medium cursor-pointer">
              <LogIn className="w-3.5 h-3.5 ltr:-scale-x-0 rtl:-scale-x-100" aria-hidden="true" />{t("landing.login")}
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-24 sm:pt-32 px-5 sm:px-8 w-full">
        <div className="max-w-6xl mx-auto"><div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-16 items-center pb-14 sm:pb-20">
          <div className="hero-in text-start">
            <h1 className="max-w-xl text-4xl sm:text-[2.75rem] font-semibold leading-[1.2] text-[#1A2236] text-balance">{T("ld.4")}</h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-[#535E78]">{T("ld.5")}</p>
            <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <button onClick={() => openModal("Admin")} className="btn-press h-11 px-6 rounded-lg bg-[#B5452B] hover:bg-[#9A3822] text-white text-[15px] whitespace-nowrap shrink-0 font-semibold cursor-pointer">{T("ld.6")}</button>
              <Link onClick={() => scrollToSection("comparison")}>{T("ld.7")}</Link>
            </div>
          </div>
          <div className="hero-card-in text-start"><BoqLive /></div>
        </div>
        <div className="ruler" aria-hidden="true" /></div>
      </section>

      {/* Pillars: one idea per band, ruled cells */}
      <div className="mt-10 sm:mt-16">
        {PILLARS.map((p, i) => (
          <section key={i} id={p.id} className={`py-12 sm:py-20 px-5 sm:px-8 ${p.dark ? "bg-[#141B2F] text-white" : ""}`}>
            <div className="max-w-6xl mx-auto">
              <h2 className={`max-w-3xl text-3xl sm:text-4xl font-semibold leading-[1.2] text-balance ${p.dark ? "text-white" : "text-[#1A2236]"}`}>{T(p.title)}</h2>
              <p className={`mt-4 max-w-2xl text-base sm:text-lg leading-relaxed ${p.dark ? "text-[#A1A9BD]" : "text-[#535E78]"}`}>{T(p.desc)}</p>
              <ul className={`mt-8 grid sm:grid-cols-3 gap-px rounded-xl overflow-hidden border ${p.dark ? "bg-[#273250] border-[#273250]" : "bg-[#DAD3C2] border-[#DAD3C2]"}`}>
                {p.pts.map((k) => (
                  <li key={k} className={`p-5 sm:p-6 ${p.dark ? "bg-[#192238]" : "bg-white"}`}>
                    <Check className="w-4 h-4 text-[#B5452B]" aria-hidden="true" />
                    <p className={`mt-3 text-base leading-snug font-medium ${p.dark ? "text-[#E9E3D5]" : "text-[#1A2236]"}`}>{T(k)}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-6"><Link onClick={() => openModal(p.role)}>{T(p.link)}</Link></div>
            </div>
          </section>
        ))}
      </div>

      <RoleModules openModal={openModal} />
      <Capabilities />

      {/* Comparison */}
      <section id="comparison" className="py-12 sm:py-20 px-5 sm:px-8 max-w-6xl mx-auto w-full">
        <div className="text-start mb-8 sm:mb-10">
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#1A2236] text-balance">{T("ld.109")}</h2>
          <p className="mt-4 max-w-2xl text-base sm:text-lg text-[#535E78] leading-relaxed">{T("ld.110")}</p>
        </div>
        <div className="space-y-4">
          {ROWS.map(([f, m, a, b]) => (
            <div key={f} className="rounded-xl bg-white border border-[#DAD3C2] p-5 sm:p-6 text-start">
              <h3 className="text-sm font-semibold text-[#B5452B]">{T(`ld.${f}`)}</h3>
              <p className="mt-2 text-lg sm:text-xl font-semibold text-[#1A2236] leading-snug">{T(`ld.${m}`)}</p>
              <div className="mt-5 pt-5 border-t border-[#E9E3D5] grid sm:grid-cols-2 gap-3 text-sm text-[#65708A] leading-relaxed">
                <p><span className="font-semibold text-[#535E78]">{T("ld.114")} — </span>{T(`ld.${a}`)}</p>
                <p><span className="font-semibold text-[#535E78]">{T("ld.115")} — </span>{T(`ld.${b}`)}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-8 text-start text-lg font-medium text-[#1A2236] text-balance">{T("ld.136")} <span className="text-[#535E78] font-normal">{T("ld.137")}</span></p>
      </section>

      <PricingSection onStart={() => openModal("Admin")} />

      {/* CTA */}
      <section id="cta" className="px-4 sm:px-6 pb-16 sm:pb-24 max-w-6xl mx-auto w-full">
        <div className="rounded-xl bg-[#141B2F] text-white text-start px-6 sm:px-12 py-12 sm:py-16">
          <h2 className="max-w-3xl text-3xl sm:text-4xl font-semibold leading-tight text-balance">{T("ld.139")}</h2>
          <p className="mt-4 max-w-xl text-base sm:text-lg text-[#A1A9BD] leading-relaxed">{T("ld.140")}</p>
          <button onClick={() => openModal("Admin")} className="btn-press mt-8 h-11 px-6 rounded-lg bg-[#B5452B] hover:bg-[#9A3822] text-white text-base font-medium cursor-pointer">{T("ld.141")}</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#DAD3C2] py-10 px-5 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-5 text-center">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#B5452B] text-white flex items-center justify-center"><LogoMark className="w-4 h-4 text-white" /></div>
            <span className="font-semibold text-[#1A2236]">{T("ld.1")}</span>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-[#535E78]">
            <button onClick={() => scrollToSection("features")} className="hover:text-[#1A2236] cursor-pointer">{t("landing.footerFeatures")}</button>
            <button onClick={() => scrollToSection("comparison")} className="hover:text-[#1A2236] cursor-pointer">{t("landing.footerCompare")}</button>
            <button onClick={() => openModal("Client")} className="hover:text-[#1A2236] cursor-pointer">{t("landing.clientPortal")}</button>
            <button onClick={() => { setLegalPage("privacy"); window.scrollTo(0, 0); }} className="hover:text-[#1A2236] cursor-pointer">{t("landing.privacy")}</button>
            <button onClick={() => { setLegalPage("terms"); window.scrollTo(0, 0); }} className="hover:text-[#1A2236] cursor-pointer">{t("landing.terms")}</button>
          </div>
          <p className="text-xs text-[#65708A]">{T("ld.143")}</p>
        </div>
      </footer>
    </>
  );
}
