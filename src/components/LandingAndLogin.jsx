import LogoMark from "./LogoMark";
import { D } from "../data/dataI18n";
import { PricingSection, LegalPage } from "./PublicPages";
import { tr_ as T } from "../i18n";
import LandingMono from "./LandingMono";
import SettingsSwitcher from "./SettingsSwitcher";
import { useI18n } from "../i18n";
import { useState } from "react";
import {
  Building2,
  Sparkles,
  ArrowLeft,
  ArrowUpRight,
  Calculator,
  Wallet,
  ShieldCheck,
  Lock,
  Mail,
  UserCheck,
  LogIn,
  CheckCircle2,
  XCircle,
  X,
  Check,
  Layers,
  TrendingUp,
  BarChart3,
  FileText,
  Smartphone,
  CheckCheck,
  Star,
  Coins,
  Eye,
  Users,
  Clock,
  ArrowDown,
  HardHat,
  FileCode,
  CreditCard,
  Camera,
  CheckSquare,
  AlertCircle,
  HelpCircle,
  Download,
} from "lucide-react";
import { clientProject, ENGINEER_CASH, formatEGP, toAr } from "../data/seed";

const HERO_PROJECT = clientProject();
const HERO_CASH = ENGINEER_CASH.find((c) => c.projectId === HERO_PROJECT.id);

const DEMO_ROLES = [
  {
    id: "Admin",
    key: "admin",
    title: "مدير تنفيذي",
    subtitle: "Manager / CEO",
    desc: "لوحة التحكم الشاملة، الرقابة المالية، ونسب الإنجاز العامة والاعتمادات",
    icon: Building2,
    badge: "صلاحيات كاملة",
  },
  {
    id: "Site Engineer",
    key: "site",
    title: "مهندس موقع",
    subtitle: "Site Engineer",
    desc: "التقارير اليومية، تصفية العهد النقدية، طلبات التشوين، وقائمة الملاحظات",
    icon: HardHat,
    badge: "ميداني",
  },
  {
    id: "Technical Office",
    key: "tech",
    title: "مكتب فني",
    subtitle: "Tech Office",
    desc: "المقايسات الذكية (BOQ)، مراجعة المخططات الهندسية، وإدارة المستندات",
    icon: FileCode,
    badge: "هندسي",
  },
  { id: "Accountant", key: "accountant", title: "محاسب", subtitle: "Accountant", desc: "", icon: Calculator, badge: "مالي" },
  { id: "Secretary", key: "secretary", title: "سكرتارية", subtitle: "Secretary", desc: "", icon: Users, badge: "إداري" },
  {
    id: "Client",
    key: "client",
    title: "عميل المشروع",
    subtitle: "Client VIP Suite",
    desc: "بوابة العميل التفاعلية، متابعة صور الموقع، جدول الدفعات، واعتماد العينات",
    icon: ShieldCheck,
    badge: "بوابة العميل",
  },
];

import { signIn, signUp, isSupabaseConfigured } from "../lib/auth";
import { SITE, goApp, goDemo, goLanding } from "../lib/site";

export default function LandingAndLogin({ onLogin }) {
  const { t } = useI18n();
  const [legalPage, setLegalPage] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(SITE !== "landing");
  const [email, setEmail] = useState("architect@miyar.eg");
  const [password, setPassword] = useState("••••••••");
  const [selectedRole, setSelectedRole] = useState("Admin");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mode, setMode] = useState(() => (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("signup") ? "up" : "in"));
  const [f, setF] = useState({ email: "", phone: "", password: "", name: "", office: "" });
  const [msg, setMsg] = useState("");
  const { currency: curNow, locale: locNow } = useI18n();
  const submitAuth = async (e) => {
    e.preventDefault(); setMsg("");
    if (mode === "up" && f.password.length < 8) { setMsg(T("login.pass8")); return; }
    const upId = f.phone.trim() || f.email.trim();
    if (mode === "up" && !upId) { setMsg(T("login.badId")); return; }
    setIsSubmitting(true);
    try {
      const acc = mode === "in" ? await signIn(f.email.trim(), f.password) : await signUp({ email: upId, contactEmail: f.phone.trim() && f.email.includes("@") ? f.email.trim() : "", password: f.password, name: f.name.trim(), office: f.office.trim(), country: { EGP: "EG", SAR: "SA", AED: "AE", TRY: "TR" }[curNow] || "EG", currency: curNow, locale: locNow });
      if (!acc) { setMsg(T("login.check")); setIsSubmitting(false); return; }
      onLogin(acc.role, "user", acc);
    } catch (err) { setMsg(err.message === "INVALID_ID" ? T("login.badId") : err.message === "NO_ORG" ? T("login.noorg") : T("login.err") + (err.message || "")); setIsSubmitting(false); }
  };

  // Landing never logs anyone in: demo buttons go to the demo site, account buttons to the app site.
  const openModal = (roleId = "Admin") => {
    if (SITE === "landing") { goDemo(roleId); return; }
    setSelectedRole(roleId);
    setIsLoginModalOpen(true);
  };
  const openApp = (m = "in") => goApp(m);

  const closeModal = () => {
    if (SITE !== "landing") { goLanding(); return; }
    setIsLoginModalOpen(false);
    setIsSubmitting(false);
  };
  const showReal = SITE !== "demo" && isSupabaseConfigured;
  const showDemo = SITE !== "app";

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onLogin(selectedRole, "guest");
    }, 250);
  };

  const handleQuickLogin = (roleId) => {
    setSelectedRole(roleId);
    setIsSubmitting(true);
    setTimeout(() => {
      onLogin(roleId, "guest");
    }, 200);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (legalPage) {
    return <LegalPage kind={legalPage} onBack={() => setLegalPage(null)} />;
  }

  return (
    <div
     
      className="m3 mono min-h-screen w-full relative isolate flex flex-col font-ibm bg-[var(--md-surface)] text-[var(--md-on-surface)] selection:bg-[var(--md-primary)] selection:text-[var(--md-on-primary)] overflow-x-hidden"
    >

      {SITE === "landing" && <LandingMono openModal={openModal} openApp={openApp} setLegalPage={setLegalPage} scrollToSection={scrollToSection} />}

      {/* 6. The Login & MVP Demo Modal */}
      {isLoginModalOpen && (
        <div className={`fixed inset-0 z-50 ${SITE === "landing" ? "bg-[#0F3D3E]/50 backdrop-blur-md" : "bg-[var(--md-surface)]"} flex items-center justify-center p-4 animate-in fade-in duration-200`}>
          <div
           
            className="bg-[var(--md-surface-container-lowest)] rounded-[32px] shadow-2xl border border-[var(--md-outline-variant)] max-w-4xl w-full max-h-[92dvh] overflow-hidden text-start animate-in zoom-in-95 duration-200 relative grid md:grid-cols-[0.8fr_1.2fr]"
          >

            <div className="relative isolate hidden md:flex flex-col justify-between p-7 text-white">
              <img src="/landing/couple.webp" alt="" className="absolute inset-0 w-full h-full object-cover -z-20" />
              <div aria-hidden="true" className="absolute inset-0 -z-10 lp-shade-card" />
              <div className="w-11 h-11 rounded-full bg-white/25 backdrop-blur flex items-center justify-center"><LogoMark className="w-5 h-5 text-white" /></div>
              <div><h3 className="font-display text-2xl font-semibold leading-snug">{T("lp.h1a")} {T("lp.h1b")}</h3><p className="mt-2 text-sm opacity-85">{T("ld.5")}</p></div>
            </div>
            <div className="p-6 sm:p-8 overflow-y-auto max-h-[92dvh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[var(--md-outline-variant)] relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full lp-pill-dark flex items-center justify-center">
                  <LogoMark className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-[var(--md-on-surface)]">
                    {T("login.title")}
                  </h3>
                  <p className="text-xs text-[var(--md-on-surface-variant)]">{T(SITE === "app" ? "login.subApp" : SITE === "demo" ? "login.subDemo" : "login.sub")}</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg text-[var(--md-on-surface-variant)] hover:text-[var(--md-on-surface)] hover:bg-[var(--md-surface-container-high)] transition-colors cursor-pointer"
                aria-label={T("ld.155")}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Real account (Supabase) */}
            {showReal && (
              <form onSubmit={submitAuth} className="mt-5 relative z-10">
                <div role="tablist" className="inline-flex gap-1 p-1 mb-3 rounded-full bg-[var(--md-surface)] border border-[var(--md-outline-variant)]">
                  {["in", "up"].map((k) => <button key={k} type="button" role="tab" aria-selected={mode === k} onClick={() => { setMode(k); setMsg(""); }} className={`px-5 py-2 rounded-full text-xs font-bold cursor-pointer ${mode === k ? "lp-pill-dark" : "text-[var(--md-on-surface-variant)]"}`}>{T("login.tab." + k)}</button>)}
                </div>
                <div className="grid gap-2">
                  {mode === "up" && <>
                    <input required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} aria-label={T("login.name")} placeholder={T("login.name")} className="w-full min-w-0 h-12 px-5 rounded-full border border-[var(--md-outline-variant)] text-sm bg-[var(--md-surface-container-lowest)]" />
                    <input value={f.office} onChange={(e) => setF({ ...f, office: e.target.value })} aria-label={T("login.office")} placeholder={T("login.office")} className="w-full min-w-0 h-12 px-5 rounded-full border border-[var(--md-outline-variant)] text-sm bg-[var(--md-surface-container-lowest)]" />
                  </>}
                  {mode === "up" ? <>
                    <input type="tel" inputMode="tel" dir="ltr" autoComplete="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} aria-label={T("login.phone")} placeholder={T("login.phone")} className="w-full min-w-0 h-12 px-5 rounded-full border border-[var(--md-outline-variant)] text-sm bg-[var(--md-surface-container-lowest)]" />
                    <input type="text" inputMode="email" dir="ltr" autoComplete="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} aria-label={T("login.emailOpt")} placeholder={T("login.emailOpt")} className="w-full min-w-0 h-12 px-5 rounded-full border border-[var(--md-outline-variant)] text-sm bg-[var(--md-surface-container-lowest)]" />
                  </> : <input required type="text" inputMode="email" autoCapitalize="none" autoCorrect="off" dir="ltr" autoComplete="username" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} aria-label={T("login.email")} placeholder={T("login.email")} className="w-full min-w-0 h-12 px-5 rounded-full border border-[var(--md-outline-variant)] text-sm bg-[var(--md-surface-container-lowest)]" dir="ltr" />}
                  <input required type="password" autoComplete={mode === "in" ? "current-password" : "new-password"} value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} aria-label={T("login.password")} placeholder={T("login.password")} className="w-full min-w-0 h-12 px-5 rounded-full border border-[var(--md-outline-variant)] text-sm bg-[var(--md-surface-container-lowest)]" dir="ltr" />
                  <button type="submit" disabled={isSubmitting} className="btn-press h-12 rounded-full lp-pill-dark text-sm font-bold cursor-pointer disabled:opacity-60">{T("login.go." + mode)}</button>
                  {msg && <p role="alert" className="text-xs text-rose-700">{msg}</p>}
                </div>
              </form>
            )}
            {showDemo && <>
            {showReal && <div className="flex items-center gap-3 my-5 text-xs text-[var(--md-outline)]"><span className="h-px flex-1 bg-[var(--md-surface-container-high)]" /><span>{T("login.or")}</span><span className="h-px flex-1 bg-[var(--md-surface-container-high)]" /></div>}
            <h4 className="flex items-center gap-2 text-lg font-semibold text-[var(--md-on-surface)]"><span className="w-8 h-8 rounded-lg bg-[var(--peach)] text-[var(--md-on-surface)] flex items-center justify-center"><Users className="w-4 h-4" aria-hidden="true" /></span>{T("login.guest")}</h4>

            {/* Guest entry: pick a role, enter. Sample data, no credentials. */}
            <form onSubmit={handleFormSubmit} className="mt-2.5 relative z-10">
              <fieldset>
                <legend className="sr-only">{T("login.pick")}</legend>
                <div className="grid grid-cols-2 gap-2">
                  {DEMO_ROLES.map((r) => {
                    const RoleIcon = r.icon;
                    const on = selectedRole === r.id;
                    return (
                      <label key={r.id} className={`relative flex flex-col sm:flex-row items-start gap-2 sm:gap-3 p-3 sm:p-3.5 rounded-[20px] border cursor-pointer transition-colors ${on ? "border-[var(--md-primary)] bg-[color-mix(in_srgb,var(--md-primary)_8%,transparent)] ring-1 ring-[var(--md-primary)]" : "border-[var(--md-outline-variant)] bg-[var(--md-surface-container-lowest)] hover:border-[var(--md-outline)]"}`}>
                        <input type="radio" name="role" value={r.id} checked={on} onChange={() => setSelectedRole(r.id)} className="sr-only" />
                        <span className={`mt-0.5 w-9 h-9 shrink-0 rounded-lg flex items-center justify-center ${on ? "bg-[var(--md-primary)] text-white" : "bg-[var(--md-surface-container-high)] text-[var(--md-on-surface-variant)]"}`}><RoleIcon className="w-[18px] h-[18px]" aria-hidden="true" /></span>
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold text-[var(--md-on-surface)]">{T("login.role." + r.key)}</span>
                          <span className="hidden sm:block mt-0.5 text-xs leading-relaxed text-[var(--md-outline)]">{T("login.desc." + r.key)}</span>
                        </span>
                        {on && <CheckCircle2 className="absolute top-3 end-3 w-4 h-4 text-[var(--md-primary)]" aria-hidden="true" />}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
              <div className="sticky bottom-0 -mx-6 sm:mx-0 px-6 sm:px-0 pt-3 pb-3 sm:pb-0 mt-3 bg-[var(--md-surface-container-lowest)]/95 backdrop-blur sm:bg-transparent">
              <button type="submit" disabled={isSubmitting}
                className="btn-press w-full h-12 rounded-full lp-pill-dark font-semibold text-[15px] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60">
                <LogIn className="w-4 h-4 ltr:-scale-x-100" aria-hidden="true" />
                <span>{T("login.enter", { role: T("login.role." + (DEMO_ROLES.find((r) => r.id === selectedRole)?.key || "admin")) })}</span>
              </button>
              </div>
              <p className="mt-1 text-xs text-center text-[var(--md-outline)]">{T("login.note")}</p>
            </form>
            </>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
