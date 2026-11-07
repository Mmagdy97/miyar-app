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

// Project Phases Stepper Data
const PROJECT_PHASES = [
  {
    id: 1,
    title: "التصميم والمخططات",
    subtitle: "المخططات الهندسية والمود بورد ثلاثي الأبعاد",
    status: "completed",
    date: "١٥ أغسطس ٢٠٢٦",
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
    date: "٢٤ نوفمبر ٢٠٢٦",
    badge: "المرحلة الحالية",
  },
  {
    id: 4,
    title: "الفرش والتسليم النهائي",
    subtitle: "المطابخ والأثاث المخصص والفحص الشامل واستلام المفتاح",
    status: "pending",
    date: "١٥ يناير ٢٠٢٧",
    badge: "قيد الانتظار",
  },
];

// High-end Instagram-style site gallery photos
const SITE_UPDATES = [
  {
    id: 1,
    title: "تركيب رخام الكلكتا الإيطالي بهو المدخل",
    date: "٦ نوفمبر ٢٠٢٦",
    category: "رخام مستورد",
    description: "مطابقة عروق الرخام بنمط Bookmatched مع فواصل إيبوكسي شفافة مقاومة لامتصاص الرطوبة.",
    photographer: "م. كريم مصطفى (الموقع)",
    bgGradient: "from-amber-100 via-[#EFEEE8] to-amber-50",
    likes: 12,
  },
  {
    id: 2,
    title: "تأسيس شبكة الكهرباء الذكية والتحكم الصوتي",
    date: "٥ نوفمبر ٢٠٢٦",
    category: "سمارت هوم KNX",
    description: "تمديد مسارات كابلات التحكم المركزي بالمكيفات والستائر والإضاءة المعمارية المحيطية.",
    photographer: "م. طارق يوسف (MEP)",
    bgGradient: "from-[#EFEEE8] via-[#E5E6DF] to-[#F5F3ED]",
    likes: 9,
  },
  {
    id: 3,
    title: "معاينة تجليد خشب الجوز الأمريكي لغرفة المعيشة",
    date: "٤ نوفمبر ٢٠٢٦",
    category: "نجارة وديكور",
    description: "استلام شرائح قشرة خشب الجوز الطبيعي بدهانات بولي يوريثان مط ضد الخدش والأتربة.",
    photographer: "سارة عامر (كبير المعماريين)",
    bgGradient: "from-amber-200 via-orange-100 to-[#E5E6DF]",
    likes: 15,
  },
  {
    id: 4,
    title: "تجهيز مساحات الإضاءة المخفية والأسقف الجبسية",
    date: "٢ نوفمبر ٢٠٢٦",
    category: "أسقف وجبس بورد",
    description: "تشكيل بروفايلات الليد المنحنية بالريسبشن وفقاً للرسومات التنفيذية المعمارية.",
    photographer: "م. كريم مصطفى (الموقع)",
    bgGradient: "from-[#F5F3ED] via-[#EFEEE8] to-[#F5F3ED]",
    likes: 8,
  },
];

function ClientPortal({ actionItems = [], setActionItems, setSelectedItem }) {
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
          : "العميل طلب بديلاً لعينة رخام Crema Marfil";

      const newActionItem = {
        id: Date.now(),
        title: decisionTitle,
        subtitle:
          decision === "approved"
            ? "اعتمد أ. محمد عينة رخام الأرضيات الإسباني، جاهز للتوريد والتركيب."
            : "طلب أ. محمد توفير بديل بلون أفتح أو عروق رخام بيج كلاسيكي.",
        user: "أ. محمد (العميل)",
        project: "فيلا الياسمين - التجمع",
        category: "اعتماد عميل",
        amount: decision === "approved" ? "معتمد ✓" : "طلب بديل",
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
      <div className="relative rounded-2xl p-6 sm:p-8 md:p-10 bg-[#183C35] text-white shadow-sm border border-[#14322c] overflow-hidden">
        {/* Subtle Ambient Glows */}
        

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          {/* Right text in RTL */}
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20 inline-flex items-center gap-1.5 backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-white" />
                جناح العميل الخاص • Private Client Suite
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-[#EFEEE8] border border-white/15">
                كود المشروع: YAS-2026
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
              مرحباً بك في مشروعك، أ. محمد
            </h1>

            <div className="flex items-center gap-2.5 flex-wrap pt-1">
              <span className="text-lg sm:text-xl font-bold text-white">
                فيلا الياسمين - التجمع الخامس
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-white/10 text-[#C5A36B] border border-white/20">
                مرحلة التشطيبات والديكور
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#EFEEE8] leading-relaxed pt-1 flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                حي النرجس، قطعة ٤٢
              </span>
              <span>•</span>
              <span>المساحة: ٦٥٠ م²</span>
              <span>•</span>
              <span>الطراز: نيوكلاسيك معاصر</span>
              <span>•</span>
              <span>الاستشاري: م. طارق يوسف</span>
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
                    <stop offset="0%" stopColor="#5D8C70" />
                    <stop offset="100%" stopColor="#C5A36B" />
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
                  strokeDashoffset="62.8" /* 75% complete */
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-white leading-none">
                  ٧٥٪
                </span>
                <span className="text-[10px] text-[#EFEEE8] font-medium mt-0.5">
                  مكتمل
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-[#C5A36B] block">
                إنجاز كلي للمشروع
              </span>
              <p className="text-sm font-extrabold text-white">
                ٧٥٪ إنجاز كلي
              </p>
              <p className="text-[11px] text-[#EFEEE8]/80">
                التسليم النهائي المستهدف: يناير ٢٠٢٧
              </p>
              <div className="flex items-center gap-1.5 pt-1 text-[11px] text-[#C5A36B] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>الجدول الزمني متقدم بيومين</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. The Visual Timeline (الجدول الزمني المرئي للمشروع) */}
      <div className="bg-white rounded-lg border border-[#E5E6DF] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-[#EFEEE8]">
          <div>
            <h2 className="text-lg font-black text-[#202923] flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#202923]" />
              الجدول الزمني لمراحل مشروعك
            </h2>
            <p className="text-xs text-[#526257] mt-0.5">
              تتبع رحلة تحويل المخطط الهندسي إلى منزلك الفاخر خطوة بخطوة
            </p>
          </div>
          <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-[#EFEEE8] text-[#202923] border border-[#E5E6DF] self-start sm:self-auto">
            المرحلة الحالية: ٣ من ٤
          </span>
        </div>

        {/* Horizontal Timeline Stepper */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative">
          {PROJECT_PHASES.map((phase, index) => {
            const isCompleted = phase.status === "completed";
            const isActive = phase.status === "active";
            const isPending = phase.status === "pending";

            return (
              <div
                key={phase.id}
                className={`rounded-lg p-4 sm:p-5 border transition-all duration-300 relative flex flex-col justify-between ${
                  isActive
                    ? "bg-[#F5F3ED] border-[#D5D8D0] ring-1 ring-[#183C35]/10 shadow-xs"
                    : isCompleted
                    ? "bg-white border-[#E5E6DF] hover:bg-[#F5F3ED]/50"
                    : "bg-[#F5F3ED] border-[#E5E6DF] opacity-80"
                }`}
              >
                {/* Stepper Header with Icon & Step Number */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-extrabold text-[#526257] font-mono">
                      المرحلة ٠{phase.id}
                    </span>

                    {/* Status Pill */}
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                        isCompleted
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                          : isActive
                          ? "bg-[#183C35] text-white border-[#14322c]"
                          : "bg-[#EFEEE8] text-[#526257] border-[#E5E6DF]"
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
                          ? "bg-[#183C35] text-white"
                          : "bg-[#E5E6DF] text-[#526257]"
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

                    <h3 className="text-sm font-black text-[#202923] leading-snug">
                      {phase.title}
                    </h3>
                  </div>

                  <p className="text-xs text-[#526257] leading-relaxed mt-1">
                    {phase.subtitle}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-[#EFEEE8] flex items-center justify-between text-[11px]">
                  <span className="text-[#526257] font-medium">التاريخ:</span>
                  <span
                    className={`font-bold ${
                      isActive ? "text-[#202923] font-bold" : "text-[#526257]"
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
      <div className="bg-white rounded-lg border border-[#E5E6DF] p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[#EFEEE8]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#EFEEE8] text-[#202923] border border-[#E5E6DF] flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#202923]">
                اعتمادات وموافقات مطلوبة منك
              </h2>
              <p className="text-xs text-[#526257] mt-0.5">
                مشاركتك في اختيار اللمسات النهائية لضمان مطابقة الذوق الرفيع
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 self-start sm:self-auto">
            مطلوب رأيك اليوم
          </span>
        </div>

        {/* Approval Item Card */}
        <div className="bg-[#F5F3ED]/50 rounded-lg p-5 border border-[#E5E6DF] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                عينة رخام الأرضيات
              </span>
              <span className="text-xs text-[#526257]">استقبال وصالون الفيلا</span>
            </div>

            <h3 className="text-base font-black text-[#202923]">
              اعتماد عينة رخام الأرضيات (Crema Marfil إسباني فرز أول)
            </h3>

            <p className="text-xs text-[#526257] leading-relaxed">
              عينة حجرية طبيعية مصقولة مقاس ٨٠×٨٠ سم مستوردة من إسبانيا مع لمسة دافئة تعكس الإنارة النهارية بشكل مثالي. تم توفير لوحين في الموقع لمعاينتك على الطبيعة.
            </p>

            <div className="flex items-center gap-4 text-xs text-[#526257] pt-1 font-medium">
              <span>المورد: رخام إسبانيا الدولي</span>
              <span>•</span>
              <span>السماكة: ٢٠ مم معالجة ضد التبقع</span>
            </div>
          </div>

          {/* Interactive Decision Action Buttons */}
          <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-2.5 min-w-[200px]">
            {approvalsState.marble === "pending" ? (
              <>
                <button
                  onClick={() => handleClientApproval("marble", "approved")}
                  className="px-5 py-3 rounded-lg text-xs sm:text-sm font-medium text-white bg-[#183C35] hover:bg-[#202923] hover:bg-[#202923] shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>موافقة واعتماد العينة</span>
                </button>

                <button
                  onClick={() => handleClientApproval("marble", "rejected")}
                  className="px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold text-[#526257] bg-white border border-[#E5E6DF] hover:bg-[#EFEEE8] hover:text-rose-700 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>طلب عينة بديلة</span>
                </button>
              </>
            ) : approvalsState.marble === "approved" ? (
              <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-300 text-center space-y-1">
                <span className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  تم اعتماد العينة بنجاح
                </span>
                <p className="text-[11px] text-emerald-700">
                  تم إشعار المكتب الفني لبدء التوريد والتركيب
                </p>
                <button
                  onClick={() => handleClientApproval("marble", "pending")}
                  className="text-[10px] text-[#526257] hover:text-[#526257] underline font-medium pt-1"
                >
                  تغيير الرأي
                </button>
              </div>
            ) : (
              <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-300 text-center space-y-1">
                <span className="inline-flex items-center gap-1.5 text-xs font-black text-rose-800">
                  <X className="w-4 h-4 text-rose-600" />
                  تم طلب عينة رخام بديلة
                </span>
                <p className="text-[11px] text-rose-700">
                  سيقوم مهندس الديكور بتحضير كتالوج رخام بديل
                </p>
                <button
                  onClick={() => handleClientApproval("marble", "pending")}
                  className="text-[10px] text-[#526257] hover:text-[#526257] underline font-medium pt-1"
                >
                  تراجع
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Latest Site Updates (آخر تحديثات الموقع الميدانية - Instagram Style) */}
      <div className="bg-white rounded-lg border border-[#E5E6DF] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[#EFEEE8]">
          <div>
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-[#202923]" />
              <h2 className="text-lg font-black text-[#202923]">
                آخر تحديثات الموقع الميدانية
              </h2>
            </div>
            <p className="text-xs text-[#526257] mt-0.5">
              صور وتوثيق حي من مهندسي الموقع للأعمال المنفذة هذا الأسبوع
            </p>
          </div>

          <span className="text-xs font-bold text-[#202923] bg-[#EFEEE8] px-3 py-1 rounded-full border border-[#E5E6DF] self-start sm:self-auto">
            محدث اليوم • ٤ لقطات جديدة
          </span>
        </div>

        {/* Gallery Grid (3-4 High-End Photo Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SITE_UPDATES.map((photo) => {
            const isLiked = likedPhotos[photo.id];

            return (
              <div
                key={photo.id}
                onClick={() => setActivePhoto(photo)}
                className="group bg-white rounded-lg border border-[#E5E6DF] overflow-hidden shadow-xs hover:shadow-xl hover:border-[#5D8C70] transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                {/* Photo Preview Container (Mimicking high-end architectural photo) */}
                <div
                  className={`relative h-48 bg-gradient-to-br ${photo.bgGradient} flex flex-col items-center justify-center p-4 overflow-hidden group-hover:scale-[1.02] transition-transform duration-500`}
                >
                  {/* Subtle architectural grid pattern */}
                  <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px]" />

                  {/* Camera icon badge */}
                  <div className="w-12 h-12 rounded-lg bg-white/90 backdrop-blur-xs text-[#202923] flex items-center justify-center shadow-md shadow-stone-900/10 group-hover:scale-110 transition-transform">
                    <Camera className="w-6 h-6" />
                  </div>

                  <span className="text-xs font-extrabold text-[#202923] bg-white/95 px-3 py-1 rounded-full shadow-xs mt-3 backdrop-blur-sm">
                    {photo.category}
                  </span>

                  {/* Top Heart and Date Badge */}
                  <div className="absolute top-3 right-3 left-3 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#526257] bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-md">
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
                          : "bg-white/80 text-[#526257] hover:text-rose-600"
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
                    <h3 className="text-xs sm:text-sm font-black text-[#202923] leading-snug group-hover:text-[#202923] transition-colors line-clamp-2">
                      {photo.title}
                    </h3>
                    <p className="text-[11px] text-[#526257] mt-1 line-clamp-2 leading-relaxed">
                      {photo.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#EFEEE8] flex items-center justify-between text-[10px] text-[#526257]">
                    <span className="truncate max-w-[140px]">
                      بواسطة: {photo.photographer}
                    </span>
                    <span className="font-bold text-[#202923] flex items-center gap-1 group-hover:underline">
                      معاينة <Eye className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Financial Overview (الملخص المالي المبسط للعميل) */}
      <div className="bg-white rounded-lg border border-[#E5E6DF] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[#EFEEE8]">
          <div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#202923]" />
              <h2 className="text-lg font-black text-[#202923]">
                الملخص المالي المبسط لمشروعك
              </h2>
            </div>
            <p className="text-xs text-[#526257] mt-0.5">
              متابعة دفعات العقد المعتمدة بدون تعقيدات محاسبية
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              ٦٠٪ مسدد من إجمالي العقد
            </span>
          </div>
        </div>

        {/* 3 Metric Cards + Highlighted Next Due Payment */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Metric 1: Total Contract */}
          <div className="p-5 rounded-lg bg-[#F5F3ED] border border-[#E5E6DF] space-y-2">
            <span className="text-xs font-bold text-[#526257] uppercase tracking-wider">
              إجمالي قيمة العقد
            </span>
            <div className="text-2xl sm:text-3xl font-black text-[#202923] font-ibm">
              ٢,٥٠٠,٠٠٠ <span className="text-sm font-bold text-[#526257]">ج.م</span>
            </div>
            <p className="text-[11px] text-[#526257]">
              شامل كافة بنود التوريدات وأعمال الديكور
            </p>
          </div>

          {/* Metric 2: Total Paid */}
          <div className="p-5 rounded-2xl bg-white border border-[#E5E6DF] shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#202923] uppercase tracking-wider">
                إجمالي المدفوع حتى الآن
              </span>
              <span className="text-xs font-bold text-[#202923] tracking-wide font-mono">
                ٦٠٪
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#202923] font-ibm">
              ١,٥٠٠,٠٠٠ <span className="text-sm font-bold text-[#EFEEE8]/80">ج.م</span>
            </div>
            {/* Horizontal progress bar */}
            <ProgressBar value={60} />
            <p className="text-[11px] text-[#526257] font-medium">
              تم سداد الدفعة الأولى والثانية بنجاح
            </p>
          </div>

          {/* Metric 3: Next Due Payment (Highlighted with Sage Theme) */}
          <div className="p-5 rounded-xl bg-[#183C35] text-white border border-[#14322c] shadow-sm space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span style={{ color: '#EFEEE8' }} className="text-xs font-bold uppercase tracking-wider">
                  الدفعة المستحقة القادمة
                </span>
                <span style={{ color: '#FFFFFF' }} className="text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded-full border border-white/20">
                  دفعة التشطيبات
                </span>
              </div>
              <div style={{ color: '#FFFFFF' }} className="text-2xl sm:text-3xl font-black font-ibm mt-1">
                ٥٠٠,٠٠٠ <span style={{ color: '#EFEEE8' }} className="text-sm font-bold opacity-80">ج.م</span>
              </div>
              <p style={{ color: '#EFEEE8' }} className="text-[11px] mt-1">
                تستحق بعد اعتماد بند رخام الأرضيات
              </p>
            </div>

            <button
              onClick={() => setPaymentModalOpen(true)}
              className="w-full py-2.5 px-4 rounded-lg text-xs sm:text-sm font-bold bg-white text-[#183C35] hover:bg-[#EFEEE8] active:scale-98 transition-all shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>تفاصيل الدفعة والتحويل</span>
            </button>
          </div>
        </div>
      </div>

      {/* Photo Preview Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 bg-[#202923]/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setActivePhoto(null)}
        >
          <div
            dir="rtl"
            className="bg-white rounded-lg shadow-2xl border border-[#E5E6DF] max-w-xl w-full overflow-hidden border border-[#E5E6DF] text-right animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Placeholder Frame */}
            <div
              className={`h-64 sm:h-80 bg-gradient-to-br ${activePhoto.bgGradient} flex flex-col items-center justify-center relative p-6`}
            >
              <div className="w-16 h-16 rounded-xl bg-white/95 text-[#202923] flex items-center justify-center shadow-lg">
                <Camera className="w-8 h-8" />
              </div>
              <span className="mt-4 px-4 py-1 rounded-full text-xs font-extrabold bg-[#183C35] text-white shadow-sm">
                {activePhoto.category}
              </span>

              <button
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-[#526257] flex items-center justify-center font-bold text-sm shadow-md"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#202923]">
                  تاريخ التوثيق: {activePhoto.date}
                </span>
                <span className="text-xs text-[#526257]">
                  الموثق: {activePhoto.photographer}
                </span>
              </div>

              <h3 className="text-lg font-black text-[#202923]">
                {activePhoto.title}
              </h3>

              <p className="text-xs sm:text-sm text-[#526257] leading-relaxed bg-[#F5F3ED] p-4 rounded-lg border border-[#EFEEE8]">
                {activePhoto.description}
              </p>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => toggleLike(activePhoto.id)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    likedPhotos[activePhoto.id]
                      ? "bg-rose-50 text-rose-600 border border-rose-200"
                      : "bg-[#EFEEE8] text-[#526257] hover:bg-[#E5E6DF]"
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
                      : "أعجبني"}
                  </span>
                </button>

                <button
                  onClick={() => setActivePhoto(null)}
                  className="px-5 py-2 rounded-lg text-xs font-medium text-white bg-[#183C35] hover:bg-[#202923] hover:bg-[#202923] transition-colors shadow-sm"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Details Modal */}
      {paymentModalOpen && (
        <div
          className="fixed inset-0 bg-[#202923]/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setPaymentModalOpen(false)}
        >
          <div
            dir="rtl"
            className="bg-white rounded-lg shadow-2xl border border-[#E5E6DF] max-w-lg w-full overflow-hidden border border-[#E5E6DF] text-right animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-[#EFEEE8] bg-[#F5F3ED]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#EFEEE8] text-[#202923] flex items-center justify-center font-bold">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#202923]">
                    بيانات سداد الدفعة القادمة
                  </h3>
                  <p className="text-xs text-[#526257]">
                    دفعة أعمال التشطيب والرخام (رقم ٣)
                  </p>
                </div>
              </div>

              <button
                onClick={() => setPaymentModalOpen(false)}
                className="w-8 h-8 rounded-lg text-[#526257] hover:text-[#526257] hover:bg-[#E5E6DF] flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs sm:text-sm">
              <div className="p-4 rounded-lg bg-[#F5F3ED] border border-[#E5E6DF] flex items-center justify-between">
                <div>
                  <span className="text-[#526257] text-xs block">المبلغ المطلوب سداده:</span>
                  <span className="text-2xl font-black text-[#202923] font-ibm">
                    ٥٠٠,٠٠٠ ج.م
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-[#202923] border border-[#E5E6DF] shadow-xs">
                  تستحق: نوفمبر ٢٠٢٦
                </span>
              </div>

              {/* Bank Transfer Details */}
              <div className="space-y-2 p-4 rounded-lg bg-[#F5F3ED] border border-[#E5E6DF]">
                <h4 className="font-bold text-[#202923] text-xs uppercase tracking-wider">
                  بيانات التحويل البنكي الرسمي للشركة:
                </h4>
                <div className="space-y-1 text-xs text-[#526257] font-medium">
                  <p>اسم البنك: <strong className="text-[#202923]">البنك التجاري الدولي (CIB - مصر)</strong></p>
                  <p>اسم الحساب: <strong className="text-[#202923]">شركة معيار للمقاولات والتصميم الداخلي</strong></p>
                  <p>رقم الآيبان (IBAN): <strong className="text-[#202923] font-mono">EG4200100003000001234567890</strong></p>
                  <p>رقم السجل التجاري: <strong className="text-[#202923] font-mono">١٨٤٥٢٩</strong></p>
                </div>
              </div>

              {transferConfirmed ? (
                <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-300 text-center space-y-1">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="font-black text-emerald-900 text-sm">
                    تم إرسال إشعار التحويل للإدارة المالية بنجاح!
                  </p>
                  <p className="text-xs text-emerald-700">
                    سيتم مراجعة الإيداع وإصدار السند الضريبي المعتمد فوراً.
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-2.5 pt-2">
                  <button
                    onClick={() => setTransferConfirmed(true)}
                    className="flex-1 py-3 rounded-lg text-xs sm:text-sm font-medium text-white bg-[#183C35] hover:bg-[#202923] hover:bg-[#202923] active:scale-95 transition-all shadow-sm"
                  >
                    تأكيد إتمام التحويل البنكي
                  </button>
                  <button
                    onClick={() => setPaymentModalOpen(false)}
                    className="px-4 py-3 rounded-lg text-xs sm:text-sm font-bold text-[#526257] bg-[#EFEEE8] hover:bg-[#E5E6DF]"
                  >
                    إلغاء
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
