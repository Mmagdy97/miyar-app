import { useState } from "react";
import { tr_ as T, E } from "../i18n";
import ProgressBar from "./ProgressBar";
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  Building2,
  Sparkles,
  Zap,
  Droplets,
  Paintbrush,
  Hammer,
  Layers,
  ShieldCheck,
  Check,
} from "lucide-react";
import { clientProject } from "../data/seed";

const DISCIPLINES_PROGRESS = [
  {
    id: 1,
    name: "أعمال السباكة وتغذية المياه",
    percentage: 100,
    status: "مكتمل بالكامل ومختبر ✓",
    statusBadge: "bg-emerald-50 text-emerald-800 border-emerald-200",
    color: "bg-emerald-700",
    icon: Droplets,
    details: "تم اختبار شبكة التغذية على ٨ بار وعزل الحمامات كيميائياً بالكامل.",
  },
  {
    id: 2,
    name: "أعمال الكهرباء والإنارة المعمارية",
    percentage: 90,
    status: "متقدم - جاري سحب الأسلاك",
    statusBadge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    color: "bg-[#2B3138]",
    icon: Zap,
    details: "تأسيس الشرب، علب ماجيك، ومسارات كابلات السويدي المعتمدة.",
  },
  {
    id: 3,
    name: "أعمال المحارة والأسمنت",
    percentage: 85,
    status: "مكتمل بؤج وأوتار وتأكيس",
    statusBadge: "bg-[#ECEEF0] text-[#1E2429] border-[#DDE1E5]",
    color: "bg-[#1E2429]",
    icon: Layers,
    details: "استلام استواء الحوائط والزوايا بشبك فايبر ضد الترييح والشروخ.",
  },
  {
    id: 4,
    name: "أعمال الجبسوم بورد والتجليد الخشبي",
    percentage: 40,
    status: "قيد التنفيذ - شاسيهات صاج",
    statusBadge: "bg-amber-50 text-amber-800 border-amber-200",
    color: "bg-amber-600",
    icon: Hammer,
    details: "تركيب ألواح كناوف خضراء مقاومة للرطوبة وتجهيز ممرات الليد بروفايل.",
  },
  {
    id: 5,
    name: "أعمال الأرضيات ورخام الاستقبال",
    percentage: 60,
    status: "قيد التوريد والتركيب",
    statusBadge: "bg-amber-50 text-amber-800 border-amber-200",
    color: "bg-amber-700",
    icon: Sparkles,
    details: "توريد رخام تريستا بيج مصقول وجاري التركيب بمونة مفلفلة.",
  },
  {
    id: 6,
    name: "الدهانات الديكورية والتشطيب النهائي",
    percentage: 25,
    status: "مرحلة المعجون والبطانة الأولى",
    statusBadge: "bg-[#ECEEF0] text-[#5A646E] border-[#DDE1E5]",
    color: "from-[#D9480F] to-[#2B3138]",
    icon: Paintbrush,
    details: "دهانات جوتن فينوماتيك مخملية ناعمة جاري تحضير بطانتها.",
  },
];

function ClientProgress() {
  const overallPercentage = clientProject().progress;

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent pb-24 font-ibm w-full max-w-full overflow-x-hidden">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap mb-1">
              <h1 className="text-2xl md:text-3xl font-black text-[#1E2429] tracking-tight flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#ECEEF0] border border-[#DDE1E5] flex items-center justify-center text-[#1E2429]">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span>{T("cli.108")}</span>
              </h1>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {T("cli.124")}
              </span>
            </div>
            <p className="text-xs md:text-sm text-[#5A646E]">
              {T("cli.110")}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{T("cli.111")}</span>
            </span>
          </div>
        </div>

        {/* Hero Section: Large Circular Progress Ring (75%) */}
        <div className="bg-[#171B21] rounded-xl p-6 md:p-8 text-white shadow-sm border border-[#20262C] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="relative z-10 space-y-3 max-w-lg text-center md:text-start">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white backdrop-blur-md border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>{T("cli.112")}</span>
            </span>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
              {T("cli.113")}
            </h2>
            <p className="text-xs md:text-sm text-[#ECEEF0] leading-relaxed">
              {T("cli.114")}
            </p>

            <div className="pt-2 flex items-center justify-center md:justify-start gap-4 text-xs text-[#ECEEF0]">
              <span>{T("cli.115")} <strong>{T("cli.116")}</strong></span>
              <span>•</span>
              <span>{T("cli.117")} <strong className="text-white">{T("cli.118")}</strong></span>
            </div>
          </div>

          {/* Large Circular Progress Ring */}
          <div className="relative shrink-0 flex items-center justify-center">
            <svg className="w-44 h-44 -rotate-90">
              {/* Background circle track */}
              <circle
                cx="88"
                cy="88"
                r="72"
                stroke="currentColor"
                strokeWidth="14"
                className="text-white/10"
                fill="transparent"
              />
              {/* Progress stroke with 75% calculation: 2 * pi * 72 ≈ 452.39 */}
              <circle
                cx="88"
                cy="88"
                r="72"
                stroke="url(#progressGradient)"
                strokeWidth="14"
                strokeDasharray={452.4}
                strokeDashoffset={452.4 * (1 - overallPercentage / 100)}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D9480F" />
                  <stop offset="100%" stopColor="#7B848E" />
                </linearGradient>
              </defs>
            </svg>

            {/* Inner Ring Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl md:text-4xl font-black tracking-tight text-white font-mono">
                %{overallPercentage}
              </span>
              <span className="text-[11px] font-bold text-[#7B848E] mt-0.5">
                {T("cli.119")}
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown for each Discipline */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-[#1E2429] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#1E2429]" />
              <span>{T("cli.120")}</span>
            </h3>
            <span className="text-xs text-[#5A646E]">{T("cli.121")}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DISCIPLINES_PROGRESS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-lg p-5 border border-[#DDE1E5] shadow-xs hover:shadow-md transition-all space-y-3.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-[#ECEEF0] text-[#1E2429] flex items-center justify-center border border-[#DDE1E5] shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-[#1E2429] leading-tight">
                          {item.name}
                        </h4>
                        <span className="text-[10px] text-[#5A646E] mt-0.5 block">
                          {item.details}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${item.statusBadge}`}
                    >
                      {E(item.status)}
                    </span>
                  </div>

                  {/* Progress Track */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[11px] font-bold text-[#5A646E]">{T("cli.122")}</span>
                      <span className="text-xs font-bold text-[#1E2429] tracking-wide font-mono">
                        %{item.percentage}
                      </span>
                    </div>
                    <ProgressBar
                      value={item.percentage}
                      isCompleted={item.percentage === 100}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}

export default ClientProgress;
