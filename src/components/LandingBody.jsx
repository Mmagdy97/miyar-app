import { useState } from "react";
import { waLink } from "../lib/nudge";
import { ChevronDown, Lock, Smartphone, Globe, BadgeCheck, ArrowUpRight, Building2, Calculator, CheckCheck, ClipboardCheck, ClipboardList, Clock, Coins, FileCode, Hammer, HardHat, Heart, LogIn, MapPin, MessageCircle, Rocket, Ruler, Share2, ShieldCheck, Users, Wallet, WifiOff } from "lucide-react";
import LogoMark from "./LogoMark";
import SettingsSwitcher from "./SettingsSwitcher";
import ScrollArt from "./ScrollArt";
import { PricingSection } from "./PublicPages";
import { tr_ as T, useI18n } from "../i18n";

const ROLES = [
  { id: "Admin", key: "admin", Icon: Building2, tone: "lp-t1", img: "villa" },
  { id: "Site Engineer", key: "site", Icon: HardHat, tone: "lp-t2", img: "site" },
  { id: "Technical Office", key: "tech", Icon: FileCode, tone: "lp-t3", img: "office" },
  { id: "Client", key: "client", Icon: ShieldCheck, tone: "lp-t4", img: "couple" },
];

const FEATURES = [
  { k: "f1", Icon: Calculator, tone: "lp-t1", wide: true, img: "kitchen" },
  { k: "f2", Icon: Wallet, tone: "lp-t2" },
  { k: "f3", Icon: Coins, tone: "lp-t3" },
  { k: "f4", Icon: CheckCheck, tone: "lp-t4" },
  { k: "f5", Icon: ClipboardList, tone: "lp-t1" },
  { k: "f6", Icon: WifiOff, tone: "lp-t2", wide: true, img: "site" },
];

const SHOWCASE = [
  { n: 1, img: "shot-boq" },
  { n: 2, img: "shot-fin" },
  { n: 3, img: "shot-rep", phone: true },
];
const TRUST = [{ n: 1, Icon: Lock }, { n: 2, Icon: Smartphone }, { n: 3, Icon: Globe }, { n: 4, Icon: BadgeCheck }];

export default function LandingBody({ openModal, setLegalPage, scrollToSection }) {
  const { t } = useI18n();
  const [role, setRole] = useState("Admin");
  const stats = [["16+", "lp.st1"], ["7", "lp.st2"], ["3", "lp.st3"], ["4", "lp.st4"]];
  return (
    <>
      <ScrollArt bare />
      {/* Sticky translucent nav */}
      <header className="lp-topnav sticky top-0 z-[95]">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 px-4 sm:px-8 h-14">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[10px] lp-pill-dark flex items-center justify-center"><LogoMark className="w-4 h-4 text-white" /></div>
            <span className="font-display text-[17px] font-semibold">{T("ld.1")}</span>
          </div>
          <nav className="hidden md:flex items-center gap-7 text-[13px] font-medium text-[var(--ink-2)]">
            <button onClick={() => scrollToSection("roles")} className="hover:text-[var(--ink)]">{T("lp.st4")}</button>
            <button onClick={() => scrollToSection("features")} className="hover:text-[var(--ink)]">{t("landing.features")}</button>
            <button onClick={() => scrollToSection("pricing")} className="hover:text-[var(--ink)]">{t("landing.pricing")}</button>
          </nav>
          <div className="flex items-center gap-2">
            <SettingsSwitcher />
            <button onClick={() => openModal("Admin")} className="btn-press lp-cta h-9 px-4 rounded-full text-[13px] font-semibold whitespace-nowrap">{t("landing.login")}</button>
          </div>
        </div>
      </header>

      <section className="lp-hero2 relative overflow-hidden">
        <div aria-hidden="true" className="lp-aurora" />
        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-14 sm:pt-24 text-center hero-in">
          <p className="text-[12px] sm:text-[13px] tracking-[.16em] uppercase font-semibold text-[var(--brand-link,#3F5BD8)]">{T("lp.kicker")}</p>
          <h1 className="mt-5 font-display font-semibold tracking-tight leading-[1.05] text-[2.6rem] sm:text-7xl xl:text-[5.5rem] text-balance">
            {T("lp.h1a")}<br /><span className="lp-grad">{T("lp.h1b")}</span>
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-base sm:text-xl leading-relaxed text-[var(--ink-2)] text-balance">{T("ld.5")}</p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3 sm:gap-5">
            <button onClick={() => openModal("Admin")} className="btn-press lp-cta h-12 px-7 rounded-full text-[15px] font-semibold">{T("ld.6")}</button>
            <button onClick={() => scrollToSection("features")} className="inline-flex items-center gap-1 h-12 px-3 text-[15px] font-semibold text-[#3F5BD8] hover:underline underline-offset-4">{T("lp.explore")}<span aria-hidden="true" className="rtl:-scale-x-100">›</span></button>
          </div>
        </div>

        {/* Product shot: desktop window + phone */}
        <div className="relative max-w-6xl mx-auto px-4 sm:px-8 mt-12 sm:mt-16">
          <div className="lp-window mx-auto">
            <div className="lp-window-bar"><i /><i /><i /></div>
            <img src="/landing/shot-d.webp" alt="" fetchpriority="high" width="1600" height="1000" className="block w-full h-auto" />
          </div>
          <div className="lp-phone hidden sm:block" aria-hidden="true">
            <img src="/landing/shot-m.webp" alt="" loading="lazy" width="390" height="844" className="block w-full h-auto" />
          </div>
        </div>

        {/* Role picker: segmented control */}
        <div className="relative max-w-3xl mx-auto px-4 mt-12 sm:mt-16 pb-14 sm:pb-20 text-center">
          <p className="text-xs font-semibold text-[var(--ink-3)]">{T("lp.enter")}</p>
          <div role="radiogroup" className="mt-3 inline-flex flex-wrap justify-center gap-1 p-1 rounded-[22px] sm:rounded-full bg-[var(--surface)] border border-[var(--line)] shadow-sm">
            {ROLES.map((r) => (
              <button key={r.id} role="radio" aria-checked={role === r.id} onClick={() => setRole(r.id)}
                className={`h-10 px-4 rounded-full text-[13px] font-semibold inline-flex items-center gap-2 transition-colors ${role === r.id ? "lp-pill-dark" : "text-[var(--ink-2)] hover:bg-[var(--paper-2)]"}`}>
                <r.Icon className="w-4 h-4" aria-hidden="true" />{T("login.role." + r.key)}
              </button>
            ))}
          </div>
          <div className="mt-4"><button onClick={() => openModal(role)} className="btn-press lp-cta h-11 px-7 rounded-full text-[14px] font-bold">{T("lp.go")}</button></div>
          <p className="mt-8 text-sm text-[var(--ink-3)]">{stats.map(([n, k]) => `${n} ${T(k)}`).join(" · ")}</p>
        </div>
      </section>

      {/* Roles */}
      <section id="roles" className="px-5 sm:px-8 py-14 sm:py-20 max-w-6xl mx-auto w-full">
        <div className="text-start max-w-2xl reveal">
          <h2 className="font-display text-3xl sm:text-5xl font-semibold leading-tight text-[#111827] text-balance">{T("lp.roles.t")}</h2>
          <p className="mt-3 text-base sm:text-lg text-[#4B5563]">{T("lp.roles.d")}</p>
        </div>
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {ROLES.map((r, i) => (
            <button key={r.id} onClick={() => openModal(r.id)} style={{ transitionDelay: `${i * 70}ms` }} className="reveal group relative isolate overflow-hidden rounded-[24px] sm:rounded-[28px] min-h-[250px] sm:min-h-[380px] p-3.5 sm:p-5 text-start text-white flex flex-col justify-between">
              <img src={`/landing/${r.img}-s.webp`} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover -z-20 transition-transform duration-700 group-hover:scale-105" />
              <div aria-hidden="true" className="absolute inset-0 -z-10 lp-shade-card" />
              <div className="flex items-center justify-between">
                <span className="lp-ic bg-white/25 backdrop-blur text-white"><r.Icon className="w-5 h-5" aria-hidden="true" /></span>
                <span className="w-10 h-10 rounded-full bg-[var(--peach)] text-[var(--on-peach)] flex items-center justify-center"><ArrowUpRight className="w-4 h-4 rtl:-scale-x-100" aria-hidden="true" /></span>
              </div>
              <div>
                <h3 className="font-display text-base sm:text-xl font-semibold">{T("login.role." + r.key)}</h3>
                <p className="mt-1.5 text-xs sm:text-sm leading-relaxed opacity-85 line-clamp-3">{T("login.desc." + r.key)}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Features bento */}
      <section id="features" className="px-5 sm:px-8 pb-14 sm:pb-20 max-w-6xl mx-auto w-full">
        <h2 className="reveal text-start max-w-2xl font-display text-3xl sm:text-5xl font-semibold leading-tight text-[#111827] text-balance">{T("lp.f.t")}</h2>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {FEATURES.map((f, i) => (
            <div key={f.k} style={{ transitionDelay: `${i * 60}ms` }} className={`reveal relative isolate overflow-hidden text-start ${f.wide ? "col-span-2 min-h-[220px] sm:min-h-[260px]" : ""} ${f.img ? "rounded-[24px] sm:rounded-[28px] p-5 sm:p-7 text-white flex flex-col justify-end" : "lp-card p-4 sm:p-7"}`}>
              {f.img && <><img src={`/landing/${f.img}-s.webp`} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover -z-20" /><div aria-hidden="true" className="absolute inset-0 -z-10 lp-shade-card" /></>}
              <span className={f.img ? "lp-ic bg-white/25 backdrop-blur text-white" : `lp-ic ${f.tone}`}><f.Icon className="w-5 h-5" aria-hidden="true" /></span>
              <h3 className={`mt-3 sm:mt-5 font-display text-base sm:text-xl font-semibold ${f.img ? "" : "text-[#111827]"}`}>{T(`lp.${f.k}.t`)}</h3>
              <p className={`mt-1.5 text-xs sm:text-base leading-relaxed ${f.img ? "opacity-90" : "text-[#4B5563]"}`}>{T(`lp.${f.k}.d`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works: steps timeline + photo */}
      <section className="px-4 sm:px-8 pb-14 sm:pb-20 max-w-6xl mx-auto w-full">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-4 sm:gap-6 items-stretch">
          <div className="reveal lp-card rounded-[34px] p-6 sm:p-10 text-start flex flex-col">
            <p className="text-xs font-semibold tracking-[.18em] uppercase text-[#4B5563]">{T("lp.how.k")}</p>
            <h2 className="mt-3 font-display text-3xl sm:text-5xl font-semibold text-[#111827] text-balance leading-tight">{T("lp.how.t")}</h2>
            <p className="mt-3 text-[#4B5563] max-w-md">{T("lp.how.d")}</p>
            <ol className="mt-8 relative space-y-3">
              <span aria-hidden="true" className="absolute top-6 bottom-6 start-[27px] w-px bg-[#E5E7EB]" />
              {[[1, Building2], [2, Users], [3, Rocket]].map(([n, Icon]) => (
                <li key={n} className="relative flex items-start gap-4 rounded-[22px] p-3 hover:bg-[#F7F8FA] transition-colors">
                  <span className={`relative z-10 w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center ${n === 3 ? "bg-[var(--brand)] text-white" : "bg-white border border-[#E5E7EB] text-[#111827]"}`}><Icon className="w-6 h-6" aria-hidden="true" /></span>
                  <div className="min-w-0 flex-1 pt-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-display text-sm font-semibold text-[#9CA3AF] tabular-nums">0{n}</span>
                      <h3 className="font-display text-lg font-semibold text-[#111827]">{T(`lp.how${n}.t`)}</h3>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold rounded-full bg-[var(--peach-soft,#FBE7DD)] text-[#7A4B2B] px-2 py-0.5"><Clock className="w-3 h-3" aria-hidden="true" />{T(`lp.how${n}.time`)}</span>
                    </div>
                    <p className="mt-1 text-sm text-[#4B5563] leading-relaxed">{T(`lp.how${n}.d`)}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-auto pt-8">
              <button onClick={() => openModal("Admin")} className="btn-press lp-pill-dark h-12 ps-6 pe-1.5 rounded-full inline-flex items-center gap-3 text-[15px] font-semibold">
                {T("ld.6")}
                <span className="w-9 h-9 rounded-full bg-[var(--peach)] text-[var(--on-peach)] flex items-center justify-center"><ArrowUpRight className="w-4 h-4 rtl:-scale-x-100" aria-hidden="true" /></span>
              </button>
            </div>
          </div>
          <div className="reveal relative isolate overflow-hidden rounded-[34px] min-h-[320px] lg:min-h-0 text-white">
            <img src="/landing/office.webp" alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover -z-20" />
            <div aria-hidden="true" className="absolute inset-0 -z-10 lp-shade-card" />
            <div className="absolute top-5 start-5 end-5 flex justify-between items-start gap-3">
              <span className="lp-glass rounded-full px-4 py-2 text-sm font-semibold">{T("lp.how.badge")}</span>
            </div>
            <div className="absolute bottom-5 start-5 end-5 lp-frost rounded-[24px] p-4 text-start">
              <div className="flex items-center justify-between text-xs font-semibold"><span>{T("lp.how.setup")}</span><span>3/3</span></div>
              <div className="mt-2 grid grid-cols-3 gap-1.5">{[1, 2, 3].map((n) => <span key={n} className="h-2 rounded-full bg-[var(--brand)]" />)}</div>
              <p className="mt-2 text-xs opacity-80">{T("lp.how.ready")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product showcase */}
      <section id="showcase" className="px-5 sm:px-8 py-16 sm:py-24 max-w-6xl mx-auto w-full">
        <div className="text-center reveal">
          <p className="text-[12px] tracking-[.16em] uppercase font-semibold text-[#3F5BD8]">{T("lp.sh.kick")}</p>
          <h2 className="mt-3 font-display text-3xl sm:text-5xl font-semibold tracking-tight text-balance">{T("lp.sh.t")}</h2>
        </div>
        <div className="mt-12 sm:mt-20 space-y-16 sm:space-y-28">
          {SHOWCASE.map((x, i) => (
            <div key={x.n} className={`reveal grid lg:grid-cols-[0.8fr_1.2fr] gap-8 lg:gap-14 items-center ${i % 2 ? "lg:[direction:rtl]" : ""}`}>
              <div className="text-start lg:[direction:initial]">
                <p className="text-xs font-semibold tracking-wide uppercase text-[#3F5BD8]">{T(`lp.sh${x.n}.k`)}</p>
                <h3 className="mt-3 font-display text-2xl sm:text-4xl font-semibold tracking-tight text-balance">{T(`lp.sh${x.n}.t`)}</h3>
                <p className="mt-4 text-base sm:text-lg leading-relaxed text-[var(--ink-2)]">{T(`lp.sh${x.n}.d`)}</p>
              </div>
              <div className="lg:[direction:initial]">
                {x.phone
                  ? <div className="lp-phone-static mx-auto"><img src={`/landing/${x.img}.webp`} alt="" loading="lazy" width="390" height="844" className="block w-full h-auto" /></div>
                  : <div className="lp-window"><div className="lp-window-bar"><i /><i /><i /></div><img src={`/landing/${x.img}.webp`} alt="" loading="lazy" width="1600" height="1000" className="block w-full h-auto" /></div>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust */}
      <section className="px-5 sm:px-8 pb-16 sm:pb-24 max-w-6xl mx-auto w-full">
        <h2 className="reveal text-center font-display text-2xl sm:text-4xl font-semibold tracking-tight">{T("lp.tr.t")}</h2>
        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {TRUST.map(({ n, Icon }) => (
            <div key={n} className="reveal lp-card p-5 sm:p-6 text-start">
              <span className="lp-ic lp-t1"><Icon className="w-5 h-5" aria-hidden="true" /></span>
              <h3 className="mt-4 font-display text-base sm:text-lg font-semibold">{T(`lp.tr${n}.t`)}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--ink-2)]">{T(`lp.tr${n}.d`)}</p>
            </div>
          ))}
        </div>
      </section>

      <PricingSection onStart={() => openModal("Admin")} />

      {/* FAQ */}
      <section id="faq" className="px-5 sm:px-8 py-16 sm:py-24 max-w-3xl mx-auto w-full">
        <h2 className="reveal text-center font-display text-3xl sm:text-5xl font-semibold tracking-tight">{T("lp.faq.t")}</h2>
        <div className="mt-10 divide-y divide-[var(--line)] border-y border-[var(--line)] text-start">
          {[1, 2, 3, 4, 5].map((n) => (
            <details key={n} className="group py-1">
              <summary className="flex items-center justify-between gap-4 py-4 cursor-pointer list-none font-semibold text-base sm:text-lg">
                {T(`lp.q${n}`)}<ChevronDown className="w-5 h-5 shrink-0 text-[var(--ink-3)] transition-transform group-open:rotate-180" aria-hidden="true" />
              </summary>
              <p className="pb-5 text-[15px] leading-relaxed text-[var(--ink-2)]">{T(`lp.a${n}`)}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="px-4 sm:px-8 pb-16 sm:pb-24 max-w-6xl mx-auto w-full">
        <div className="lp-hero !min-h-0 px-6 sm:px-14 py-12 sm:py-16 text-start">
          <img src="/landing/living.webp" alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover -z-20" /><div aria-hidden="true" className="absolute inset-0 -z-10 lp-shade" />
          <h2 className="max-w-3xl font-display text-3xl sm:text-5xl font-semibold leading-tight text-balance">{T("ld.139")}</h2>
          <p className="mt-4 max-w-xl text-base sm:text-lg opacity-80 leading-relaxed">{T("ld.140")}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button onClick={() => openModal("Admin")} className="btn-press lp-pill-dark h-11 sm:h-12 ps-5 sm:ps-6 pe-1.5 rounded-full inline-flex items-center gap-3 text-sm sm:text-[15px] font-semibold">
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
            <span className="font-display font-semibold text-[#111827]">{T("ld.1")}</span>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-[#4B5563]">
            <button onClick={() => scrollToSection("features")} className="hover:text-[#111827] cursor-pointer">{t("landing.footerFeatures")}</button>
            <button onClick={() => scrollToSection("pricing")} className="hover:text-[#111827] cursor-pointer">{t("landing.pricing")}</button>
            <button onClick={() => openModal("Client")} className="hover:text-[#111827] cursor-pointer">{t("landing.clientPortal")}</button>
            <button onClick={() => { setLegalPage("privacy"); window.scrollTo(0, 0); }} className="hover:text-[#111827] cursor-pointer">{t("landing.privacy")}</button>
            <button onClick={() => { setLegalPage("terms"); window.scrollTo(0, 0); }} className="hover:text-[#111827] cursor-pointer">{t("landing.terms")}</button>
          </div>
          <p className="text-xs text-[#6B7280]">{T("ld.143")}</p>
        </div>
      </footer>
    </>
  );
}
