import { currencySymbol, intlLocale, E } from "../i18n";
import { localize, D, DF } from "../data/dataI18n";
import { tr_ as T } from "../i18n";
import { useState } from "react";
import ProgressBar from "./ProgressBar";
import {
  FileCode,
  Layers,
  AlertTriangle,
  ClipboardList,
  FileEdit,
  UploadCloud,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  Send,
  Calendar,
  Building2,
  Check,
  X,
  Search,
  Filter,
  FileText,
  Sparkles,
  HelpCircle,
  Hash,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

// Mock Latest Engineering Drawings (Document Control)
const INITIAL_DRAWINGS = localize([
  {
    id: "DWG-01",
    name: "لوحة توزيع الكهرباء والإنارة - الدور الأرضي",
    code: "E-02-GF",
    rev: "Rev. 02",
    discipline: D("كهرباء"),
    project: D("فيلا الياسمين - التجمع"),
    date: "اليوم، ٠٩:٣٠ ص",
    size: "٤.٢ ميجابايت",
    status: "approved", // approved | review | rejected
    statusLabel: "معتمدة للتنفيذ (AFC)",
  },
  {
    id: "DWG-02",
    name: "مخطط تمديدات الصرف والتغذية - البدروم",
    code: "P-01-BS",
    rev: "Rev. 01",
    discipline: "صحي ومياه",
    project: D("فيلا الياسمين - التجمع"),
    date: "أمس، ٠٣:١٥ م",
    size: "٣.٨ ميجابايت",
    status: "approved",
    statusLabel: "معتمدة للتنفيذ (AFC)",
  },
  {
    id: "DWG-03",
    name: "مخطط الأسقف المعلقة وتوزيع الإضاءة المخفية",
    code: "A-04-1F",
    rev: "Rev. 03",
    discipline: "معماري وديكور",
    project: D("دوبلكس نيو جيزة"),
    date: "منذ يومين",
    size: "٦.١ ميجابايت",
    status: "review",
    statusLabel: "بانتظار المراجعة",
  },
  {
    id: "DWG-04",
    name: "تفصيلة رخام الدرج والمصعد البانورامي",
    code: "D-08-ST",
    rev: "Rev. 01",
    discipline: "تفاصيل معمارية",
    project: "مقر إداري - الشيخ زايد",
    date: "٠٤ نوفمبر ٢٠٢٦",
    size: "٢.٩ ميجابايت",
    status: "review",
    statusLabel: "بانتظار المراجعة",
  },
  {
    id: "DWG-05",
    name: "مسارات التكييف الكونسيلد المعدلة لتفادي الكمرات",
    code: "M-03-HVAC",
    rev: "Rev. 02",
    discipline: "تكييف وميكانيكا",
    project: D("فيلا الياسمين - التجمع"),
    date: "٠٢ نوفمبر ٢٠٢٦",
    size: "٥.٤ ميجابايت",
    status: "rejected",
    statusLabel: "مرفوضة للتعديل",
  },
]);

// Mock Site Requests / RFIs
const INITIAL_RFIS = localize([
  {
    id: "RFI-104",
    title: "تعارض مسار تكييف الكونسيلد مع كمرة خرسانية ساقطة",
    location: "فيلا الياسمين - جناح الماستر",
    submitter: "م. كريم مصطفى (مهندس الموقع)",
    priority: "urgent", // urgent | medium | normal
    priorityLabel: "عاجل جداً (أعمال معطلة)",
    details: "مسار دكت التكييف المعتمد بالمخطط يتعارض مع كمرة خرسانية عمق ٦٠ سم، مما يمنع تمرير مجرى الهواء بالارتفاع المطلوب.",
    status: "pending", // pending | solved
    time: "منذ ساعتين",
  },
  {
    id: "RFI-103",
    title: "تحديد منسوب عتب فتحات الأبواب الداخلية بعد منسوب اللياسة",
    location: "مقر إداري - الشيخ زايد",
    submitter: "م. أحمد (الموقع)",
    priority: "medium",
    priorityLabel: "أولوية متوسطة",
    details: "يرجى تأكيد الارتفاع الصافي لفتحات الأبواب الخشبية بعد احتساب منسوب بلاط البورسلين لطلب الحلق الزفر.",
    status: "pending",
    time: "أمس، ٠٥:٠٠ م",
  },
  {
    id: "RFI-102",
    title: "تأكيد سمك عزل خزان المياه الأرضي وطبقات الحماية",
    location: "فيلا الياسمين - البدروم",
    submitter: "م. كريم مصطفى (مهندس الموقع)",
    priority: "normal",
    priorityLabel: "تم الحل والاعتماد",
    details: "تم اعتماد دهان وجهين بيتومين مطاطي مع تركيب ألواح حماية سمك ٤ مم وفحص ضغط المياه لمدة ٤٨ ساعة.",
    status: "solved",
    solution: "تم إرسال التفصيلة المعمارية رقم D-14 ومطابقتها مع مواصفات استشاري العزل.",
    time: "٠٣ نوفمبر ٢٠٢٦",
  },
]);

// Mock Active BOQ Items
const BOQ_ITEMS = localize([
  {
    code: "01.02",
    description: "توريد وتركيب رخام كلكتا جولد إيطالي معالج ومصقول للأرضيات",
    unit: "م²",
    contractQty: 180,
    executedQty: 140,
    progress: 78,
    status: "جاري التركيب",
  },
  {
    code: "02.04",
    description: "شبكة تمديدات الكهرباء الذكية بنظام KNX ومفاتيح اللمس",
    unit: "نقطة",
    contractQty: 120,
    executedQty: 120,
    progress: 100,
    status: "مكتمل ومعتمد",
  },
  {
    code: "03.01",
    description: "عزل مائي وحراري مزدوج لجدران وقواعد البدروم بالبيتومين المطاطي",
    unit: "م²",
    contractQty: 350,
    executedQty: 350,
    progress: 100,
    status: "تم الفحص والاعتماد",
  },
  {
    code: "04.05",
    description: "دهانات ديكورية مخملية نيوكلاسيك (Jotun Fenomastic) وجهين وبطانة",
    unit: "م²",
    contractQty: 850,
    executedQty: 340,
    progress: 40,
    status: "قيد التجهيز والصنفرة",
  },
  {
    code: "05.02",
    description: "تجليد حوائط خشب جوز أمريكي طبيعي معالج بدهان بولي يوريثان",
    unit: "م²",
    contractQty: 95,
    executedQty: 30,
    progress: 32,
    status: "وصول الخامات للموقع",
  },
]);

function TechnicalOfficeDashboard({ actionItems, setActionItems, setSelectedItem }) {
  const [drawings, setDrawings] = useState(INITIAL_DRAWINGS);
  const [rfis, setRfis] = useState(INITIAL_RFIS);
  const [searchQuery, setSearchQuery] = useState("");

  // Upload Drawing Modal State
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [newDwgName, setNewDwgName] = useState("");
  const [newDwgCode, setNewDwgCode] = useState("");
  const [newDwgDiscipline, setNewDwgDiscipline] = useState("معماري وديكور");
  const [newDwgRev, setNewDwgRev] = useState("Rev. 01");
  const [newDwgProject, setNewDwgProject] = useState("فيلا الياسمين - التجمع");

  // RFI Solution Modal State
  const [solvingRfi, setSolvingRfi] = useState(null);
  const [solutionText, setSolutionText] = useState("");
  const [solutionSuccessToast, setSolutionSuccessToast] = useState(false);

  const todayArabic = new Intl.DateTimeFormat(intlLocale(), {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  // Filter Drawings based on search
  const filteredDrawings = drawings.filter(
    (d) =>
      d.name.includes(searchQuery) ||
      d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.project.includes(searchQuery)
  );

  // Handle Uploading a new Drawing
  const handleUploadSubmit = (e) => {
    e.preventDefault();
    const newDrawing = {
      id: `DWG-${drawings.length + 1}`,
      name: newDwgName || D("لوحة تفاصيل تنفيذية جديدة"),
      code: newDwgCode || "A-09-DT",
      rev: newDwgRev,
      discipline: newDwgDiscipline,
      project: newDwgProject,
      date: "الآن",
      size: "٤.٥ ميجابايت",
      status: "review",
      statusLabel: "بانتظار المراجعة",
    };

    setDrawings((prev) => [newDrawing, ...prev]);
    setUploadSuccess(true);

    // Notify Admin & Site Engineer in actionItems
    if (setActionItems) {
      const newAction = {
        id: Date.now(),
        title: DF("لوحة جديدة معتمدة: {0}", newDrawing.name),
        subtitle: DF("إصدار {0} • مشروع {1}", newDrawing.rev, newDrawing.project),
        user: "المكتب الفني",
        project: newDrawing.project,
        category: "مخططات ومستندات",
        amount: "إصدار جديد",
        timestamp: "الآن",
        time: "الآن",
        targetRole: "Site Engineer",
        type: "report",
        status: "pending",
      };
      setActionItems((prev) => [newAction, ...prev]);
    }

    setTimeout(() => {
      setUploadSuccess(false);
      setUploadModalOpen(false);
      setNewDwgName("");
      setNewDwgCode("");
    }, 1200);
  };

  // Handle Submitting RFI Engineering Solution
  const handleSolveRfi = (e) => {
    e.preventDefault();
    if (!solvingRfi) return;

    setRfis((prev) =>
      prev.map((rfi) =>
        rfi.id === solvingRfi.id
          ? {
              ...rfi,
              status: "solved",
              priorityLabel: "تم إرسال الحل للموقع ✓",
              solution: solutionText || D("تم تعديل مسار الدكت وتمريره من الفتحة المعتمدة."),
            }
          : rfi
      )
    );

    // Also notify Site Engineer in actionItems
    if (setActionItems) {
      const newAction = {
        id: Date.now(),
        title: DF("حل هندسي معتمد لـ {0}", solvingRfi.id),
        subtitle: DF("تم اعتماد حل تعارض: {0}", solvingRfi.title),
        user: "المكتب الفني",
        project: solvingRfi.location,
        category: "حلول RFI",
        amount: "معتمد للتنفيذ",
        timestamp: "الآن",
        time: "الآن",
        targetRole: "Site Engineer",
        type: "report",
        status: "pending",
      };
      setActionItems((prev) => [newAction, ...prev]);
    }

    setSolvingRfi(null);
    setSolutionText("");
    setSolutionSuccessToast(true);
    setTimeout(() => setSolutionSuccessToast(false), 3000);
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-7 max-w-7xl mx-auto w-full max-w-full overflow-x-hidden bg-transparent min-h-screen">
      {/* Toast Notification for Solution Sent */}
      {solutionSuccessToast && (
        <div className="sticky top-4 z-40 p-4 rounded-lg bg-emerald-700 text-white shadow-xl shadow-emerald-600/25 border border-emerald-500 animate-in fade-in slide-in-from-top-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 font-black text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
            <span>{T("to.1")}</span>
          </div>
          <span className="text-xs bg-emerald-700/80 px-2 py-0.5 rounded-full font-bold">
            {T("to.2")}
          </span>
        </div>
      )}

      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-[#E3E0D9]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EEECE6] text-[#16181C] border border-[#E3E0D9] inline-flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#5D6168]" />
              {T("to.3")}
            </span>
            <span className="text-xs text-[#5D6168] font-semibold font-mono">BIM & CAD Studio</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[#16181C] mt-1.5">
            {T("to.4")}
          </h1>

          <p className="text-xs md:text-sm text-[#5D6168] mt-1 flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 font-semibold text-[#5D6168]">
              <Calendar className="w-3.5 h-3.5 text-[#5D6168]" />
              {todayArabic}
            </span>
            <span className="text-[#80848B]">•</span>
            <span className="text-[#5D6168]">
              {D("متابعة مستندات")} <strong className="text-[#16181C]">{D("٤ مشاريع تنفيذية")}</strong> {D("وجداول الحصر والمقايسات")}
            </span>
          </p>
        </div>

        {/* Quick Action Button: Upload Drawing */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setUploadModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black text-white bg-[#2B3138] hover:bg-[#16181C] transition-colors shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <UploadCloud className="w-4 h-4 shrink-0" />
            <span>{T("to.6")}</span>
          </button>
        </div>
      </div>

      {/* 2. Engineering Dashboard Grid (4 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: مخططات بانتظار الاعتماد */}
        <div className="bg-white rounded-lg border border-[#E3E0D9] p-5 shadow-xs transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5D6168] uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16181C]" />
              {T("to.7")}
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#EEECE6] border border-[#E3E0D9] flex items-center justify-center text-[#16181C]">
              <FileCode className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3.5 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-[#16181C] font-ibm">
              ٥
            </span>
            <span className="text-xs font-bold text-[#16181C] bg-[#EEECE6] border border-[#E3E0D9] px-2 py-0.5 rounded-full text-[#16181C]">
              {T("to.9")}
            </span>
          </div>
          <p className="text-xs text-[#5D6168] mt-2 font-medium">
            {D("٣ معماري وديكور • ٢ كهروميكانيكال")}
          </p>
        </div>

        {/* Card 2: طلبات استفسار الموقع (RFIs) - Warning/Urgent Style */}
        <div className="bg-white rounded-lg border border-[#E3E0D9] p-5 shadow-xs transition-all flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 end-0 start-0 h-1 bg-amber-700" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#16181C] flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>
              {T("to.11")}
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center font-bold">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3.5 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-amber-800 font-ibm">
              ٢
            </span>
            <span className="text-xs font-black text-rose-800 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
              {T("to.13")}
            </span>
          </div>
          <p className="text-xs text-amber-800/80 mt-2 font-medium">
            {T("to.14")}
          </p>
        </div>

        {/* Card 3: مقايسات قيد التسعير */}
        <div className="bg-white rounded-lg border border-[#E3E0D9] p-5 shadow-xs transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5D6168] uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {T("to.15")}
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#EEECE6] border border-[#E3E0D9] flex items-center justify-center text-[#16181C]">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3.5 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-[#16181C] font-ibm">
              ٣
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-[#EEECE6] border border-[#E3E0D9] px-2 py-0.5 rounded-full text-[#16181C]">
              {T("to.17")}
            </span>
          </div>
          <p className="text-xs text-[#5D6168] mt-2 font-medium">
            {D("تشطيبات شاليه مراسي ومقر الشيخ زايد")}
          </p>
        </div>

        {/* Card 4: أوامر التغيير المطلوبة */}
        <div className="bg-white rounded-lg border border-[#E3E0D9] p-5 shadow-xs transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5D6168] uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              {T("to.19")}
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#EEECE6] border border-[#E3E0D9] flex items-center justify-center text-[#16181C]">
              <FileEdit className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3.5 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-[#16181C] font-ibm">
              ١
            </span>
            <span className="text-xs font-bold text-purple-700 bg-[#EEECE6] border border-[#E3E0D9] px-2 py-0.5 rounded-full text-[#16181C]">
              {T("to.21")}
            </span>
          </div>
          <p className="text-xs text-[#5D6168] mt-2 font-medium">
            {T("to.22", { v0: currencySymbol() })}
          </p>
        </div>
      </div>

      {/* 3. Split Layout (Two Columns: Document Control vs Site RFIs) */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column: آخر المخططات الهندسية (Document Control & Shop Drawings) */}
        <div className="bg-white rounded-lg border border-[#E3E0D9] shadow-xs overflow-hidden flex flex-col justify-between flex-1">
          <div>
            <div className="p-5 border-b border-[#EEECE6] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-[#16181C] flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-[#16181C]" />
                  {T("to.23")}
                </h2>
                <p className="text-xs text-[#5D6168] mt-0.5">
                  {T("to.24")}
                </p>
              </div>

              {/* Quick Search in Drawings */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={T("to.25")}
                  className="py-1.5 ps-8 pe-3 rounded-lg border border-[#E3E0D9] text-xs focus:outline-none focus:ring-2 focus:ring-[#2B3138]/10 focus:border-[#2B3138] text-[#16181C] placeholder:text-[#5D6168] w-44"
                />
                <Search className="w-3.5 h-3.5 text-[#5D6168] absolute start-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="divide-y divide-[#EEECE6] max-h-[460px] overflow-y-auto">
              {filteredDrawings.map((dwg) => {
                const isApproved = dwg.status === "approved";
                const isReview = dwg.status === "review";
                const isRejected = dwg.status === "rejected";

                return (
                  <div
                    key={dwg.id}
                    className="p-4 hover:bg-[#F6F5F1] transition-all flex items-start justify-between gap-3 group"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-[#EEECE6] group-hover:bg-[#E3E0D9] text-[#5D6168] flex items-center justify-center font-bold text-xs shrink-0 transition-colors">
                        <FileText className="w-4 h-4" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-xs sm:text-sm font-bold text-[#16181C] truncate">
                            {dwg.name}
                          </h3>
                          <span className="text-[10px] font-black font-mono px-1.5 py-0.5 rounded bg-[#EEECE6] text-[#16181C] border border-[#E3E0D9]">
                            {dwg.code}
                          </span>
                          <span className="text-[10px] font-extrabold text-[#16181C] bg-[#EEECE6] text-[#16181C] px-1.5 py-0.5 rounded border border-[#E3E0D9]">
                            {dwg.rev}
                          </span>
                        </div>

                        <p className="text-xs text-[#5D6168] mt-1 flex items-center gap-2 flex-wrap">
                          <span>{T("to.26")} <strong className="text-[#5D6168]">{dwg.project}</strong></span>
                          <span>•</span>
                          <span>{T("to.27", { v0: dwg.discipline })}</span>
                          <span>•</span>
                          <span className="text-[#5D6168] text-[11px]">{dwg.date}</span>
                        </p>

                        <div className="mt-2 flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full border ${
                              isApproved
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : isReview
                                ? "bg-amber-50 text-amber-800 border-amber-200"
                                : "bg-rose-50 text-rose-700 border-rose-200"
                            }`}
                          >
                            {isApproved ? (
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            ) : isReview ? (
                              <Clock className="w-3 h-3 text-amber-600" />
                            ) : (
                              <X className="w-3 h-3 text-rose-600" />
                            )}
                            {dwg.statusLabel}
                          </span>
                          <span className="text-[10px] text-[#5D6168]">{dwg.size}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Download / View */}
                    <div className="flex items-center gap-1 shrink-0 pt-1">
                      <button
                        title={T("to.28")}
                        onClick={() => alert(DF("معاينة المخطط: {0} ({1})", dwg.name, dwg.code))}
                        className="p-1.5 rounded-lg text-[#5D6168] hover:text-[#16181C] hover:bg-[#EEECE6] transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        title={T("to.29")}
                        onClick={() => alert(DF("جاري تنزيل الملف المعتمد: {0}.pdf", dwg.name))}
                        className="p-1.5 rounded-lg text-[#5D6168] hover:text-[#16181C] hover:bg-[#EEECE6] transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3.5 bg-[#F6F5F1] border-t border-[#EEECE6] text-[#5D6168] flex items-center justify-between text-xs text-[#5D6168]">
            <span>{T("to.30", { v0: drawings.length })}</span>
            <span className="font-bold text-[#5D6168]">{T("to.31")}</span>
          </div>
        </div>

        {/* Right Column: استفسارات وتعارضات الموقع (Site Requests / RFIs) */}
        <div className="bg-white rounded-lg border border-[#E3E0D9] shadow-xs overflow-hidden flex flex-col justify-between flex-1">
          <div>
            <div className="p-5 border-b border-[#EEECE6] flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#16181C] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  {T("to.32")}
                </h2>
                <p className="text-xs text-[#5D6168] mt-0.5">
                  {T("to.33")}
                </p>
              </div>

              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                {rfis.filter((r) => r.status === "pending").length} {D("تتطلب رداً")}
              </span>
            </div>

            <div className="p-4 space-y-3.5 max-h-[460px] overflow-y-auto">
              {rfis.map((rfi) => {
                const isPending = rfi.status === "pending";
                const isUrgent = rfi.priority === "urgent";

                return (
                  <div
                    key={rfi.id}
                    className={`rounded-lg p-4 border transition-all ${
                      isUrgent && isPending
                        ? "bg-amber-50/30 border-amber-300 shadow-xs"
                        : isPending
                        ? "bg-white border-[#E3E0D9] shadow-xs"
                        : "bg-[#F6F5F1] border-[#E3E0D9]/60 opacity-90"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black font-mono px-2 py-0.5 rounded bg-[#EEECE6] text-[#16181C] border border-[#E3E0D9]">
                          {rfi.id}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            isUrgent
                              ? "bg-rose-50 text-rose-700 border-rose-200 font-extrabold animate-pulse"
                              : isPending
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          }`}
                        >
                          {rfi.priorityLabel}
                        </span>
                      </div>

                      <span className="text-[11px] text-[#5D6168] font-medium">
                        {rfi.time}
                      </span>
                    </div>

                    <h3 className="text-xs sm:text-sm font-black text-[#16181C] mt-2 leading-snug">
                      {rfi.title}
                    </h3>

                    <p className="text-xs text-[#5D6168] mt-1.5 leading-relaxed bg-[#F6F5F1] p-2.5 rounded-lg border border-[#E3E0D9]">
                      {rfi.details}
                    </p>

                    <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#5D6168]">
                      <span>{T("to.34")} <strong className="text-[#16181C]">{rfi.location}</strong></span>
                      <span>{T("to.35")} <strong className="text-[#5D6168]">{rfi.submitter}</strong></span>
                    </div>

                    {/* Action or Resolution */}
                    <div className="mt-3 pt-3 border-t border-[#EEECE6] flex items-center justify-between">
                      {isPending ? (
                        <button
                          onClick={() => setSolvingRfi(rfi)}
                          className="px-4 py-1.5 rounded-xl text-xs font-black text-white bg-[#2B3138] hover:bg-[#16181C] active:scale-95 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer text-white"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{T("to.36")}</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{rfi.solution || D("تم اعتماد الحل وإرسال اللوحة المعدلة")}</span>
                        </div>
                      )}

                      <span className="text-[10px] text-[#5D6168]">
                        {T("to.38")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3.5 bg-[#F6F5F1] border-t border-[#EEECE6] text-[#5D6168] flex items-center justify-between text-xs text-[#5D6168]">
            <span>{T("to.39")}</span>
            <span className="font-bold text-[#5D6168]">{T("to.40")}</span>
          </div>
        </div>
      </div>

      {/* 4. Active BOQs (المقايسات النشطة) */}
      <div className="bg-white rounded-lg border border-[#E3E0D9] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[#EEECE6]">
          <div>
            <div className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-[#16181C]" />
              <h2 className="text-base sm:text-lg font-black text-[#16181C]">
                {T("to.41")}
              </h2>
            </div>
            <p className="text-xs text-[#5D6168] mt-0.5">
              {D("متابعة كميات البنود التعاقدية ومقارنتها بالحصر الفعلي بالموقع لمشروع:")} <strong className="text-[#16181C]">{D("فيلا الياسمين (BOQ-YAS-2026)")}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EEECE6] text-[#16181C] border border-[#E3E0D9]">
              {D("إجمالي البنود: ٥ بنود رئيسية")}
            </span>
          </div>
        </div>

        {/* Clean Structured Data Table */}
        <div className="overflow-x-auto w-full rounded-lg border border-[#E3E0D9] shadow-sm">
          <table className="w-full text-start text-xs">
            <thead className="bg-[#F6F5F1] text-[#5D6168] font-extrabold border-b border-[#E3E0D9]">
              <tr>
                <th className="py-3 px-3.5 font-mono">{T("to.44")}</th>
                <th className="py-3 px-3.5">{T("to.45")}</th>
                <th className="py-3 px-3.5 text-center">{T("to.46")}</th>
                <th className="py-3 px-3.5 text-center">{T("to.47")}</th>
                <th className="py-3 px-3.5 text-center">{T("to.48")}</th>
                <th className="py-3 px-3.5 min-w-[150px]">{T("to.49")}</th>
                <th className="py-3 px-3.5 text-center">{T("to.50")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEECE6]">
              {BOQ_ITEMS.map((item) => (
                <tr key={item.code} className="hover:bg-[#F6F5F1] transition-colors">
                  <td className="py-3.5 px-3.5 font-bold font-mono text-[#5D6168]">
                    {item.code}
                  </td>
                  <td className="py-3.5 px-3.5 font-bold text-[#16181C] max-w-xs">
                    {item.description}
                  </td>
                  <td className="py-3.5 px-3.5 text-center text-[#5D6168] font-bold">
                    {E(item.unit)}
                  </td>
                  <td className="py-3.5 px-3.5 text-center font-extrabold text-[#16181C] font-mono">
                    {item.contractQty.toLocaleString(intlLocale())}
                  </td>
                  <td className="py-3.5 px-3.5 text-center font-extrabold text-[#16181C] font-mono">
                    {item.executedQty.toLocaleString(intlLocale())}
                  </td>
                  <td className="py-3.5 px-3.5">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-[#5D6168]">{T("to.51")}</span>
                        <span className="text-xs font-bold text-[#16181C] tracking-wide font-mono">{T("to.52", { v0: item.progress })}</span>
                      </div>
                      <ProgressBar
                        value={item.progress}
                        isCompleted={item.progress === 100}
                      />
                    </div>
                  </td>
                  <td className="py-3.5 px-3.5 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        item.progress === 100
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-[#EEECE6] text-[#16181C] border border-[#E3E0D9]"
                      }`}
                    >
                      {E(item.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Drawing Modal */}
      {uploadModalOpen && (
        <div
          className="fixed inset-0 bg-[#16181C]/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setUploadModalOpen(false)}
        >
          <div
           
            className="bg-white rounded-lg shadow-2xl max-w-lg w-full overflow-hidden border border-[#E3E0D9] text-start animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-[#EEECE6] bg-[#F6F5F1]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#EEECE6] text-[#16181C] flex items-center justify-center font-bold">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#16181C]">
                    {T("to.53")}
                  </h3>
                  <p className="text-xs text-[#5D6168]">
                    {T("to.54")}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setUploadModalOpen(false)}
                className="w-8 h-8 rounded-lg text-[#5D6168] hover:text-[#16181C] hover:bg-[#E3E0D9] flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {uploadSuccess ? (
              <div className="p-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
                <h4 className="font-black text-[#16181C] text-base">
                  {T("to.55")}
                </h4>
                <p className="text-xs text-[#5D6168]">
                  {T("to.56")}
                </p>
              </div>
            ) : (
              <form onSubmit={handleUploadSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block text-xs font-bold text-[#5D6168] mb-1">
                    {T("to.57")}
                  </label>
                  <input
                    type="text"
                    required
                    value={newDwgName}
                    onChange={(e) => setNewDwgName(e.target.value)}
                    placeholder={T("to.58")}
                    className="w-full p-3 rounded-lg border border-[#E3E0D9] focus:outline-none focus:ring-2 focus:ring-[#2B3138]/10 focus:border-[#2B3138] text-xs sm:text-sm font-bold text-[#16181C]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#5D6168] mb-1">
                      {T("to.59")}
                    </label>
                    <input
                      type="text"
                      required
                      value={newDwgCode}
                      onChange={(e) => setNewDwgCode(e.target.value)}
                      placeholder="E-05-1F"
                      className="w-full p-3 rounded-lg border border-[#E3E0D9] focus:outline-none focus:ring-2 focus:ring-[#2B3138]/10 focus:border-[#2B3138] text-xs sm:text-sm font-bold font-mono text-[#16181C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#5D6168] mb-1">
                      {T("to.60")}
                    </label>
                    <select
                      value={newDwgRev}
                      onChange={(e) => setNewDwgRev(e.target.value)}
                      className="w-full p-3 rounded-lg border border-[#E3E0D9] focus:outline-none focus:ring-2 focus:ring-[#2B3138]/10 focus:border-[#2B3138] text-xs font-bold text-[#16181C] bg-white"
                    >
                      <option value="Rev. 00">{T("to.114")}</option>
                      <option value="Rev. 01">{T("to.62")}</option>
                      <option value="Rev. 02">{T("to.63")}</option>
                      <option value="Rev. 03">{T("to.64")}</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#5D6168] mb-1">
                      {T("to.115")}
                    </label>
                    <select
                      value={newDwgDiscipline}
                      onChange={(e) => setNewDwgDiscipline(e.target.value)}
                      className="w-full p-3 rounded-lg border border-[#E3E0D9] focus:outline-none focus:ring-2 focus:ring-[#2B3138]/10 focus:border-[#2B3138] text-xs font-bold text-[#16181C] bg-white"
                    >
                      <option value="معماري وديكور">{T("to.116")}</option>
                      <option value="إنشائي">{T("to.67")}</option>
                      <option value="كهرباء وإنارة">{T("to.68")}</option>
                      <option value="صحي ومياه">{T("to.119")}</option>
                      <option value="تكييف وميكانيكا">{T("to.70")}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#5D6168] mb-1">
                      {T("to.71")}
                    </label>
                    <select
                      value={newDwgProject}
                      onChange={(e) => setNewDwgProject(e.target.value)}
                      className="w-full p-3 rounded-lg border border-[#E3E0D9] focus:outline-none focus:ring-2 focus:ring-[#2B3138]/10 focus:border-[#2B3138] text-xs font-bold text-[#16181C] bg-white"
                    >
                      <option value="فيلا الياسمين - التجمع">{T("to.72")}</option>
                      <option value="مقر إداري - الشيخ زايد">{T("to.73")}</option>
                      <option value="دوبلكس نيو جيزة">{T("to.74")}</option>
                      <option value="شاليه مراسي 14B">{T("to.75")}</option>
                    </select>
                  </div>
                </div>

                {/* Upload Zone */}
                <div className="p-4 border-2 border-dashed border-[#D1CDC5] rounded-lg bg-[#F6F5F1] text-center cursor-pointer hover:bg-[#EEECE6] transition-colors">
                  <UploadCloud className="w-8 h-8 text-[#5D6168] mx-auto mb-1" />
                  <p className="text-xs font-bold text-[#16181C]">
                    {T("to.76")}
                  </p>
                  <p className="text-[10px] text-[#5D6168] mt-0.5">
                    {T("to.77")}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl text-xs sm:text-sm font-black text-white bg-[#2B3138] hover:bg-[#16181C] text-white active:scale-95 transition-all shadow-sm"
                  >
                    {T("to.78")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadModalOpen(false)}
                    className="px-4 py-3 rounded-lg text-xs sm:text-sm font-bold text-[#5D6168] bg-[#EEECE6] hover:bg-[#E3E0D9] text-[#5D6168]"
                  >
                    {T("to.126")}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* RFI Solution Modal */}
      {solvingRfi && (
        <div
          className="fixed inset-0 bg-[#16181C]/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSolvingRfi(null)}
        >
          <div
           
            className="bg-white rounded-lg shadow-2xl max-w-lg w-full overflow-hidden border border-[#E3E0D9] text-start animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-[#EEECE6] bg-[#F6F5F1]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#EEECE6] text-[#16181C] flex items-center justify-center font-bold">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#16181C]">
                    {T("to.80", { v0: solvingRfi.id })}
                  </h3>
                  <p className="text-xs text-[#5D6168]">
                    {T("to.81")}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSolvingRfi(null)}
                className="w-8 h-8 rounded-lg text-[#5D6168] hover:text-[#16181C] hover:bg-[#E3E0D9] flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSolveRfi} className="p-6 space-y-4 text-xs sm:text-sm">
              <div className="p-3.5 rounded-lg bg-amber-50/60 border border-amber-200 text-xs space-y-1">
                <span className="font-extrabold text-amber-900 block">
                  {T("to.82", { v0: solvingRfi.title })}
                </span>
                <p className="text-amber-800">{solvingRfi.details}</p>
                <p className="text-[10px] text-amber-700 font-medium pt-1">
                  {T("to.83", { v0: solvingRfi.location, v1: solvingRfi.submitter })}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5D6168] mb-1">
                  {T("to.84")}
                </label>
                <textarea
                  rows={4}
                  required
                  value={solutionText}
                  onChange={(e) => setSolutionText(e.target.value)}
                  placeholder={T("to.85")}
                  className="w-full p-3 rounded-lg border border-[#E3E0D9] focus:outline-none focus:ring-2 focus:ring-[#2B3138]/10 focus:border-[#2B3138] text-xs sm:text-sm text-[#16181C] leading-relaxed placeholder:text-[#5D6168]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl text-xs sm:text-sm font-black text-white bg-[#2B3138] hover:bg-[#16181C] text-white active:scale-95 transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>{T("to.86")}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSolvingRfi(null)}
                  className="px-4 py-3 rounded-lg text-xs sm:text-sm font-bold text-[#5D6168] bg-[#EEECE6] hover:bg-[#E3E0D9] text-[#5D6168]"
                >
                  {T("to.126")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default TechnicalOfficeDashboard;
