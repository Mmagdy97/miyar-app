import { useState } from "react";
import {
  FileText,
  Download,
  Settings,
  Sliders,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  FileSpreadsheet,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  Save,
  Check,
} from "lucide-react";

// Standard Engineering Templates
const STANDARD_TEMPLATES = [
  {
    id: "WIR",
    code: "WIR-01",
    name: "نموذج طلب استلام أعمال بالموقع (Work Inspection Request)",
    desc: "نموذج الاستلام المرحلي للأعمال المدنية والمعمارية وتسليم الاستشاري",
    format: "PDF + DOCX",
    size: "١.٢ ميجابايت",
    category: "استلامات الموقع",
    color: "from-[#2B3138] to-[#1E2429]",
  },
  {
    id: "RFI",
    code: "RFI-02",
    name: "نموذج استفسار هندسي وتعارضات (Request for Information)",
    desc: "توثيق التعارضات الفنية بين المخططات وطلب توجيه استشاري المشروع",
    format: "PDF + DOCX",
    size: "٩٨٠ كيلوبايت",
    category: "دراسات وتعارضات",
    color: "from-amber-600 to-orange-600",
  },
  {
    id: "MIR",
    code: "MIR-03",
    name: "نموذج اعتماد وتوريد خامات (Material Inspection Request)",
    desc: "طلب مطابقة العينات الموردة للموقع مع الكتالوجات المعتمدة تعاقدياً",
    format: "PDF + EXCEL",
    size: "١.٥ ميجابايت",
    category: "المشتريات والخامات",
    color: "from-emerald-600 to-teal-600",
  },
  {
    id: "VO",
    code: "VO-04",
    name: "نموذج أمر تغيير ومستجدات أسعار (Variation Order Form)",
    desc: "توثيق بنود الأعمال المستحدثة واحتساب فروق الأسعار للعميل",
    format: "PDF + EXCEL",
    size: "١.١ ميجابايت",
    category: "المقايسات والعقود",
    color: "from-purple-600 to-pink-600",
  },
];

// Initial Settings Toggles
const INITIAL_SETTINGS = {
  notifySiteOnAfc: true,
  requireConsultantSign: true,
  autoArchiveRevisions: true,
  autoAlertDelayedRfi: true,
  lockBoqAfterClientApproval: false,
};

function TechnicalOfficeSettings() {
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [toastMessage, setToastMessage] = useState(null);

  // Toggle switch
  const handleToggle = (key) => {
    setSettings((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      setToastMessage("تم تحديث إعدادات المكتب الفني بنجاح");
      setTimeout(() => setToastMessage(null), 2500);
      return updated;
    });
  };

  // Mock template download
  const handleDownloadTemplate = (template) => {
    setToastMessage(`جاري تحميل ${template.code} - ${template.name}...`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Reset settings
  const handleResetSettings = () => {
    setSettings(INITIAL_SETTINGS);
    setToastMessage("تمت استعادة الإعدادات الافتراضية");
    setTimeout(() => setToastMessage(null), 2500);
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

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap mb-1">
              <h1 className="text-2xl md:text-3xl font-black text-[#1E2429] tracking-tight flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#ECEEF0] border border-[#DDE1E5] flex items-center justify-center text-[#1E2429]">
                  <Settings className="w-5 h-5" />
                </div>
                <span>الإعدادات والنماذج الهندسية</span>
              </h1>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#ECEEF0] text-[#1E2429] border border-[#DDE1E5]">
                إدارة الجودة وقواعد العمل
              </span>
            </div>
            <p className="text-xs md:text-sm text-[#5A646E]">
              تحميل قوالب ونماذج العمل الهندسية القياسية، وضبط قواعد الأرشفة والإشعارات الآلية بالمكتب الفني.
            </p>
          </div>

          <button
            onClick={handleResetSettings}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-[#5A646E] bg-white border border-[#DDE1E5] hover:bg-[#F3F4F6] transition-colors shadow-2xs self-start sm:self-auto cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة ضبط القواعد</span>
          </button>
        </div>

        {/* Section 1: النماذج القياسية (Engineering Templates) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base md:text-lg font-black text-[#1E2429] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#1E2429]" />
                <span>النماذج القياسية (Engineering Templates)</span>
              </h2>
              <p className="text-xs text-[#5A646E] mt-0.5">
                نماذج رسمية جاهزة للطباعة والتعبئة مطابقة لمواصفات المشروعات الكبرى
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#ECEEF0] text-[#5A646E]">
              {STANDARD_TEMPLATES.length} نماذج رسمية
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {STANDARD_TEMPLATES.map((tmpl) => (
              <div
                key={tmpl.id}
                className="bg-white rounded-lg p-6 border border-[#DDE1E5] shadow-xs hover:border-[#D9480F] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="text-[11px] font-mono font-extrabold px-2.5 py-1 rounded-lg bg-[#ECEEF0] text-[#1E2429] border border-[#DDE1E5]">
                      {tmpl.code}
                    </span>
                    <span className="text-[10px] font-bold text-[#5A646E] bg-[#ECEEF0] px-2 py-0.5 rounded-md">
                      {tmpl.category}
                    </span>
                  </div>

                  <h3 className="text-sm md:text-base font-extrabold text-[#1E2429] leading-snug group-hover:text-[#1E2429] transition-colors">
                    {tmpl.name}
                  </h3>
                  <p className="text-xs text-[#5A646E] mt-1.5 leading-relaxed">
                    {tmpl.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#ECEEF0] flex items-center justify-between">
                  <div className="text-[11px] text-[#5A646E]">
                    <span className="font-bold text-[#5A646E]">{tmpl.format}</span> • {tmpl.size}
                  </div>

                  <button
                    onClick={() => handleDownloadTemplate(tmpl)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#ECEEF0] hover:bg-[#2B3138] text-[#1E2429] hover:text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>تحميل النموذج</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: إعدادات المكتب الفني (Technical Office Settings) */}
        <div className="bg-white rounded-lg p-6 md:p-8 border border-[#DDE1E5] shadow-xs space-y-6">
          <div className="pb-4 border-b border-[#ECEEF0] flex items-center justify-between">
            <div>
              <h2 className="text-base md:text-lg font-black text-[#1E2429] flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#1E2429]" />
                <span>إعدادات وقواعد عمل المكتب الفني (Workflow Rules)</span>
              </h2>
              <p className="text-xs text-[#5A646E] mt-0.5">
                تفعيل الإشعارات الآلية وإجراءات الضبط والاعتماد الرقمي للرسومات والمقايسات
              </p>
            </div>
            <span className="text-xs font-bold text-[#1E2429] bg-[#ECEEF0] px-2.5 py-1 rounded-full border border-[#DDE1E5]">
              حفظ فوري
            </span>
          </div>

          <div className="space-y-3.5">
            {/* Rule 1: Notify site upon drawing approval */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F3F4F6] border border-[#DDE1E5]/60 hover:bg-[#F3F4F6] rounded-lg transition-colors">
              <div>
                <h4 className="text-xs md:text-sm font-extrabold text-[#1E2429]">
                  إرسال إشعار للموقع عند اعتماد مخطط جديد (AFC)
                </h4>
                <p className="text-[11px] text-[#5A646E] mt-0.5">
                  إرسال تنبيه مباشر لجوال مهندس الموقع فور اعتماد لوحة جديدة لتفادي العمل بمخطط ملغي
                </p>
              </div>

              <button
                type="button"
                dir="ltr"
                role="switch"
                aria-checked={settings.notifySiteOnAfc}
                onClick={() => handleToggle("notifySiteOnAfc")}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.notifySiteOnAfc ? "bg-[#2B3138]" : "bg-[#DDE1E5]"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    settings.notifySiteOnAfc ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Rule 2: Require consultant signature before BOQ export */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F3F4F6] border border-[#DDE1E5]/60 hover:bg-[#F3F4F6] rounded-lg transition-colors">
              <div>
                <h4 className="text-xs md:text-sm font-extrabold text-[#1E2429]">
                  طلب توقيع استشاري المالك قبل تصدير المقايسة
                </h4>
                <p className="text-[11px] text-[#5A646E] mt-0.5">
                  عدم إتاحة تحميل المقايسة بصيغة PDF الرسمية للعميل إلا بعد توقيع الاستشاري
                </p>
              </div>

              <button
                type="button"
                dir="ltr"
                role="switch"
                aria-checked={settings.requireConsultantSign}
                onClick={() => handleToggle("requireConsultantSign")}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.requireConsultantSign ? "bg-[#2B3138]" : "bg-[#DDE1E5]"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    settings.requireConsultantSign ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Rule 3: Auto-archive revisions */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F3F4F6] border border-[#DDE1E5]/60 hover:bg-[#F3F4F6] rounded-lg transition-colors">
              <div>
                <h4 className="text-xs md:text-sm font-extrabold text-[#1E2429]">
                  أرشفة الإصدارات القديمة تلقائياً عند رفع Rev جديد
                </h4>
                <p className="text-[11px] text-[#5A646E] mt-0.5">
                  تحويل الإصدار السابق تلقائياً إلى حالة "ملغي (Superseded)" ونقله لسجل الأرشيف
                </p>
              </div>

              <button
                type="button"
                dir="ltr"
                role="switch"
                aria-checked={settings.autoArchiveRevisions}
                onClick={() => handleToggle("autoArchiveRevisions")}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.autoArchiveRevisions ? "bg-[#2B3138]" : "bg-[#DDE1E5]"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    settings.autoArchiveRevisions ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Rule 4: Auto-alert delayed RFI */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F3F4F6] border border-[#DDE1E5]/60 hover:bg-[#F3F4F6] rounded-lg transition-colors">
              <div>
                <h4 className="text-xs md:text-sm font-extrabold text-[#1E2429]">
                  التنبيه التلقائي للمهندسين عند تأخر الرد على استفسار RFI
                </h4>
                <p className="text-[11px] text-[#5A646E] mt-0.5">
                  إرسال إشعار عاجل إذا تجاوز استفسار الموقع ٤٨ ساعة دون صدور حل هندسي معتمد
                </p>
              </div>

              <button
                type="button"
                dir="ltr"
                role="switch"
                aria-checked={settings.autoAlertDelayedRfi}
                onClick={() => handleToggle("autoAlertDelayedRfi")}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.autoAlertDelayedRfi ? "bg-[#2B3138]" : "bg-[#DDE1E5]"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    settings.autoAlertDelayedRfi ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default TechnicalOfficeSettings;
