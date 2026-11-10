import { useState } from "react";
import ProgressBar from "./ProgressBar";
import {
  Briefcase,
  Building2,
  MapPin,
  Calendar,
  CheckCircle2,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  Layers,
  Eye,
  FileText,
  Clock,
} from "lucide-react";
import { clientProject } from "../data/seed";

const CLIENT_UNITS = [
  {
    id: 1,
    name: "فيلا الياسمين - التجمع الخامس",
    type: "فيلا سكنية منفصلة (Stand-alone)",
    location: "حي الياسمين، القاهرة الجديدة",
    area: "٦٥٠ م² (أرضي + أول + بدروم + رووف)",
    phase: "مرحلة التشطيبات",
    progress: clientProject().progress,
    status: "جاري العمل وفق الجدول",
    startDate: "سبتمبر ٢٠٢٦",
    expectedHandover: "ديسمبر ٢٠٢٦",
    engineer: "م. كريم مصطفى (الموقع) / م. سارة (التصميم)",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
    badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
  },
  {
    id: 2,
    name: "شقة الساحل الشمالي - هاسيندا باي",
    type: "شاليه صيفي بإطلالة بحرية",
    location: "الكيلو ١٢٤، الساحل الشمالي",
    area: "١٨٠ م² + حديقة ٨٠ م²",
    phase: "قيد التصميم والاعتمادات المبدئية",
    progress: 25,
    status: "مرحلة مراجعة المخططات 3D",
    startDate: "أكتوبر ٢٠٢٦",
    expectedHandover: "مايو ٢٠٢٧",
    engineer: "م. ليلى رياض (مصممة الديكور)",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80",
    badgeColor: "bg-[#EFEEE8] text-[#202923] border border-[#E5E6DF]",
  },
  {
    id: 3,
    name: "دوبلكس زايد - سوديك ويست",
    type: "بنتهاوس مع مسبح خاص",
    location: "بيفرلي هيلز، الشيخ زايد",
    area: "٣٤٠ م²",
    phase: "قيد التجهيز وبدء الحصر",
    progress: 10,
    status: "قيد إعداد المقايسة التعاقدية",
    startDate: "نوفمبر ٢٠٢٦",
    expectedHandover: "أغسطس ٢٠٢٧",
    engineer: "المكتب الفني / قسم التعاقدات",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80",
    badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
  },
];

function ClientProjects() {
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const handleAction = (unitName, actionType) => {
    setToastMessage(`جاري فتح ${actionType} لمشروع: ${unitName}...`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent pb-24 font-ibm w-full max-w-full overflow-x-hidden" dir="rtl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 left-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#183C35] text-white rounded-xl shadow-xl border border-white/10 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-xs font-bold leading-relaxed">{toastMessage}</p>
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Luxury Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap mb-1">
              <h1 className="text-2xl md:text-3xl font-black text-[#202923] tracking-tight flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#EFEEE8] border border-[#E5E6DF] flex items-center justify-center text-[#202923]">
                  <Briefcase className="w-5 h-5" />
                </div>
                <span>مشاريعي الحالية</span>
              </h1>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EFEEE8] text-[#202923] border border-[#E5E6DF]/80">
                {CLIENT_UNITS.length} وحدات استثمارية وسكنية
              </span>
            </div>
            <p className="text-xs md:text-sm text-[#526257]">
              متابعة شاملة لوحداتك العقارية ومشاريع التصميم الداخلي الموكلة لشركة معيار.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#526257] bg-white px-3.5 py-2 rounded-lg border border-[#E5E6DF] shadow-2xs">
              العميل: <strong className="text-[#202923]">أ. محمد عبد الرحمن</strong>
            </span>
          </div>
        </div>

        {/* Units Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {CLIENT_UNITS.map((unit) => (
            <div
              key={unit.id}
              className="bg-white rounded-lg border border-[#E5E6DF] shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              {/* Cover Image with Gradient Overlay */}
              <div className="relative h-48 overflow-hidden bg-[#183C35]">
                <img
                  src={unit.image}
                  alt={unit.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#202923]/80 via-transparent to-transparent" />

                {/* Status Badge in Photo */}
                <div className="absolute top-3.5 right-3.5">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border backdrop-blur-md shadow-xs ${unit.badgeColor}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    <span>{unit.phase}</span>
                  </span>
                </div>

                {/* Progress bar overlay at bottom of cover photo */}
                <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-white">
                  <span className="text-xs font-black">{unit.name}</span>
                  <span className="text-xs font-mono font-bold text-amber-300">
                    %{unit.progress} إنجاز
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4 flex-1">
                {/* Location & Type */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-[#526257]">
                    <MapPin className="w-3.5 h-3.5 text-[#526257] shrink-0" />
                    <span className="truncate">{unit.location}</span>
                  </div>
                  <p className="text-xs font-bold text-[#526257]">{unit.type}</p>
                </div>

                {/* Progress Track */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#526257] font-medium">نسبة تقدم الأعمال:</span>
                    <span className="text-xs font-bold text-[#202923] tracking-wide font-mono">
                      %{unit.progress}
                    </span>
                  </div>
                  <ProgressBar value={unit.progress} />
                </div>

                {/* Specs List */}
                <div className="p-3 bg-[#F5F3ED] rounded-lg border border-[#EFEEE8] space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#526257]">المساحة:</span>
                    <span className="font-bold text-[#202923]">{unit.area}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#526257]">الموعد النهائي:</span>
                    <span className="font-bold text-[#202923] font-mono">{unit.expectedHandover}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#526257]">فريق الإشراف:</span>
                    <span className="font-bold text-[#202923] truncate max-w-[160px]">{unit.engineer}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 bg-[#F5F3ED]/60 border-t border-[#EFEEE8] flex items-center gap-2">
                <button
                  onClick={() => handleAction(unit.name, "تقرير الإنجاز وصور الموقع")}
                  className="flex-1 py-2 px-3 rounded-lg border border-[#E5E6DF] bg-white hover:bg-[#F5F3ED] text-[#202923] text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-[#526257]" />
                  <span>صور الموقع</span>
                </button>

                <button
                  onClick={() => handleAction(unit.name, "المخططات الهندسية 3D")}
                  className="flex-1 py-2 px-3 rounded-lg bg-[#183C35] hover:bg-[#202923] text-white hover:bg-[#202923] transition-colors text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>معاينة 3D</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default ClientProjects;
