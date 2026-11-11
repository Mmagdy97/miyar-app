import { createPersistedStore } from "../data/persisted";
import { useState, useMemo } from "react";
import { localize, D } from "../data/dataI18n";
import { tr_ as T, E } from "../i18n";
import {
  AlertTriangle,
  Plus,
  CheckCircle2,
  Clock,
  Building2,
  X,
  User,
  Check,
  RotateCcw,
  Sparkles,
  Camera,
  ShieldAlert,
} from "lucide-react";

const INITIAL_SNAGS = localize([
  {
    id: 1,
    description: "شرخ سطحي وترييح في دهان جدار غرفة النوم الرئيسية",
    location: "الدور الأول - غرفة النوم الرئيسية",
    contractor: D("مقاول الدهانات (الأسطى حسن)"),
    severity: "متوسطة", // حرجة | متوسطة | طفيفة
    status: "قيد الملاحظة", // قيد الملاحظة | تمت المعالجة
    date: "اليوم، ١٠:٣٠ ص",
  },
  {
    id: 2,
    description: "تسريب مياه بسيط عند سن محبس دفن حمام الضيوف",
    location: "الدور الأرضي - حمام الضيوف",
    contractor: D("فني السباكة (الأسطى رجب)"),
    severity: "حرجة",
    status: "قيد الملاحظة",
    date: "اليوم، ٠٩:١٥ ص",
  },
  {
    id: 3,
    description: "فروق وزنات وتطبيش في زاوية الجبسوم بورد لبيت النور",
    location: "منطقة الاستقبال والمدخل",
    contractor: D("فريق الجبسوم بورد (شركة ديكور بلس)"),
    severity: "متوسطة",
    status: "تمت المعالجة",
    date: "أمس، ٠٤:٠٠ م",
  },
  {
    id: 4,
    description: "تفريغ في سقية عرانيس رخام التريستا بالمدخل الرئيسي",
    location: "المدخل الرئيسي الخارجي",
    contractor: D("معلم الرخام (الأسطى فتحي)"),
    severity: "طفيفة",
    status: "تمت المعالجة",
    date: "أمس، ١١:٢٠ ص",
  },
]);

const SEVERITY_COLORS = localize({
  حرجة: "bg-rose-50 text-rose-800 border-rose-200",
  متوسطة: "bg-amber-50 text-amber-800 border-amber-200",
  طفيفة: "bg-[#EEECE6] text-[#5D6168] border-[#E3E0D9]",
});

const snagsStore = createPersistedStore("miyar:snags:v1", INITIAL_SNAGS);

function SiteEngineerSnagList() {
  const [snags, setSnags] = snagsStore.use();
  const [filter, setFilter] = useState("الكل");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // New snag form state
  const [newDesc, setNewDesc] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newSeverity, setNewSeverity] = useState("متوسطة");
  const [newContractor, setNewContractor] = useState("");

  // Toggle resolve status
  const handleToggleStatus = (id) => {
    setSnags((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const nextStatus =
            s.status === "تمت المعالجة" ? "قيد الملاحظة" : "تمت المعالجة";
          setToastMessage(
            nextStatus === "تمت المعالجة"
              ? D("تم تحديث الملاحظة إلى \"تمت المعالجة\" بنجاح ✓")
              : D("تمت إعادة فتح الملاحظة للمراجعة")
          );
          setTimeout(() => setToastMessage(null), 3000);
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );
  };

  // Add new snag submit
  const handleAddSnag = (e) => {
    e.preventDefault();
    if (!newDesc.trim() || !newLocation.trim()) return;

    const newSnag = {
      id: Date.now(),
      description: newDesc.trim(),
      location: newLocation.trim(),
      contractor: newContractor.trim() || D("فريق التشطيبات بالموقع"),
      severity: newSeverity,
      status: "قيد الملاحظة",
      date: "الآن",
    };

    setSnags((prev) => [newSnag, ...prev]);
    setIsModalOpen(false);
    setNewDesc("");
    setNewLocation("");
    setNewContractor("");
    setToastMessage(D("تم توثيق ملاحظة جديدة في قائمة العيوب (Snag List)"));
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Stats
  const stats = useMemo(() => {
    const total = snags.length;
    const pending = snags.filter((s) => s.status === "قيد الملاحظة").length;
    const resolved = snags.filter((s) => s.status === "تمت المعالجة").length;
    return { total, pending, resolved };
  }, [snags]);

  // Filtered snags
  const filteredSnags = useMemo(() => {
    if (filter === "قيد الملاحظة") return snags.filter((s) => s.status === "قيد الملاحظة");
    if (filter === "تمت المعالجة") return snags.filter((s) => s.status === "تمت المعالجة");
    return snags;
  }, [snags, filter]);

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent pb-24 font-ibm w-full max-w-full overflow-x-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 end-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#2B3138] text-white rounded-xl shadow-xl border border-white/10 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-xs font-bold leading-relaxed">{toastMessage}</p>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header & Quick Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap mb-1">
              <h1 className="text-2xl md:text-3xl font-black text-[#16181C] tracking-tight flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#EEECE6] border border-[#E3E0D9] flex items-center justify-center text-[#16181C]">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <span>{T("se.80")}</span>
              </h1>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                {T("se.81", { v0: stats.pending })}
              </span>
            </div>
            <p className="text-xs md:text-sm text-[#5D6168]">
              {T("se.82")}
            </p>
          </div>

          {/* Button: + إضافة ملاحظة جديدة */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold text-white bg-[#2B3138] hover:bg-[#16181C] transition-colors shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{T("se.83")}</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid stat-grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          <div className="bg-white rounded-lg p-4 border border-[#E3E0D9] shadow-xs text-center">
            <span className="text-[11px] font-bold text-[#5D6168] block mb-1">{T("se.84")}</span>
            <span className="text-xl md:text-2xl font-black text-[#16181C]">{stats.total}</span>
          </div>

          <div className="bg-white rounded-lg p-4 border border-[#E3E0D9] shadow-xs text-center">
            <span className="text-[11px] font-bold text-[#5D6168] block mb-1">{T("se.85")}</span>
            <span className="text-xl md:text-2xl font-black text-rose-700">{stats.pending}</span>
          </div>

          <div className="bg-white rounded-lg p-4 border border-[#E3E0D9] shadow-xs text-center">
            <span className="text-[11px] font-bold text-[#5D6168] block mb-1">{T("se.86")}</span>
            <span className="text-xl md:text-2xl font-black text-emerald-700">{stats.resolved}</span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          {["الكل", "قيد الملاحظة", "تمت المعالجة"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filter === tab
                  ? "bg-[#2B3138] text-white shadow-sm"
                  : "bg-white text-[#5D6168] border border-[#E3E0D9] hover:bg-[#F6F5F1]"
              }`}
            >
              {E(tab)}
            </button>
          ))}
        </div>

        {/* Snag List Items */}
        <div className="space-y-3.5">
          {filteredSnags.map((snag) => {
            const isResolved = snag.status === "تمت المعالجة";
            const severityClass =
              SEVERITY_COLORS[snag.severity] || SEVERITY_COLORS["طفيفة"];

            return (
              <div
                key={snag.id}
                className={`bg-white rounded-lg p-5 border transition-all duration-200 ${
                  isResolved
                    ? "border-emerald-200/70 bg-emerald-50/15 rounded-lg"
                    : "border-[#E3E0D9] rounded-lg shadow-xs"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${severityClass}`}
                      >
                        {T("se.87", { v0: D(snag.severity) })}
                      </span>
                      <span className="text-[11px] text-[#5D6168]">{snag.date}</span>
                    </div>

                    <h3
                      className={`text-sm md:text-base font-extrabold leading-snug ${
                        isResolved ? "line-through text-[#5D6168]" : "text-[#16181C]"
                      }`}
                    >
                      {snag.description}
                    </h3>
                  </div>

                  {/* Toggle Status Button */}
                  <button
                    onClick={() => handleToggleStatus(snag.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isResolved
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                        : "bg-[#EEECE6] text-[#5D6168] border border-[#E3E0D9] hover:bg-[#E3E0D9]"
                    }`}
                  >
                    {isResolved ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>{T("se.88")}</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        <span>{T("se.89")}</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="pt-3 border-t border-[#EEECE6] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#5D6168]">
                  <span className="flex items-center gap-1 text-[#5D6168]">
                    <Building2 className="w-3.5 h-3.5 text-[#5D6168]" />
                    <span>{T("se.90")} <strong className="text-[#5D6168]">{snag.location}</strong></span>
                  </span>

                  <span className="flex items-center gap-1 text-[#5D6168]">
                    <User className="w-3.5 h-3.5 text-[#5D6168]" />
                    <span>{T("se.91")} <strong className="text-[#16181C]">{snag.contractor}</strong></span>
                  </span>
                </div>
              </div>
            );
          })}

          {filteredSnags.length === 0 && (
            <div className="py-12 text-center bg-white rounded-lg border border-[#E3E0D9] p-8">
              <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-emerald-500" />
              <h4 className="text-sm font-bold text-[#16181C]">{T("se.92")}</h4>
              <p className="text-xs text-[#5D6168] mt-1">
                {T("se.93")}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Snag Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#16181C]/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-2xl border border-[#E3E0D9] max-w-md w-full p-6 md:p-8 text-start animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#EEECE6]">
              <h3 className="text-base font-black text-[#16181C] flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span>{T("se.94")}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-[#5D6168] hover:text-[#16181C] hover:bg-[#EEECE6]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSnag} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-[#5D6168] mb-1.5">
                  وصف الملاحظة / العيب بالتفصيل <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder={T("se.95")}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E3E0D9] text-xs md:text-sm font-semibold text-[#16181C] focus:outline-none focus:ring-2 focus:ring-[#2B3138]/10 focus:border-[#2B3138]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5D6168] mb-1.5">
                  المكان / الغرفة بالموقع <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={T("se.96")}
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E3E0D9] text-xs md:text-sm font-semibold text-[#16181C] focus:outline-none focus:ring-2 focus:ring-[#2B3138]/10 focus:border-[#2B3138]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#5D6168] mb-1.5">{T("se.97")}</label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#E3E0D9] text-xs font-bold text-[#16181C] bg-white"
                  >
                    <option value="طفيفة">{T("se.98")}</option>
                    <option value="متوسطة">{T("se.99")}</option>
                    <option value="حرجة">{T("se.100")}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5D6168] mb-1.5">{T("se.101")}</label>
                  <input
                    type="text"
                    placeholder={T("se.102")}
                    value={newContractor}
                    onChange={(e) => setNewContractor(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#E3E0D9] text-xs font-semibold text-[#16181C]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#EEECE6]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-[#5D6168] hover:bg-[#EEECE6]"
                >
                  {T("se.124")}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#2B3138] hover:bg-[#16181C] hover:bg-[#16181C] text-white font-bold text-xs shadow-sm"
                >
                  {T("se.104")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default SiteEngineerSnagList;
