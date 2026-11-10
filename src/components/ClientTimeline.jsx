import { useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Sparkles,
  Building2,
  Check,
  Flag,
  ArrowRight,
  ShieldCheck,
  Layers,
  ChevronLeft,
} from "lucide-react";
import { clientProject, toAr } from "../data/seed";

const TIMELINE_STEPS = [
  {
    id: 1,
    phase: "المرحلة الأولى: التصميم والاعتمادات المعمارية",
    dateRange: "١ سبتمبر ٢٠٢٦ — ٢٥ سبتمبر ٢٠٢٦",
    status: "مكتملة بالكامل ✓",
    statusType: "completed", // completed | active | upcoming
    description:
      "إعداد المخططات ثنائية وثلاثية الأبعاد (2D & 3D Renders)، مطابقة الفرش وتوزيع الإضاءة، واعتماد كود الألوان وعينات الرخام والبورسلين.",
    deliverables: [
      "مخطط توزيع الفرش والكهرباء المعتمد",
      "لقطات رندر واقعية 3D لكافة الفراغات",
      "المقايسة التقديرية النهائية وتوقيع العقد",
    ],
  },
  {
    id: 2,
    phase: "المرحلة الثانية: أعمال التأسيس والمرافق (MEP)",
    dateRange: "٢٦ سبتمبر ٢٠٢٦ — ٢٠ أكتوبر ٢٠٢٦",
    status: "مكتملة ومختبرة بالكامل ✓",
    statusType: "completed",
    description:
      "تنفيذ شبكات السباكة وتغذية المياه بولي بروبلين، تمديد مسارات خراطيم وأسلاك الكهرباء، وتأسيس شبكة صرف التكييف واختبار العزل الكيميائي.",
    deliverables: [
      "شهادة اختبار ضغط المياه على ٨ بار",
      "عزل الحمامات وخزانات المياه بالبيتومين المطاطي",
      "استلام شرب المناسيب ودفن علب الكهرباء",
    ],
  },
  {
    id: 3,
    phase: "المرحلة الثالثة: أعمال التشطيبات والديكور الداخلي",
    dateRange: "٢١ أكتوبر ٢٠٢٦ — ١٥ ديسمبر ٢٠٢٦",
    status: `المرحلة النشطة حالياً (قيد التنفيذ ${toAr(clientProject().progress)}٪)`,
    statusType: "active",
    description:
      "تأكيس وبؤج المحارة، تركيب شاسيهات وألواح الجبسوم بورد لبيوت النور، توريد وتركيب رخام أرضيات الاستقبال، والبدء في وجه البطانة للدهانات.",
    deliverables: [
      "تركيب رخام تريستا بيج مصقول (جاري)",
      "ألواح كناوف خضراء مقاومة للرطوبة (جاري)",
      "تجهيز بطانات دهانات جوتن فينوماتيك (مجدول)",
    ],
  },
  {
    id: 4,
    phase: "المرحلة الرابعة: التسليم النهائي وضمان الجودة",
    dateRange: "١٦ ديسمبر ٢٠٢٦ — ٣٠ ديسمبر ٢٠٢٦",
    status: "المرحلة الختامية (مجدولة قريباً)",
    statusType: "upcoming",
    description:
      "تثبيت المفاتيح الديكورية والإنارة المعمارية، جلي وتلميع الرخام بالكريستال، النظافة الشاملة للموقع، والمعاينة المشتركة للتسليم المفتاحي وشهادة الضمان.",
    deliverables: [
      "محضر الاستلام المفتاحي النهائي المعتمد",
      "شهادة ضمان الأعمال الإنشائية والديكور لمدة عامين",
      "كتيب صيانة المنزل الذكي والمخططات As-Built",
    ],
  },
];

function ClientTimeline() {
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent pb-24 font-ibm w-full max-w-full overflow-x-hidden" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap mb-1">
              <h1 className="text-2xl md:text-3xl font-black text-[#202923] tracking-tight flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#EFEEE8] border border-[#E5E6DF] flex items-center justify-center text-[#202923]">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <span>الجدول الزمني للمشروع</span>
              </h1>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EFEEE8] text-[#202923] border border-[#E5E6DF]">
                مشروع: فيلا الياسمين
              </span>
            </div>
            <p className="text-xs md:text-sm text-[#526257]">
              المراحل التنفيذية المعتمدة ومحطات الاستلام التعاقدية حتى التسليم المفتاحي النهائي.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EFEEE8] text-[#202923] border border-[#E5E6DF] text-xs font-bold">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>موعد التسليم: ٣٠ ديسمبر ٢٠٢٦</span>
            </span>
          </div>
        </div>

        {/* Vertical Stepper Container */}
        <div className="relative border-r-2 border-[#E5E6DF] mr-4 sm:mr-6 pr-6 sm:pr-8 space-y-8 py-2">
          {TIMELINE_STEPS.map((step, idx) => {
            const isCompleted = step.statusType === "completed";
            const isActive = step.statusType === "active";
            const isUpcoming = step.statusType === "upcoming";

            return (
              <div key={step.id} className="relative group">
                {/* Stepper Node Icon on the vertical border */}
                <div
                  className={`absolute -right-[35px] sm:-right-[43px] top-4 w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                    isCompleted || isActive
                      ? "bg-[#183C35] text-white border-4 border-white shadow-sm ring-1 ring-[#E5E6DF]"
                      : "bg-[#EFEEE8] text-[#526257] border-4 border-white shadow-sm"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : isActive ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>

                {/* Step Card */}
                <div
                  className={`bg-white rounded-2xl p-6 border transition-all duration-300 ${
                    isActive
                      ? "border-[#183C35] shadow-sm ring-1 ring-[#183C35]/10"
                      : "border-[#E5E6DF] shadow-sm"
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3
                        className={`text-base font-black tracking-tight ${
                          isActive ? "text-emerald-600 font-black" : "text-[#202923]"
                        }`}
                      >
                        {step.phase}
                      </h3>
                      {isActive && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse">
                          <span>المرحلة الحالية</span>
                        </span>
                      )}
                    </div>

                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold border self-start sm:self-auto ${
                        isCompleted
                          ? "bg-[#EFEEE8] text-[#202923] border-[#E5E6DF]"
                          : isActive
                          ? "bg-amber-50 text-amber-800 border-amber-200 font-black"
                          : "bg-[#EFEEE8] text-[#526257] border-[#E5E6DF]"
                      }`}
                    >
                      {step.status}
                    </span>
                  </div>

                  {/* Dates */}
                  <div className="flex items-center gap-2 text-xs font-mono text-[#526257] mb-3">
                    <CalendarDays className="w-3.5 h-3.5 text-[#526257]" />
                    <span>{step.dateRange}</span>
                  </div>

                  {/* Description */}
                  <p className="text-xs md:text-sm text-[#526257] leading-relaxed mb-4">
                    {step.description}
                  </p>

                  {/* Deliverables Checklist */}
                  <div className="p-3.5 rounded-lg bg-[#F5F3ED] border border-[#EFEEE8] space-y-2">
                    <span className="text-[11px] font-bold text-[#526257] block mb-1">
                      مخرجات واعتمادات المرحلة:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      {step.deliverables.map((item, dIdx) => (
                        <div
                          key={dIdx}
                          className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-lg border border-[#E5E6DF]/60 text-[#526257] text-[11px]"
                        >
                          <CheckCircle2
                            className={`w-3.5 h-3.5 shrink-0 ${
                              isCompleted
                                ? "text-emerald-600"
                                : isActive
                                ? "text-[#202923]"
                                : "text-[#C5A36B]"
                            }`}
                          />
                          <span className="truncate">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

export default ClientTimeline;
