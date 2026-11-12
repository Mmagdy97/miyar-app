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
     
      className="min-h-screen w-full relative isolate flex flex-col font-ibm bg-[#F3EFE6] text-[#1A2236] selection:bg-[#24304D] selection:text-white overflow-x-hidden"
    >

      <LandingBody openModal={openModal} setLegalPage={setLegalPage} scrollToSection={scrollToSection} />

      {/* 6. The Login & MVP Demo Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#24304D]/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
           
            className="bg-white rounded-xl shadow-2xl border border-[#DAD3C2] max-w-md w-full p-6 sm:p-8 text-start animate-in zoom-in-95 duration-200 relative overflow-hidden"
          >

            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E9E3D5] relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#24304D] text-white flex items-center justify-center shadow-xs">
                  <LogoMark className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#1A2236]">
                    {T("ld.144")}
                  </h3>
                  <p className="text-[11px] text-[#535E78]">{T("ld.145")}</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg text-[#535E78] hover:text-[#1A2236] hover:bg-[#E9E3D5] transition-colors cursor-pointer"
                aria-label={T("ld.155")}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Login Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4 mt-5 relative z-10">
              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-[#1A2236] mb-1.5">
                  {T("ld.147")}
                </label>
                <div className="relative">
                  <div className="absolute start-3.5 top-1/2 -translate-y-1/2 text-[#535E78]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-[#DAD3C2] bg-[#F3EFE6]/50 text-xs sm:text-sm font-medium text-[#1A2236] focus:outline-none focus:ring-2 border-[#C6BEAA] focus:border-[#24304D] focus:ring-1 focus:ring-[#24304D] transition-all"
                    placeholder="architect@miyar.eg"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-[#1A2236] mb-1.5">
                  {T("ld.148")}
                </label>
                <div className="relative">
                  <div className="absolute start-3.5 top-1/2 -translate-y-1/2 text-[#535E78]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-[#DAD3C2] bg-[#F3EFE6]/50 text-xs sm:text-sm font-medium text-[#1A2236] focus:outline-none focus:ring-2 border-[#C6BEAA] focus:border-[#24304D] focus:ring-1 focus:ring-[#24304D] transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* MVP Magic Role Selector Dropdown */}
              <div className="pt-1">
                <label className="block text-xs font-black text-[#1A2236] mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-[#1A2236]" />
                    {T("ld.149")}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    MVP Quick Switch
                  </span>
                </label>

                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DAD3C2] bg-[#F3EFE6] text-xs sm:text-sm font-bold text-[#1A2236] focus:outline-none focus:ring-2 border-[#C6BEAA] focus:border-[#24304D] focus:ring-1 focus:ring-[#24304D] cursor-pointer shadow-2xs"
                >
                  <option value="Admin">{T("ld.150")}</option>
                  <option value="Site Engineer">{T("ld.151")}</option>
                  <option value="Technical Office">{T("ld.152")}</option>
                  <option value="Client">{T("ld.153")}</option>
                </select>
              </div>

              {/* Quick 1-Click Role Access Buttons */}
              <div className="pt-1">
                <span className="text-[11px] font-bold text-[#535E78] block mb-2">
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
                          selectedRole === r.id ? "bg-[#24304D] text-white border-[#24304D] shadow-xs" : "bg-[#F3EFE6] text-[#1A2236] border-[#DAD3C2] hover:border-[#B5452B]"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <RoleIcon className={`w-3.5 h-3.5 shrink-0 ${selectedRole === r.id ? "text-white" : "text-[#1A2236]"}`} />
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
                  className="w-full py-3 px-6 rounded-lg bg-[#24304D] hover:bg-[#1A2236] active:scale-[0.99] text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  <LogIn className="w-4 h-4 text-white" />
                  <span>
                    {isSubmitting ? "جاري الدخول للنظام..." : D("دخول المنصة الآن")}
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
