import { PricingSection, LegalPage } from "./PublicPages";
import { tr_ as T } from "../i18n";
import Hero from "./Hero";
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
    title: "مدير تنفيذي",
    subtitle: "Manager / CEO",
    desc: "لوحة التحكم الشاملة، الرقابة المالية، ونسب الإنجاز العامة والاعتمادات",
    icon: Building2,
    badge: "صلاحيات كاملة",
  },
  {
    id: "Site Engineer",
    title: "مهندس موقع",
    subtitle: "Site Engineer",
    desc: "التقارير اليومية، تصفية العهد النقدية، طلبات التشوين، وقائمة الملاحظات",
    icon: HardHat,
    badge: "ميداني",
  },
  {
    id: "Technical Office",
    title: "مكتب فني",
    subtitle: "Tech Office",
    desc: "المقايسات الذكية (BOQ)، مراجعة المخططات الهندسية، وإدارة المستندات",
    icon: FileCode,
    badge: "هندسي",
  },
  {
    id: "Client",
    title: "عميل المشروع",
    subtitle: "Client VIP Suite",
    desc: "بوابة العميل التفاعلية، متابعة صور الموقع، جدول الدفعات، واعتماد العينات",
    icon: ShieldCheck,
    badge: "بوابة العميل",
  },
];

export default function LandingAndLogin({ onLogin }) {
  const { t } = useI18n();
  const [legalPage, setLegalPage] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [email, setEmail] = useState("architect@miyar.eg");
  const [password, setPassword] = useState("••••••••");
  const [selectedRole, setSelectedRole] = useState("Admin");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      onLogin(selectedRole);
    }, 250);
  };

  const handleQuickLogin = (roleId) => {
    setSelectedRole(roleId);
    setIsSubmitting(true);
    setTimeout(() => {
      onLogin(roleId);
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
     
      className="min-h-screen w-full relative isolate flex flex-col font-ibm bg-[#F3F4F6] text-[#1E2429] selection:bg-[#2B3138] selection:text-white overflow-x-hidden"
    >

      {/* 1. Floating Glass Navbar */}
      <header className="fixed top-0 end-0 start-0 z-40 bg-[#F3F4F6] border-b border-[#DDE1E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          {/* Logo (Right in RTL) */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2B3138] text-white flex items-center justify-center shadow-sm">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-black text-[#1E2429] tracking-tight">
                {T("ld.1")}
              </span>
              <span className="hidden sm:block text-[10px] text-[#5A646E] font-medium leading-none mt-0.5">
                {T("ld.2")}
              </span>
            </div>
          </div>

          {/* Center Navigation Links (Hidden on small mobile) */}
          <nav className="hidden md:flex items-center gap-8 text-xs lg:text-sm font-bold text-[#5A646E]">
            <button
              onClick={() => scrollToSection("features")}
              className="hover:text-[#2B3138] transition-colors cursor-pointer"
            >
              {t("landing.features")}
            </button>
            <button
              onClick={() => scrollToSection("pillars")}
              className="hover:text-[#2B3138] transition-colors cursor-pointer"
            >
              {t("landing.pillars")}
            </button>
            <button
              onClick={() => scrollToSection("comparison")}
              className="hover:text-[#2B3138] transition-colors cursor-pointer"
            >
              {t("landing.why")}
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="hover:text-[#2B3138] transition-colors cursor-pointer"
            >
              {t("landing.pricing")}
            </button>
          </nav>

          {/* Action button (Left in RTL) */}
          <div className="flex items-center gap-3">
            <SettingsSwitcher />
            <button
              onClick={() => openModal("Admin")}
              className="px-6 py-2.5 rounded-lg bg-[#2B3138] hover:bg-[#1E2429] text-white text-xs sm:text-sm font-medium rounded-lg btn-press flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{t("landing.login")}</span>
            </button>
          </div>
        </div>
      </header>

      <Hero onStart={() => openModal("Admin")} onWhy={() => scrollToSection("comparison")} />

      {/* 3. The Core Features Showcase (Detailed Explanations) */}
      <section id="features" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="max-w-2xl mb-14 sm:mb-20 text-start">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1E2429] leading-tight text-balance">
            {T("ld.36")}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#5A646E] leading-relaxed font-medium">
            {T("ld.37")}
          </p>
        </div>

        {/* 4 Pillars in Alternating Rich Bento Layout */}
        <div id="pillars" className="space-y-16 sm:space-y-24">
          {/* Pillar 1: المقايسات الذكية (Smart BOQ) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Text Description (7 Cols in RTL) */}
            <div className="lg:col-span-6 space-y-4 text-start">
              <h3 className="text-2xl sm:text-3xl font-bold text-[#1E2429] leading-snug text-balance">
                {T("ld.39")}
              </h3>
              <p className="text-sm sm:text-base text-[#5A646E] leading-relaxed font-medium">
                {T("ld.40")}
              </p>

              <ul className="space-y-3 pt-2 text-xs sm:text-sm text-[#1E2429] font-bold">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#D9480F] shrink-0" />
                  <span>{T("ld.41")}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#D9480F] shrink-0" />
                  <span>{T("ld.42")}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#D9480F] shrink-0" />
                  <span>{T("ld.43")}</span>
                </li>
              </ul>

              <div className="pt-2">
                <button
                  onClick={() => openModal("Technical Office")}
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-black text-[#1E2429] hover:text-emerald-700 transition-colors cursor-pointer"
                >
                  <span>{T("ld.44")}</span>
                  <ArrowLeft className="ltr:-scale-x-100 w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Visual Interactive Mockup Card (6 Cols) */}
            <div className="lg:col-span-6 bg-white rounded-xl p-6 sm:p-8 border border-[#DDE1E5] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#ECEEF0]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  <span className="text-xs font-black text-[#1E2429]">{T("ld.45")}</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  هامش الربح: +٣٠٪
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-[#5A646E]">
                  <span>{T("ld.47")}</span>
                  <span className="font-bold text-[#1E2429]">١٢٠ م²</span>
                </div>
                <div className="flex justify-between text-[#5A646E]">
                  <span>{T("ld.49")}</span>
                  <span className="font-mono font-bold text-[#1E2429]">١,٤٠٠ ج.م/م²</span>
                </div>
                <div className="flex justify-between text-[#5A646E]">
                  <span>{T("ld.51")}</span>
                  <span className="font-mono font-bold text-[#1E2429]">١,٨٢٠ ج.م/م²</span>
                </div>
                <div className="p-3 bg-[#F3F4F6] rounded-xl border border-[#DDE1E5] flex items-center justify-between font-black text-[#1E2429]">
                  <span>{T("ld.53")}</span>
                  <span className="text-sm font-black text-[#1E2429] font-mono">٢١٨,٤٠٠ ج.م</span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <span className="flex-1 text-center py-2 rounded-xl bg-[#ECEEF0] text-[#5A646E] text-xs font-bold">
                  {T("ld.55")}
                </span>
                <span className="flex-1 text-center py-2 rounded-xl bg-[#2B3138] text-white text-xs font-medium rounded-lg shadow-xs hover:bg-[#1E2429]">
                  {T("ld.56")}
                </span>
              </div>
            </div>
          </div>

          {/* Pillar 2: الرقابة المالية والعهد (Petty Cash) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Visual Interactive Mockup Card (6 Cols - First on Desktop for alternating flow) */}
            <div className="lg:col-span-6 bg-white rounded-xl p-6 sm:p-8 border border-[#DDE1E5] space-y-4 order-2 lg:order-1">
              <div className="flex items-center justify-between pb-3 border-b border-[#ECEEF0]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#2B3138] text-white flex items-center justify-center font-bold text-xs">
                    م.أ
                  </div>
                  <div>
                    <p className="text-xs font-black text-[#1E2429]">م. أحمد الشناوي</p>
                    <p className="text-[10px] text-[#5A646E]">مقر إداري - الشيخ زايد</p>
                  </div>
                </div>
                <span className="text-[11px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {T("ld.60")}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#5A646E]">{T("ld.61")}</span>
                  <span className="font-bold text-[#1E2429] font-mono">٥٠,٠٠٠ ج.م</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5A646E]">{T("ld.63")}</span>
                  <span className="font-bold text-[#1E2429] font-mono">٣٥,٠٠٠ ج.م</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5A646E]">{T("ld.65")}</span>
                  <span className="font-bold text-emerald-700 font-mono">١٥,٠٠٠ ج.م</span>
                </div>

                <div className="pt-1">
                  <div className="flex justify-between text-[11px] mb-1 font-bold">
                    <span className="text-[#5A646E]">{T("ld.67")}</span>
                    <span className="text-[#1E2429] font-mono">٧٠٪</span>
                  </div>
                  <div className="w-full h-2 bg-[#ECEEF0] rounded-full overflow-hidden">
                    <div className="h-full bg-[#2B3138] rounded-full w-[70%]" />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/60 text-xs text-amber-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                <span>فاتورة قيد المراجعة: تشوين أسمنت سريع (١,٥٠٠ ج.م) بانتظار اعتمادك الآن.</span>
              </div>
            </div>

            {/* Text Description (6 Cols) */}
            <div className="lg:col-span-6 space-y-4 text-start order-1 lg:order-2">
              <h3 className="text-2xl sm:text-3xl font-bold text-[#1E2429] leading-snug text-balance">
                {T("ld.71")}
              </h3>
              <p className="text-sm sm:text-base text-[#5A646E] leading-relaxed font-medium">
                {T("ld.72")}
              </p>

              <ul className="space-y-3 pt-2 text-xs sm:text-sm text-[#1E2429] font-bold">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#D9480F] shrink-0" />
                  <span>{T("ld.73")}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#D9480F] shrink-0" />
                  <span>{T("ld.74")}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#D9480F] shrink-0" />
                  <span>{T("ld.75")}</span>
                </li>
              </ul>

              <div className="pt-2">
                <button
                  onClick={() => openModal("Admin")}
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-black text-[#1E2429] hover:text-emerald-700 transition-colors cursor-pointer"
                >
                  <span>{T("ld.76")}</span>
                  <ArrowLeft className="ltr:-scale-x-100 w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Pillar 3: بوابة العميل الفاخرة (Client Portal) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Text Description */}
            <div className="lg:col-span-6 space-y-4 text-start">
              <h3 className="text-2xl sm:text-3xl font-bold text-[#1E2429] leading-snug text-balance">
                {T("ld.78")}
              </h3>
              <p className="text-sm sm:text-base text-[#5A646E] leading-relaxed font-medium">
                {T("ld.79")}
              </p>

              <ul className="space-y-3 pt-2 text-xs sm:text-sm text-[#1E2429] font-bold">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#D9480F] shrink-0" />
                  <span>{T("ld.80")}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#D9480F] shrink-0" />
                  <span>{T("ld.81")}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#D9480F] shrink-0" />
                  <span>{T("ld.82")}</span>
                </li>
              </ul>

              <div className="pt-2">
                <button
                  onClick={() => openModal("Client")}
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-black text-[#1E2429] hover:text-emerald-700 transition-colors cursor-pointer"
                >
                  <span>{T("ld.83")}</span>
                  <ArrowLeft className="ltr:-scale-x-100 w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Visual Interactive Mockup Card */}
            <div className="lg:col-span-6 bg-white rounded-xl p-6 sm:p-8 border border-[#DDE1E5] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#ECEEF0]">
                <div>
                  <span className="text-[10px] font-bold text-[#5A646E] block">{T("ld.84")}</span>
                  <h4 className="text-sm font-black text-[#1E2429]">مشروع فيلا الياسمين — أ. محمد عبد الرحمن</h4>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-[#2B3138] text-white">
                  VIP Suite
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#F3F4F6] border border-[#DDE1E5] space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-[#1E2429]">
                  <span>{T("ld.86")}</span>
                  <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    {T("ld.87")}
                  </span>
                </div>
                <p className="text-[11px] text-[#5A646E] leading-relaxed">
                  {T("ld.88")}
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button className="py-2 rounded-xl bg-[#2B3138] text-white text-xs font-medium rounded-lg shadow-xs hover:bg-[#1E2429]">
                    {T("ld.89")}
                  </button>
                  <button className="py-2 rounded-xl bg-white border border-[#DDE1E5] text-[#1E2429] text-xs font-bold">
                    {T("ld.90")}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-[#5A646E] pt-1">
                <span>الدفعة القادمة: ٥٠٠,٠٠٠ ج.م</span>
                <span className="font-bold text-[#1E2429]">{T("ld.92")}</span>
              </div>
            </div>
          </div>

          {/* Pillar 4: إدارة المهام والمخططات (Site & Tech Office) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Visual Interactive Mockup Card */}
            <div className="lg:col-span-6 bg-white rounded-xl p-6 sm:p-8 border border-[#DDE1E5] space-y-4 order-2 lg:order-1">
              <div className="flex items-center justify-between pb-3 border-b border-[#ECEEF0]">
                <span className="text-xs font-black text-[#1E2429]">{T("ld.93")}</span>
                <span className="text-[11px] font-bold text-[#5A646E] font-mono">٤ بنود تحت المتابعة</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#D9480F]" />
                    <span className="font-bold text-[#1E2429]">{T("ld.95")}</span>
                  </div>
                  <span className="text-[10px] font-extrabold text-emerald-700">{T("ld.96")}</span>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span className="font-bold text-[#1E2429]">{T("ld.97")}</span>
                  </div>
                  <span className="text-[10px] font-extrabold text-amber-700">{T("ld.98")}</span>
                </div>

                <div className="p-3 rounded-xl bg-[#F3F4F6] border border-[#DDE1E5] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-[#1E2429]" />
                    <span className="font-bold text-[#1E2429]">لوحة شوب دروينج معتمدة: Rev 03 - MEP</span>
                  </div>
                  <span className="text-[10px] font-extrabold text-[#1E2429] bg-[#ECEEF0] px-2 py-0.5 rounded-full">
                    {T("ld.100")}
                  </span>
                </div>
              </div>
            </div>

            {/* Text Description */}
            <div className="lg:col-span-6 space-y-4 text-start order-1 lg:order-2">
              <h3 className="text-2xl sm:text-3xl font-bold text-[#1E2429] leading-snug text-balance">
                {T("ld.102")}
              </h3>
              <p className="text-sm sm:text-base text-[#5A646E] leading-relaxed font-medium">
                {T("ld.103")}
              </p>

              <ul className="space-y-3 pt-2 text-xs sm:text-sm text-[#1E2429] font-bold">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#D9480F] shrink-0" />
                  <span>{T("ld.104")}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#D9480F] shrink-0" />
                  <span>{T("ld.105")}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#D9480F] shrink-0" />
                  <span>{T("ld.106")}</span>
                </li>
              </ul>

              <div className="pt-2">
                <button
                  onClick={() => openModal("Site Engineer")}
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-black text-[#1E2429] hover:text-emerald-700 transition-colors cursor-pointer"
                >
                  <span>{T("ld.107")}</span>
                  <ArrowLeft className="ltr:-scale-x-100 w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. The Competitor Comparison Table (The Deal Closer) */}
      <section id="comparison" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="text-start max-w-2xl mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1E2429] leading-tight text-balance">
            {T("ld.109")}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#5A646E] leading-relaxed font-medium">
            {T("ld.110")}
          </p>
        </div>

        {/* The Table Container */}
        <div className="bg-white rounded-xl shadow-sm border border-[#DDE1E5] overflow-hidden overflow-x-auto">
          <table className="w-full text-start border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-[#DDE1E5] text-sm">
                <th className="p-5 sm:p-6 font-black text-[#1E2429] w-1/4">{T("ld.111")}</th>
                <th className="p-5 sm:p-6 font-black text-[#1E2429] w-1/3 bg-[#F3F4F6] border-t-4 border-[#2B3138] relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[#1E2429] text-base sm:text-lg font-black">{T("ld.112")}</span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-[#2B3138] text-white text-[10px] font-black">
                      {T("ld.113")}
                    </span>
                  </div>
                </th>
                <th className="p-5 sm:p-6 font-bold text-[#5A646E] w-1/5">{T("ld.114")}</th>
                <th className="p-5 sm:p-6 font-bold text-[#5A646E] w-1/5">{T("ld.115")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECEEF0] text-xs sm:text-sm">
              {/* Row 1 */}
              <tr className="hover:bg-[#F3F4F6]/50 transition-colors">
                <td className="p-5 sm:p-6 font-extrabold text-[#1E2429]">
                  {T("ld.116")}
                </td>
                <td className="p-5 sm:p-6 bg-[#F3F4F6]/70 font-bold text-[#1E2429]">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#D9480F] shrink-0 mt-0.5" />
                    <span>{T("ld.117")}</span>
                  </div>
                </td>
                <td className="p-5 sm:p-6 text-[#5A646E]">
                  <div className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <span>{T("ld.118")}</span>
                  </div>
                </td>
                <td className="p-5 sm:p-6 text-[#5A646E]">
                  <div className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <span>{T("ld.119")}</span>
                  </div>
                </td>
              </tr>

              {/* Row 2 */}
              <tr className="hover:bg-[#F3F4F6]/50 transition-colors">
                <td className="p-5 sm:p-6 font-extrabold text-[#1E2429]">
                  {T("ld.120")}
                </td>
                <td className="p-5 sm:p-6 bg-[#F3F4F6]/70 font-bold text-[#1E2429]">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#D9480F] shrink-0 mt-0.5" />
                    <span>{T("ld.121")}</span>
                  </div>
                </td>
                <td className="p-5 sm:p-6 text-[#5A646E]">
                  <div className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <span>{T("ld.122")}</span>
                  </div>
                </td>
                <td className="p-5 sm:p-6 text-[#5A646E]">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <span>{T("ld.123")}</span>
                  </div>
                </td>
              </tr>

              {/* Row 3 */}
              <tr className="hover:bg-[#F3F4F6]/50 transition-colors">
                <td className="p-5 sm:p-6 font-extrabold text-[#1E2429]">
                  {T("ld.124")}
                </td>
                <td className="p-5 sm:p-6 bg-[#F3F4F6]/70 font-bold text-[#1E2429]">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#D9480F] shrink-0 mt-0.5" />
                    <span>{T("ld.125")}</span>
                  </div>
                </td>
                <td className="p-5 sm:p-6 text-[#5A646E]">
                  <div className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <span>{T("ld.126")}</span>
                  </div>
                </td>
                <td className="p-5 sm:p-6 text-[#5A646E]">
                  <div className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <span>{T("ld.127")}</span>
                  </div>
                </td>
              </tr>

              {/* Row 4 */}
              <tr className="hover:bg-[#F3F4F6]/50 transition-colors">
                <td className="p-5 sm:p-6 font-extrabold text-[#1E2429]">
                  {T("ld.128")}
                </td>
                <td className="p-5 sm:p-6 bg-[#F3F4F6]/70 font-bold text-[#1E2429]">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#D9480F] shrink-0 mt-0.5" />
                    <span>{T("ld.129")}</span>
                  </div>
                </td>
                <td className="p-5 sm:p-6 text-[#5A646E]">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <span>{T("ld.130")}</span>
                  </div>
                </td>
                <td className="p-5 sm:p-6 text-[#5A646E]">
                  <div className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <span>{T("ld.131")}</span>
                  </div>
                </td>
              </tr>

              {/* Row 5 */}
              <tr className="hover:bg-[#F3F4F6]/50 transition-colors">
                <td className="p-5 sm:p-6 font-extrabold text-[#1E2429]">
                  {T("ld.132")}
                </td>
                <td className="p-5 sm:p-6 bg-[#F3F4F6]/70 font-bold text-[#1E2429]">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#D9480F] shrink-0 mt-0.5" />
                    <span>{T("ld.133")}</span>
                  </div>
                </td>
                <td className="p-5 sm:p-6 text-[#5A646E]">
                  <div className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <span>{T("ld.134")}</span>
                  </div>
                </td>
                <td className="p-5 sm:p-6 text-[#5A646E]">
                  <div className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <span>{T("ld.135")}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-8 p-6 rounded-xl bg-white border border-[#DDE1E5] text-center text-xs sm:text-sm font-bold text-[#1E2429]">
          <span className="text-[#1E2429] font-black">{T("ld.136")} </span>
          {T("ld.137")}
        </div>
      </section>

      {/* 5. Final CTA Banner & Footer */}
      <PricingSection onStart={() => openModal("Admin")} />

      <section id="cta" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="bg-[#171B21] border border-[#262c34] text-white rounded-xl p-10 md:p-16 text-start relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">

            <h2
              className="text-3xl md:text-5xl font-bold leading-tight mb-6 text-white text-balance"
            >
              {T("ld.139")}
            </h2>

            <p
              className="text-lg max-w-2xl mb-10 text-[#C9CFD6] leading-relaxed font-normal"
            >
              {T("ld.140")}
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <button
                onClick={() => openModal("Admin")}
                className="w-full sm:w-auto px-8 py-4 rounded-lg bg-[#D9480F] text-white hover:bg-[#B83B0A] font-semibold text-base btn-press"
              >
                {T("ld.141")}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#DDE1E5] bg-white/80 py-10 px-4 sm:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-start">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2B3138] text-white flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-base font-black text-[#1E2429]">{T("ld.1")}</p>
              <p className="text-[11px] text-[#5A646E]">{T("ld.142")}</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs font-bold text-[#5A646E]">
            <button onClick={() => scrollToSection("features")} className="hover:text-[#2B3138] cursor-pointer">
              {t("landing.footerFeatures")}
            </button>
            <button onClick={() => scrollToSection("pillars")} className="hover:text-[#2B3138] cursor-pointer">
              {t("landing.footerPillars")}
            </button>
            <button onClick={() => scrollToSection("comparison")} className="hover:text-[#2B3138] cursor-pointer">
              {t("landing.footerCompare")}
            </button>
            <button onClick={() => openModal("Client")} className="hover:text-[#2B3138] cursor-pointer">
              {t("landing.clientPortal")}
            </button>
            <button onClick={() => { setLegalPage("privacy"); window.scrollTo(0, 0); }} className="hover:text-[#2B3138] cursor-pointer">
              {t("landing.privacy")}
            </button>
            <button onClick={() => { setLegalPage("terms"); window.scrollTo(0, 0); }} className="hover:text-[#2B3138] cursor-pointer">
              {t("landing.terms")}
            </button>
          </div>

          <p className="text-xs text-[#5A646E] font-medium">
            {T("ld.143")}
          </p>
        </div>
      </footer>

      {/* 6. The Login & MVP Demo Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#2B3138]/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
           
            className="bg-white rounded-xl shadow-2xl border border-[#DDE1E5] max-w-md w-full p-6 sm:p-8 text-start animate-in zoom-in-95 duration-200 relative overflow-hidden"
          >

            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#ECEEF0] relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#2B3138] text-white flex items-center justify-center shadow-xs">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#1E2429]">
                    {T("ld.144")}
                  </h3>
                  <p className="text-[11px] text-[#5A646E]">{T("ld.145")}</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg text-[#5A646E] hover:text-[#1E2429] hover:bg-[#ECEEF0] transition-colors cursor-pointer"
                aria-label={T("ld.155")}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Login Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4 mt-5 relative z-10">
              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-[#1E2429] mb-1.5">
                  {T("ld.147")}
                </label>
                <div className="relative">
                  <div className="absolute start-3.5 top-1/2 -translate-y-1/2 text-[#5A646E]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-[#DDE1E5] bg-[#F3F4F6]/50 text-xs sm:text-sm font-medium text-[#1E2429] focus:outline-none focus:ring-2 border-[#CBD0D6] focus:border-[#2B3138] focus:ring-1 focus:ring-[#2B3138] transition-all"
                    placeholder="architect@miyar.eg"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-[#1E2429] mb-1.5">
                  {T("ld.148")}
                </label>
                <div className="relative">
                  <div className="absolute start-3.5 top-1/2 -translate-y-1/2 text-[#5A646E]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-[#DDE1E5] bg-[#F3F4F6]/50 text-xs sm:text-sm font-medium text-[#1E2429] focus:outline-none focus:ring-2 border-[#CBD0D6] focus:border-[#2B3138] focus:ring-1 focus:ring-[#2B3138] transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* MVP Magic Role Selector Dropdown */}
              <div className="pt-1">
                <label className="block text-xs font-black text-[#1E2429] mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-[#1E2429]" />
                    {T("ld.149")}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    MVP Quick Switch
                  </span>
                </label>

                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE1E5] bg-[#F3F4F6] text-xs sm:text-sm font-bold text-[#1E2429] focus:outline-none focus:ring-2 border-[#CBD0D6] focus:border-[#2B3138] focus:ring-1 focus:ring-[#2B3138] cursor-pointer shadow-2xs"
                >
                  <option value="Admin">{T("ld.150")}</option>
                  <option value="Site Engineer">{T("ld.151")}</option>
                  <option value="Technical Office">{T("ld.152")}</option>
                  <option value="Client">{T("ld.153")}</option>
                </select>
              </div>

              {/* Quick 1-Click Role Access Buttons */}
              <div className="pt-1">
                <span className="text-[11px] font-bold text-[#5A646E] block mb-2">
                  {T("ld.154")}
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {DEMO_ROLES.map((r) => {
                    const RoleIcon = r.icon;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => handleQuickLogin(r.id)}
                        className={`p-2.5 rounded-xl text-[11px] font-bold border transition-all cursor-pointer text-start flex items-center justify-between ${
                          selectedRole === r.id ? "bg-[#2B3138] text-white border-[#2B3138] shadow-xs" : "bg-[#F3F4F6] text-[#1E2429] border-[#DDE1E5] hover:border-[#D9480F]"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <RoleIcon className={`w-3.5 h-3.5 shrink-0 ${selectedRole === r.id ? "text-white" : "text-[#1E2429]"}`} />
                          <span className="truncate">{r.title}</span>
                        </div>
                        {selectedRole === r.id && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0 ms-1" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-6 rounded-lg bg-[#2B3138] hover:bg-[#1E2429] active:scale-[0.99] text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  <LogIn className="w-4 h-4 text-white" />
                  <span>
                    {isSubmitting ? "جاري الدخول للنظام..." : "دخول المنصة الآن"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
