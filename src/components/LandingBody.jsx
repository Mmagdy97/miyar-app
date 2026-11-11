import { ChevronRight, Check, LogIn } from "lucide-react";
import LogoMark from "./LogoMark";
import SettingsSwitcher from "./SettingsSwitcher";
import Capabilities from "./Capabilities";
import RoleModules from "./RoleModules";
import { BoqLive } from "./Hero";
import { PricingSection } from "./PublicPages";
import { tr_ as T, useI18n } from "../i18n";

const Link = ({ onClick, children }) => (
  <button onClick={onClick} className="group inline-flex items-center gap-1 text-base sm:text-lg font-medium text-[#D9480F] hover:underline underline-offset-4 cursor-pointer">
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
      <header className="fixed top-0 inset-x-0 z-40 bg-[#F6F5F1]/80 glass border-b border-[#E3E0D9]/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[9px] bg-[#D9480F] text-white flex items-center justify-center"><LogoMark className="w-4.5 h-4.5 text-white" /></div>
            <span className="text-lg font-semibold tracking-tight text-[#16181C]">{T("ld.1")}</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium text-[#5D6168]">
            <button onClick={() => scrollToSection("features")} className="hover:text-[#16181C] cursor-pointer">{t("landing.features")}</button>
            <button onClick={() => scrollToSection("comparison")} className="hover:text-[#16181C] cursor-pointer">{t("landing.why")}</button>
            <button onClick={() => scrollToSection("pricing")} className="hover:text-[#16181C] cursor-pointer">{t("landing.pricing")}</button>
          </nav>
          <div className="flex items-center gap-2">
            <SettingsSwitcher />
            <button onClick={() => openModal("Admin")} className="btn-press inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-[#16181C] text-white text-[13px] font-medium cursor-pointer">
              <LogIn className="w-3.5 h-3.5 ltr:-scale-x-0 rtl:-scale-x-100" aria-hidden="true" />{t("landing.login")}
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 sm:pt-44 px-5 text-center">
        <h1 className="hero-in mx-auto max-w-4xl text-[2.6rem] leading-[1.12] sm:text-7xl sm:leading-[1.08] font-semibold tracking-tight text-[#16181C] text-balance">{T("ld.4")}</h1>
        <p className="hero-in mx-auto mt-6 max-w-2xl text-lg sm:text-2xl leading-relaxed text-[#5D6168] text-balance">{T("ld.5")}</p>
        <div className="hero-in mt-9 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
          <button onClick={() => openModal("Admin")} className="btn-press h-12 px-8 rounded-full bg-[#D9480F] hover:bg-[#B83B0A] text-white text-base font-medium cursor-pointer">{T("ld.6")}</button>
          <Link onClick={() => scrollToSection("comparison")}>{T("ld.7")}</Link>
        </div>
        <div className="hero-card-in mx-auto mt-14 sm:mt-20 max-w-xl text-start"><BoqLive /></div>
      </section>

      {/* Pillars: one idea per screen */}
      <div className="mt-14 sm:mt-32">
        {PILLARS.map((p, i) => (
          <section key={i} id={p.id} className={`py-14 sm:py-36 px-5 text-center ${p.dark ? "bg-[#171B21] text-white" : ""}`}>
            <p className="text-sm sm:text-base font-semibold text-[#D9480F]">{T(p.kicker)}</p>
            <h2 className={`mx-auto mt-3 max-w-4xl text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.1] text-balance ${p.dark ? "text-white" : "text-[#16181C]"}`}>{T(p.title)}</h2>
            <p className={`mx-auto mt-6 max-w-2xl text-lg sm:text-xl leading-relaxed ${p.dark ? "text-[#AEB5BD]" : "text-[#5D6168]"}`}>{T(p.desc)}</p>
            <ul className="mx-auto mt-8 sm:mt-16 max-w-5xl grid sm:grid-cols-3 gap-3 sm:gap-6 text-start">
              {p.pts.map((k) => (
                <li key={k} className={`rounded-2xl sm:rounded-3xl p-5 sm:p-8 ${p.dark ? "bg-[#1E242B]" : "bg-white border border-[#E3E0D9]"}`}>
                  <Check className="w-5 h-5 text-[#D9480F]" aria-hidden="true" />
                  <p className={`mt-4 text-base sm:text-lg leading-snug font-medium ${p.dark ? "text-[#EEECE6]" : "text-[#16181C]"}`}>{T(k)}</p>
                </li>
              ))}
            </ul>
            <div className="mt-10"><Link onClick={() => openModal(p.role)}>{T(p.link)}</Link></div>
          </section>
        ))}
      </div>

      <RoleModules openModal={openModal} />
      <Capabilities />

      {/* Comparison */}
      <section id="comparison" className="py-14 sm:py-32 px-5 max-w-5xl mx-auto w-full">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-4xl sm:text-6xl font-semibold tracking-tight text-[#16181C] text-balance">{T("ld.109")}</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg sm:text-xl text-[#5D6168] leading-relaxed">{T("ld.110")}</p>
        </div>
        <div className="space-y-4">
          {ROWS.map(([f, m, a, b]) => (
            <div key={f} className="rounded-3xl bg-white border border-[#E3E0D9] p-6 sm:p-8 text-start">
              <h3 className="text-sm font-semibold text-[#D9480F]">{T(`ld.${f}`)}</h3>
              <p className="mt-2 text-xl sm:text-2xl font-semibold tracking-tight text-[#16181C] leading-snug">{T(`ld.${m}`)}</p>
              <div className="mt-5 pt-5 border-t border-[#EEECE6] grid sm:grid-cols-2 gap-3 text-sm text-[#80848B] leading-relaxed">
                <p><span className="font-semibold text-[#5D6168]">{T("ld.114")} — </span>{T(`ld.${a}`)}</p>
                <p><span className="font-semibold text-[#5D6168]">{T("ld.115")} — </span>{T(`ld.${b}`)}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-lg font-medium text-[#16181C] text-balance">{T("ld.136")} <span className="text-[#5D6168] font-normal">{T("ld.137")}</span></p>
      </section>

      <PricingSection onStart={() => openModal("Admin")} />

      {/* CTA */}
      <section id="cta" className="px-4 sm:px-6 pb-16 sm:pb-24 max-w-6xl mx-auto w-full">
        <div className="rounded-[2rem] bg-[#171B21] text-white text-center px-6 py-16 sm:py-24">
          <h2 className="mx-auto max-w-3xl text-3xl sm:text-5xl font-semibold tracking-tight leading-tight text-balance">{T("ld.139")}</h2>
          <p className="mx-auto mt-5 max-w-xl text-base sm:text-lg text-[#AEB5BD] leading-relaxed">{T("ld.140")}</p>
          <button onClick={() => openModal("Admin")} className="btn-press mt-9 h-12 px-8 rounded-full bg-[#D9480F] hover:bg-[#B83B0A] text-white text-base font-medium cursor-pointer">{T("ld.141")}</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E3E0D9] py-10 px-5 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-5 text-center">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#D9480F] text-white flex items-center justify-center"><LogoMark className="w-4 h-4 text-white" /></div>
            <span className="font-semibold text-[#16181C]">{T("ld.1")}</span>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-[#5D6168]">
            <button onClick={() => scrollToSection("features")} className="hover:text-[#16181C] cursor-pointer">{t("landing.footerFeatures")}</button>
            <button onClick={() => scrollToSection("comparison")} className="hover:text-[#16181C] cursor-pointer">{t("landing.footerCompare")}</button>
            <button onClick={() => openModal("Client")} className="hover:text-[#16181C] cursor-pointer">{t("landing.clientPortal")}</button>
            <button onClick={() => { setLegalPage("privacy"); window.scrollTo(0, 0); }} className="hover:text-[#16181C] cursor-pointer">{t("landing.privacy")}</button>
            <button onClick={() => { setLegalPage("terms"); window.scrollTo(0, 0); }} className="hover:text-[#16181C] cursor-pointer">{t("landing.terms")}</button>
          </div>
          <p className="text-xs text-[#80848B]">{T("ld.143")}</p>
        </div>
      </footer>
    </>
  );
}
