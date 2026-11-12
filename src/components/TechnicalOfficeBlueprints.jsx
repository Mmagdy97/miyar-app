import { useState, useMemo } from "react";
import { drawingsStore } from "../data/stores";
import { TECH_DRAWINGS } from "../data/techSeed";
import { localize, D, DF } from "../data/dataI18n";
import { tr_ as T, E } from "../i18n";
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

const AFC = "معتمد للتنفيذ (AFC)";
const REVIEW = "قيد المراجعة";
const REJECTED = "مرفوضة للتعديل";
const LABEL_OF = { approved: AFC, review: REVIEW, rejected: REJECTED };
const CODE_OF = { [AFC]: "approved", [REVIEW]: "review" };
// The shared store uses the dashboard's shape; this screen shows it with its own field names.
const toView = (d) => ({ ...d, uploadDate: d.date, fileSize: d.size, status: LABEL_OF[d.status] || d.status });

const DISCIPLINES = localize([
  "الكل",
  "معماري وديكور",
  D("كهرباء"),
  "ميكانيكا وتكييف",
  "صحي ومياه",
]);

function TechnicalOfficeBlueprints({ actionItems, setActionItems }) {
  const [stored, setStored] = drawingsStore.use();
  const drawings = useMemo(() => stored.map(toView), [stored]);
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
      id: `DWG-${Date.now()}`,
      name: newName.trim(),
      code: newCode.trim().toUpperCase(),
      rev: newRev,
      discipline: newDiscipline,
      project: "فيلا الياسمين - التجمع الخامس",
      uploadDate: "الآن",
      fileSize: "٤.٠ ميجابايت",
      status: newStatus,
    };

    setStored((prev) => [{ id: newDrawing.id, name: newDrawing.name, code: newDrawing.code, rev: newDrawing.rev, discipline: newDrawing.discipline, project: newDrawing.project, date: "الآن", size: newDrawing.fileSize, status: CODE_OF[newStatus] || "review", statusLabel: newStatus }, ...prev]);
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
        title: DF("مخطط تنفيذي جديد: {0}", newDrawing.name),
        subtitle: DF("كود {0} • إصدار {1} • {2}", newDrawing.code, newDrawing.rev, newDrawing.status),
        user: "المكتب الفني",
        project: D("فيلا الياسمين - التجمع"),
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

    setToastMessage(DF("تم رفع واعتماد المخطط \"{0}\" بنجاح", newDrawing.name));
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Delete Drawing
  const handleDeleteDrawing = (id, name) => {
    setStored((prev) => prev.filter((d) => d.id !== id));
    setToastMessage(DF("تم حذف المخطط: \"{0}\"", name));
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Mock Download
  const handleDownloadDrawing = (name, code) => {
    setToastMessage(DF("جاري تحميل ملف الأوتوكاد والـ PDF: {0} - {1}...", code, name));
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Mock Preview
  const handlePreviewDrawing = (name, code) => {
    setToastMessage(DF("فتح معاينة المخطط الفني: [{0}] {1}", code, name));
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Reset demo drawings
  const handleReset = () => {
    setStored(TECH_DRAWINGS);
    setToastMessage(D("تمت استعادة القائمة الافتراضية للمخططات"));
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent pb-24 font-ibm w-full max-w-full overflow-x-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 end-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#24304D] text-white rounded-xl shadow-xl border border-white/10 animate-in fade-in slide-in-from-bottom-3 duration-200">
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
            <h1 className="text-2xl md:text-3xl font-black text-[#1A2236] tracking-tight flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#E9E3D5] border border-[#DAD3C2] flex items-center justify-center text-[#1A2236]">
                <FileCode className="w-5 h-5" />
              </div>
              <span>{T("to.87")}</span>
            </h1>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#E9E3D5] text-[#1A2236] border border-[#DAD3C2]">
              {T("to.88")}
            </span>
          </div>
          <p className="text-xs md:text-sm text-[#535E78]">
            {T("to.89")}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-[#535E78] bg-white border border-[#DAD3C2] hover:bg-[#F3EFE6] transition-colors shadow-2xs cursor-pointer"
            title={T("to.90")}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{T("to.91")}</span>
          </button>

          {/* Primary Action Button: + رفع مخطط جديد */}
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold text-white bg-[#24304D] hover:bg-[#1A2236] transition-colors shadow-sm cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{T("to.92")}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid stat-grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border border-[#DAD3C2] shadow-xs">
          <span className="text-[11px] font-bold text-[#535E78] block mb-1">{T("to.93")}</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl md:text-2xl font-black text-[#1A2236]">{stats.total}</span>
            <span className="text-[11px] font-bold text-[#1A2236] bg-[#E9E3D5] border border-[#DAD3C2] px-2 py-0.5 rounded-md">
              {T("to.94")}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-[#DAD3C2] shadow-xs">
          <span className="text-[11px] font-bold text-[#535E78] block mb-1">{T("to.95")}</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl md:text-2xl font-black text-emerald-600">{stats.afc}</span>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
              {T("to.96")}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-[#DAD3C2] shadow-xs">
          <span className="text-[11px] font-bold text-[#535E78] block mb-1">{T("to.97")}</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl md:text-2xl font-black text-amber-600">{stats.review}</span>
            <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
              {T("to.98")}
            </span>
          </div>
        </div>
      </div>

      {/* Search and Discipline Filters */}
      <div className="bg-white rounded-lg border border-[#DAD3C2] p-3.5 mb-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#535E78] absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={T("to.99")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full ps-10 pe-4 py-2 rounded-lg border border-[#DAD3C2] bg-[#F3EFE6] text-xs md:text-sm font-semibold text-[#1A2236] placeholder-[#535E78]/50 focus:outline-none focus:ring-2 focus:ring-[#24304D]/10 focus:border-[#24304D] transition-all"
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
                  ? "bg-[#24304D] text-white shadow-sm"
                  : "bg-[#E9E3D5] text-[#1A2236] hover:bg-[#DAD3C2]"
              }`}
            >
              {E(disc)}
            </button>
          ))}
        </div>
      </div>

      {/* Main Document Control Data Table */}
      <div className="bg-white rounded-lg border border-[#DAD3C2] shadow-xs overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-start border-collapse">
            <thead>
              <tr className="bg-[#F3EFE6] text-[#535E78] text-xs font-bold border-b border-[#DAD3C2]">
                <th className="py-4 px-5 min-w-[260px]">{T("to.100")}</th>
                <th className="py-4 px-4 w-32 text-center">{T("to.101")}</th>
                <th className="py-4 px-4 w-28 text-center">{T("to.102")}</th>
                <th className="py-4 px-4 w-36 text-center">{T("to.103")}</th>
                <th className="py-4 px-4 w-40 text-center">{T("to.104")}</th>
                <th className="py-4 px-5 w-32 text-center">{T("to.105")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E3D5] text-xs md:text-sm">
              {filteredDrawings.map((dwg) => {
                const isAfc = dwg.status === "معتمد للتنفيذ (AFC)";

                return (
                  <tr
                    key={dwg.id}
                    className="hover:bg-[#F3EFE6] transition-colors duration-150 group"
                  >
                    {/* Drawing Name & Discipline */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#E9E3D5] text-[#1A2236] font-extrabold text-xs flex items-center justify-center shrink-0 border border-[#DAD3C2]">
                          <FileCode className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-[#1A2236] leading-snug group-hover:text-[#1A2236] transition-colors">
                            {dwg.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#535E78]">
                            <span className="text-[#535E78] font-semibold">{E(dwg.discipline)}</span>
                            <span>{D(dwg.fileSize)}</span>
                            <span>{dwg.project}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Code */}
                    <td className="py-4 px-4 text-center">
                      <span className="font-mono font-black text-[#1A2236] bg-[#E9E3D5] px-2.5 py-1 rounded-lg text-xs text-[#1A2236]">
                        {dwg.code}
                      </span>
                    </td>

                    {/* Revision */}
                    <td className="py-4 px-4 text-center">
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-[#E9E3D5] text-[#1A2236] border border-[#DAD3C2]">
                        {dwg.rev}
                      </span>
                    </td>

                    {/* Upload Date */}
                    <td className="py-4 px-4 text-center text-xs text-[#535E78] font-medium">
                      {D(dwg.uploadDate)}
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
                        <span>{E(dwg.status)}</span>
                      </span>
                    </td>

                    {/* Actions: Download, Preview, Delete */}
                    <td className="py-4 px-5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Preview */}
                        <button
                          onClick={() => handlePreviewDrawing(dwg.name, dwg.code)}
                          className="p-1.5 rounded-lg text-[#535E78] hover:text-[#1A2236] hover:bg-[#E9E3D5] transition-colors cursor-pointer"
                          title={T("to.106")}
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Download */}
                        <button
                          onClick={() => handleDownloadDrawing(dwg.name, dwg.code)}
                          className="p-1.5 rounded-lg text-[#535E78] hover:text-[#1A2236] hover:bg-[#E9E3D5] transition-colors cursor-pointer"
                          title={T("to.107")}
                        >
                          <Download className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteDrawing(dwg.id, dwg.name)}
                          className="p-1.5 rounded-lg text-[#535E78] hover:text-rose-700 hover:bg-[#E9E3D5] transition-colors cursor-pointer"
                          title={T("to.108")}
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
                  <td colSpan="6" className="py-12 text-center text-[#535E78]">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-[#65708A]" />
                    <p className="font-bold text-[#535E78]">{T("to.109")}</p>
                    <p className="text-xs text-[#535E78] mt-1">
                      جرّب تعديل كلمة البحث أو الضغط على D("+ رفع مخطط جديد")
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 bg-[#F3EFE6] border-t border-[#DAD3C2] flex items-center justify-between text-xs text-[#535E78]">
          <span>
            {D("عرض")} <strong className="text-[#1A2236]">{filteredDrawings.length}</strong> {D("من أصل")}{" "}
            <strong className="text-[#1A2236]">{drawings.length}</strong> {D("مخطط")}
          </span>
          <span className="text-[11px] text-[#535E78]">
            {D("* جميع اللوحات المعتمدة تحمل خاتم AFC الرقمي وتصل فوراً لمهندسي المواقع.")}
          </span>
        </div>
      </div>

      {/* Upload Drawing Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#1A2236]/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-2xl border border-[#DAD3C2] max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 text-start animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#E9E3D5]">
              <h3 className="text-lg font-black text-[#1A2236] flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-[#1A2236]" />
                <span>{T("to.110")}</span>
              </h3>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1.5 rounded-lg text-[#535E78] hover:text-[#1A2236] hover:bg-[#E9E3D5] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-[#535E78] mb-1.5">
                  اسم اللوحة / المخطط <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={T("to.111")}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#DAD3C2] text-xs md:text-sm font-semibold text-[#1A2236] focus:outline-none focus:ring-2 focus:ring-[#24304D]/10 focus:border-[#24304D] transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#535E78] mb-1.5">
                    كود اللوحة (Drawing Code) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={T("to.112")}
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-[#DAD3C2] text-xs font-mono font-bold text-[#1A2236] focus:outline-none focus:ring-2 focus:ring-[#24304D]/10 focus:border-[#24304D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#535E78] mb-1.5">
                    {T("to.113")}
                  </label>
                  <select
                    value={newRev}
                    onChange={(e) => setNewRev(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-[#DAD3C2] text-xs font-bold text-[#1A2236] bg-white"
                  >
                    <option value="Rev. 00">{T("to.114")}</option>
                    <option value="Rev. 01">Rev. 01</option>
                    <option value="Rev. 02">Rev. 02</option>
                    <option value="Rev. 03">Rev. 03</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#535E78] mb-1.5">
                    {T("to.115")}
                  </label>
                  <select
                    value={newDiscipline}
                    onChange={(e) => setNewDiscipline(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-[#DAD3C2] text-xs font-bold text-[#1A2236] bg-white"
                  >
                    <option value="معماري وديكور">{T("to.116")}</option>
                    <option value="كهرباء">{T("to.117")}</option>
                    <option value="ميكانيكا وتكييف">{T("to.118")}</option>
                    <option value="صحي ومياه">{T("to.119")}</option>
                    <option value="إنشائي">{T("to.120")}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#535E78] mb-1.5">
                    {T("to.121")}
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-[#DAD3C2] text-xs font-bold text-[#1A2236] bg-white"
                  >
                    <option value="معتمد للتنفيذ (AFC)">{T("to.122")}</option>
                    <option value="قيد المراجعة">{T("to.123")}</option>
                  </select>
                </div>
              </div>

              {/* Upload Zone Mock */}
              <div className="border-2 border-dashed border-[#C6BEAA] hover:border-[#24304D] rounded-lg p-6 text-center bg-[#F3EFE6] hover:bg-[#E9E3D5] transition-all cursor-pointer">
                <UploadCloud className="w-8 h-8 text-[#535E78] mx-auto mb-2" />
                <p className="text-xs font-bold text-[#1A2236]">
                  {T("to.124")}
                </p>
                <p className="text-[10px] text-[#535E78] mt-1">
                  {T("to.125")}
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#E9E3D5]">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2.5 rounded-lg text-xs font-bold text-[#535E78] hover:bg-[#E9E3D5] cursor-pointer"
                >
                  {T("to.126")}
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#24304D] hover:bg-[#1A2236] hover:bg-[#1A2236] text-white font-bold text-xs md:text-sm shadow-sm transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{T("to.127")}</span>
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
