import DashHero from "./DashHero";
import { valueMoment } from "../lib/nudge";
import { currencySymbol, intlLocale } from "../i18n";
import { localize, D, DF } from "../data/dataI18n";
import { tr_ as T } from "../i18n";
import { expensesStore } from "../data/stores";
import { ENGINEER_CASH, personById, projectById, formatNumber } from "../data/seed";
import { useState } from "react";
import ProgressBar from "./ProgressBar";
import {
  Camera,
  CheckCircle2,
  Users,
  MapPin,
  Plus,
  Minus,
  Send,
  Image as ImageIcon,
  DollarSign,
  Check,
  Building,
  Trash2,
  CheckCircle,
  Wallet,
} from "lucide-react";

const WEATHER_OPTIONS = localize([
  { id: "sunny", label: D("☀️ مشمس ومستقر") },
  { id: "hot", label: D("🌡️ حار - تشغيل مبردات") },
  { id: "windy", label: D("💨 رياح وغبار خفيف") },
  { id: "smooth", label: D("🟢 العمل يسير بدون عوائق") },
]);

const INITIAL_WORKS_CHECKLIST = localize([
  { id: 1, text: D("استكمال شبكة مواسير التغذية والصرف بالبدروم"), done: true },
  { id: 2, text: D("استلام شحنة أسمنت العزل وتشوينها في المخزن الداخلي"), done: true },
  { id: 3, text: D("مطابقة مناسيب أرضيات الرخام في بهو المدخل مع المخطط"), done: false },
  { id: 4, text: D("عزل جدران خزان المياه الأرضي بالبيتومين المطاطي"), done: false },
]);

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
  const [customNotes, setCustomNotes] = useState("تم فحص ضغط شبكة التغذية على ٨ بار لمدة ساعتين بحضور مندوب الشركة الموردة، وتم توثيق شهادة الاختبار بنجاح."
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

  const todayArabic = new Intl.DateTimeFormat(intlLocale(), {
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
        name: DF("لقطة_ميدانية_جديدة_رقم_{0}.jpg", newId),
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

  // Demo session = the engineer assigned to the client's project (single source: seed)
  const cashRow = ENGINEER_CASH.find((c) => c.projectId === 1) || ENGINEER_CASH[0];
  const eng = personById(cashRow.engineerId);
  const proj = projectById(cashRow.projectId);

  // Requirement 3: Engineer Submit Daily Report
  const handleSubmitReport = (e) => {
    e.preventDefault();

    // Add new action item to shared state targeting Admin role
    const newReportItem = {
      id: Date.now(),
      title: "تقرير يومي جديد: فيلا الياسمين",
      subtitle: DF("حضور {0} عمال بالموقع • {1} مهام منجزة • {2} صور توثيقية", totalWorkers, worksChecklist.filter((w) => w.done).length, photos.length),
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

    valueMoment("report");
    // Clear the text areas
    setCustomNotes("");

    // Show temporary success message for 3 seconds
    setToastMessage(D("تم إرسال التقرير للإدارة بنجاح ✔️"));
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


    expensesStore.set((prev) => [
      {
        id: Date.now(),
        engId: cashRow.id,
        engName: `${eng.displayName} (${proj.name})`,
        description: cashNotes || D("طلب تسوية عهدة ميدانية"),
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
      title: DF("تصفية عهدة ({0})", cashCategory),
      subtitle: cashNotes || D("طلب تسوية عهدة ميدانية طارئة"),
      user: "م. محمد (الموقع)",
      project: D("فيلا الياسمين - التجمع"),
      category: "تسوية عهدة",
      amount: `${formatNumber(amountNum)} ${currencySymbol()}`,
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
      setToastMessage(D("تم إرسال طلب تسوية العهدة للإدارة بنجاح ✔️"));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1200);
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent min-h-screen w-full max-w-full overflow-x-hidden">
      {/* Constrain layout to a mobile/tablet-friendly container */}
      <div className="max-w-2xl lg:max-w-6xl mx-auto space-y-5 pb-12">
        {/* Temporary Success Toast Message (Auto-hides after 3 seconds) */}
        {showToast && (
          <div className="sticky top-4 z-40 p-4 rounded-lg bg-emerald-700 text-white shadow-xl shadow-emerald-600/25 border border-emerald-500 animate-in fade-in slide-in-from-top-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 font-semibold text-sm">
              <CheckCircle className="w-5 h-5 text-emerald-200 shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <span className="text-xs bg-emerald-700/80 px-2 py-0.5 rounded-full font-bold">
              {T("se.1")}
            </span>
          </div>
        )}

        {/* 1. Hero */}
        <DashHero img="site" kicker={todayArabic} title={T("se.2")} sub={T("se.4")} />
        <div className="bg-white rounded-lg border border-[#DCE4DC] p-5 shadow-xs">
          {/* Two Large Primary Action Buttons Side-by-Side */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            {/* Button A: Add Daily Report */}
            <a
              href="#daily-form"
              className="flex items-center justify-center gap-2 p-3 sm:p-3.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#5F6C61] hover:bg-[#5F6C61] transition-colors shadow-sm active:scale-[0.98] transition-all text-center"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>{T("se.5")}</span>
            </a>

            {/* Button B: Settle Petty Cash */}
            <button
              onClick={() => setPettyCashModalOpen(true)}
              className="flex items-center justify-center gap-2 p-3 sm:p-3.5 rounded-lg text-xs sm:text-sm font-semibold text-[#56635B] bg-white border border-[#DCE4DC] hover:bg-[#F2F5F1] hover:border-[#5F6C61] shadow-xs active:scale-[0.98] transition-all text-center"
            >
              <DollarSign className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{T("se.6")}</span>
            </button>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-6 lg:items-start space-y-5 lg:space-y-0">
        <div className="lg:col-span-5 lg:sticky lg:top-24">
        {/* 2. Active Sites (مواقع العمل الحالية) */}
        <div className="bg-white rounded-lg border border-[#DCE4DC] p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#56635B] uppercase tracking-wider flex items-center gap-1.5">
              <Building className="w-4 h-4 text-[#56635B]" />
              {T("se.7")}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {T("se.8")}
            </span>
          </div>

          {/* Project Card */}
          <div className="p-4 rounded-lg bg-[#F2F5F1] border border-[#DCE4DC]">
            <div className="flex flex-col-reverse sm:flex-row items-start sm:justify-between gap-2 sm:gap-3">
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-semibold text-[#1F2A26] leading-snug">
                  {T("se.9")}
                </h2>
                <p className="text-xs text-[#56635B] mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>{T("se.10")}</span>
                </p>
              </div>

              <div className="text-end shrink-0">
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#E8EFE9] text-[#1F2A26] border border-[#DCE4DC] inline-block">
                  {T("se.11")}
                </span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="mt-4 pt-3 border-t border-[#DCE4DC] flex items-center justify-between text-xs text-[#56635B] font-medium">
              <span>{T("se.12")} <strong className="text-xs font-bold text-[#1F2A26] tracking-wide font-mono">{D("٧٨٪")}</strong></span>
              <span className="text-[#56635B]">{T("se.14")} <strong className="text-[#1F2A26]">{T("se.15")}</strong></span>
            </div>

            {/* Progress bar */}
            <ProgressBar value={78} />
          </div>
        </div>

        </div>
        <div className="lg:col-span-7">
        {/* 3. Daily Report Quick Form (نموذج التقرير السريع) */}
        <form
          id="daily-form"
          onSubmit={handleSubmitReport}
          className="bg-white rounded-lg border border-[#DCE4DC] p-5 sm:p-6 shadow-xs space-y-6"
        >
          <div className="border-b border-[#E8EFE9] pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#5F6C61]" />
              <h2 className="text-base sm:text-lg font-semibold text-[#1F2A26]">
                {T("se.16")}
              </h2>
            </div>
            <p className="text-xs text-[#56635B] mt-0.5">
              {T("se.17")}
            </p>
          </div>

          {/* Section A: حالة الطقس والعوائق */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold text-[#56635B] uppercase tracking-wider">
              {T("se.18")}
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
                        ? "bg-[#E8EFE9] border-[#5F6C61] text-[#1F2A26] shadow-xs"
                        : "bg-white border-[#DCE4DC] text-[#56635B] hover:bg-[#F2F5F1]"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-[#1F2A26] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section B: العمالة اليوم (Labor Counters) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#56635B] uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#56635B]" />
                {T("se.19")}
              </label>
              <span className="text-xs font-semibold text-[#1F2A26] bg-[#E8EFE9] px-2.5 py-0.5 rounded-lg border border-[#DCE4DC]">
                {T("se.20", { v0: totalWorkers })}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {/* Plumbers */}
              <div className="p-3 rounded-lg bg-[#F2F5F1] border border-[#DCE4DC] flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="text-xs font-bold text-[#1F2A26] block">{T("se.21")}</span>
                  <span className="text-[11px] text-[#56635B]">{T("se.22")}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleLaborChange("plumbers", -1)}
                    className="w-7 h-7 rounded-lg bg-white border border-[#DCE4DC] text-[#56635B] flex items-center justify-center hover:bg-[#E8EFE9] active:scale-95 text-xs font-bold"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-6 text-center font-semibold text-[#1F2A26] text-sm">
                    {labor.plumbers}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleLaborChange("plumbers", 1)}
                    className="w-7 h-7 rounded-lg bg-[#5F6C61] text-white flex items-center justify-center hover:bg-[#5F6C61] active:scale-95 text-xs font-bold shadow-xs"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Helpers / Cleaning */}
              <div className="p-3 rounded-lg bg-[#F2F5F1] border border-[#DCE4DC] flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="text-xs font-bold text-[#1F2A26] block">{T("se.23")}</span>
                  <span className="text-[11px] text-[#56635B]">{T("se.24")}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleLaborChange("helpers", -1)}
                    className="w-7 h-7 rounded-lg bg-white border border-[#DCE4DC] text-[#56635B] flex items-center justify-center hover:bg-[#E8EFE9] active:scale-95 text-xs font-bold"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-6 text-center font-semibold text-[#1F2A26] text-sm">
                    {labor.helpers}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleLaborChange("helpers", 1)}
                    className="w-7 h-7 rounded-lg bg-[#5F6C61] text-white flex items-center justify-center hover:bg-[#5F6C61] active:scale-95 text-xs font-bold shadow-xs"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Tilers */}
              <div className="p-3 rounded-lg bg-[#F2F5F1] border border-[#DCE4DC] flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="text-xs font-bold text-[#1F2A26] block">{T("se.25")}</span>
                  <span className="text-[11px] text-[#56635B]">{T("se.26")}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleLaborChange("tilers", -1)}
                    className="w-7 h-7 rounded-lg bg-white border border-[#DCE4DC] text-[#56635B] flex items-center justify-center hover:bg-[#E8EFE9] active:scale-95 text-xs font-bold"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-6 text-center font-semibold text-[#1F2A26] text-sm">
                    {labor.tilers}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleLaborChange("tilers", 1)}
                    className="w-7 h-7 rounded-lg bg-[#5F6C61] text-white flex items-center justify-center hover:bg-[#5F6C61] active:scale-95 text-xs font-bold shadow-xs"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Electricians */}
              <div className="p-3 rounded-lg bg-[#F2F5F1] border border-[#DCE4DC] flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="text-xs font-bold text-[#1F2A26] block">{T("se.27")}</span>
                  <span className="text-[11px] text-[#56635B]">{T("se.28")}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleLaborChange("electricians", -1)}
                    className="w-7 h-7 rounded-lg bg-white border border-[#DCE4DC] text-[#56635B] flex items-center justify-center hover:bg-[#E8EFE9] active:scale-95 text-xs font-bold"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-6 text-center font-semibold text-[#1F2A26] text-sm">
                    {labor.electricians}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleLaborChange("electricians", 1)}
                    className="w-7 h-7 rounded-lg bg-[#5F6C61] text-white flex items-center justify-center hover:bg-[#5F6C61] active:scale-95 text-xs font-bold shadow-xs"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section C: الأعمال المنجزة (Completed Works Checklist & Notes) */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-[#56635B] uppercase tracking-wider">
              {T("se.29")}
            </label>

            {/* Checklist items */}
            <div className="space-y-2">
              {worksChecklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklist(item.id)}
                  className={`p-3 rounded-lg border flex items-center gap-3 cursor-pointer select-none transition-all ${
                    item.done
                      ? "bg-[#E8EFE9] border-[#C6D0C6] text-[#1F2A26] font-semibold"
                      : "bg-white border-[#DCE4DC] text-[#56635B] hover:bg-[#F2F5F1]"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                      item.done
                        ? "bg-[#5F6C61] text-white"
                        : "border border-[#C6D0C6] bg-white"
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
              <label className="block text-xs font-bold text-[#56635B] mb-1">
                {T("se.30")}
              </label>
              <textarea
                rows={3}
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder={T("se.31")}
                className="w-full p-3 rounded-lg border border-[#DCE4DC] focus:outline-none focus:ring-2 focus:ring-[#5F6C61]/10 focus:border-[#5F6C61] text-xs sm:text-sm text-[#1F2A26] leading-relaxed placeholder:text-[#56635B]"
              />
            </div>
          </div>

          {/* Section D: التوثيق البصري (Visual Documentation) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#56635B] uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-[#56635B]" />
                {T("se.32")}
              </label>
              <span className="text-xs text-[#56635B] font-medium">
                {T("se.33", { v0: photos.length })}
              </span>
            </div>

            {/* Tap/Drop Upload Zone */}
            <div
              onClick={handleMockAddPhoto}
              className="border-2 border-dashed border-[#C6D0C6] hover:border-[#5F6C61] bg-[#F2F5F1] hover:bg-[#E8EFE9] rounded-lg p-5 text-center cursor-pointer transition-all active:scale-[0.99] group"
            >
              <div className="w-12 h-12 rounded-lg bg-[#E8EFE9] group-hover:bg-[#DCE4DC] text-[#1F2A26] flex items-center justify-center mx-auto mb-2 transition-colors">
                <Camera className="w-6 h-6" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-[#1F2A26]">
                {T("se.34")}
              </p>
              <p className="text-[11px] text-[#56635B] mt-1">
                {T("se.35")}
              </p>
            </div>

            {/* Attached Photos List */}
            {photos.length > 0 && (
              <div className="space-y-2 pt-1">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-[#F2F5F1] border border-[#DCE4DC] text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[#DCE4DC] text-[#56635B] flex items-center justify-center shrink-0">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-[#1F2A26] truncate">
                          {D(photo.name)}
                        </p>
                        <p className="text-[10px] text-[#56635B]">
                          {D(photo.time)} • {D(photo.size)}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(photo.id)}
                      className="text-[#56635B] hover:text-rose-600 p-1.5 transition-colors"
                      title={T("se.36")}
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
              className="w-full flex items-center justify-center gap-2 p-4 rounded-xl text-sm font-semibold text-white bg-[#5F6C61] hover:bg-[#5F6C61] shadow-sm active:scale-[0.98] transition-all cursor-pointer"
            >
              <Send className="w-4 h-4 shrink-0" />
              <span>{T("se.37")}</span>
            </button>
            <p className="text-center text-[11px] text-[#56635B] mt-2 font-medium">
              {T("se.38")}
            </p>
          </div>
        </form>
        </div>
        </div>
      </div>

      {/* Petty Cash Settlement Modal */}
      {pettyCashModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F2A26]/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-2xl border border-[#DCE4DC] max-w-md w-full p-6 md:p-8 text-start space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8EFE9]">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-[#E8EFE9] text-[#1F2A26] flex items-center justify-center font-bold">
                  <Wallet className="w-4 h-4" aria-hidden="true" />
                </span>
                <h3 className="text-base font-semibold text-[#1F2A26]">
                  {T("se.39")}
                </h3>
              </div>
              <button
                onClick={() => setPettyCashModalOpen(false)}
                className="text-[#56635B] hover:text-[#1F2A26] text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {pettyCashSuccess ? (
              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-center py-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <p className="font-semibold text-emerald-900 text-sm">
                  {T("se.40")}
                </p>
                <p className="text-xs text-emerald-700 mt-1">
                  تمت إضافتها في مركز اعتمادات المدير بلحظية "الآن".
                </p>
              </div>
            ) : (
              <form onSubmit={handlePettyCashSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#56635B] mb-1">
                    {T("se.41", { v0: currencySymbol() })}
                  </label>
                  <input
                    type="number"
                    value={cashAmount}
                    onChange={(e) => setCashAmount(e.target.value)}
                    required
                    className="w-full p-3 rounded-lg border border-[#DCE4DC] focus:outline-none focus:ring-2 focus:ring-1 focus:ring-[#5F6C61] focus:border-[#5F6C61] text-sm font-bold text-[#1F2A26]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#56635B] mb-1">
                    {T("se.42")}
                  </label>
                  <select
                    value={cashCategory}
                    onChange={(e) => setCashCategory(e.target.value)}
                    className="w-full p-3 rounded-lg border border-[#DCE4DC] focus:outline-none focus:ring-2 focus:ring-1 focus:ring-[#5F6C61] focus:border-[#5F6C61] text-sm font-bold text-[#1F2A26] bg-white"
                  >
                    <option value="نقل وتشوين خامات">{T("se.43")}</option>
                    <option value="شراء عدد وأدوات طارئة">{T("se.44")}</option>
                    <option value="يوميات عمالة إضافية">{T("se.45")}</option>
                    <option value="ضيافة واستقبال عميل">{T("se.46")}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#56635B] mb-1">
                    {T("se.47")}
                  </label>
                  <textarea
                    rows={2}
                    value={cashNotes}
                    onChange={(e) => setCashNotes(e.target.value)}
                    className="w-full p-3 rounded-lg border border-[#DCE4DC] focus:outline-none focus:ring-2 focus:ring-1 focus:ring-[#5F6C61] focus:border-[#5F6C61] text-xs text-[#1F2A26]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#5F6C61] hover:bg-[#5F6C61] active:scale-95 transition-all shadow-sm"
                  >
                    {T("se.48")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPettyCashModalOpen(false)}
                    className="px-4 py-3 rounded-lg text-xs sm:text-sm font-bold text-[#56635B] bg-[#E8EFE9] hover:bg-[#DCE4DC] text-[#56635B]"
                  >
                    {T("se.124")}
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
