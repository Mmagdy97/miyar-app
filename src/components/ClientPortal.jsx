import { currencySymbol, E } from "../i18n";
import { localize, D } from "../data/dataI18n";
import { tr_ as T } from "../i18n";
import { invoicesStore } from "../data/stores";
import { useState } from "react";
import ProgressBar from "./ProgressBar";
import {
  Sparkles,
  CheckCircle2,
  Clock,
  Home,
  Camera,
  Heart,
  ChevronLeft,
  ChevronRight,
  Eye,
  CreditCard,
  Building2,
  Calendar,
  Check,
  X,
  FileText,
  Download,
  Share2,
  ShieldCheck,
  MapPin,
  ExternalLink,
  SlidersHorizontal,
  Compass,
} from "lucide-react";
import { clientProject, getClientPayments, formatNumber, formatDateAr, formatMonthYearAr, toAr } from "../data/seed";

const PROJECT = clientProject();

// Project Phases Stepper Data
const PROJECT_PHASES = localize([
  {
    id: 1,
    title: "التصميم والمخططات",
    subtitle: "المخططات الهندسية والمود بورد ثلاثي الأبعاد",
    status: "completed",
    date: "٢٥ سبتمبر ٢٠٢٦",
    badge: "مكتمل بنجاح",
  },
  {
    id: 2,
    title: "أعمال التأسيس وMEP",
    subtitle: "شبكات الصرف والتغذية والتكييف والكهرباء الذكية",
    status: "completed",
    date: "٢٠ أكتوبر ٢٠٢٦",
    badge: "مكتمل بنجاح",
  },
  {
    id: 3,
    title: "أعمال التشطيب والديكور",
    subtitle: "تركيب الرخام المستورد وتجليد الحوائط والأسقف",
    status: "active",
    date: "١٥ ديسمبر ٢٠٢٦",
    badge: "المرحلة الحالية",
  },
  {
    id: 4,
    title: "الفرش والتسليم النهائي",
    subtitle: "المطابخ والأثاث المخصص والفحص الشامل واستلام المفتاح",
    status: "pending",
    date: formatDateAr(PROJECT.deadline),
    badge: "قيد الانتظار",
  },
]);

// High-end Instagram-style site gallery photos
const SITE_UPDATES = localize([
  {
    id: 1,
    title: "تركيب رخام الكلكتا الإيطالي بهو المدخل",
    date: "٦ نوفمبر ٢٠٢٦",
    category: "رخام مستورد",
    description: "مطابقة عروق الرخام بنمط Bookmatched مع فواصل إيبوكسي شفافة مقاومة لامتصاص الرطوبة.",
    photographer: "م. كريم مصطفى (الموقع)",
    bgGradient: "from-amber-100 via-[#EEF1F5] to-amber-50",
    likes: 12,
  },
  {
    id: 2,
    title: "تأسيس شبكة الكهرباء الذكية والتحكم الصوتي",
    date: "٥ نوفمبر ٢٠٢٦",
    category: "سمارت هوم KNX",
    description: "تمديد مسارات كابلات التحكم المركزي بالمكيفات والستائر والإضاءة المعمارية المحيطية.",
    photographer: "م. طارق يوسف (MEP)",
    bgGradient: "from-[#EEF1F5] via-[#E3E7EE] to-[#F4F6F9]",
    likes: 9,
  },
  {
    id: 3,
    title: "معاينة تجليد خشب الجوز الأمريكي لغرفة المعيشة",
    date: "٤ نوفمبر ٢٠٢٦",
    category: "نجارة وديكور",
    description: "استلام شرائح قشرة خشب الجوز الطبيعي بدهانات بولي يوريثان مط ضد الخدش والأتربة.",
    photographer: "سارة عامر (كبير المعماريين)",
    bgGradient: "from-amber-200 via-orange-100 to-[#E3E7EE]",
    likes: 15,
  },
  {
    id: 4,
    title: "تجهيز مساحات الإضاءة المخفية والأسقف الجبسية",
    date: "٢ نوفمبر ٢٠٢٦",
    category: "أسقف وجبس بورد",
    description: "تشكيل بروفايلات الليد المنحنية بالريسبشن وفقاً للرسومات التنفيذية المعمارية.",
    photographer: "م. كريم مصطفى (الموقع)",
    bgGradient: "from-[#F4F6F9] via-[#EEF1F5] to-[#F4F6F9]",
    likes: 8,
  },
]);

function ClientPortal({ actionItems = [], setActionItems, setSelectedItem }) {
  const [invoiceRows] = invoicesStore.use();
  const PAY = getClientPayments(invoiceRows);
  // Client Approvals State
  const [approvalsState, setApprovalsState] = useState({
    marble: "pending", // "pending" | "approved" | "rejected"
    paint: "pending",
  });

  // Photo Likes State
  const [likedPhotos, setLikedPhotos] = useState({});

  // Active Photo Preview Modal State
  const [activePhoto, setActivePhoto] = useState(null);

  // Financial Payment Details Modal State
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [transferConfirmed, setTransferConfirmed] = useState(false);

  const toggleLike = (id) => {
    setLikedPhotos((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleClientApproval = (itemKey, decision) => {
    setApprovalsState((prev) => ({
      ...prev,
      [itemKey]: decision,
    }));

    // If approved, create a notification back to the Admin
    if (setActionItems) {
      const decisionTitle =
        decision === "approved"
          ? "العميل اعتمد عينة الرخام Crema Marfil"
          : D("العميل طلب بديلاً لعينة رخام Crema Marfil");

      const newActionItem = {
        id: Date.now(),
        title: decisionTitle,
        subtitle:
          decision === "approved"
            ? "اعتمد أ. محمد عينة رخام الأرضيات الإسباني، جاهز للتوريد والتركيب."
            : D("طلب أ. محمد توفير بديل بلون أفتح أو عروق رخام بيج كلاسيكي."),
        user: "أ. محمد (العميل)",
        project: D("فيلا الياسمين - التجمع"),
        category: "اعتماد عميل",
        amount: decision === "approved" ? "معتمد ✓" : D("طلب بديل"),
        timestamp: "الآن",
        time: "الآن",
        targetRole: "Admin",
        type: "report",
        status: "pending",
      };

      setActionItems((prev) => [newActionItem, ...prev]);
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full max-w-full overflow-x-hidden">
      {/* 1. Premium Header (Welcome Banner) */}
      <div className="relative rounded-2xl p-6 sm:p-8 md:p-10 bg-[#0F172A] text-white shadow-sm border border-[#1C2540] overflow-hidden">
        {/* Subtle Ambient Glows */}
        

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          {/* Right text in RTL */}
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20 inline-flex items-center gap-1.5 backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-white" />
                {T("cli.28")}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-[#EEF1F5] border border-white/15">
                {T("cli.29")}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
              {T("cli.30")}
            </h1>

            <div className="flex items-center gap-2.5 flex-wrap pt-1">
              <span className="text-lg sm:text-xl font-bold text-white">
                {T("cli.31")}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-white/10 text-[#CBD5E1] border border-white/20">
                {T("cli.32")}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#EEF1F5] leading-relaxed pt-1 flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                {T("cli.33")}
              </span>
              <span>{T("cli.34")}</span>
              <span>{T("cli.35")}</span>
              <span>{T("cli.36")}</span>
            </p>
          </div>

          {/* Left Progress in RTL: Beautiful Circular Progress Widget */}
          <div className="flex items-center gap-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-5 self-start lg:self-center shrink-0">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                {/* Background Track */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="8"
                />
                {/* Active Gradient Ring */}
                <defs>
                  <linearGradient id="clientProgressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0F766E" />
                    <stop offset="100%" stopColor="#64748B" />
                  </linearGradient>
                </defs>
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="url(#clientProgressGrad)"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 * (1 - PROJECT.progress / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-white leading-none">
                  {T("cli.37", { v0: toAr(PROJECT.progress) })}
                </span>
                <span className="text-[10px] text-[#EEF1F5] font-medium mt-0.5">
                  {T("cli.38")}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-[#CBD5E1] block">
                {T("cli.119")}
              </span>
              <p className="text-sm font-extrabold text-white">
                {T("cli.40", { v0: toAr(PROJECT.progress) })}
              </p>
              <p className="text-[11px] text-[#EEF1F5]/80">
                {T("cli.41", { v0: formatMonthYearAr(PROJECT.deadline) })}
              </p>
              <div className="flex items-center gap-1.5 pt-1 text-[11px] text-[#CBD5E1] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{T("cli.42")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. The Visual Timeline (الجدول الزمني المرئي للمشروع) */}
      <div className="bg-white rounded-lg border border-[#E3E7EE] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-[#EEF1F5]">
          <div>
            <h2 className="text-lg font-black text-[#0F172A] flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#0F172A]" />
              {T("cli.43")}
            </h2>
            <p className="text-xs text-[#475569] mt-0.5">
              {T("cli.44")}
            </p>
          </div>
          <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-[#EEF1F5] text-[#0F172A] border border-[#E3E7EE] self-start sm:self-auto">
            {T("cli.45")}
          </span>
        </div>

        {/* Horizontal Timeline Stepper */}
        <div className="grid stat-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative">
          {PROJECT_PHASES.map((phase, index) => {
            const isCompleted = phase.status === "completed";
            const isActive = phase.status === "active";
            const isPending = phase.status === "pending";

            return (
              <div
                key={phase.id}
                className={`rounded-lg p-4 sm:p-5 border transition-all duration-300 relative flex flex-col justify-between ${
                  isActive
                    ? "bg-[#F4F6F9] border-[#CBD2DC] ring-1 ring-[#0F172A]/10 shadow-xs"
                    : isCompleted
                    ? "bg-white border-[#E3E7EE] hover:bg-[#F4F6F9]/50"
                    : "bg-[#F4F6F9] border-[#E3E7EE] opacity-80"
                }`}
              >
                {/* Stepper Header with Icon & Step Number */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-extrabold text-[#475569] font-mono">
                      {T("cli.46", { v0: phase.id })}
                    </span>

                    {/* Status Pill */}
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                        isCompleted
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                          : isActive
                          ? "bg-[#0F172A] text-white border-[#1C2540]"
                          : "bg-[#EEF1F5] text-[#475569] border-[#E3E7EE]"
                      }`}
                    >
                      {phase.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 mb-2">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isCompleted
                          ? "bg-emerald-100 text-emerald-700"
                          : isActive
                          ? "bg-[#0F172A] text-white"
                          : "bg-[#E3E7EE] text-[#475569]"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : isActive ? (
                        <Sparkles className="w-4 h-4" />
                      ) : (
                        <Clock className="w-4 h-4" />
                      )}
                    </div>

                    <h3 className="text-sm font-black text-[#0F172A] leading-snug">
                      {phase.title}
                    </h3>
                  </div>

                  <p className="text-xs text-[#475569] leading-relaxed mt-1">
                    {phase.subtitle}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-[#EEF1F5] flex items-center justify-between text-[11px]">
                  <span className="text-[#475569] font-medium">{T("cli.47")}</span>
                  <span
                    className={`font-bold ${
                      isActive ? "text-[#0F172A] font-bold" : "text-[#475569]"
                    }`}
                  >
                    {phase.date}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Approvals Required (اعتمادات وموافقات مطلوبة منك) */}
      <div className="bg-white rounded-lg border border-[#E3E7EE] p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[#EEF1F5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#EEF1F5] text-[#0F172A] border border-[#E3E7EE] flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#0F172A]">
                {T("cli.48")}
              </h2>
              <p className="text-xs text-[#475569] mt-0.5">
                {T("cli.49")}
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 self-start sm:self-auto">
            {T("cli.50")}
          </span>
        </div>

        {/* Approval Item Card */}
        <div className="bg-[#F4F6F9]/50 rounded-lg p-5 border border-[#E3E7EE] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                {T("cli.51")}
              </span>
              <span className="text-xs text-[#475569]">{T("cli.52")}</span>
            </div>

            <h3 className="text-base font-black text-[#0F172A]">
              {T("cli.53")}
            </h3>

            <p className="text-xs text-[#475569] leading-relaxed">
              {T("cli.54")}
            </p>

            <div className="flex items-center gap-4 text-xs text-[#475569] pt-1 font-medium">
              <span>{T("cli.55")}</span>
              <span>{T("cli.56")}</span>
            </div>
          </div>

          {/* Interactive Decision Action Buttons */}
          <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-2.5 min-w-[200px]">
            {approvalsState.marble === "pending" ? (
              <>
                <button
                  onClick={() => handleClientApproval("marble", "approved")}
                  className="px-5 py-3 rounded-lg text-xs sm:text-sm font-medium text-white bg-[#0F172A] hover:bg-[#0F172A] hover:bg-[#0F172A] shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{T("cli.57")}</span>
                </button>

                <button
                  onClick={() => handleClientApproval("marble", "rejected")}
                  className="px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold text-[#475569] bg-white border border-[#E3E7EE] hover:bg-[#EEF1F5] hover:text-rose-700 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>{T("cli.58")}</span>
                </button>
              </>
            ) : approvalsState.marble === "approved" ? (
              <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-300 text-center space-y-1">
                <span className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  {T("cli.59")}
                </span>
                <p className="text-[11px] text-emerald-700">
                  {T("cli.60")}
                </p>
                <button
                  onClick={() => handleClientApproval("marble", "pending")}
                  className="text-[10px] text-[#475569] hover:text-[#475569] underline font-medium pt-1"
                >
                  {T("cli.61")}
                </button>
              </div>
            ) : (
              <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-300 text-center space-y-1">
                <span className="inline-flex items-center gap-1.5 text-xs font-black text-rose-800">
                  <X className="w-4 h-4 text-rose-600" />
                  {T("cli.62")}
                </span>
                <p className="text-[11px] text-rose-700">
                  {T("cli.63")}
                </p>
                <button
                  onClick={() => handleClientApproval("marble", "pending")}
                  className="text-[10px] text-[#475569] hover:text-[#475569] underline font-medium pt-1"
                >
                  {T("cli.64")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Latest Site Updates (آخر تحديثات الموقع الميدانية - Instagram Style) */}
      <div className="bg-white rounded-lg border border-[#E3E7EE] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[#EEF1F5]">
          <div>
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-[#0F172A]" />
              <h2 className="text-lg font-black text-[#0F172A]">
                {T("cli.65")}
              </h2>
            </div>
            <p className="text-xs text-[#475569] mt-0.5">
              {T("cli.66")}
            </p>
          </div>

          <span className="text-xs font-bold text-[#0F172A] bg-[#EEF1F5] px-3 py-1 rounded-full border border-[#E3E7EE] self-start sm:self-auto">
            {T("cli.67")}
          </span>
        </div>

        {/* Gallery Grid (3-4 High-End Photo Cards) */}
        <div className="grid stat-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SITE_UPDATES.map((photo) => {
            const isLiked = likedPhotos[photo.id];

            return (
              <div
                key={photo.id}
                onClick={() => setActivePhoto(photo)}
                className="group bg-white rounded-lg border border-[#E3E7EE] overflow-hidden shadow-xs hover:shadow-xl hover:border-[#0F766E] transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                {/* Photo Preview Container (Mimicking high-end architectural photo) */}
                <div
                  className={`relative h-48 bg-gradient-to-br ${photo.bgGradient} flex flex-col items-center justify-center p-4 overflow-hidden group-hover:scale-[1.02] transition-transform duration-500`}
                >
                  {/* Subtle architectural grid pattern */}
                  <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px]" />

                  {/* Camera icon badge */}
                  <div className="w-12 h-12 rounded-lg bg-white/90 backdrop-blur-xs text-[#0F172A] flex items-center justify-center shadow-md shadow-stone-900/10 group-hover:scale-110 transition-transform">
                    <Camera className="w-6 h-6" />
                  </div>

                  <span className="text-xs font-extrabold text-[#0F172A] bg-white/95 px-3 py-1 rounded-full shadow-xs mt-3 backdrop-blur-sm">
                    {E(photo.category)}
                  </span>

                  {/* Top Heart and Date Badge */}
                  <div className="absolute top-3 start-3 end-3 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#475569] bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-md">
                      {photo.date}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(photo.id);
                      }}
                      className={`p-1.5 rounded-full backdrop-blur-sm transition-all ${
                        isLiked
                          ? "bg-rose-50 text-rose-600 scale-110"
                          : "bg-white/80 text-[#475569] hover:text-rose-600"
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 ${isLiked ? "fill-rose-600" : ""}`}
                      />
                    </button>
                  </div>
                </div>

                {/* Caption & Metadata */}
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-[#0F172A] leading-snug group-hover:text-[#0F172A] transition-colors line-clamp-2">
                      {photo.title}
                    </h3>
                    <p className="text-[11px] text-[#475569] mt-1 line-clamp-2 leading-relaxed">
                      {photo.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#EEF1F5] flex items-center justify-between text-[10px] text-[#475569]">
                    <span className="truncate max-w-[140px]">
                      {T("cli.68", { v0: photo.photographer })}
                    </span>
                    <span className="font-bold text-[#0F172A] flex items-center gap-1 group-hover:underline">
                      {D("معاينة")} <Eye className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Financial Overview (الملخص المالي المبسط للعميل) */}
      <div className="bg-white rounded-lg border border-[#E3E7EE] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[#EEF1F5]">
          <div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#0F172A]" />
              <h2 className="text-lg font-black text-[#0F172A]">
                {T("cli.69")}
              </h2>
            </div>
            <p className="text-xs text-[#475569] mt-0.5">
              {T("cli.70")}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {T("cli.71", { v0: toAr(PAY.paidPct) })}
            </span>
          </div>
        </div>

        {/* 3 Metric Cards + Highlighted Next Due Payment */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Metric 1: Total Contract */}
          <div className="p-5 rounded-lg bg-[#F4F6F9] border border-[#E3E7EE] space-y-2">
            <span className="text-xs font-bold text-[#475569] uppercase tracking-wider">
              {T("cli.72")}
            </span>
            <div className="text-2xl sm:text-3xl font-black text-[#0F172A] font-ibm">
              {formatNumber(PAY.total)} <span className="text-sm font-bold text-[#475569]">{currencySymbol()}</span>
            </div>
            <p className="text-[11px] text-[#475569]">
              {T("cli.73")}
            </p>
          </div>

          {/* Metric 2: Total Paid */}
          <div className="p-5 rounded-2xl bg-white border border-[#E3E7EE] shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                {T("cli.74")}
              </span>
              <span className="text-xs font-bold text-[#0F172A] tracking-wide font-mono">
                {T("cli.37", { v0: toAr(PAY.paidPct) })}
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#0F172A] font-ibm">
              {formatNumber(PAY.paid)} <span className="text-sm font-bold text-[#EEF1F5]/80">{currencySymbol()}</span>
            </div>
            {/* Horizontal progress bar */}
            <ProgressBar value={PAY.paidPct} />
            <p className="text-[11px] text-[#475569] font-medium">
              {T("cli.75")}
            </p>
          </div>

          {/* Metric 3: Next Due Payment (Highlighted with Sage Theme) */}
          <div className="p-5 rounded-xl bg-[#0F172A] text-white border border-[#1C2540] shadow-sm space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider">
                  {T("cli.76")}
                </span>
                <span className="text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded-full border border-white/20">
                  {T("cli.77")}
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black font-ibm mt-1">
                {PAY.next ? formatNumber(PAY.next.amount) : "٠"} <span className="text-sm font-bold opacity-80">{currencySymbol()}</span>
              </div>
              <p className="text-[11px] mt-1">
                {PAY.next ? `${D("تستحق في")} ${formatDateAr(PAY.next.dueIso)}` : D("لا توجد دفعات مستحقة")}
              </p>
            </div>

            <button
              onClick={() => setPaymentModalOpen(true)}
              className="w-full py-2.5 px-4 rounded-lg text-xs sm:text-sm font-bold bg-white text-[#0F172A] hover:bg-[#EEF1F5] active:scale-98 transition-all shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>{T("cli.78")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Photo Preview Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setActivePhoto(null)}
        >
          <div
           
            className="bg-white rounded-lg shadow-2xl border border-[#E3E7EE] max-w-xl w-full overflow-hidden border border-[#E3E7EE] text-start animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Placeholder Frame */}
            <div
              className={`h-64 sm:h-80 bg-gradient-to-br ${activePhoto.bgGradient} flex flex-col items-center justify-center relative p-6`}
            >
              <div className="w-16 h-16 rounded-xl bg-white/95 text-[#0F172A] flex items-center justify-center shadow-lg">
                <Camera className="w-8 h-8" />
              </div>
              <span className="mt-4 px-4 py-1 rounded-full text-xs font-extrabold bg-[#0F172A] text-white shadow-sm">
                {E(activePhoto.category)}
              </span>

              <button
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 end-4 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-[#475569] flex items-center justify-center font-bold text-sm shadow-md"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0F172A]">
                  {T("cli.79", { v0: activePhoto.date })}
                </span>
                <span className="text-xs text-[#475569]">
                  {T("cli.80", { v0: activePhoto.photographer })}
                </span>
              </div>

              <h3 className="text-lg font-black text-[#0F172A]">
                {activePhoto.title}
              </h3>

              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed bg-[#F4F6F9] p-4 rounded-lg border border-[#EEF1F5]">
                {activePhoto.description}
              </p>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => toggleLike(activePhoto.id)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    likedPhotos[activePhoto.id]
                      ? "bg-rose-50 text-rose-600 border border-rose-200"
                      : "bg-[#EEF1F5] text-[#475569] hover:bg-[#E3E7EE]"
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      likedPhotos[activePhoto.id] ? "fill-rose-600" : ""
                    }`}
                  />
                  <span>
                    {likedPhotos[activePhoto.id]
                      ? "تم الإعجاب بالصورة"
                      : D("أعجبني")}
                  </span>
                </button>

                <button
                  onClick={() => setActivePhoto(null)}
                  className="px-5 py-2 rounded-lg text-xs font-medium text-white bg-[#0F172A] hover:bg-[#0F172A] hover:bg-[#0F172A] transition-colors shadow-sm"
                >
                  {T("cli.81")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Details Modal */}
      {paymentModalOpen && (
        <div
          className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setPaymentModalOpen(false)}
        >
          <div
           
            className="bg-white rounded-lg shadow-2xl border border-[#E3E7EE] max-w-lg w-full overflow-hidden border border-[#E3E7EE] text-start animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-[#EEF1F5] bg-[#F4F6F9]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#EEF1F5] text-[#0F172A] flex items-center justify-center font-bold">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#0F172A]">
                    {T("cli.82")}
                  </h3>
                  <p className="text-xs text-[#475569]">
                    {T("cli.83")}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setPaymentModalOpen(false)}
                className="w-8 h-8 rounded-lg text-[#475569] hover:text-[#475569] hover:bg-[#E3E7EE] flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs sm:text-sm">
              <div className="p-4 rounded-lg bg-[#F4F6F9] border border-[#E3E7EE] flex items-center justify-between">
                <div>
                  <span className="text-[#475569] text-xs block">{T("cli.84")}</span>
                  <span className="text-2xl font-black text-[#0F172A] font-ibm">
                    {PAY.next ? formatNumber(PAY.next.amount) : "٠"} {currencySymbol()}
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-[#0F172A] border border-[#E3E7EE] shadow-xs">
                  تستحق: {PAY.next ? formatMonthYearAr(PAY.next.dueIso) : "—"}
                </span>
              </div>

              {/* Bank Transfer Details */}
              <div className="space-y-2 p-4 rounded-lg bg-[#F4F6F9] border border-[#E3E7EE]">
                <h4 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider">
                  {T("cli.85")}
                </h4>
                <div className="space-y-1 text-xs text-[#475569] font-medium">
                  <p>{T("cli.86")} <strong className="text-[#0F172A]">{T("cli.87")}</strong></p>
                  <p>{T("cli.88")} <strong className="text-[#0F172A]">{T("cli.89")}</strong></p>
                  <p>{T("cli.90")} <strong className="text-[#0F172A] font-mono">EG4200100003000001234567890</strong></p>
                  <p>{T("cli.91")} <strong className="text-[#0F172A] font-mono">{T("cli.92")}</strong></p>
                </div>
              </div>

              {transferConfirmed ? (
                <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-300 text-center space-y-1">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="font-black text-emerald-900 text-sm">
                    {T("cli.93")}
                  </p>
                  <p className="text-xs text-emerald-700">
                    {T("cli.94")}
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-2.5 pt-2">
                  <button
                    onClick={() => setTransferConfirmed(true)}
                    className="flex-1 py-3 rounded-lg text-xs sm:text-sm font-medium text-white bg-[#0F172A] hover:bg-[#0F172A] hover:bg-[#0F172A] active:scale-95 transition-all shadow-sm"
                  >
                    {T("cli.95")}
                  </button>
                  <button
                    onClick={() => setPaymentModalOpen(false)}
                    className="px-4 py-3 rounded-lg text-xs sm:text-sm font-bold text-[#475569] bg-[#EEF1F5] hover:bg-[#E3E7EE]"
                  >
                    {T("cli.96")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default ClientPortal;
