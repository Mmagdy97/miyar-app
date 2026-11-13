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
     
      className="min-h-screen w-full relative isolate flex flex-col font-ibm bg-[#F7F3EA] text-[#1F2421] selection:bg-[#17614F] selection:text-white overflow-x-hidden"
    >

      <LandingBody openModal={openModal} setLegalPage={setLegalPage} scrollToSection={scrollToSection} />

      {/* 6. The Login & MVP Demo Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#1F2421]/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
           
            className="bg-white rounded-xl shadow-2xl border border-[#E6DFD0] max-w-md w-full p-6 sm:p-8 text-start animate-in zoom-in-95 duration-200 relative overflow-hidden"
          >

            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#F0EADD] relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#17614F] text-white flex items-center justify-center">
                  <LogoMark className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-[#1F2421]">
                    {T("login.title")}
                  </h3>
                  <p className="text-xs text-[#555B53]">{T("login.sub")}</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg text-[#555B53] hover:text-[#1F2421] hover:bg-[#F0EADD] transition-colors cursor-pointer"
                aria-label={T("ld.155")}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Real account (Supabase) */}
            {isSupabaseConfigured && (
              <form onSubmit={submitAuth} className="mt-5 relative z-10">
                <div role="tablist" className="inline-flex gap-1 p-1 mb-3 rounded-xl bg-[#F7F3EA] border border-[#E6DFD0]">
                  {["in", "up"].map((k) => <button key={k} type="button" role="tab" aria-selected={mode === k} onClick={() => { setMode(k); setMsg(""); }} className={`px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${mode === k ? "bg-[#17614F] text-white" : "text-[#555B53]"}`}>{T("login.tab." + k)}</button>)}
                </div>
                <div className="grid gap-2">
                  {mode === "up" && <>
                    <input required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} aria-label={T("login.name")} placeholder={T("login.name")} className="w-full min-w-0 h-11 px-3 rounded-lg border border-[#E6DFD0] text-sm bg-white" />
                    <input value={f.office} onChange={(e) => setF({ ...f, office: e.target.value })} aria-label={T("login.office")} placeholder={T("login.office")} className="w-full min-w-0 h-11 px-3 rounded-lg border border-[#E6DFD0] text-sm bg-white" />
                  </>}
                  <input required type="email" autoComplete="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} aria-label={T("login.email")} placeholder={T("login.email")} className="w-full min-w-0 h-11 px-3 rounded-lg border border-[#E6DFD0] text-sm bg-white" dir="ltr" />
                  <input required type="password" autoComplete={mode === "in" ? "current-password" : "new-password"} value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} aria-label={T("login.password")} placeholder={T("login.password")} className="w-full min-w-0 h-11 px-3 rounded-lg border border-[#E6DFD0] text-sm bg-white" dir="ltr" />
                  <button type="submit" disabled={isSubmitting} className="btn-press h-11 rounded-lg bg-[#17614F] hover:bg-[#104A3C] text-white text-sm font-semibold cursor-pointer disabled:opacity-60">{T("login.go." + mode)}</button>
                  {msg && <p role="alert" className="text-xs text-rose-700">{msg}</p>}
                </div>
              </form>
            )}
            <div className="flex items-center gap-3 my-5 text-xs text-[#6F756B]"><span className="h-px flex-1 bg-[#E6DFD0]" /><span>{T("login.or")}</span><span className="h-px flex-1 bg-[#E6DFD0]" /></div>
            <h4 className="flex items-center gap-2 text-lg font-semibold text-[#1F2421]"><span className="w-8 h-8 rounded-lg bg-[var(--brass)] text-[#1F2421] flex items-center justify-center"><Users className="w-4 h-4" aria-hidden="true" /></span>{T("login.guest")}</h4>

            {/* Guest entry: pick a role, enter. Sample data, no credentials. */}
            <form onSubmit={handleFormSubmit} className="mt-2.5 relative z-10">
              <fieldset>
                <legend className="sr-only">{T("login.pick")}</legend>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {DEMO_ROLES.map((r) => {
                    const RoleIcon = r.icon;
                    const on = selectedRole === r.id;
                    return (
                      <label key={r.id} className={`relative flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors ${on ? "border-[#17614F] bg-[#17614F]/[0.06] ring-1 ring-[#17614F]" : "border-[#E6DFD0] bg-white hover:border-[#A39B88]"}`}>
                        <input type="radio" name="role" value={r.id} checked={on} onChange={() => setSelectedRole(r.id)} className="sr-only" />
                        <span className={`mt-0.5 w-9 h-9 shrink-0 rounded-lg flex items-center justify-center ${on ? "bg-[#17614F] text-white" : "bg-[#F0EADD] text-[#555B53]"}`}><RoleIcon className="w-[18px] h-[18px]" aria-hidden="true" /></span>
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold text-[#1F2421]">{T("login.role." + r.key)}</span>
                          <span className="block mt-0.5 text-xs leading-relaxed text-[#6F756B]">{T("login.desc." + r.key)}</span>
                        </span>
                        {on && <CheckCircle2 className="absolute top-3 end-3 w-4 h-4 text-[#17614F]" aria-hidden="true" />}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
              <button type="submit" disabled={isSubmitting}
                className="btn-press mt-5 w-full h-12 rounded-lg bg-[#17614F] hover:bg-[#104A3C] text-white font-semibold text-[15px] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60">
                <LogIn className="w-4 h-4 ltr:-scale-x-100" aria-hidden="true" />
                <span>{T("login.enter", { role: T("login.role." + (DEMO_ROLES.find((r) => r.id === selectedRole)?.key || "admin")) })}</span>
              </button>
              <p className="mt-3 text-xs text-center text-[#6F756B]">{T("login.note")}</p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
