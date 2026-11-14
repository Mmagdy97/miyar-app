import { useState } from "react";
import { localize, D, DF } from "../data/dataI18n";
import { tr_ as T, E } from "../i18n";
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

const TIMELINE_STEPS = localize([
  {
    id: 1,
    phase: "المرحلة الأولى: التصميم والاعتمادات المعمارية",
    dateRange: D("1 سبتمبر 2026 — 25 سبتمبر 2026"),
    status: "مكتملة بالكامل ✓",
    statusType: "completed", // completed | active | upcoming
    description:
      D("إعداد المخططات ثنائية وثلاثية الأبعاد (2D & 3D Renders)، مطابقة الفرش وتوزيع الإضاءة، واعتماد كود الألوان وعينات الرخام والبورسلين."),
    deliverables: [
      D("مخطط توزيع الفرش والكهرباء المعتمد"),
      D("لقطات رندر واقعية 3D لكافة الفراغات"),
      D("المقايسة التقديرية النهائية وتوقيع العقد"),
    ],
  },
  {
    id: 2,
    phase: "المرحلة الثانية: أعمال التأسيس والمرافق (MEP)",
    dateRange: D("26 سبتمبر 2026 — 20 أكتوبر 2026"),
    status: "مكتملة ومختبرة بالكامل ✓",
    statusType: "completed",
    description:
      D("تنفيذ شبكات السباكة وتغذية المياه بولي بروبلين، تمديد مسارات خراطيم وأسلاك الكهرباء، وتأسيس شبكة صرف التكييف واختبار العزل الكيميائي."),
    deliverables: [
      D("شهادة اختبار ضغط المياه على 8 بار"),
      D("عزل الحمامات وخزانات المياه بالبيتومين المطاطي"),
      D("استلام شرب المناسيب ودفن علب الكهرباء"),
    ],
  },
  {
    id: 3,
    phase: "المرحلة الثالثة: أعمال التشطيبات والديكور الداخلي",
    dateRange: D("21 أكتوبر 2026 — 15 ديسمبر 2026"),
    status: DF("المرحلة النشطة حالياً (قيد التنفيذ {0}٪)", toAr(clientProject().progress)),
    statusType: "active",
    description:
      D("تأكيس وبؤج المحارة، تركيب شاسيهات وألواح الجبسوم بورد لبيوت النور، توريد وتركيب رخام أرضيات الاستقبال، والبدء في وجه البطانة للدهانات."),
    deliverables: [
      D("تركيب رخام تريستا بيج مصقول (جاري)"),
      D("ألواح كناوف خضراء مقاومة للرطوبة (جاري)"),
      D("تجهيز بطانات دهانات جوتن فينوماتيك (مجدول)"),
    ],
  },
  {
    id: 4,
    phase: "المرحلة الرابعة: التسليم النهائي وضمان الجودة",
    dateRange: D("16 ديسمبر 2026 — 30 ديسمبر 2026"),
    status: "المرحلة الختامية (مجدولة قريباً)",
    statusType: "upcoming",
    description:
      D("تثبيت المفاتيح الديكورية والإنارة المعمارية، جلي وتلميع الرخام بالكريستال، النظافة الشاملة للموقع، والمعاينة المشتركة للتسليم المفتاحي وشهادة الضمان."),
    deliverables: [
      D("محضر الاستلام المفتاحي النهائي المعتمد"),
      D("شهادة ضمان الأعمال الإنشائية والديكور لمدة عامين"),
      D("كتيب صيانة المنزل الذكي والمخططات As-Built"),
    ],
  },
]);

function ClientTimeline() {
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent pb-24 font-ibm w-full max-w-full overflow-x-hidden">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap mb-1">
              <h1 className="text-2xl md:text-3xl font-semibold text-[#1F2A26] tracking-tight flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#E8EFE9] border border-[#DCE4DC] flex items-center justify-center text-[#1F2A26]">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <span>{T("cli.123")}</span>
              </h1>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#E8EFE9] text-[#1F2A26] border border-[#DCE4DC]">
                {T("cli.124")}
              </span>
            </div>
            <p className="text-xs md:text-sm text-[#56635B]">
              {T("cli.125")}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E8EFE9] text-[#1F2A26] border border-[#DCE4DC] text-xs font-bold">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>{T("cli.126")}</span>
            </span>
          </div>
        </div>

        {/* Vertical Stepper Container */}
        <div className="relative border-e-2 border-[#DCE4DC] ms-4 sm:ms-6 ps-6 sm:ps-8 space-y-8 py-2">
          {TIMELINE_STEPS.map((step, idx) => {
            const isCompleted = step.statusType === "completed";
            const isActive = step.statusType === "active";
            const isUpcoming = step.statusType === "upcoming";

            return (
              <div key={step.id} className="relative group">
                {/* Stepper Node Icon on the vertical border */}
                <div
                  className={`absolute -start-[35px] sm:-start-[43px] top-4 w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                    isCompleted || isActive
                      ? "bg-[#5F6C61] text-white border-4 border-white shadow-sm ring-1 ring-[#DCE4DC]"
                      : "bg-[#E8EFE9] text-[#56635B] border-4 border-white shadow-sm"
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
                      ? "border-[#5F6C61] shadow-sm ring-1 ring-[#5F6C61]/10"
                      : "border-[#DCE4DC] shadow-sm"
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3
                        className={`text-base font-semibold tracking-tight ${
                          isActive ? "text-emerald-600 font-semibold" : "text-[#1F2A26]"
                        }`}
                      >
                        {E(step.phase)}
                      </h3>
                      {isActive && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse">
                          <span>{T("cli.127")}</span>
                        </span>
                      )}
                    </div>

                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold border self-start sm:self-auto ${
                        isCompleted
                          ? "bg-[#E8EFE9] text-[#1F2A26] border-[#DCE4DC]"
                          : isActive
                          ? "bg-amber-50 text-amber-800 border-amber-200 font-semibold"
                          : "bg-[#E8EFE9] text-[#56635B] border-[#DCE4DC]"
                      }`}
                    >
                      {E(step.status)}
                    </span>
                  </div>

                  {/* Dates */}
                  <div className="flex items-center gap-2 text-xs font-mono text-[#56635B] mb-3">
                    <CalendarDays className="w-3.5 h-3.5 text-[#56635B]" />
                    <span>{step.dateRange}</span>
                  </div>

                  {/* Description */}
                  <p className="text-xs md:text-sm text-[#56635B] leading-relaxed mb-4">
                    {step.description}
                  </p>

                  {/* Deliverables Checklist */}
                  <div className="p-3.5 rounded-lg bg-[#F2F5F1] border border-[#E8EFE9] space-y-2">
                    <span className="text-[11px] font-bold text-[#56635B] block mb-1">
                      {T("cli.128")}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      {step.deliverables.map((item, dIdx) => (
                        <div
                          key={dIdx}
                          className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-lg border border-[#DCE4DC]/60 text-[#56635B] text-[11px]"
                        >
                          <CheckCircle2
                            className={`w-3.5 h-3.5 shrink-0 ${
                              isCompleted
                                ? "text-emerald-600"
                                : isActive
                                ? "text-[#1F2A26]"
                                : "text-[#6E7B72]"
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
