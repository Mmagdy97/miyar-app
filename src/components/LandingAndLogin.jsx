import LogoMark from "./LogoMark";
import { D } from "../data/dataI18n";
import { PricingSection, LegalPage } from "./PublicPages";
import { tr_ as T } from "../i18n";
import LandingBody from "./LandingBody";
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

export default function LandingAndLogin({ onLogin }) {
  const { t } = useI18n();
  const [legalPage, setLegalPage] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [email, setEmail] = useState("architect@miyar.eg");
  const [password, setPassword] = useState("••••••••");
  const [selectedRole, setSelectedRole] = useState("Admin");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mode, setMode] = useState("in");
  const [f, setF] = useState({ email: "", password: "", name: "", office: "" });
  const [msg, setMsg] = useState("");
  const { currency: curNow, locale: locNow } = useI18n();
  const submitAuth = async (e) => {
    e.preventDefault(); setMsg("");
    if (mode === "up" && f.password.length < 8) { setMsg(T("login.pass8")); return; }
    setIsSubmitting(true);
    try {
      const acc = mode === "in" ? await signIn(f.email.trim(), f.password) : await signUp({ email: f.email.trim(), password: f.password, name: f.name.trim(), office: f.office.trim(), country: { EGP: "EG", SAR: "SA", AED: "AE", TRY: "TR" }[curNow] || "EG", currency: curNow, locale: locNow });
      if (!acc) { setMsg(T("login.check")); setIsSubmitting(false); return; }
      onLogin(acc.role, "user", acc);
    } catch (err) { setMsg(T("login.err") + (err.message || "")); setIsSubmitting(false); }
  };

  const openModal = (roleId = "Admin") => {
    setSelectedRole(roleId);
    setIsLoginModalOpen(true);
  };

  const closeModal = () => {
    setIsLoginModalOpen(false);
    setIsSubmitting(false);
  };

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
     
      className="min-h-screen w-full relative isolate flex flex-col font-ibm bg-[#F2F5F1] text-[#1F2A26] selection:bg-[#5F6C61] selection:text-white overflow-x-hidden"
    >

      <LandingBody openModal={openModal} setLegalPage={setLegalPage} scrollToSection={scrollToSection} />

      {/* 6. The Login & MVP Demo Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#1F2A26]/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
           
            className="bg-white rounded-[32px] shadow-2xl border border-[#DCE4DC] max-w-4xl w-full max-h-[92dvh] overflow-hidden text-start animate-in zoom-in-95 duration-200 relative grid md:grid-cols-[0.8fr_1.2fr]"
          >

            <div className="relative isolate hidden md:flex flex-col justify-between p-7 text-white">
              <img src="/landing/couple.webp" alt="" className="absolute inset-0 w-full h-full object-cover -z-20" />
              <div aria-hidden="true" className="absolute inset-0 -z-10 lp-shade-card" />
              <div className="w-11 h-11 rounded-full bg-white/25 backdrop-blur flex items-center justify-center"><LogoMark className="w-5 h-5 text-white" /></div>
              <div><h3 className="font-display text-2xl font-semibold leading-snug">{T("lp.h1a")} {T("lp.h1b")}</h3><p className="mt-2 text-sm opacity-85">{T("ld.5")}</p></div>
            </div>
            <div className="p-6 sm:p-8 overflow-y-auto max-h-[92dvh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E8EFE9] relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full lp-pill-dark flex items-center justify-center">
                  <LogoMark className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-[#1F2A26]">
                    {T("login.title")}
                  </h3>
                  <p className="text-xs text-[#56635B]">{T("login.sub")}</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg text-[#56635B] hover:text-[#1F2A26] hover:bg-[#E8EFE9] transition-colors cursor-pointer"
                aria-label={T("ld.155")}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Real account (Supabase) */}
            {isSupabaseConfigured && (
              <form onSubmit={submitAuth} className="mt-5 relative z-10">
                <div role="tablist" className="inline-flex gap-1 p-1 mb-3 rounded-full bg-[#F2F5F1] border border-[#DCE4DC]">
                  {["in", "up"].map((k) => <button key={k} type="button" role="tab" aria-selected={mode === k} onClick={() => { setMode(k); setMsg(""); }} className={`px-5 py-2 rounded-full text-xs font-bold cursor-pointer ${mode === k ? "lp-pill-dark" : "text-[#56635B]"}`}>{T("login.tab." + k)}</button>)}
                </div>
                <div className="grid gap-2">
                  {mode === "up" && <>
                    <input required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} aria-label={T("login.name")} placeholder={T("login.name")} className="w-full min-w-0 h-12 px-5 rounded-full border border-[#DCE4DC] text-sm bg-white" />
                    <input value={f.office} onChange={(e) => setF({ ...f, office: e.target.value })} aria-label={T("login.office")} placeholder={T("login.office")} className="w-full min-w-0 h-12 px-5 rounded-full border border-[#DCE4DC] text-sm bg-white" />
                  </>}
                  <input required type="email" autoComplete="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} aria-label={T("login.email")} placeholder={T("login.email")} className="w-full min-w-0 h-12 px-5 rounded-full border border-[#DCE4DC] text-sm bg-white" dir="ltr" />
                  <input required type="password" autoComplete={mode === "in" ? "current-password" : "new-password"} value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} aria-label={T("login.password")} placeholder={T("login.password")} className="w-full min-w-0 h-12 px-5 rounded-full border border-[#DCE4DC] text-sm bg-white" dir="ltr" />
                  <button type="submit" disabled={isSubmitting} className="btn-press h-12 rounded-full lp-pill-dark text-sm font-bold cursor-pointer disabled:opacity-60">{T("login.go." + mode)}</button>
                  {msg && <p role="alert" className="text-xs text-rose-700">{msg}</p>}
                </div>
              </form>
            )}
            <div className="flex items-center gap-3 my-5 text-xs text-[#6E7B72]"><span className="h-px flex-1 bg-[#DCE4DC]" /><span>{T("login.or")}</span><span className="h-px flex-1 bg-[#DCE4DC]" /></div>
            <h4 className="flex items-center gap-2 text-lg font-semibold text-[#1F2A26]"><span className="w-8 h-8 rounded-lg bg-[var(--brass)] text-[#1F2A26] flex items-center justify-center"><Users className="w-4 h-4" aria-hidden="true" /></span>{T("login.guest")}</h4>

            {/* Guest entry: pick a role, enter. Sample data, no credentials. */}
            <form onSubmit={handleFormSubmit} className="mt-2.5 relative z-10">
              <fieldset>
                <legend className="sr-only">{T("login.pick")}</legend>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {DEMO_ROLES.map((r) => {
                    const RoleIcon = r.icon;
                    const on = selectedRole === r.id;
                    return (
                      <label key={r.id} className={`relative flex items-start gap-3 p-3.5 rounded-[20px] border cursor-pointer transition-colors ${on ? "border-[#5F6C61] bg-[#5F6C61]/[0.06] ring-1 ring-[#5F6C61]" : "border-[#DCE4DC] bg-white hover:border-[#A3AE9F]"}`}>
                        <input type="radio" name="role" value={r.id} checked={on} onChange={() => setSelectedRole(r.id)} className="sr-only" />
                        <span className={`mt-0.5 w-9 h-9 shrink-0 rounded-lg flex items-center justify-center ${on ? "bg-[#5F6C61] text-white" : "bg-[#E8EFE9] text-[#56635B]"}`}><RoleIcon className="w-[18px] h-[18px]" aria-hidden="true" /></span>
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold text-[#1F2A26]">{T("login.role." + r.key)}</span>
                          <span className="block mt-0.5 text-xs leading-relaxed text-[#6E7B72]">{T("login.desc." + r.key)}</span>
                        </span>
                        {on && <CheckCircle2 className="absolute top-3 end-3 w-4 h-4 text-[#5F6C61]" aria-hidden="true" />}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
              <button type="submit" disabled={isSubmitting}
                className="btn-press mt-5 w-full h-12 rounded-full lp-pill-dark font-semibold text-[15px] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60">
                <LogIn className="w-4 h-4 ltr:-scale-x-100" aria-hidden="true" />
                <span>{T("login.enter", { role: T("login.role." + (DEMO_ROLES.find((r) => r.id === selectedRole)?.key || "admin")) })}</span>
              </button>
              <p className="mt-3 text-xs text-center text-[#6E7B72]">{T("login.note")}</p>
            </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
