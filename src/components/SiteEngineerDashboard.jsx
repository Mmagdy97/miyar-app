import { expensesStore } from "../data/stores";
import { ENGINEER_CASH, personById, projectById, formatNumber } from "../data/seed";
import { useState } from "react";
import ProgressBar from "./ProgressBar";
import {
  HardHat,
  Camera,
  CheckCircle2,
  Users,
  MapPin,
  Calendar,
  Sun,
  Plus,
  Minus,
  Send,
  Image as ImageIcon,
  DollarSign,
  AlertTriangle,
  Clock,
  Sparkles,
  Check,
  Building,
  UploadCloud,
  ChevronDown,
  Trash2,
  CheckCircle,
} from "lucide-react";

const WEATHER_OPTIONS = [
  { id: "sunny", label: "☀️ مشمس ومستقر" },
  { id: "hot", label: "🌡️ حار - تشغيل مبردات" },
  { id: "windy", label: "💨 رياح وغبار خفيف" },
  { id: "smooth", label: "🟢 العمل يسير بدون عوائق" },
];

const INITIAL_WORKS_CHECKLIST = [
  { id: 1, text: "استكمال شبكة مواسير التغذية والصرف بالبدروم", done: true },
  { id: 2, text: "استلام شحنة أسمنت العزل وتشوينها في المخزن الداخلي", done: true },
  { id: 3, text: "مطابقة مناسيب أرضيات الرخام في بهو المدخل مع المخطط", done: false },
  { id: 4, text: "عزل جدران خزان المياه الأرضي بالبيتومين المطاطي", done: false },
];

function SiteEngineerDashboard({ setActionItems }) {
  // Labor count state (mobile tap-friendly +/-)
  const [labor, setLabor] = useState({
    plumbers: 2,
    helpers: 3,
    tilers: 4,
    electricians: 2,
  });

  const [weatherSelected, setWeatherSelected] = useState("sunny");
  const [worksChecklist, setWorksChecklist] = useState(INITIAL_WORKS_CHECKLIST);
  const [customNotes, setCustomNotes] = useState(
    "تم فحص ضغط شبكة التغذية على ٨ بار لمدة ساعتين بحضور مندوب الشركة الموردة، وتم توثيق شهادة الاختبار بنجاح."
  );

  // Mock Uploaded Photos
  const [photos, setPhotos] = useState([
    {
      id: 1,
      name: "تمديدات_صرف_البدروم_اختبار_الضغط.jpg",
      time: "١٠:١٥ ص",
      size: "٢.٤ ميجابايت",
    },
    {
      id: 2,
      name: "تشوين_أسمنت_المقاوم_المخزن.jpg",
      time: "١١:٢٥ ص",
      size: "١.٨ ميجابايت",
    },
  ]);

  // Temporary 3-second success message
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [pettyCashModalOpen, setPettyCashModalOpen] = useState(false);
  const [pettyCashSuccess, setPettyCashSuccess] = useState(false);

  // Petty Cash Form State
  const [cashAmount, setCashAmount] = useState("1200");
  const [cashCategory, setCashCategory] = useState("نقل وتشوين خامات");
  const [cashNotes, setCashNotes] = useState("نولون سيارة نصف نقل لنقل خامات العزل عاجلاً");

  const todayArabic = new Intl.DateTimeFormat("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  const handleLaborChange = (key, delta) => {
    setLabor((prev) => ({
      ...prev,
      [key]: Math.max(0, prev[key] + delta),
    }));
  };

  const toggleChecklist = (id) => {
    setWorksChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  };

  const handleMockAddPhoto = () => {
    const newId = photos.length + 1;
    setPhotos((prev) => [
      ...prev,
      {
        id: newId,
        name: `لقطة_ميدانية_جديدة_رقم_${newId}.jpg`,
        time: "الآن",
        size: "٣.١ ميجابايت",
      },
    ]);
  };

  const handleRemovePhoto = (id) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const totalWorkers =
    labor.plumbers + labor.helpers + labor.tilers + labor.electricians;

  // Requirement 3: Engineer Submit Daily Report
  const handleSubmitReport = (e) => {
    e.preventDefault();

    // Add new action item to shared state targeting Admin role
    const newReportItem = {
      id: Date.now(),
      title: "تقرير يومي جديد: فيلا الياسمين",
      subtitle: `حضور ${totalWorkers} عمال بالموقع • ${worksChecklist.filter((w) => w.done).length} مهام منجزة • ${photos.length} صور توثيقية`,
      user: eng.displayName,
      project: proj.name,
      category: "تقرير يومي",
      amount: "اعتماد فني",
      timestamp: "الآن",
      time: "الآن",
      targetRole: "Admin",
      type: "report",
      status: "pending",
    };

    if (setActionItems) {
      setActionItems((prev) => [newReportItem, ...prev]);
    }

    // Clear the text areas
    setCustomNotes("");

    // Show temporary success message for 3 seconds
    setToastMessage("تم إرسال التقرير للإدارة بنجاح ✔️");
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Engineer Submit Petty Cash Settlement
  const handlePettyCashSubmit = (e) => {
    e.preventDefault();
    const amountNum = Number(cashAmount);
    if (!(amountNum > 0)) return;

    // Demo session = the engineer assigned to the client's project (single source: seed)
    const cashRow = ENGINEER_CASH.find((c) => c.projectId === 1) || ENGINEER_CASH[0];
    const eng = personById(cashRow.engineerId);
    const proj = projectById(cashRow.projectId);

    expensesStore.set((prev) => [
      {
        id: Date.now(),
        engId: cashRow.id,
        engName: `${eng.displayName} (${proj.name})`,
        description: cashNotes || "طلب تسوية عهدة ميدانية",
        amount: amountNum,
        date: "الآن",
        category: cashCategory,
        receiptNumber: `REC-${String(Date.now()).slice(-4)}`,
        invoiceImg: "",
      },
      ...prev,
    ]);

    const newExpenseItem = {
      id: Date.now(),
      title: `تصفية عهدة (${cashCategory})`,
      subtitle: cashNotes || "طلب تسوية عهدة ميدانية طارئة",
      user: "م. محمد (الموقع)",
      project: "فيلا الياسمين - التجمع",
      category: "تسوية عهدة",
      amount: `${formatNumber(amountNum)} ج.م`,
      timestamp: "الآن",
      time: "الآن",
      targetRole: "Admin",
      type: "expense",
      status: "pending",
    };

    if (setActionItems) {
      setActionItems((prev) => [newExpenseItem, ...prev]);
    }

    setPettyCashSuccess(true);
    setTimeout(() => {
      setPettyCashSuccess(false);
      setPettyCashModalOpen(false);
      setToastMessage("تم إرسال طلب تسوية العهدة للإدارة بنجاح ✔️");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1200);
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent min-h-screen w-full max-w-full overflow-x-hidden">
      {/* Constrain layout to a mobile/tablet-friendly container */}
      <div className="max-w-2xl mx-auto space-y-5 pb-12">
        {/* Temporary Success Toast Message (Auto-hides after 3 seconds) */}
        {showToast && (
          <div className="sticky top-4 z-40 p-4 rounded-lg bg-emerald-700 text-white shadow-xl shadow-emerald-600/25 border border-emerald-500 animate-in fade-in slide-in-from-top-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 font-black text-sm">
              <CheckCircle className="w-5 h-5 text-emerald-200 shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <span className="text-xs bg-emerald-700/80 px-2 py-0.5 rounded-full font-bold">
              مباشر الآن
            </span>
          </div>
        )}

        {/* 1. Header & Quick Actions */}
        <div className="bg-white rounded-lg border border-[#DDE1E5] p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#ECEEF0]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-[#2B3138] hover:bg-[#1E2429] text-white flex items-center justify-center shadow-xs">
                <HardHat className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-black text-[#1E2429] tracking-tight">
                    مرحباً يا هندسة، محمد
                  </h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ECEEF0] text-[#1E2429] border border-[#DDE1E5]">
                    ميداني
                  </span>
                </div>
                <p className="text-xs text-[#5A646E] mt-0.5 flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-[#5A646E]" />
                  <span>{todayArabic}</span>
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F3F4F6] border border-[#DDE1E5] text-xs text-[#5A646E] font-semibold">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>٢٦° م القاهرة</span>
            </div>
          </div>

          {/* Two Large Primary Action Buttons Side-by-Side */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            {/* Button A: Add Daily Report */}
            <a
              href="#daily-form"
              className="flex items-center justify-center gap-2 p-3 sm:p-3.5 rounded-xl text-xs sm:text-sm font-extrabold text-white bg-[#2B3138] hover:bg-[#1E2429] transition-colors shadow-sm active:scale-[0.98] transition-all text-center"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>+ إضافة تقرير يومي</span>
            </a>

            {/* Button B: Settle Petty Cash */}
            <button
              onClick={() => setPettyCashModalOpen(true)}
              className="flex items-center justify-center gap-2 p-3 sm:p-3.5 rounded-lg text-xs sm:text-sm font-extrabold text-[#5A646E] bg-white border border-[#DDE1E5] hover:bg-[#F3F4F6] hover:border-[#D9480F] shadow-xs active:scale-[0.98] transition-all text-center"
            >
              <DollarSign className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>💸 تسوية عهدة</span>
            </button>
          </div>
        </div>

        {/* 2. Active Sites (مواقع العمل الحالية) */}
        <div className="bg-white rounded-lg border border-[#DDE1E5] p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5A646E] uppercase tracking-wider flex items-center gap-1.5">
              <Building className="w-4 h-4 text-[#5A646E]" />
              موقع العمل المسند لك اليوم
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              موقعك الحالي
            </span>
          </div>

          {/* Project Card */}
          <div className="p-4 rounded-lg bg-[#F3F4F6] border border-[#DDE1E5]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-black text-[#1E2429] leading-snug">
                  فيلا الياسمين - التجمع الخامس
                </h2>
                <p className="text-xs text-[#5A646E] mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>حي النرجس، قطعة ٤٢، بجوار كمبوند الدبلوماسيين</span>
                </p>
              </div>

              <div className="text-end shrink-0">
                <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-[#ECEEF0] text-[#1E2429] border border-[#DDE1E5] inline-block">
                  مرحلة التأسيس (MEP)
                </span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="mt-4 pt-3 border-t border-[#DDE1E5] flex items-center justify-between text-xs text-[#5A646E] font-medium">
              <span>نسبة تقدم المشروع: <strong className="text-xs font-bold text-[#1E2429] tracking-wide font-mono">٧٨٪</strong></span>
              <span className="text-[#5A646E]">الاستشاري: <strong className="text-[#1E2429]">م. طارق يوسف</strong></span>
            </div>

            {/* Progress bar */}
            <ProgressBar value={78} />
          </div>
        </div>

        {/* 3. Daily Report Quick Form (نموذج التقرير السريع) */}
        <form
          id="daily-form"
          onSubmit={handleSubmitReport}
          className="bg-white rounded-lg border border-[#DDE1E5] p-5 sm:p-6 shadow-xs space-y-6"
        >
          <div className="border-b border-[#ECEEF0] pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2B3138]" />
              <h2 className="text-base sm:text-lg font-black text-[#1E2429]">
                نموذج التقرير اليومي السريع
              </h2>
            </div>
            <p className="text-xs text-[#5A646E] mt-0.5">
              سجل حالة الموقع اليومية والعمالة والأعمال المنفذة فوراً من الهاتف
            </p>
          </div>

          {/* Section A: حالة الطقس والعوائق */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold text-[#5A646E] uppercase tracking-wider">
              حالة الطقس والعوائق الميدانية
            </label>
            <div className="grid grid-cols-2 gap-2">
              {WEATHER_OPTIONS.map((opt) => {
                const isSelected = weatherSelected === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setWeatherSelected(opt.id)}
                    className={`px-3 py-2.5 rounded-lg text-xs font-bold border transition-all text-start flex items-center justify-between ${
                      isSelected
                        ? "bg-[#ECEEF0] border-[#2B3138] text-[#1E2429] shadow-xs"
                        : "bg-white border-[#DDE1E5] text-[#5A646E] hover:bg-[#F3F4F6]"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-[#1E2429] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section B: العمالة اليوم (Labor Counters) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#5A646E] uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#5A646E]" />
                حصر العمالة المتواجدة اليوم
              </label>
              <span className="text-xs font-black text-[#1E2429] bg-[#ECEEF0] px-2.5 py-0.5 rounded-lg border border-[#DDE1E5]">
                إجمالي: {totalWorkers} عمال
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {/* Plumbers */}
              <div className="p-3 rounded-lg bg-[#F3F4F6] border border-[#DDE1E5] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#1E2429] block">سباك / صحي</span>
                  <span className="text-[11px] text-[#5A646E]">شبكة التغذية</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleLaborChange("plumbers", -1)}
                    className="w-7 h-7 rounded-lg bg-white border border-[#DDE1E5] text-[#5A646E] flex items-center justify-center hover:bg-[#ECEEF0] active:scale-95 text-xs font-bold"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-6 text-center font-extrabold text-[#1E2429] text-sm">
                    {labor.plumbers}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleLaborChange("plumbers", 1)}
                    className="w-7 h-7 rounded-lg bg-[#2B3138] text-white flex items-center justify-center hover:bg-[#1E2429] active:scale-95 text-xs font-bold shadow-xs"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Helpers / Cleaning */}
              <div className="p-3 rounded-lg bg-[#F3F4F6] border border-[#DDE1E5] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#1E2429] block">عمال نظافة وتشوين</span>
                  <span className="text-[11px] text-[#5A646E]">مساعدون</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleLaborChange("helpers", -1)}
                    className="w-7 h-7 rounded-lg bg-white border border-[#DDE1E5] text-[#5A646E] flex items-center justify-center hover:bg-[#ECEEF0] active:scale-95 text-xs font-bold"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-6 text-center font-extrabold text-[#1E2429] text-sm">
                    {labor.helpers}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleLaborChange("helpers", 1)}
                    className="w-7 h-7 rounded-lg bg-[#2B3138] text-white flex items-center justify-center hover:bg-[#1E2429] active:scale-95 text-xs font-bold shadow-xs"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Tilers */}
              <div className="p-3 rounded-lg bg-[#F3F4F6] border border-[#DDE1E5] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#1E2429] block">مبلط رخام وسيراميك</span>
                  <span className="text-[11px] text-[#5A646E]">الأرضيات</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleLaborChange("tilers", -1)}
                    className="w-7 h-7 rounded-lg bg-white border border-[#DDE1E5] text-[#5A646E] flex items-center justify-center hover:bg-[#ECEEF0] active:scale-95 text-xs font-bold"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-6 text-center font-extrabold text-[#1E2429] text-sm">
                    {labor.tilers}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleLaborChange("tilers", 1)}
                    className="w-7 h-7 rounded-lg bg-[#2B3138] text-white flex items-center justify-center hover:bg-[#1E2429] active:scale-95 text-xs font-bold shadow-xs"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Electricians */}
              <div className="p-3 rounded-lg bg-[#F3F4F6] border border-[#DDE1E5] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#1E2429] block">كهربائي تمديدات</span>
                  <span className="text-[11px] text-[#5A646E]">سحب أسلاك</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleLaborChange("electricians", -1)}
                    className="w-7 h-7 rounded-lg bg-white border border-[#DDE1E5] text-[#5A646E] flex items-center justify-center hover:bg-[#ECEEF0] active:scale-95 text-xs font-bold"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-6 text-center font-extrabold text-[#1E2429] text-sm">
                    {labor.electricians}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleLaborChange("electricians", 1)}
                    className="w-7 h-7 rounded-lg bg-[#2B3138] text-white flex items-center justify-center hover:bg-[#1E2429] active:scale-95 text-xs font-bold shadow-xs"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section C: الأعمال المنجزة (Completed Works Checklist & Notes) */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-[#5A646E] uppercase tracking-wider">
              الأعمال المنجزة والمهام الفنية اليوم
            </label>

            {/* Checklist items */}
            <div className="space-y-2">
              {worksChecklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklist(item.id)}
                  className={`p-3 rounded-lg border flex items-center gap-3 cursor-pointer select-none transition-all ${
                    item.done
                      ? "bg-[#ECEEF0] border-[#CBD0D6] text-[#1E2429] font-semibold"
                      : "bg-white border-[#DDE1E5] text-[#5A646E] hover:bg-[#F3F4F6]"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                      item.done
                        ? "bg-[#2B3138] text-white"
                        : "border border-[#CBD0D6] bg-white"
                    }`}
                  >
                    {item.done && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <span className="text-xs sm:text-sm leading-snug">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Textarea for additional notes */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-[#5A646E] mb-1">
                ملاحظات وتوجيهات هندسية إضافية:
              </label>
              <textarea
                rows={3}
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="اكتب ملاحظات الموقع والتوجيهات الفنية أو استلامات الاستشاري..."
                className="w-full p-3 rounded-lg border border-[#DDE1E5] focus:outline-none focus:ring-2 focus:ring-[#2B3138]/10 focus:border-[#2B3138] text-xs sm:text-sm text-[#1E2429] leading-relaxed placeholder:text-[#5A646E]"
              />
            </div>
          </div>

          {/* Section D: التوثيق البصري (Visual Documentation) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#5A646E] uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-[#5A646E]" />
                التوثيق البصري وصور الموقع
              </label>
              <span className="text-xs text-[#5A646E] font-medium">
                {photos.length} صور ملتقطة
              </span>
            </div>

            {/* Tap/Drop Upload Zone */}
            <div
              onClick={handleMockAddPhoto}
              className="border-2 border-dashed border-[#CBD0D6] hover:border-[#2B3138] bg-[#F3F4F6] hover:bg-[#ECEEF0] rounded-lg p-5 text-center cursor-pointer transition-all active:scale-[0.99] group"
            >
              <div className="w-12 h-12 rounded-lg bg-[#ECEEF0] group-hover:bg-[#DDE1E5] text-[#1E2429] flex items-center justify-center mx-auto mb-2 transition-colors">
                <Camera className="w-6 h-6" />
              </div>
              <p className="text-xs sm:text-sm font-black text-[#1E2429]">
                التقط أو ارفع صور الموقع هنا
              </p>
              <p className="text-[11px] text-[#5A646E] mt-1">
                اضغط لتشغيل كاميرا الهاتف أو اختيار لقطات من المعرض (JPG / PNG)
              </p>
            </div>

            {/* Attached Photos List */}
            {photos.length > 0 && (
              <div className="space-y-2 pt-1">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-[#F3F4F6] border border-[#DDE1E5] text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[#DDE1E5] text-[#5A646E] flex items-center justify-center shrink-0">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-[#1E2429] truncate">
                          {photo.name}
                        </p>
                        <p className="text-[10px] text-[#5A646E]">
                          {photo.time} • {photo.size}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(photo.id)}
                      className="text-[#5A646E] hover:text-rose-600 p-1.5 transition-colors"
                      title="حذف الصورة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Full-Width Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 p-4 rounded-xl text-sm font-black text-white bg-[#2B3138] hover:bg-[#1E2429] shadow-sm active:scale-[0.98] transition-all cursor-pointer"
            >
              <Send className="w-4 h-4 shrink-0" />
              <span>إرسال التقرير للمدير التنفيذي</span>
            </button>
            <p className="text-center text-[11px] text-[#5A646E] mt-2 font-medium">
              سيتم إشعار الإدارة فوراً وإضافة التقرير لمركز المهام العاجلة
            </p>
          </div>
        </form>
      </div>

      {/* Petty Cash Settlement Modal */}
      {pettyCashModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E2429]/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-2xl border border-[#DDE1E5] max-w-md w-full p-6 md:p-8 text-start space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#ECEEF0]">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-[#ECEEF0] text-[#1E2429] flex items-center justify-center font-bold">
                  💸
                </span>
                <h3 className="text-base font-black text-[#1E2429]">
                  تسوية عهدة الموقع
                </h3>
              </div>
              <button
                onClick={() => setPettyCashModalOpen(false)}
                className="text-[#5A646E] hover:text-[#1E2429] text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {pettyCashSuccess ? (
              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-center py-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <p className="font-black text-emerald-900 text-sm">
                  تم تقديم طلب تسوية العهدة بنجاح!
                </p>
                <p className="text-xs text-emerald-700 mt-1">
                  تمت إضافتها في مركز اعتمادات المدير بلحظية "الآن".
                </p>
              </div>
            ) : (
              <form onSubmit={handlePettyCashSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#5A646E] mb-1">
                    المبلغ المنصرف (ج.م)
                  </label>
                  <input
                    type="number"
                    value={cashAmount}
                    onChange={(e) => setCashAmount(e.target.value)}
                    required
                    className="w-full p-3 rounded-lg border border-[#DDE1E5] focus:outline-none focus:ring-2 focus:ring-1 focus:ring-[#2B3138] focus:border-[#2B3138] text-sm font-bold text-[#1E2429]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5A646E] mb-1">
                    بند الصرف
                  </label>
                  <select
                    value={cashCategory}
                    onChange={(e) => setCashCategory(e.target.value)}
                    className="w-full p-3 rounded-lg border border-[#DDE1E5] focus:outline-none focus:ring-2 focus:ring-1 focus:ring-[#2B3138] focus:border-[#2B3138] text-sm font-bold text-[#1E2429] bg-white"
                  >
                    <option value="نقل وتشوين خامات">نقل وتشوين خامات</option>
                    <option value="شراء عدد وأدوات طارئة">شراء عدد وأدوات طارئة</option>
                    <option value="يوميات عمالة إضافية">يوميات عمالة إضافية</option>
                    <option value="ضيافة واستقبال عميل">ضيافة واستقبال عميل</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5A646E] mb-1">
                    ملاحظات الفاتورة أو إيصال الصرف
                  </label>
                  <textarea
                    rows={2}
                    value={cashNotes}
                    onChange={(e) => setCashNotes(e.target.value)}
                    className="w-full p-3 rounded-lg border border-[#DDE1E5] focus:outline-none focus:ring-2 focus:ring-1 focus:ring-[#2B3138] focus:border-[#2B3138] text-xs text-[#1E2429]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl text-xs sm:text-sm font-black text-white bg-[#2B3138] hover:bg-[#1E2429] active:scale-95 transition-all shadow-sm"
                  >
                    إرسال طلب التسوية
                  </button>
                  <button
                    type="button"
                    onClick={() => setPettyCashModalOpen(false)}
                    className="px-4 py-3 rounded-lg text-xs sm:text-sm font-bold text-[#5A646E] bg-[#ECEEF0] hover:bg-[#DDE1E5] text-[#5A646E]"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default SiteEngineerDashboard;
