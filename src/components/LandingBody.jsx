import { useState } from "react";
import { waLink } from "../lib/nudge";
import {
  ArrowUpRight, LogIn, MessageCircle, Building2, HardHat, FileCode, ShieldCheck,
  Calculator, Wallet, Coins, CheckCheck, ClipboardList, WifiOff,
} from "lucide-react";
import LogoMark from "./LogoMark";
import SettingsSwitcher from "./SettingsSwitcher";
import ScrollArt from "./ScrollArt";
import { PricingSection } from "./PublicPages";
import { tr_ as T, useI18n } from "../i18n";

const ROLES = [
  { id: "Admin", key: "admin", Icon: Building2, tone: "lp-t1" },
  { id: "Site Engineer", key: "site", Icon: HardHat, tone: "lp-t2" },
  { id: "Technical Office", key: "tech", Icon: FileCode, tone: "lp-t3" },
  { id: "Client", key: "client", Icon: ShieldCheck, tone: "lp-t4" },
];

const FEATURES = [
  { k: "f1", Icon: Calculator, tone: "lp-t1", wide: true },
  { k: "f2", Icon: Wallet, tone: "lp-t2" },
  { k: "f3", Icon: Coins, tone: "lp-t3" },
  { k: "f4", Icon: CheckCheck, tone: "lp-t4" },
  { k: "f5", Icon: ClipboardList, tone: "lp-t1" },
  { k: "f6", Icon: WifiOff, tone: "lp-t2", wide: true },
];

function HeroArt() {
  // Stylised modern building at dusk: curved volumes, lit windows, pool
  return (
    <svg aria-hidden="true" viewBox="0 0 1200 420" preserveAspectRatio="xMidYMax slice" className="absolute inset-x-0 bottom-0 w-full h-[40%] -z-10">
      <defs>
        <linearGradient id="lpg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F7F3EE" /><stop offset="1" stopColor="#E2D6CA" /></linearGradient>
        <linearGradient id="lpg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFD9A8" /><stop offset="1" stopColor="#F2A87C" /></linearGradient>
        <linearGradient id="lpg3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8EC5D2" /><stop offset="1" stopColor="#5FA3B5" /></linearGradient>
      </defs>
      <path d="M0 300 C200 240 360 280 560 250 C760 220 980 270 1200 230 V420 H0Z" fill="#9DB8A6" opacity=".35" />
      <path d="M0 340 C240 300 420 330 640 305 C860 280 1020 320 1200 300 V420 H0Z" fill="#7F9C8A" opacity=".45" />
      <rect x="250" y="236" width="700" height="62" rx="31" fill="url(#lpg1)" />
      <rect x="320" y="176" width="520" height="72" rx="36" fill="#fff" opacity=".96" />
      <rect x="360" y="192" width="440" height="40" rx="20" fill="url(#lpg2)" />
      <g fill="#fff" opacity=".7"><rect x="392" y="200" width="54" height="24" rx="12" /><rect x="462" y="200" width="54" height="24" rx="12" /><rect x="532" y="200" width="54" height="24" rx="12" /><rect x="602" y="200" width="54" height="24" rx="12" /><rect x="672" y="200" width="54" height="24" rx="12" /></g>
      <rect x="290" y="252" width="620" height="30" rx="15" fill="url(#lpg2)" opacity=".9" />
      <rect x="230" y="296" width="740" height="124" rx="40" fill="url(#lpg3)" />
      <path d="M260 318 H940" stroke="#fff" strokeOpacity=".5" strokeWidth="3" strokeLinecap="round" />
      <path d="M300 346 H900" stroke="#fff" strokeOpacity=".3" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export default function LandingBody({ openModal, setLegalPage, scrollToSection }) {
  const { t } = useI18n();
  const [role, setRole] = useState("Admin");
  const stats = [["16+", "lp.st1"], ["7", "lp.st2"], ["3", "lp.st3"], ["4", "lp.st4"]];
  return (
    <>
      <ScrollArt bare />
      <div className="p-3 sm:p-4 w-full">
        <section className="lp-hero">
          <div className="lp-sun" aria-hidden="true" />
          <HeroArt />

          {/* Floating pill nav */}
          <header className="lp-nav relative z-10 flex items-center justify-between gap-3 px-4 sm:px-8 pt-4 sm:pt-6">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full lp-pill-dark flex items-center justify-center"><LogoMark className="w-5 h-5 text-white" /></div>
              <span className="font-display text-lg font-semibold">{T("ld.1")}</span>
            </div>
            <nav className="lp-glass hidden md:flex items-center gap-1 rounded-full p-1.5 text-[13px] font-medium">
              <button onClick={() => scrollToSection("roles")} className="px-4 py-2 rounded-full lp-pill-dark">{T("lp.st4")}</button>
              <button onClick={() => scrollToSection("features")} className="px-4 py-2 rounded-full">{t("landing.features")}</button>
              <button onClick={() => scrollToSection("pricing")} className="px-4 py-2 rounded-full">{t("landing.pricing")}</button>
            </nav>
            <div className="flex items-center gap-2">
              <SettingsSwitcher />
              <button onClick={() => openModal("Admin")} className="btn-press lp-pill-dark inline-flex items-center gap-2 h-11 ps-5 pe-1.5 rounded-full text-[13px] font-semibold">
                {t("landing.login")}
                <span className="w-8 h-8 rounded-full bg-[var(--peach)] text-[var(--on-peach)] flex items-center justify-center"><LogIn className="w-4 h-4 rtl:-scale-x-100" aria-hidden="true" /></span>
              </button>
            </div>
          </header>

          {/* Headline */}
          <div className="relative z-10 px-5 sm:px-12 pt-10 sm:pt-16 text-start max-w-3xl hero-in">
            <p className="text-[11px] sm:text-xs tracking-[.18em] uppercase font-semibold opacity-70">{T("lp.kicker")}</p>
            <h1 className="mt-4 font-display font-semibold leading-[1.1] text-[2.6rem] sm:text-6xl xl:text-7xl">
              {T("lp.h1a")}<br /><span className="text-[#C4724F]">{T("lp.h1b")}</span>
            </h1>
            <p className="mt-5 max-w-lg text-base sm:text-lg leading-relaxed opacity-80">{T("ld.5")}</p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button onClick={() => openModal("Admin")} className="btn-press lp-pill-dark h-12 ps-6 pe-1.5 rounded-full inline-flex items-center gap-3 text-[15px] font-semibold">
                {T("ld.6")}
                <span className="w-9 h-9 rounded-full bg-[var(--peach)] text-[var(--on-peach)] flex items-center justify-center"><ArrowUpRight className="w-4 h-4 rtl:-scale-x-100" aria-hidden="true" /></span>
              </button>
              <button onClick={() => scrollToSection("features")} className="lp-glass h-12 px-6 rounded-full text-[15px] font-semibold">{T("lp.explore")}</button>
            </div>
          </div>

          {/* Role strip (glass search-bar style) */}
          <div className="relative z-10 mt-8 sm:mt-10 px-4 sm:px-12">
            <div className="lp-glass rounded-[28px] sm:rounded-full p-2.5 flex flex-col sm:flex-row sm:items-center gap-2 max-w-4xl">
              <span className="px-4 text-xs font-semibold opacity-70 shrink-0">{T("lp.enter")}</span>
              <div role="radiogroup" className="flex flex-wrap gap-1.5 flex-1">
                {ROLES.map((r) => (
                  <button key={r.id} role="radio" aria-checked={role === r.id} onClick={() => setRole(r.id)}
                    className={`h-10 px-4 rounded-full text-[13px] font-semibold inline-flex items-center gap-2 transition-colors ${role === r.id ? "lp-pill-dark" : "hover:bg-black/5"}`}>
                    <r.Icon className="w-4 h-4" aria-hidden="true" />{T("login.role." + r.key)}
                  </button>
                ))}
              </div>
              <button onClick={() => openModal(role)} className="btn-press h-11 px-6 rounded-full bg-[var(--peach)] text-[var(--on-peach)] text-[14px] font-bold shrink-0">{T("lp.go")}</button>
            </div>
          </div>

          {/* Bottom glass cards */}
          <div className="lp-bottom relative z-10 mt-8 sm:mt-10 px-4 sm:px-12 pb-6 sm:pb-10 grid lg:grid-cols-[1fr_1.35fr_1fr] gap-3 sm:gap-4 text-start">
            <div className="lp-glass rounded-[28px] p-5">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-[var(--mint,#DAEBE3)] text-[#2F4A3E]"><span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />{T("lp.fp.tag")}</span>
              <h3 className="mt-3 font-display text-lg font-semibold">{T("lp.fp.name")}</h3>
              <p className="text-sm opacity-70">{T("lp.fp.meta")}</p>
              <div className="mt-4 h-2.5 rounded-full bg-black/10 overflow-hidden"><div className="h-full w-[65%] rounded-full bg-[var(--peach)]" /></div>
              <p className="mt-2 text-xs font-semibold opacity-80">{T("lp.fp.prog")}</p>
            </div>
            <div className="lp-glass rounded-[28px] p-5 grid grid-cols-4 gap-2 items-center text-center">
              {stats.map(([n, k]) => (
                <div key={k} className="px-1 border-s first:border-s-0 border-black/10">
                  <div className="font-display text-3xl sm:text-4xl font-semibold">{n}</div>
                  <div className="mt-1 text-[11px] sm:text-xs opacity-70 leading-tight">{T(k)}</div>
                </div>
              ))}
            </div>
            <button onClick={() => openModal("Client")} className="lp-pill-dark rounded-[28px] p-5 text-start flex flex-col justify-between gap-4 min-h-[140px] group">
              <div className="flex items-center justify-between"><ShieldCheck className="w-6 h-6 text-[var(--peach)]" aria-hidden="true" /><span className="w-9 h-9 rounded-full bg-[var(--peach)] text-[var(--on-peach)] flex items-center justify-center group-hover:rotate-12 transition-transform"><ArrowUpRight className="w-4 h-4 rtl:-scale-x-100" aria-hidden="true" /></span></div>
              <div><h3 className="font-display text-lg font-semibold">{T("lp.cl.t")}</h3><p className="mt-1 text-sm opacity-75 leading-relaxed">{T("lp.cl.d")}</p></div>
            </button>
          </div>
        </section>
      </div>

      {/* Roles */}
      <section id="roles" className="px-5 sm:px-8 py-14 sm:py-20 max-w-6xl mx-auto w-full">
        <div className="text-start max-w-2xl reveal">
          <h2 className="font-display text-3xl sm:text-5xl font-semibold leading-tight text-[#1F2A26] text-balance">{T("lp.roles.t")}</h2>
          <p className="mt-3 text-base sm:text-lg text-[#56635B]">{T("lp.roles.d")}</p>
        </div>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ROLES.map((r, i) => (
            <button key={r.id} onClick={() => openModal(r.id)} style={{ transitionDelay: `${i * 70}ms` }} className="lp-card reveal p-6 text-start flex flex-col gap-4">
              <span className={`lp-ic ${r.tone}`}><r.Icon className="w-5 h-5" aria-hidden="true" /></span>
              <div>
                <h3 className="font-display text-lg font-semibold text-[#1F2A26]">{T("login.role." + r.key)}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[#56635B]">{T("login.desc." + r.key)}</p>
              </div>
              <ArrowUpRight className="w-5 h-5 mt-auto self-end text-[#56635B] rtl:-scale-x-100" aria-hidden="true" />
            </button>
          ))}
        </div>
      </section>

      {/* Features bento */}
      <section id="features" className="px-5 sm:px-8 pb-14 sm:pb-20 max-w-6xl mx-auto w-full">
        <h2 className="reveal text-start max-w-2xl font-display text-3xl sm:text-5xl font-semibold leading-tight text-[#1F2A26] text-balance">{T("lp.f.t")}</h2>
        <div className="mt-8 grid md:grid-cols-4 gap-4">
          {FEATURES.map((f, i) => (
            <div key={f.k} style={{ transitionDelay: `${i * 60}ms` }} className={`lp-card reveal p-6 sm:p-7 text-start ${f.wide ? "md:col-span-2" : ""}`}>
              <span className={`lp-ic ${f.tone}`}><f.Icon className="w-5 h-5" aria-hidden="true" /></span>
              <h3 className="mt-5 font-display text-xl font-semibold text-[#1F2A26]">{T(`lp.${f.k}.t`)}</h3>
              <p className="mt-2 text-sm sm:text-base leading-relaxed text-[#56635B]">{T(`lp.${f.k}.d`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 sm:px-8 pb-14 sm:pb-20 max-w-6xl mx-auto w-full">
        <div className="rounded-[34px] bg-[var(--panel)] text-[var(--panel-ink)] px-6 sm:px-12 py-10 sm:py-14 text-start">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold max-w-xl text-balance">{T("lp.how.t")}</h2>
          <ol className="mt-8 grid md:grid-cols-3 gap-4">
            {[1, 2, 3].map((n) => (
              <li key={n} className="rounded-[24px] bg-white/[.07] border border-white/10 p-6">
                <span className="w-10 h-10 rounded-full bg-[var(--peach)] text-[var(--on-peach)] font-display font-semibold flex items-center justify-center">{n}</span>
                <h3 className="mt-4 font-display text-lg font-semibold">{T(`lp.how${n}.t`)}</h3>
                <p className="mt-1.5 text-sm opacity-75 leading-relaxed">{T(`lp.how${n}.d`)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <PricingSection onStart={() => openModal("Admin")} />

      {/* CTA */}
      <section id="cta" className="px-4 sm:px-8 pb-16 sm:pb-24 max-w-6xl mx-auto w-full">
        <div className="lp-hero !min-h-0 px-6 sm:px-14 py-12 sm:py-16 text-start">
          <div className="lp-sun !w-80 !h-80 !top-0" aria-hidden="true" />
          <h2 className="max-w-3xl font-display text-3xl sm:text-5xl font-semibold leading-tight text-balance">{T("ld.139")}</h2>
          <p className="mt-4 max-w-xl text-base sm:text-lg opacity-80 leading-relaxed">{T("ld.140")}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button onClick={() => openModal("Admin")} className="btn-press lp-pill-dark h-12 ps-6 pe-1.5 rounded-full inline-flex items-center gap-3 text-[15px] font-semibold">
              {T("ld.141")}
              <span className="w-9 h-9 rounded-full bg-[var(--peach)] text-[var(--on-peach)] flex items-center justify-center"><ArrowUpRight className="w-4 h-4 rtl:-scale-x-100" aria-hidden="true" /></span>
            </button>
            <a href={waLink(T("nudge.msgLanding"))} target="_blank" rel="noopener noreferrer" className="lp-glass inline-flex items-center gap-2 h-12 px-5 rounded-full text-sm font-semibold"><MessageCircle className="w-4 h-4" aria-hidden="true" />{T("nudge.cta")}</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-5 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-5 text-center">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full lp-pill-dark flex items-center justify-center"><LogoMark className="w-4 h-4 text-white" /></div>
            <span className="font-display font-semibold text-[#1F2A26]">{T("ld.1")}</span>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-[#56635B]">
            <button onClick={() => scrollToSection("features")} className="hover:text-[#1F2A26] cursor-pointer">{t("landing.footerFeatures")}</button>
            <button onClick={() => scrollToSection("pricing")} className="hover:text-[#1F2A26] cursor-pointer">{t("landing.pricing")}</button>
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
