import { createPersistedStore } from "../data/persisted";
import { useState } from "react";
import { localize, D, DF } from "../data/dataI18n";
import { tr_ as T, E } from "../i18n";
import {
  PackageSearch,
  Send,
  CheckCircle2,
  Clock,
  Calendar,
  Building2,
  Layers,
  Sparkles,
  Truck,
  RotateCcw,
  Check,
  AlertCircle,
} from "lucide-react";

const INITIAL_REQUESTS = localize([
  {
    id: 1,
    materialType: "أسمنت بورتلاندي مقاوم للكبريتات (سويف)",
    quantity: "١٥٠ شيكارة (٧.٥ طن)",
    requiredDate: "غداً صباحاً (٠٩:٠٠ ص)",
    project: "فيلا الياسمين - التجمع الخامس",
    status: "جاري الشحن", // قيد المراجعة | جاري الشحن | تم التوريد
    notes: "مطلوب ونش تنزيل للتشوين بالبدروم الداخلي مباشرة",
    requestDate: "اليوم، ٠٨:٣٠ ص",
  },
  {
    id: 2,
    materialType: "رمل حرش مغسول عالي الجودة لبياض المحارة",
    quantity: "٢ قلاب كبير (٤٠ م³)",
    requiredDate: "بعد غد",
    project: "فيلا الياسمين - التجمع الخامس",
    status: "قيد المراجعة",
    notes: "التشوين في الساحة الخارجية أمام السور الشرقي",
    requestDate: "اليوم، ١١:١٥ ص",
  },
  {
    id: 3,
    materialType: "مواسير بولي بروبلين ٣/٤ بوصة وصرف ٤ بوصة الشريف",
    quantity: "٤٥ عود تغذية + ٣٠ عود صرف",
    requiredDate: D("أمس"),
    project: "فيلا الياسمين - التجمع الخامس",
    status: "تم التوريد",
    notes: "تم الاستلام والمطابقة بمعرفة م. محمد وتخزينها بالموقع",
    requestDate: "أمس، ٠٩:٠٠ ص",
  },
]);

const STATUS_BADGES = localize({
  "قيد المراجعة": "bg-amber-50 text-amber-800 border-amber-200",
  "جاري الشحن": "bg-[#E9E3D5] text-[#1A2236] border-[#DAD3C2]",
  "تم التوريد": "bg-emerald-50 text-emerald-800 border-emerald-200",
});

const requestsStore = createPersistedStore("miyar:requests:v1", INITIAL_REQUESTS);

function SiteEngineerMaterialRequests({ actionItems, setActionItems, setSelectedItem }) {
  const [requests, setRequests] = requestsStore.use();
  const [toastMessage, setToastMessage] = useState(null);

  // Form State
  const [materialType, setMaterialType] = useState("أسمنت");
  const [customMaterial, setCustomMaterial] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("شيكارة");
  const [requiredDate, setRequiredDate] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle Form Submit
  const handleSubmitRequest = (e) => {
    e.preventDefault();
    if (!quantity) return;

    const finalMaterialName =
      materialType ==="أخرى"
        ? customMaterial.trim() || "خامات أخرى"
        : materialType;

    const fullMaterialDetails =
      materialType ==="أخرى"
        ? customMaterial.trim() || "خامات تشطيبات متنوعة"
        : `${materialType}${customMaterial.trim() ? " (" + customMaterial.trim() + ")" : ""}`;

    const newReq = {
      id: Date.now(),
      materialType: fullMaterialDetails,
      quantity: `${quantity} ${unit}`,
      requiredDate: requiredDate || D("خلال ٤٨ ساعة"),
      project: "فيلا الياسمين - التجمع الخامس",
      status: "قيد المراجعة",
      notes: notes.trim() || D("تشوين عادي بالموقع"),
      requestDate: "الآن",
    };

    // Update local requests list
    setRequests((prev) => [newReq, ...prev]);

    // Requirement 2: Trigger setActionItems to prepend a new notification object for the Admin
    if (setActionItems) {
      const newNotification = {
        id: Date.now(),
        title: D("طلب توريد خامات: ") + finalMaterialName,
        subtitle: DF("الكمية: {0} {1} • موعد التوريد: {2}", quantity, unit, requiredDate || D("خلال ٤٨ ساعة")),
        user: "م. محمد (الموقع)",
        project: D("فيلا الياسمين - التجمع"),
        category: "طلب تشوين وتوريد",
        amount: `${quantity} ${unit}`,
        targetRole: "Admin",
        time: "الآن",
        timestamp: "الآن",
        type: "material_request",
        status: "pending",
      };
      setActionItems((prev) => [newNotification, ...prev]);
    }

    // Requirement 3: Clear the input fields
    setMaterialType(D("أسمنت"));
    setCustomMaterial("");
    setQuantity("");
    setUnit(D("شيكارة"));
    setRequiredDate("");
    setNotes("");

    // Requirement 3: Show local success state/toast for 3 seconds
    setToastMessage(D("تم إرسال الطلب للإدارة بنجاح ✔️"));
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

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2.5 flex-wrap mb-1">
            <h1 className="text-2xl md:text-3xl font-black text-[#1A2236] tracking-tight flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#E9E3D5] border border-[#DAD3C2] flex items-center justify-center text-[#1A2236]">
                <Truck className="w-5 h-5" />
              </div>
              <span>{T("se.50")}</span>
            </h1>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#E9E3D5] text-[#1A2236] border border-[#DAD3C2]">
              {T("se.51")}
            </span>
          </div>
          <p className="text-xs md:text-sm text-[#535E78]">
            {T("se.52")}
          </p>
        </div>

        {/* Top: The Material Request Form */}
        <div className="bg-white rounded-lg p-5 md:p-7 border border-[#DAD3C2] shadow-xs">
          <div className="flex items-center gap-2 pb-4 mb-4 border-b border-[#E9E3D5]">
            <PackageSearch className="w-5 h-5 text-[#1A2236]" />
            <h2 className="text-base font-extrabold text-[#1A2236]">
              {T("se.53")}
            </h2>
          </div>

          <form onSubmit={handleSubmitRequest} className="space-y-4">
            {/* Field 1: Material Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#535E78] mb-1.5">
                  {D("نوع الخامة")} <span className="text-rose-500">*</span>
                </label>
                <select
                  value={materialType}
                  onChange={(e) => setMaterialType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#DAD3C2] text-xs md:text-sm font-bold text-[#1A2236] bg-white focus:outline-none focus:ring-2 focus:ring-[#24304D]/10 focus:border-[#24304D]"
                >
                  <option value="أسمنت">{T("se.54")}</option>
                  <option value="رمل">{T("se.55")}</option>
                  <option value="سيراميك وبورسلين">{T("se.56")}</option>
                  <option value="مواسير سباكة">{T("se.57")}</option>
                  <option value="كابلات كهرباء">{T("se.58")}</option>
                  <option value="جبسوم بورد">{T("se.59")}</option>
                  <option value="أخرى">{T("se.60")}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#535E78] mb-1.5">
                  {T("se.61")}
                </label>
                <input
                  type="text"
                  placeholder={T("se.62")}
                  value={customMaterial}
                  onChange={(e) => setCustomMaterial(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#DAD3C2] text-xs md:text-sm font-semibold text-[#1A2236] focus:outline-none focus:ring-2 focus:ring-[#24304D]/10 focus:border-[#24304D]"
                />
              </div>
            </div>

            {/* Field 2: Quantity & Required Date */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#535E78] mb-1.5">
                  {D("الكمية المطلوبة")} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  step="any"
                  required
                  placeholder={T("se.63")}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#DAD3C2] text-xs md:text-sm font-black text-[#1A2236] focus:outline-none focus:ring-2 focus:ring-[#24304D]/10 focus:border-[#24304D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#535E78] mb-1.5">{T("se.64")}</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-[#DAD3C2] text-xs md:text-sm font-bold text-[#1A2236] bg-white"
                >
                  <option value="شيكارة">{T("se.65")}</option>
                  <option value="طن">{T("se.66")}</option>
                  <option value="متر مكعب (م³)">{T("se.67")}</option>
                  <option value="متر مربع (م²)">{T("se.68")}</option>
                  <option value="لوح">{T("se.69")}</option>
                  <option value="لفة / بكرة">{T("se.70")}</option>
                  <option value="قلاب كبير">{T("se.71")}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#535E78] mb-1.5">
                  {D("موعد التوريد المطلوب")} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={requiredDate}
                  onChange={(e) => setRequiredDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#DAD3C2] text-xs md:text-sm font-semibold text-[#1A2236] focus:outline-none focus:ring-2 focus:ring-[#24304D]/10 focus:border-[#24304D]"
                />
              </div>
            </div>

            {/* Field 3: Notes */}
            <div>
              <label className="block text-xs font-bold text-[#535E78] mb-1.5">
                {T("se.72")}
              </label>
              <input
                type="text"
                placeholder={T("se.73")}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#DAD3C2] text-xs md:text-sm text-[#1A2236] focus:outline-none focus:ring-2 focus:ring-[#24304D]/10 focus:border-[#24304D]"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#24304D] hover:bg-[#1A2236] text-white hover:bg-[#1A2236] transition-colors font-bold text-sm transition-all cursor-pointer disabled:opacity-50 shadow-sm"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? "جاري الإرسال..." : D("إرسال الطلب للإدارة")}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Bottom: Recent Requests List */}
        <div className="bg-white rounded-lg p-5 md:p-6 border border-[#DAD3C2] shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E9E3D5]">
            <div>
              <h3 className="text-base font-extrabold text-[#1A2236] flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#1A2236]" />
                <span>{T("se.75")}</span>
              </h3>
              <p className="text-xs text-[#535E78] mt-0.5">
                {T("se.76")}
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#E9E3D5] text-[#535E78]">
              {T("se.77", { v0: requests.length })}
            </span>
          </div>

          <div className="space-y-3">
            {requests.map((req) => {
              const statusClass =
                STATUS_BADGES[req.status] || STATUS_BADGES["قيد المراجعة"];

              return (
                <div
                  key={req.id}
                  className="p-4 rounded-lg border border-[#DAD3C2] bg-white hover:border-[#B5452B] shadow-xs transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="text-sm font-extrabold text-[#1A2236]">
                        {req.materialType}
                      </h4>
                      <p className="text-xs text-[#535E78] mt-0.5 flex items-center gap-1.5">
                        <strong className="text-[#1A2236] font-bold">{req.quantity}</strong>
                        <span>•</span>
                        <span>{T("se.78", { v0: req.requiredDate })}</span>
                      </p>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shrink-0 ${statusClass}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      <span>{E(req.status)}</span>
                    </span>
                  </div>

                  {req.notes && (
                    <div className="pt-2 mt-2 border-t border-[#E9E3D5] flex items-center justify-between text-xs text-[#535E78]">
                      <span>{T("se.79", { v0: req.notes })}</span>
                      <span>{req.requestDate}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}

export default SiteEngineerMaterialRequests;
