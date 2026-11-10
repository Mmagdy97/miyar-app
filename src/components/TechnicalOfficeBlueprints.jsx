import { useState, useMemo } from "react";
import {
  FileText,
  UploadCloud,
  Download,
  Trash2,
  CheckCircle2,
  Clock,
  Eye,
  Plus,
  Search,
  Filter,
  X,
  Building2,
  Layers,
  Sparkles,
  RotateCcw,
  Check,
  FileCode,
} from "lucide-react";

const INITIAL_DRAWINGS = [
  {
    id: "DWG-01",
    name: "مخطط التكييف المركزي ومسارات الدكت - الدور الأول",
    code: "M-02-1F",
    rev: "Rev. 02",
    discipline: "ميكانيكا وتكييف",
    project: "فيلا الياسمين - التجمع الخامس",
    uploadDate: "اليوم، ٠٩:٣٠ ص",
    fileSize: "٤.٨ ميجابايت",
    status: "معتمد للتنفيذ (AFC)",
  },
  {
    id: "DWG-02",
    name: "لوحة توزيع الإنارة ومخارج القوى - الدور الأرضي",
    code: "E-01-GF",
    rev: "Rev. 03",
    discipline: "كهرباء",
    project: "فيلا الياسمين - التجمع الخامس",
    uploadDate: "أمس، ٠٣:١٥ م",
    fileSize: "٣.٥ ميجابايت",
    status: "معتمد للتنفيذ (AFC)",
  },
  {
    id: "DWG-03",
    name: "تفاصيل شاسيهات الأسقف المعلقة وبيوت النور",
    code: "A-04-DT",
    rev: "Rev. 01",
    discipline: "معماري وديكور",
    project: "فيلا الياسمين - التجمع الخامس",
    uploadDate: "اليوم، ١١:٤٥ ص",
    fileSize: "٥.٢ ميجابايت",
    status: "قيد المراجعة",
  },
  {
    id: "DWG-04",
    name: "مخطط شبكة الصرف الداخلي وغرف التفتيش",
    code: "P-02-BS",
    rev: "Rev. 01",
    discipline: "صحي ومياه",
    project: "فيلا الياسمين - التجمع الخامس",
    uploadDate: "منذ يومين",
    fileSize: "٢.٩ ميجابايت",
    status: "معتمد للتنفيذ (AFC)",
  },
  {
    id: "DWG-05",
    name: "قطاعات رأسية لتجليد حوائط الرخام وتوزيع الإضاءة",
    code: "A-06-SC",
    rev: "Rev. 02",
    discipline: "معماري وديكور",
    project: "فيلا الياسمين - التجمع الخامس",
    uploadDate: "اليوم، ٠٨:٠٠ ص",
    fileSize: "٦.١ ميجابايت",
    status: "قيد المراجعة",
  },
];

const DISCIPLINES = [
  "الكل",
  "معماري وديكور",
  "كهرباء",
  "ميكانيكا وتكييف",
  "صحي ومياه",
];

function TechnicalOfficeBlueprints({ actionItems, setActionItems }) {
  const [drawings, setDrawings] = useState(INITIAL_DRAWINGS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState("الكل");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // New Drawing Form State
  const [newName, setNewName] = useState("");
  const [newCode, setNewCode] = useState("");
  const [newDiscipline, setNewDiscipline] = useState("معماري وديكور");
  const [newRev, setNewRev] = useState("Rev. 01");
  const [newStatus, setNewStatus] = useState("معتمد للتنفيذ (AFC)");

  // Filtered drawings
  const filteredDrawings = useMemo(() => {
    return drawings.filter((dwg) => {
      const matchesSearch =
        dwg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dwg.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dwg.rev.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDiscipline =
        selectedDiscipline === "الكل" || dwg.discipline === selectedDiscipline;
      return matchesSearch && matchesDiscipline;
    });
  }, [drawings, searchQuery, selectedDiscipline]);

  // Stats
  const stats = useMemo(() => {
    const total = drawings.length;
    const afc = drawings.filter((d) => d.status === "معتمد للتنفيذ (AFC)").length;
    const review = drawings.filter((d) => d.status === "قيد المراجعة").length;
    return { total, afc, review };
  }, [drawings]);

  // Upload Submit
  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newCode.trim()) return;

    const newDrawing = {
      id: `DWG-0${drawings.length + 1}`,
      name: newName.trim(),
      code: newCode.trim().toUpperCase(),
      rev: newRev,
      discipline: newDiscipline,
      project: "فيلا الياسمين - التجمع الخامس",
      uploadDate: "الآن",
      fileSize: "٤.٠ ميجابايت",
      status: newStatus,
    };

    setDrawings((prev) => [newDrawing, ...prev]);
    setIsUploadModalOpen(false);

    // Reset Form
    setNewName("");
    setNewCode("");
    setNewDiscipline("معماري وديكور");
    setNewRev("Rev. 01");
    setNewStatus("معتمد للتنفيذ (AFC)");

    // Notify Site Engineer & Admin if setActionItems exists
    if (setActionItems) {
      const newAction = {
        id: Date.now(),
        title: `مخطط تنفيذي جديد: ${newDrawing.name}`,
        subtitle: `كود ${newDrawing.code} • إصدار ${newDrawing.rev} • ${newDrawing.status}`,
        user: "المكتب الفني",
        project: "فيلا الياسمين - التجمع",
        category: "مخططات ومستندات",
        amount: newDrawing.rev,
        targetRole: "Site Engineer",
        time: "الآن",
        timestamp: "الآن",
        type: "report",
        status: "pending",
      };
      setActionItems((prev) => [newAction, ...prev]);
    }

    setToastMessage(`تم رفع واعتماد المخطط "${newDrawing.name}" بنجاح`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Delete Drawing
  const handleDeleteDrawing = (id, name) => {
    setDrawings((prev) => prev.filter((d) => d.id !== id));
    setToastMessage(`تم حذف المخطط: "${name}"`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Mock Download
  const handleDownloadDrawing = (name, code) => {
    setToastMessage(`جاري تحميل ملف الأوتوكاد والـ PDF: ${code} - ${name}...`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Mock Preview
  const handlePreviewDrawing = (name, code) => {
    setToastMessage(`فتح معاينة المخطط الفني: [${code}] ${name}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Reset demo drawings
  const handleReset = () => {
    setDrawings(INITIAL_DRAWINGS);
    setToastMessage("تمت استعادة القائمة الافتراضية للمخططات");
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent pb-24 font-ibm w-full max-w-full overflow-x-hidden" dir="rtl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 end-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#2B3138] text-white rounded-xl shadow-xl border border-white/10 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-xs font-bold leading-relaxed">{toastMessage}</p>
        </div>
      )}

      {/* Header & Quick Actions */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap mb-1">
            <h1 className="text-2xl md:text-3xl font-black text-[#1E2429] tracking-tight flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#ECEEF0] border border-[#DDE1E5] flex items-center justify-center text-[#1E2429]">
                <FileCode className="w-5 h-5" />
              </div>
              <span>إدارة المخططات واللوحات التنفيذية</span>
            </h1>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#ECEEF0] text-[#1E2429] border border-[#DDE1E5]">
              سجل Document Control
            </span>
          </div>
          <p className="text-xs md:text-sm text-[#5A646E]">
            أرشيف اللوحات التنفيذية المعتمدة (Shop Drawings) ومتابعة إصدارات التعديلات المعمارية والـ MEP.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-[#5A646E] bg-white border border-[#DDE1E5] hover:bg-[#F3F4F6] transition-colors shadow-2xs cursor-pointer"
            title="استعادة البيانات الأصلية"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة ضبط</span>
          </button>

          {/* Primary Action Button: + رفع مخطط جديد */}
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold text-white bg-[#2B3138] hover:bg-[#1E2429] transition-colors shadow-sm cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            <span>+ رفع مخطط جديد</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border border-[#DDE1E5] shadow-xs">
          <span className="text-[11px] font-bold text-[#5A646E] block mb-1">إجمالي المخططات المفهرسة</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl md:text-2xl font-black text-[#1E2429]">{stats.total}</span>
            <span className="text-[11px] font-bold text-[#1E2429] bg-[#ECEEF0] border border-[#DDE1E5] px-2 py-0.5 rounded-md">
              لوحة رسمية
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-[#DDE1E5] shadow-xs">
          <span className="text-[11px] font-bold text-[#5A646E] block mb-1">معتمدة للتنفيذ (AFC)</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl md:text-2xl font-black text-emerald-600">{stats.afc}</span>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
              صادرة للورشة
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-[#DDE1E5] shadow-xs">
          <span className="text-[11px] font-bold text-[#5A646E] block mb-1">قيد المراجعة والتدقيق</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl md:text-2xl font-black text-amber-600">{stats.review}</span>
            <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
              بانتظار الاعتماد
            </span>
          </div>
        </div>
      </div>

      {/* Search and Discipline Filters */}
      <div className="bg-white rounded-lg border border-[#DDE1E5] p-3.5 mb-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#5A646E] absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="بحث باسم اللوحة أو الكود (مثل: M-02, E-01)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full ps-10 pe-4 py-2 rounded-lg border border-[#DDE1E5] bg-[#F3F4F6] text-xs md:text-sm font-semibold text-[#1E2429] placeholder-[#5A646E]/50 focus:outline-none focus:ring-2 focus:ring-[#2B3138]/10 focus:border-[#2B3138] transition-all"
          />
        </div>

        {/* Discipline Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {DISCIPLINES.map((disc) => (
            <button
              key={disc}
              onClick={() => setSelectedDiscipline(disc)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedDiscipline === disc
                  ? "bg-[#2B3138] text-white shadow-sm"
                  : "bg-[#ECEEF0] text-[#1E2429] hover:bg-[#DDE1E5]"
              }`}
            >
              {disc}
            </button>
          ))}
        </div>
      </div>

      {/* Main Document Control Data Table */}
      <div className="bg-white rounded-lg border border-[#DDE1E5] shadow-xs overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-start border-collapse">
            <thead>
              <tr className="bg-[#F3F4F6] text-[#5A646E] text-xs font-bold border-b border-[#DDE1E5]">
                <th className="py-4 px-5 min-w-[260px]">اسم اللوحة والمواصفة الهندسية</th>
                <th className="py-4 px-4 w-32 text-center">كود اللوحة</th>
                <th className="py-4 px-4 w-28 text-center">الإصدار (Rev)</th>
                <th className="py-4 px-4 w-36 text-center">تاريخ الرفع</th>
                <th className="py-4 px-4 w-40 text-center">الحالة</th>
                <th className="py-4 px-5 w-32 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECEEF0] text-xs md:text-sm">
              {filteredDrawings.map((dwg) => {
                const isAfc = dwg.status === "معتمد للتنفيذ (AFC)";

                return (
                  <tr
                    key={dwg.id}
                    className="hover:bg-[#F3F4F6] transition-colors duration-150 group"
                  >
                    {/* Drawing Name & Discipline */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#ECEEF0] text-[#1E2429] font-extrabold text-xs flex items-center justify-center shrink-0 border border-[#DDE1E5]">
                          <FileCode className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-[#1E2429] leading-snug group-hover:text-[#1E2429] transition-colors">
                            {dwg.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#5A646E]">
                            <span className="text-[#5A646E] font-semibold">{dwg.discipline}</span>
                            <span>•</span>
                            <span>{dwg.fileSize}</span>
                            <span>•</span>
                            <span>{dwg.project}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Code */}
                    <td className="py-4 px-4 text-center">
                      <span className="font-mono font-black text-[#1E2429] bg-[#ECEEF0] px-2.5 py-1 rounded-lg text-xs text-[#1E2429]">
                        {dwg.code}
                      </span>
                    </td>

                    {/* Revision */}
                    <td className="py-4 px-4 text-center">
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-[#ECEEF0] text-[#1E2429] border border-[#DDE1E5]">
                        {dwg.rev}
                      </span>
                    </td>

                    {/* Upload Date */}
                    <td className="py-4 px-4 text-center text-xs text-[#5A646E] font-medium">
                      {dwg.uploadDate}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                          isAfc
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isAfc ? "bg-emerald-600" : "bg-amber-500 animate-pulse"
                          }`}
                        />
                        <span>{dwg.status}</span>
                      </span>
                    </td>

                    {/* Actions: Download, Preview, Delete */}
                    <td className="py-4 px-5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Preview */}
                        <button
                          onClick={() => handlePreviewDrawing(dwg.name, dwg.code)}
                          className="p-1.5 rounded-lg text-[#5A646E] hover:text-[#1E2429] hover:bg-[#ECEEF0] transition-colors cursor-pointer"
                          title="معاينة اللوحة"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Download */}
                        <button
                          onClick={() => handleDownloadDrawing(dwg.name, dwg.code)}
                          className="p-1.5 rounded-lg text-[#5A646E] hover:text-[#1E2429] hover:bg-[#ECEEF0] transition-colors cursor-pointer"
                          title="تحميل الملف التنفيذي"
                        >
                          <Download className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteDrawing(dwg.id, dwg.name)}
                          className="p-1.5 rounded-lg text-[#5A646E] hover:text-rose-700 hover:bg-[#ECEEF0] transition-colors cursor-pointer"
                          title="حذف اللوحة من الأرشيف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredDrawings.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-[#5A646E]">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-[#7B848E]" />
                    <p className="font-bold text-[#5A646E]">لم يتم العثور على أي مخططات مطابقة للبحث</p>
                    <p className="text-xs text-[#5A646E] mt-1">
                      جرّب تعديل كلمة البحث أو الضغط على "+ رفع مخطط جديد"
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 bg-[#F3F4F6] border-t border-[#DDE1E5] flex items-center justify-between text-xs text-[#5A646E]">
          <span>
            عرض <strong className="text-[#1E2429]">{filteredDrawings.length}</strong> من أصل{" "}
            <strong className="text-[#1E2429]">{drawings.length}</strong> مخطط
          </span>
          <span className="text-[11px] text-[#5A646E]">
            * جميع اللوحات المعتمدة تحمل خاتم AFC الرقمي وتصل فوراً لمهندسي المواقع.
          </span>
        </div>
      </div>

      {/* Upload Drawing Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#1E2429]/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-2xl border border-[#DDE1E5] max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 text-start animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#ECEEF0]">
              <h3 className="text-lg font-black text-[#1E2429] flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-[#1E2429]" />
                <span>رفع مخطط تنفيذي جديد للأرشيف</span>
              </h3>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1.5 rounded-lg text-[#5A646E] hover:text-[#1E2429] hover:bg-[#ECEEF0] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-[#5A646E] mb-1.5">
                  اسم اللوحة / المخطط <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: مخطط شبكة الإنارة المعمارية والسبوت لايت..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#DDE1E5] text-xs md:text-sm font-semibold text-[#1E2429] focus:outline-none focus:ring-2 focus:ring-[#2B3138]/10 focus:border-[#2B3138] transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#5A646E] mb-1.5">
                    كود اللوحة (Drawing Code) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: E-03-1F"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-[#DDE1E5] text-xs font-mono font-bold text-[#1E2429] focus:outline-none focus:ring-2 focus:ring-[#2B3138]/10 focus:border-[#2B3138]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5A646E] mb-1.5">
                    رقم التعديل (Revision)
                  </label>
                  <select
                    value={newRev}
                    onChange={(e) => setNewRev(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-[#DDE1E5] text-xs font-bold text-[#1E2429] bg-white"
                  >
                    <option value="Rev. 00">Rev. 00 (مبدئي)</option>
                    <option value="Rev. 01">Rev. 01</option>
                    <option value="Rev. 02">Rev. 02</option>
                    <option value="Rev. 03">Rev. 03</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#5A646E] mb-1.5">
                    التخصص الهندسي
                  </label>
                  <select
                    value={newDiscipline}
                    onChange={(e) => setNewDiscipline(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-[#DDE1E5] text-xs font-bold text-[#1E2429] bg-white"
                  >
                    <option value="معماري وديكور">معماري وديكور</option>
                    <option value="كهرباء">كهرباء</option>
                    <option value="ميكانيكا وتكييف">ميكانيكا وتكييف</option>
                    <option value="صحي ومياه">صحي ومياه</option>
                    <option value="إنشائي">إنشائي</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5A646E] mb-1.5">
                    حالة اللوحة
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-[#DDE1E5] text-xs font-bold text-[#1E2429] bg-white"
                  >
                    <option value="معتمد للتنفيذ (AFC)">معتمد للتنفيذ (AFC)</option>
                    <option value="قيد المراجعة">قيد المراجعة</option>
                  </select>
                </div>
              </div>

              {/* Upload Zone Mock */}
              <div className="border-2 border-dashed border-[#CBD0D6] hover:border-[#2B3138] rounded-lg p-6 text-center bg-[#F3F4F6] hover:bg-[#ECEEF0] transition-all cursor-pointer">
                <UploadCloud className="w-8 h-8 text-[#5A646E] mx-auto mb-2" />
                <p className="text-xs font-bold text-[#1E2429]">
                  اسحب ملف المخطط (DWG أو PDF) هنا أو اضغط للاختيار
                </p>
                <p className="text-[10px] text-[#5A646E] mt-1">
                  الحد الأقصى لحجم الملف: ٥٠ ميجابايت (AutoCAD / Revit / PDF)
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#ECEEF0]">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2.5 rounded-lg text-xs font-bold text-[#5A646E] hover:bg-[#ECEEF0] cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#2B3138] hover:bg-[#1E2429] hover:bg-[#1E2429] text-white font-bold text-xs md:text-sm shadow-sm transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>تأكيد الرفع والفهرسة</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default TechnicalOfficeBlueprints;
