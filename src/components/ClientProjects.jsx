import { useState } from "react";
import { tr_ as T } from "../i18n";
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
    badgeColor: "bg-[#ECEEF0] text-[#1E2429] border border-[#DDE1E5]",
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

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Luxury Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap mb-1">
              <h1 className="text-2xl md:text-3xl font-black text-[#1E2429] tracking-tight flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#ECEEF0] border border-[#DDE1E5] flex items-center justify-center text-[#1E2429]">
                  <Briefcase className="w-5 h-5" />
                </div>
                <span>{T("cli.97")}</span>
              </h1>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#ECEEF0] text-[#1E2429] border border-[#DDE1E5]/80">
                {T("cli.98", { v0: CLIENT_UNITS.length })}
              </span>
            </div>
            <p className="text-xs md:text-sm text-[#5A646E]">
              {T("cli.99")}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#5A646E] bg-white px-3.5 py-2 rounded-lg border border-[#DDE1E5] shadow-2xs">
              العميل: <strong className="text-[#1E2429]">{T("cli.100")}</strong>
            </span>
          </div>
        </div>

        {/* Units Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {CLIENT_UNITS.map((unit) => (
            <div
              key={unit.id}
              className="bg-white rounded-lg border border-[#DDE1E5] shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              {/* Cover Image with Gradient Overlay */}
              <div className="relative h-48 overflow-hidden bg-[#2B3138]">
                <img
                  src={unit.image}
                  alt={unit.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E2429]/80 via-transparent to-transparent" />

                {/* Status Badge in Photo */}
                <div className="absolute top-3.5 start-3.5">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border backdrop-blur-md shadow-xs ${unit.badgeColor}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    <span>{unit.phase}</span>
                  </span>
                </div>

                {/* Progress bar overlay at bottom of cover photo */}
                <div className="absolute bottom-3 start-3 end-3 flex items-center justify-between text-white">
                  <span className="text-xs font-black">{unit.name}</span>
                  <span className="text-xs font-mono font-bold text-amber-300">
                    {T("cli.101", { v0: unit.progress })}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4 flex-1">
                {/* Location & Type */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-[#5A646E]">
                    <MapPin className="w-3.5 h-3.5 text-[#5A646E] shrink-0" />
                    <span className="truncate">{unit.location}</span>
                  </div>
                  <p className="text-xs font-bold text-[#5A646E]">{unit.type}</p>
                </div>

                {/* Progress Track */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#5A646E] font-medium">{T("cli.102")}</span>
                    <span className="text-xs font-bold text-[#1E2429] tracking-wide font-mono">
                      %{unit.progress}
                    </span>
                  </div>
                  <ProgressBar value={unit.progress} />
                </div>

                {/* Specs List */}
                <div className="p-3 bg-[#F3F4F6] rounded-lg border border-[#ECEEF0] space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#5A646E]">{T("cli.103")}</span>
                    <span className="font-bold text-[#1E2429]">{unit.area}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5A646E]">{T("cli.104")}</span>
                    <span className="font-bold text-[#1E2429] font-mono">{unit.expectedHandover}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5A646E]">{T("cli.105")}</span>
                    <span className="font-bold text-[#1E2429] truncate max-w-[160px]">{unit.engineer}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 bg-[#F3F4F6]/60 border-t border-[#ECEEF0] flex items-center gap-2">
                <button
                  onClick={() => handleAction(unit.name, "تقرير الإنجاز وصور الموقع")}
                  className="flex-1 py-2 px-3 rounded-lg border border-[#DDE1E5] bg-white hover:bg-[#F3F4F6] text-[#1E2429] text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-[#5A646E]" />
                  <span>{T("cli.106")}</span>
                </button>

                <button
                  onClick={() => handleAction(unit.name, "المخططات الهندسية 3D")}
                  className="flex-1 py-2 px-3 rounded-lg bg-[#2B3138] hover:bg-[#1E2429] text-white hover:bg-[#1E2429] transition-colors text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{T("cli.107")}</span>
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
