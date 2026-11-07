import { useState } from "react";
import ProgressBar from "./ProgressBar";
import {
  TrendingUp,
  Wallet,
  AlertCircle,
  Banknote,
  Clock,
  CheckCircle2,
  XCircle,
  Building2,
  ArrowUpRight,
  ShieldAlert,
  ChevronLeft,
  Check,
  X,
  FileText,
  DollarSign,
  Package,
  Sparkles,
  Calendar,
  ClipboardCheck,
  Camera,
  Users,
} from "lucide-react";

// Team Members for each project with Arabic initials and roles
const TEAM_MEMBERS = {
  1: [
    { initials: "س.ع", name: "سارة عامر", role: "كبير المعماريين", bg: "bg-[#183C35]" },
    { initials: "ك.م", name: "كريم مصطفى", role: "مهندس الموقع", bg: "bg-[#183C35]" },
    { initials: "ط.ي", name: "طارق يوسف", role: "استشاري MEP", bg: "bg-[#5D8C70]" },
  ],
  2: [
    { initials: "م.ح", name: "محمد حسن", role: "مهندس مدني", bg: "bg-[#202923]" },
    { initials: "ل.ر", name: "ليلى رياض", role: "مصممة الديكور", bg: "bg-[#183C35]" },
  ],
  3: [
    { initials: "ن.ف", name: "نور فتحي", role: "مهندسة معمارية", bg: "bg-[#183C35]" },
    { initials: "ع.ع", name: "عمر عادل", role: "مسؤول المشتريات", bg: "bg-[#5D8C70]" },
  ],
  4: [
    { initials: "ي.م", name: "يوسف مدحت", role: "مشرف الموقع", bg: "bg-[#202923]" },
    { initials: "س.ك", name: "سلمى كمال", role: "مراقبة الجودة", bg: "bg-[#5D8C70]" },
  ],
};

const INITIAL_PROJECTS = [
  {
    id: 1,
    name: "فيلا الياسمين - التجمع الخامس",
    category: "سكني فاخر",
    client: "مجموعة العامر للاستثمار",
    phase: "التشطيب النهائي وأعمال MEP",
    phaseDetail: "تركيب الرخام المستورد والتكييف المركزي المخفي",
    progress: 78,
    status: "جاري العمل",
    dueDate: "٢٤ نوفمبر ٢٠٢٦",
    contractValue: "٢.٨٥ مليون ج.م",
  },
  {
    id: 2,
    name: "مقر إداري - الشيخ زايد",
    category: "مساحات عمل ومكاتب",
    client: "شركة نايل تك للبرمجيات",
    phase: "أعمال التأسيس والهيكل الداخلي",
    phaseDetail: "قواطع زجاجية عازلة وهياكل أسقف معلقة",
    progress: 42,
    status: "متأخر",
    dueDate: "١٥ ديسمبر ٢٠٢٦",
    contractValue: "٦.٥٠ مليون ج.م",
  },
  {
    id: 3,
    name: "دوبلكس نيو جيزة",
    category: "تجديد بنتهاوس كامل",
    client: "د. فاروق الشريف",
    phase: "أعمال النجارة والديكور",
    phaseDetail: "تجليد جدران خشب جوز طبيعي ومطابخ ألمانية",
    progress: 88,
    status: "جاري العمل",
    dueDate: "١٠ نوفمبر ٢٠٢٦",
    contractValue: "١.٤٠ مليون ج.م",
  },
  {
    id: 4,
    name: "شاليه مراسي 14B",
    category: "فيلا شاطئية ساحلية",
    client: "م. طارق عبد الرحمن",
    phase: "أعمال الرخام والتراصو",
    phaseDetail: "أرضيات تراصو خارجية وترافنتينو حمامات السباحة",
    progress: 60,
    status: "جاري العمل",
    dueDate: "٠٥ يناير ٢٠٢٧",
    contractValue: "٩٥٠ ألف ج.م",
  },
];

const MONTHLY_FINANCIALS = [
  { month: "يونيو", revenue: 580, expenses: 380, label: "٥٨٠ ألف / ٣٨٠ ألف" },
  { month: "يوليو", revenue: 720, expenses: 490, label: "٧٢٠ ألف / ٤٩٠ ألف" },
  { month: "أغسطس", revenue: 890, expenses: 540, label: "٨٩٠ ألف / ٥٤٠ ألف" },
  { month: "سبتمبر", revenue: 950, expenses: 620, label: "٩٥٠ ألف / ٦٢٠ ألف" },
  { month: "أكتوبر", revenue: 1120, expenses: 710, label: "١.١٢ مليون / ٧١٠ ألف" },
  { month: "نوفمبر", revenue: 1160, expenses: 680, label: "١.١٦ مليون / ٦٨٠ ألف" },
];

function AdminDashboard({ actionItems = [], setActionItems, setSelectedItem }) {
  const [timeframe, setTimeframe] = useState("6M");
  const [activeHoverBar, setActiveHoverBar] = useState(null);

  // Handle Approve / Reject / Undo on the shared state
  const handleAction = (id, newStatus) => {
    if (setActionItems) {
      setActionItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
    }
  };

  // Filter action items targeted to Admin
  const adminActionItems = actionItems.filter(
    (item) => !item.targetRole || item.targetRole === "Admin"
  );
  const pendingCount = adminActionItems.filter((a) => a.status === "pending").length;

  const todayArabic = new Intl.DateTimeFormat("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  const maxVal = Math.max(
    ...MONTHLY_FINANCIALS.map((m) => Math.max(m.revenue, m.expenses))
  );

  // Helper function to resolve icon and styling based on item type
  const getItemVisuals = (item) => {
    if (item.type === "report") {
      return {
        icon: ClipboardCheck,
        iconBg: "bg-[#EFEEE8] text-[#526257] border border-[#E5E6DF]",
      };
    }
    if (item.type === "expense") {
      return {
        icon: DollarSign,
        iconBg: "bg-amber-50 text-amber-800 border border-amber-200",
      };
    }
    if (item.type === "material") {
      return {
        icon: Package,
        iconBg: "bg-[#EFEEE8] text-[#202923] border border-[#E5E6DF]",
      };
    }
    return {
      icon: FileText,
      iconBg: "bg-[#EFEEE8] text-[#202923] border border-[#E5E6DF]",
    };
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-7 max-w-7xl mx-auto w-full">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-[#E5E6DF]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EFEEE8] text-[#202923] border border-[#E5E6DF] inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#526257]" />
              استوديو الإدارة التنفيذية
            </span>
            <span className="text-xs text-[#526257] font-semibold">استوديو القاهرة</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[#202923] mt-1.5">
            نظرة عامة على الأداء
          </h1>

          <p className="text-xs md:text-sm text-[#526257] mt-1 flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 font-semibold text-[#526257]">
              <Calendar className="w-3.5 h-3.5 text-[#526257]" />
              {todayArabic}
            </span>
            <span className="text-[#C5A36B]">•</span>
            <span className="text-[#526257]">
              متابعة مباشرة لـ <strong className="text-[#202923]">٤ مشاريع قيد التنفيذ</strong> في نطاق القاهرة الكبرى
            </span>
          </p>
        </div>

        {/* Studio Status Pill */}
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-[#E5E6DF] text-xs font-semibold text-[#526257] shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5A36B] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5D8C70]/150" />
            </span>
            <span>مزامنة مباشرة مع مواقع التنفيذ</span>
          </div>
        </div>
      </div>

      {/* 2. Advanced KPI Cards (The Grid of 4) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: الإيرادات المتوقعة */}
        <div className="bg-white border border-[#E5E6DF] rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[#526257] text-sm font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#183C35]" />
                الإيرادات المتوقعة
              </span>
              <span className="inline-flex items-center gap-0.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#27734E]/10 text-[#27734E]">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +١٤.٢٪
              </span>
            </div>

            <div className="mt-4">
              <span className="text-3xl font-bold tracking-tight text-[#202923] font-ibm">
                ٥.٤ مليون <span className="text-base font-medium text-[#526257]">ج.م</span>
              </span>
            </div>
            <p className="text-xs text-[#526257] mt-1">
              إجمالي القيمة التعاقدية لـ ٦ مشاريع
            </p>
          </div>

          {/* Sparkline */}
          <div className="mt-5 pt-3 border-t border-[#EFEEE8]">
            <div className="flex items-center justify-between text-xs text-[#526257] mb-1">
              <span>مسار النمو (آخر ٦ شهور)</span>
              <span className="text-[#27734E] font-bold">+٦٧٠ ألف ج.م</span>
            </div>
            <div className="h-10 w-full relative">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 30">
                <defs>
                  <linearGradient id="revGradAr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#183C35" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#183C35" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M0,26 Q20,24 35,18 T70,12 T100,4 L100,30 L0,30 Z" fill="url(#revGradAr)" />
                <path d="M0,26 Q20,24 35,18 T70,12 T100,4" fill="none" stroke="#183C35" strokeWidth="2" strokeLinecap="round" />
                <circle cx="100" cy="4" r="2.5" fill="#183C35" />
              </svg>
            </div>
          </div>
        </div>

        {/* KPI 2: إجمالي المحصل */}
        <div className="bg-white border border-[#E5E6DF] rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[#526257] text-sm font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#183C35]" />
                إجمالي المحصل
              </span>
              <span className="inline-flex items-center gap-0.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#27734E]/10 text-[#27734E]">
                ٥٩.٢٪
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-[#202923] font-ibm">
                ٣.٢ مليون <span className="text-base font-medium text-[#526257]">ج.م</span>
              </span>
            </div>
            <p className="text-xs text-[#526257] mt-1">
              مودعة بالحسابات البنكية للمكتب
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-[#EFEEE8]">
            <div className="flex items-center justify-between text-xs text-[#526257] mb-1">
              <span>سرعة التدفقات النقدية</span>
              <span className="text-[#202923] font-bold">٤٢٠ ألف ج.م/شهر</span>
            </div>
            <div className="h-10 w-full relative">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 30">
                <defs>
                  <linearGradient id="collGradAr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#183C35" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#183C35" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M0,28 Q25,26 45,19 T80,10 T100,6 L100,30 L0,30 Z" fill="url(#collGradAr)" />
                <path d="M0,28 Q25,26 45,19 T80,10 T100,6" fill="none" stroke="#183C35" strokeWidth="2" strokeLinecap="round" />
                <circle cx="100" cy="6" r="2.5" fill="#183C35" />
              </svg>
            </div>
          </div>
        </div>

        {/* KPI 3: مستحقات متأخرة */}
        <div className="bg-white border border-[#E5E6DF] rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[#526257] text-sm font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B83F3F]" />
                مستحقات متأخرة
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#B83F3F]/10 text-[#B83F3F]">
                متابعة عاجلة
              </span>
            </div>

            <div className="mt-4">
              <span className="text-3xl font-bold tracking-tight text-[#B83F3F] font-ibm">
                ١.١٤ مليون <span className="text-base font-medium text-[#526257]">ج.م</span>
              </span>
            </div>
            <p className="text-xs text-[#526257] mt-1">
              ٣ فواتير ومستخلصات تجاوزت موعد الاستحقاق
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-[#EFEEE8] space-y-2">
            <div className="flex items-center justify-between text-xs text-[#526257] font-medium">
              <span className="truncate">مستخلص فيلا الياسمين</span>
              <span className="shrink-0 text-xs font-bold text-[#B83F3F]">٥٨٠ ألف ج.م (٦٨٪)</span>
            </div>
            <ProgressBar value={68} customFillClass="bg-[#B83F3F]" />
            <p className="text-xs text-[#526257] font-medium">
              متوسط التأخير: ١٨ يوماً
            </p>
          </div>
        </div>

        {/* KPI 4: عهد مهندسين نشطة */}
        <div className="bg-white border border-[#E5E6DF] rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[#526257] text-sm font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#183C35]" />
                عهد مهندسين نشطة
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#C5A36B]/15 text-[#A76B20]">
                بالمواقع (٧٥٪)
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-[#202923] font-ibm">
                ٤٥,٠٠٠ <span className="text-base font-medium text-[#526257]">ج.م</span>
              </span>
            </div>
            <p className="text-xs text-[#526257] mt-1">
              في حوزة ٤ مهندسي مواقع للمشتريات
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-[#EFEEE8] space-y-2.5">
            <div className="flex items-center justify-between text-xs text-[#526257] font-medium">
              <span>نسبة استخدام سقف العهد</span>
              <span className="text-xs font-bold text-[#202923] font-mono">٧٥٪</span>
            </div>
            <ProgressBar value={75} customFillClass="bg-[#183C35]" />
            <div className="flex items-center justify-between text-xs text-[#526257] font-medium">
              <span>الحد الأقصى: ٦٠,٠٠٠ ج.م</span>
              <span className="text-[#27734E] font-bold">السيولة آمنة</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Financial Chart (التقرير المالي والتدفقات النقدية) */}
      <div className="bg-white rounded-xl border border-[#E5E6DF] shadow-sm p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-[#EFEEE8]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#202923]">
                التدفقات النقدية والأداء المالي
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#5D8C70]/15 text-[#183C35] border border-[#5D8C70]/30">
                هامش الربح التشغيلي: ٣٩.٤٪
              </span>
            </div>
            <p className="text-xs text-[#526257] mt-0.5">
              مقارنة شهرية بين المستخلصات المحصلة وتكاليف التشوين ومصروفات المواقع
            </p>
          </div>

          {/* Controls & Legend */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-4 text-xs font-medium text-[#526257]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#183C35]" />
                التدفقات الداخلة (الإيراد)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#E5E6DF]" />
                مصروفات المواقع
              </span>
            </div>

            <div className="inline-flex rounded-lg border border-[#E5E6DF] p-0.5 bg-[#F5F3ED] text-xs font-bold">
              <button
                onClick={() => setTimeframe("6M")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  timeframe === "6M"
                    ? "bg-[#183C35] text-white shadow-xs"
                    : "text-[#526257] hover:text-[#202923]"
                }`}
              >
                آخر ٦ شهور
              </button>
              <button
                onClick={() => setTimeframe("YTD")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  timeframe === "YTD"
                    ? "bg-[#183C35] text-white shadow-xs"
                    : "text-[#526257] hover:text-[#202923]"
                }`}
              >
                السنة بالكامل
              </button>
            </div>
          </div>
        </div>

        {/* Dual-bar Chart */}
        <div className="mt-6 pt-2">
          <div className="h-6 mb-2 flex items-center justify-start text-xs font-semibold">
            {activeHoverBar ? (
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#EFEEE8] border border-[#E5E6DF] text-[#202923] animate-in fade-in">
                <span>{activeHoverBar.month} ٢٠٢٦:</span>
                <span className="text-[#202923] font-bold">
                  إيراد: {activeHoverBar.revenue} ألف ج.م
                </span>
                <span className="text-[#526257]">|</span>
                <span className="text-[#526257]">
                  مصروف: {activeHoverBar.expenses} ألف ج.م
                </span>
                <span className="text-[#183C35]">
                  (صافي +{Math.round(((activeHoverBar.revenue - activeHoverBar.expenses) / activeHoverBar.revenue) * 100)}٪)
                </span>
              </span>
            ) : (
              <span className="text-[#526257] text-xs font-medium">
                مرر الفأرة فوق الأعمدة لعرض التفاصيل وصافي أرباح كل شهر
              </span>
            )}
          </div>

          <div className="grid grid-cols-6 gap-2 sm:gap-6 items-end h-52 border-b border-dashed border-[#E5E6DF] pb-3">
            {MONTHLY_FINANCIALS.map((item) => {
              const revPercent = Math.round((item.revenue / maxVal) * 100);
              const expPercent = Math.round((item.expenses / maxVal) * 100);

              return (
                <div
                  key={item.month}
                  onMouseEnter={() => setActiveHoverBar(item)}
                  onMouseLeave={() => setActiveHoverBar(null)}
                  className="flex flex-col items-center h-full justify-end group cursor-pointer"
                >
                  <div className="w-full flex items-end justify-center gap-1.5 sm:gap-2.5 h-full">
                    {/* Revenue Bar (Sage Green) */}
                    <div
                      className="w-1/2 max-w-[28px] rounded-t-md bg-[#183C35] group-hover:bg-[#202923] transition-all duration-300"
                      style={{ height: `${revPercent}%` }}
                    />
                    {/* Expense Bar */}
                    <div
                      className="w-1/2 max-w-[28px] rounded-t-md bg-[#E5E6DF] group-hover:bg-[#E5E6DF] transition-all duration-300"
                      style={{ height: `${expPercent}%` }}
                    />
                  </div>
                  <span className="mt-3 text-xs font-bold text-[#202923] group-hover:text-[#202923] transition-colors">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Bottom Summary Bar */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-xs text-[#526257] pt-1">
            <div className="flex items-center gap-6">
              <div>
                <span className="text-[#526257] block text-[11px] font-semibold">إجمالي إيراد ٦ أشهر</span>
                <span className="font-extrabold text-[#202923] text-sm">٥,٤٢٠,٠٠٠ ج.م</span>
              </div>
              <div className="h-6 w-px bg-[#E5E6DF]" />
              <div>
                <span className="text-[#526257] block text-[11px] font-semibold">تكاليف التشوين والمواقع</span>
                <span className="font-extrabold text-[#202923] text-sm">٣,٤٢٠,٠٠٠ ج.م</span>
              </div>
              <div className="h-6 w-px bg-[#E5E6DF]" />
              <div>
                <span className="text-[#526257] block text-[11px] font-semibold">صافي أرباح المقاولات</span>
                <span className="font-extrabold text-[#183C35] text-sm">+٢,٠٠٠,٠٠٠ ج.م</span>
              </div>
            </div>

            <span className="text-[11px] text-[#526257] font-medium">
              البيانات مطابقة لسجلات الفواتير الإلكترونية المعتمدة
            </span>
          </div>
        </div>
      </div>

      {/* 4. Split Layout (Projects Health vs Action Center) */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column: حالة المشاريع (Projects Health) */}
        <div className="bg-white rounded-xl border border-[#E5E6DF] shadow-[0_8px_30px_rgba(45,36,34,0.04)] overflow-hidden flex flex-col justify-between flex-1">
          <div>
            <div className="p-5 border-b border-[#EFEEE8] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-[#202923] flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#202923]" />
                    حالة المشاريع والتنفيذ
                  </h2>
                </div>
                <p className="text-xs text-[#526257] mt-0.5">
                  نسب الإنجاز الميداني ومراحل التصميم والمهندسون المشرفون
                </p>
              </div>

              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#EFEEE8] text-[#202923] border border-[#E5E6DF]">
                {INITIAL_PROJECTS.length} مواقع قيد العمل
              </span>
            </div>

            <div className="divide-y divide-[#EFEEE8]">
              {INITIAL_PROJECTS.map((project) => {
                const isOnTrack = project.status === "جاري العمل";
                const team = TEAM_MEMBERS[project.id] || [];

                return (
                  <div
                    key={project.id}
                    className="p-5 hover:bg-[#F5F3ED]/70 transition-all duration-200 group"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-bold text-[#202923] group-hover:text-[#202923] transition-colors">
                            {project.name}
                          </h3>
                          <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#EFEEE8] text-[#202923] font-semibold border border-[#E5E6DF]">
                            {project.category}
                          </span>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                              isOnTrack
                                ? "bg-[#5D8C70]/15 text-[#183C35] border-[#5D8C70]/30"
                                : "bg-rose-50 text-rose-700 border-rose-200"
                            }`}
                          >
                            {isOnTrack ? (
                              <CheckCircle2 className="w-3 h-3 ml-1 text-[#5D8C70]" />
                            ) : (
                              <ShieldAlert className="w-3 h-3 ml-1 text-rose-600" />
                            )}
                            {project.status}
                          </span>
                        </div>

                        <p className="text-xs text-[#526257] mt-1">
                          العميل: <span className="text-[#202923] font-bold">{project.client}</span> • القيمة التعاقدية: <span className="text-[#202923] font-extrabold">{project.contractValue}</span>
                        </p>
                      </div>

                      {/* Overlapping Team Avatars */}
                      <div className="flex items-center shrink-0">
                        <div className="flex items-center -space-x-2 space-x-reverse overflow-hidden">
                          {team.map((member, i) => (
                            <div
                              key={i}
                              title={`${member.name} (${member.role})`}
                              className={`w-7 h-7 rounded-full ${member.bg} text-white font-extrabold text-[10px] flex items-center justify-center border-2 border-white shadow-xs cursor-pointer hover:scale-110 hover:z-10 transition-transform`}
                            >
                              {member.initials}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar with Sage Green Fill */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-1.5 font-semibold">
                        <span className="text-[#526257]">
                          المرحلة: <span className="text-[#202923] font-bold">{project.phase}</span>
                        </span>
                        <span className="text-xs font-bold text-[#202923] tracking-wide font-mono">
                          {project.progress}٪ مكتمل
                        </span>
                      </div>

                      <ProgressBar
                        value={project.progress}
                        isWarning={!isOnTrack}
                      />
                    </div>

                    <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#526257]">
                      <span className="truncate max-w-[260px] text-[#526257]">
                        {project.phaseDetail}
                      </span>
                      <span className="shrink-0 font-bold text-[#526257]">
                        التسليم: {project.dueDate}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-4 bg-[#F5F3ED]/70 border-t border-[#EFEEE8] flex items-center justify-between text-xs">
            <span className="text-[#526257] font-medium">
              جميع الأعمال متوافقة مع الكود الهندسي المصري ٢٠٢٦
            </span>
            <button className="font-bold text-[#202923] hover:text-amber-800 inline-flex items-center gap-1 transition-colors">
              عرض سجل المشاريع
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Action Center (المهام والاعتمادات العاجلة) - Clickable Items & Modal */}
        <div className="bg-white rounded-xl border border-[#E5E6DF] shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-[#EFEEE8] flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#202923] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-[#202923]" />
                  المهام والاعتمادات العاجلة
                </h2>
                <p className="text-xs text-[#526257] mt-0.5">
                  اضغط على أي عنصر لعرض التفاصيل والصور الميدانية
                </p>
              </div>

              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                  pendingCount > 0
                    ? "bg-[#EFEEE8] text-[#202923] border-[#E5E6DF]"
                    : "bg-[#EFEEE8] text-[#526257] border-[#E5E6DF]"
                }`}
              >
                {pendingCount} قيد الانتظار
              </span>
            </div>

            {/* Dynamic Map over actionItems Prop with Clickable Rows */}
            <div className="p-4 space-y-3.5 max-h-[580px] overflow-y-auto">
              {adminActionItems.length === 0 ? (
                <div className="text-center py-12 text-[#526257]">
                  <ClipboardCheck className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-bold">لا توجد مهام معلقة حالياً</p>
                </div>
              ) : (
                adminActionItems.map((item) => {
                  const visuals = getItemVisuals(item);
                  const ItemIcon = visuals.icon;
                  const isPending = item.status === "pending";
                  const isJustNow =
                    item.timestamp === "الآن" || item.time === "الآن";

                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className={`rounded-xl p-4 border transition-all duration-200 relative cursor-pointer hover:bg-[#F5F3ED] ${
                        isJustNow && isPending
                          ? "bg-[#F5F3ED] border-[#D5D8D0] ring-1 ring-[#183C35]/10 shadow-xs"
                          : isPending
                          ? "bg-white border-[#E5E6DF] hover:border-[#5D8C70] hover:shadow-xs hover:-translate-y-0.5"
                          : "bg-[#F5F3ED]/60 border-[#E5E6DF] opacity-90"
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${visuals.iconBg}`}
                        >
                          <ItemIcon className="w-4 h-4" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-bold text-[#526257] uppercase tracking-wider">
                                {item.category || "إشعار"} • {item.project || "الموقع"}
                              </span>

                              {/* Subtle badge if timestamp is "الآن" */}
                              {isJustNow && isPending && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#5D8C70]/15 text-[#183C35] border border-[#5D8C70]/30">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#183C35]" />
                                  جديد الآن
                                </span>
                              )}
                            </div>

                            <span className="text-[11px] font-bold text-[#526257] shrink-0">
                              {item.timestamp || item.time}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-2 mt-1">
                            <h4 className="text-sm font-bold text-[#202923] leading-snug">
                              {item.title}
                            </h4>
                            {item.amount && (
                              <span className="text-xs font-bold text-[#202923] shrink-0 bg-[#EFEEE8] px-2.5 py-0.5 rounded-lg border border-[#E5E6DF] font-mono">
                                {item.amount}
                              </span>
                            )}
                          </div>

                          {item.subtitle && (
                            <p className="text-xs text-[#526257] mt-1 leading-relaxed">
                              {item.subtitle}
                            </p>
                          )}

                          <div className="mt-2 text-[11px] text-[#526257] font-medium">
                            المصدر:{" "}
                            <span className="text-[#202923] font-bold">
                              {item.user || item.submitter}
                            </span>
                            <span className="text-[#202923] mr-2 font-bold hover:underline">
                              (اضغط لعرض التفاصيل والصور)
                            </span>
                          </div>

                          {/* Interactive Action Buttons */}
                          <div className="mt-3.5 pt-3 border-t border-[#EFEEE8] flex items-center justify-between">
                            {isPending ? (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAction(item.id, "approved");
                                  }}
                                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium text-white bg-[#183C35] hover:bg-[#202923] hover:bg-[#202923] transition-colors shadow-sm cursor-pointer"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  اعتماد
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAction(item.id, "rejected");
                                  }}
                                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-[#526257] bg-white border border-[#E5E6DF] hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 active:scale-95 transition-all"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  رفض
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between w-full">
                                <span
                                  className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${
                                    item.status === "approved"
                                      ? "text-[#183C35] bg-[#5D8C70]/15 border border-[#5D8C70]/30"
                                      : "text-rose-800 bg-rose-50 border border-rose-200"
                                  }`}
                                >
                                  {item.status === "approved" ? (
                                    <>
                                      <CheckCircle2 className="w-3.5 h-3.5 text-[#5D8C70]" />
                                      تم الاعتماد والموافقة
                                    </>
                                  ) : (
                                    <>
                                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                                      تم الرفض والإعادة
                                    </>
                                  )}
                                </span>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAction(item.id, "pending");
                                  }}
                                  className="text-[11px] font-bold text-[#526257] hover:text-[#526257] underline"
                                >
                                  تراجع
                                </button>
                              </div>
                            )}

                            {isPending && (
                              <span className="text-[11px] text-[#526257] hidden sm:inline font-medium">
                                يتطلب مراجعة الشريك
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="p-4 bg-[#F5F3ED]/70 border-t border-[#EFEEE8] flex items-center justify-between text-xs text-[#526257] font-medium">
            <span>تسجيل وتوثيق كافة العمليات في السجل الرقابي للمكتب</span>
            <span className="font-bold text-[#526257]">محدث الآن</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
