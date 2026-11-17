import { useState } from "react";
import { waLink } from "../lib/nudge";
import { ChevronDown, Lock, Smartphone, Globe, BadgeCheck, ArrowUpRight, Building2, Calculator, CheckCheck, ClipboardCheck, ClipboardList, Clock, Coins, FileCode, Hammer, HardHat, Heart, LogIn, MapPin, MessageCircle, Rocket, Ruler, Share2, ShieldCheck, Users, Wallet, WifiOff } from "lucide-react";
import LogoMark from "./LogoMark";
import SettingsSwitcher from "./SettingsSwitcher";
import LandingWhy from "./LandingWhy";
import ScrollArt from "./ScrollArt";
import { PricingSection } from "./PublicPages";
import { tr_ as T, useI18n } from "../i18n";

const ROLES = [
  { id: "Admin", key: "admin", Icon: Building2, tone: "lp-t1", img: "villa" },
  { id: "Site Engineer", key: "site", Icon: HardHat, tone: "lp-t2", img: "site" },
  { id: "Technical Office", key: "tech", Icon: FileCode, tone: "lp-t3", img: "office" },
  { id: "Accountant", key: "accountant", Icon: Calculator, tone: "lp-t2", img: "kitchen" },
  { id: "Secretary", key: "secretary", Icon: ClipboardList, tone: "lp-t3", img: "living" },
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
  { n: 1, img: "shot-boq", role: "Technical Office" },
  { n: 2, img: "shot-fin", role: "Admin" },
  { n: 3, img: "shot-rep", phone: true, role: "Site Engineer" },
];
const TRUST = [{ n: 1, Icon: Lock }, { n: 2, Icon: Smartphone }, { n: 3, Icon: Globe }, { n: 4, Icon: BadgeCheck }];

export default function LandingBody({ openModal, setLegalPage, scrollToSection }) {
  const { t } = useI18n();
  const [role, setRole] = useState("Admin");
  const [shot, setShot] = useState(1);
  const cur = SHOWCASE.find((x) => x.n === shot);
  const stats = [["16+", "lp.st1"], ["7", "lp.st2"], ["3", "lp.st3"], ["6", "lp.st4"]];
  return (
    <>
      <ScrollArt bare />
      <div className="p-3 sm:p-4 w-full">
        <section className="lp-hero">
          <img src="/landing/villa.webp" alt="" fetchpriority="high" className="absolute inset-0 w-full h-full object-cover object-[64%_50%] sm:object-center -z-20" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 lp-shade" />

          {/* Floating pill nav */}
          <header className="lp-nav relative z-[95] flex items-center justify-between gap-3 px-4 sm:px-8 pt-4 sm:pt-6">
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
              <button onClick={() => openModal("Admin")} className="btn-press lp-pill-dark inline-flex items-center gap-2 h-10 sm:h-11 ps-4 sm:ps-5 pe-1 sm:pe-1.5 rounded-full text-xs sm:text-[13px] whitespace-nowrap font-semibold">
                {t("landing.login")}
                <span className="w-8 h-8 rounded-full bg-[var(--peach)] text-[var(--on-peach)] flex items-center justify-center"><LogIn className="w-4 h-4 rtl:-scale-x-100" aria-hidden="true" /></span>
              </button>
            </div>
          </header>

          {/* Headline */}
          <div className="relative z-10 px-5 sm:px-12 pt-7 sm:pt-16 text-start max-w-3xl hero-in">
            <p className="text-[11px] sm:text-xs tracking-[.18em] uppercase font-semibold opacity-70">{T("lp.kicker")}</p>
            <h1 className="mt-4 font-display font-semibold leading-[1.1] [text-shadow:0_2px_24px_rgba(0,0,0,.35)] text-[2.1rem] sm:text-6xl xl:text-7xl">
              {T("lp.h1a")}<br /><span className="text-[#FFD2B5]">{T("lp.h1b")}</span>
            </h1>
            <p className="mt-4 max-w-lg text-sm sm:text-lg leading-relaxed opacity-80">{T("ld.5")}</p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button onClick={() => openModal("Admin")} className="btn-press lp-pill-dark h-11 sm:h-12 ps-5 sm:ps-6 pe-1.5 rounded-full inline-flex items-center gap-3 text-sm sm:text-[15px] font-semibold">
                {T("ld.6")}
                <span className="w-9 h-9 rounded-full bg-[var(--peach)] text-[var(--on-peach)] flex items-center justify-center"><ArrowUpRight className="w-4 h-4 rtl:-scale-x-100" aria-hidden="true" /></span>
              </button>
              <button onClick={() => scrollToSection("features")} className="lp-glass h-11 sm:h-12 px-5 sm:px-6 rounded-full text-sm sm:text-[15px] font-semibold">{T("lp.explore")}</button>
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
              <button onClick={() => openModal(role)} className="btn-press lp-pill-dark h-11 px-6 rounded-full text-[14px] font-bold shrink-0">{T("lp.go")}</button>
            </div>
          </div>

          {/* Bottom: frosted project card (start) + paper "notch" card cut into the hero corner (end) */}
          <div className="lp-bottom relative z-10 mt-8 sm:mt-10 flex flex-col lg:flex-row-reverse lg:items-end justify-between gap-3 text-start">
            <article className="lp-frost mx-4 sm:mx-12 lg:mb-10 lg:me-12 lg:ms-0 w-auto lg:w-[400px] rounded-[30px] p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/70 text-[#111827]"><span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />{T("lp.fp.tag")}</span>
                  <h3 className="mt-2.5 font-display text-xl font-semibold">{T("lp.fp.name")}</h3>
                  <p className="mt-0.5 flex items-center gap-1 text-xs opacity-75"><MapPin className="w-3.5 h-3.5" aria-hidden="true" />{T("lp.fp.meta")}</p>
                </div>
                <button type="button" onClick={() => openModal("Admin")} aria-label={T("lp.n.cta")} className="w-11 h-11 shrink-0 rounded-full bg-white text-[#111827] flex items-center justify-center shadow-sm hover:rotate-12 transition-transform"><ArrowUpRight className="w-4 h-4 rtl:-scale-x-100" aria-hidden="true" /></button>
              </div>
              <p className="mt-3 text-xs sm:text-sm leading-relaxed opacity-85">{T("lp.fp.d")}</p>
              <div className="mt-4 flex items-end justify-between gap-3">
                <ul className="text-xs space-y-1.5 opacity-90">
                  <li className="flex items-center gap-1.5"><Ruler className="w-3.5 h-3.5" aria-hidden="true" />{T("lp.fp.area")}</li>
                  <li className="flex items-center gap-1.5"><Hammer className="w-3.5 h-3.5" aria-hidden="true" />{T("lp.fp.phase")}</li>
                </ul>
                <div className="flex gap-2">
                  {[[ClipboardCheck, "lp.fp.a1", "12"], [Heart, "lp.fp.a2", "8"], [Share2, "lp.fp.a3", ""]].map(([Icon, k, n]) => (
                    <span key={k} className="flex flex-col items-center gap-1" title={T(k)}>
                      <span className="w-10 h-10 rounded-full bg-white/60 border border-white/70 flex items-center justify-center"><Icon className="w-4 h-4" aria-hidden="true" /></span>
                      <span className="text-[10px] font-semibold opacity-80 h-3">{n}</span>
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-2 rounded-full bg-black/10 overflow-hidden"><div className="h-full w-[65%] rounded-full bg-[var(--brand)]" /></div>
                <span className="text-xs font-bold">65%</span>
              </div>
            </article>

            <div className="lp-notch w-full lg:w-[460px] px-5 pt-5 pb-5 sm:px-7 sm:pt-7 sm:pb-8">
              <h3 className="font-display text-lg sm:text-xl font-semibold">{T("lp.n.t")}</h3>
              <p className="mt-1.5 text-sm text-[#4B5563] leading-relaxed max-w-sm">{T("lp.n.d")}</p>
              <div className="mt-5 flex items-center justify-between gap-3">
                <div>
                  <div className="font-display text-4xl sm:text-5xl font-semibold leading-none">16+</div>
                  <div className="mt-1 text-xs text-[#4B5563]">{T("lp.st1")}</div>
                </div>
                <div className="flex items-center">
                  <span className="flex -space-x-3 rtl:space-x-reverse">
                    {["site", "office", "couple"].map((im) => <img key={im} src={`/landing/${im}-s.webp`} alt="" loading="lazy" className="w-11 h-11 rounded-full object-cover border-[3px] border-[var(--paper)]" />)}
                  </span>
                  <button type="button" onClick={() => scrollToSection("roles")} aria-label={T("lp.n.cta")} className="ms-1 w-11 h-11 rounded-full border border-[#E5E7EB] bg-white text-[#111827] flex items-center justify-center hover:bg-[#F7F8FA]"><ArrowUpRight className="w-4 h-4 rtl:-scale-x-100" aria-hidden="true" /></button>
                </div>
              </div>
              <p className="mt-4 text-xs text-[#4B5563]">{stats.slice(1).map(([n, k]) => `${n} ${T(k)}`).join(" · ")}</p>
            </div>
          </div>
        </section>
      </div>

      {/* Roles */}
      <section id="roles" className="px-5 sm:px-8 py-14 sm:py-20 max-w-6xl mx-auto w-full">
        <div className="text-start max-w-2xl reveal">
          <h2 className="font-display text-3xl sm:text-5xl font-semibold leading-tight text-[#111827] text-balance">{T("lp.roles.t")}</h2>
          <p className="mt-3 text-base sm:text-lg text-[#4B5563]">{T("lp.roles.d")}</p>
        </div>
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
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
        <div className="text-start reveal">
          <p className="text-[12px] tracking-[.16em] uppercase font-semibold text-[#3F5BD8]">{T("lp.sh.kick")}</p>
          <h2 className="mt-3 font-display text-3xl sm:text-5xl font-semibold leading-tight text-balance">{T("lp.sh.t")}</h2>
        </div>
        <div role="tablist" className="mt-8 flex flex-wrap gap-2">
          {SHOWCASE.map((x) => (
            <button key={x.n} role="tab" aria-selected={shot === x.n} onClick={() => setShot(x.n)}
              className={`h-10 px-5 rounded-full text-[13px] sm:text-sm font-semibold transition-colors ${shot === x.n ? "lp-pill-dark" : "bg-[var(--surface)] border border-[var(--line)] text-[var(--ink-2)] hover:bg-[var(--paper-2)]"}`}>
              {T(`lp.sh${x.n}.k`)}
            </button>
          ))}
        </div>
        <div className="mt-4 rounded-[28px] sm:rounded-[36px] bg-[var(--paper-2)] border border-[var(--line)] overflow-hidden grid md:grid-cols-[0.8fr_1.2fr] items-center text-start">
          <div key={cur.n} className="p-6 sm:p-10 lg:p-14 hero-in">
            <h3 className="font-display text-2xl sm:text-4xl font-semibold leading-tight text-balance">{T(`lp.sh${cur.n}.t`)}</h3>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-[var(--ink-2)]">{T(`lp.sh${cur.n}.d`)}</p>
            <button onClick={() => openModal(cur.role)} className="mt-6 inline-flex items-center gap-1 text-[15px] font-semibold text-[#3F5BD8] hover:underline underline-offset-4">{T("lp.go")}<span aria-hidden="true" className="rtl:-scale-x-100">›</span></button>
          </div>
          <div key={`i${cur.n}`} className="relative hero-in aspect-[4/3] md:aspect-auto md:h-[460px] overflow-hidden px-6 pt-6 md:pt-10 md:pe-0 md:ps-4">
            {cur.phone ? (
              <div className="lp-phone-static mx-auto !max-w-[250px] !rounded-b-none !border-b-0 translate-y-0"><img src={`/landing/${cur.img}.webp`} alt="" loading="lazy" width="390" height="844" className="block w-full h-auto" /></div>
            ) : (
              <div className="lp-window !max-w-none !rounded-b-none !border-b-0 relative overflow-hidden" dir="ltr"><div className="lp-window-bar"><i /><i /><i /></div>
                <div className="overflow-hidden"><img src={`/landing/${cur.img}.webp`} alt="" loading="lazy" width="1600" height="1000" className="block max-w-none w-[138%] -translate-x-[18.6%]" /></div>
              </div>
            )}
          </div>
        </div>
      </section>

      <LandingWhy />

      {/* Trust */}
      <section className="px-5 sm:px-8 pb-16 sm:pb-24 max-w-6xl mx-auto w-full">
        <h2 className="reveal text-start max-w-2xl font-display text-3xl sm:text-5xl font-semibold leading-tight text-[#111827] text-balance">{T("lp.tr.t")}</h2>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {TRUST.map(({ n, Icon, img }, i) => (
            <div key={n} style={{ transitionDelay: `${i * 60}ms` }} className={`reveal relative isolate overflow-hidden text-start rounded-[24px] sm:rounded-[28px] p-5 sm:p-6 min-h-[200px] sm:min-h-[240px] flex flex-col justify-between ${img ? "text-white" : "lp-card"}`}>
              {img && <><img src={`/landing/${img}-s.webp`} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover -z-20" /><div aria-hidden="true" className="absolute inset-0 -z-10 lp-shade-card" /></>}
              <span className={img ? "lp-ic bg-white/25 backdrop-blur text-white" : "lp-ic lp-t1"}><Icon className="w-5 h-5" aria-hidden="true" /></span>
              <div>
                <h3 className="font-display text-base sm:text-xl font-semibold">{T(`lp.tr${n}.t`)}</h3>
                <p className={`mt-1.5 text-xs sm:text-sm leading-relaxed ${img ? "opacity-85" : "text-[var(--ink-2)]"}`}>{T(`lp.tr${n}.d`)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <PricingSection onStart={() => openModal("Admin")} />

      {/* FAQ */}
      <section id="faq" className="px-5 sm:px-8 py-14 sm:py-20 max-w-3xl mx-auto w-full">
        <h2 className="reveal text-center font-display text-3xl sm:text-5xl font-semibold leading-tight text-balance">{T("lp.faq.t")}</h2>
        <div className="reveal mt-10 space-y-3 text-start">
          {[1, 2, 3, 4, 5].map((n) => (
            <details key={n} open={n === 1} className="group lp-card !rounded-[22px] px-5 sm:px-6">
              <summary className="flex items-center justify-between gap-4 py-4 sm:py-5 cursor-pointer list-none font-semibold text-base sm:text-lg">
                {T(`lp.q${n}`)}<span className="w-8 h-8 shrink-0 rounded-full bg-[var(--paper-2)] flex items-center justify-center"><ChevronDown className="w-4 h-4 text-[var(--ink-2)] transition-transform group-open:rotate-180" aria-hidden="true" /></span>
              </summary>
              <p className="pb-5 text-[15px] sm:text-base leading-relaxed text-[var(--ink-2)]">{T(`lp.a${n}`)}</p>
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
      <footer className="py-10 px-5 mt-auto border-t border-[var(--line)]">
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
