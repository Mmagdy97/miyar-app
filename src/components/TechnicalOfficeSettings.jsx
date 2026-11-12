import { useState } from "react";
import { techSettingsStore, TECH_SETTINGS_DEFAULT } from "../data/stores";
import { localize, D, DF } from "../data/dataI18n";
import { tr_ as T, E } from "../i18n";
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
const STANDARD_TEMPLATES = localize([
  {
    id: "WIR",
    code: "WIR-01",
    name: "نموذج طلب استلام أعمال بالموقع (Work Inspection Request)",
    desc: "نموذج الاستلام المرحلي للأعمال المدنية والمعمارية وتسليم الاستشاري",
    format: "PDF + DOCX",
    size: "١.٢ ميجابايت",
    category: "استلامات الموقع",
    color: "from-[#0F172A] to-[#0F172A]",
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
    color: "from-[#0F766E] to-[#0B5F58]",
  },
]);

// Initial Settings Toggles
const INITIAL_SETTINGS = {
  notifySiteOnAfc: true,
  requireConsultantSign: true,
  autoArchiveRevisions: true,
  autoAlertDelayedRfi: true,
  lockBoqAfterClientApproval: false,
};

function TechnicalOfficeSettings() {
  const [settings, setSettings] = techSettingsStore.use();
  const [toastMessage, setToastMessage] = useState(null);

  // Toggle switch
  const handleToggle = (key) => {
    setSettings((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      setToastMessage(D("تم تحديث إعدادات المكتب الفني بنجاح"));
      setTimeout(() => setToastMessage(null), 2500);
      return updated;
    });
  };

  // Mock template download
  const handleDownloadTemplate = (template) => {
    setToastMessage(DF("جاري تحميل {0} - {1}...", template.code, template.name));
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Reset settings
  const handleResetSettings = () => {
    setSettings(TECH_SETTINGS_DEFAULT);
    setToastMessage(D("تمت استعادة الإعدادات الافتراضية"));
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent pb-24 font-ibm w-full max-w-full overflow-x-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 end-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#0F172A] text-white rounded-xl shadow-xl border border-white/10 animate-in fade-in slide-in-from-bottom-3 duration-200">
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
              <h1 className="text-2xl md:text-3xl font-black text-[#0F172A] tracking-tight flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#EEF1F5] border border-[#E3E7EE] flex items-center justify-center text-[#0F172A]">
                  <Settings className="w-5 h-5" />
                </div>
                <span>{T("to.128")}</span>
              </h1>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EEF1F5] text-[#0F172A] border border-[#E3E7EE]">
                {T("to.129")}
              </span>
            </div>
            <p className="text-xs md:text-sm text-[#475569]">
              {T("to.130")}
            </p>
          </div>

          <button
            onClick={handleResetSettings}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-[#475569] bg-white border border-[#E3E7EE] hover:bg-[#F4F6F9] transition-colors shadow-2xs self-start sm:self-auto cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{T("to.131")}</span>
          </button>
        </div>

        {/* Section 1: النماذج القياسية (Engineering Templates) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base md:text-lg font-black text-[#0F172A] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#0F172A]" />
                <span>{T("to.132")}</span>
              </h2>
              <p className="text-xs text-[#475569] mt-0.5">
                {T("to.133")}
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#EEF1F5] text-[#475569]">
              {T("to.134", { v0: STANDARD_TEMPLATES.length })}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {STANDARD_TEMPLATES.map((tmpl) => (
              <div
                key={tmpl.id}
                className="bg-white rounded-lg p-6 border border-[#E3E7EE] shadow-xs hover:border-[#0F766E] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="text-[11px] font-mono font-extrabold px-2.5 py-1 rounded-lg bg-[#EEF1F5] text-[#0F172A] border border-[#E3E7EE]">
                      {tmpl.code}
                    </span>
                    <span className="text-[10px] font-bold text-[#475569] bg-[#EEF1F5] px-2 py-0.5 rounded-md">
                      {E(tmpl.category)}
                    </span>
                  </div>

                  <h3 className="text-sm md:text-base font-extrabold text-[#0F172A] leading-snug group-hover:text-[#0F172A] transition-colors">
                    {tmpl.name}
                  </h3>
                  <p className="text-xs text-[#475569] mt-1.5 leading-relaxed">
                    {tmpl.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#EEF1F5] flex items-center justify-between">
                  <div className="text-[11px] text-[#475569]">
                    <span className="font-bold text-[#475569]">{tmpl.format}</span> • {tmpl.size}
                  </div>

                  <button
                    onClick={() => handleDownloadTemplate(tmpl)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#EEF1F5] hover:bg-[#0F172A] text-[#0F172A] hover:text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{T("to.135")}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: إعدادات المكتب الفني (Technical Office Settings) */}
        <div className="bg-white rounded-lg p-6 md:p-8 border border-[#E3E7EE] shadow-xs space-y-6">
          <div className="pb-4 border-b border-[#EEF1F5] flex items-center justify-between">
            <div>
              <h2 className="text-base md:text-lg font-black text-[#0F172A] flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#0F172A]" />
                <span>{T("to.136")}</span>
              </h2>
              <p className="text-xs text-[#475569] mt-0.5">
                {T("to.137")}
              </p>
            </div>
            <span className="text-xs font-bold text-[#0F172A] bg-[#EEF1F5] px-2.5 py-1 rounded-full border border-[#E3E7EE]">
              {T("to.138")}
            </span>
          </div>

          <div className="space-y-3.5">
            {/* Rule 1: Notify site upon drawing approval */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F4F6F9] border border-[#E3E7EE]/60 hover:bg-[#F4F6F9] rounded-lg transition-colors">
              <div>
                <h4 className="text-xs md:text-sm font-extrabold text-[#0F172A]">
                  {T("to.139")}
                </h4>
                <p className="text-[11px] text-[#475569] mt-0.5">
                  {T("to.140")}
                </p>
              </div>

              <button
                type="button"
                dir="ltr"
                role="switch"
                aria-checked={settings.notifySiteOnAfc}
                onClick={() => handleToggle("notifySiteOnAfc")}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.notifySiteOnAfc ? "bg-[#0F172A]" : "bg-[#E3E7EE]"
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
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F4F6F9] border border-[#E3E7EE]/60 hover:bg-[#F4F6F9] rounded-lg transition-colors">
              <div>
                <h4 className="text-xs md:text-sm font-extrabold text-[#0F172A]">
                  {T("to.141")}
                </h4>
                <p className="text-[11px] text-[#475569] mt-0.5">
                  {T("to.142")}
                </p>
              </div>

              <button
                type="button"
                dir="ltr"
                role="switch"
                aria-checked={settings.requireConsultantSign}
                onClick={() => handleToggle("requireConsultantSign")}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.requireConsultantSign ? "bg-[#0F172A]" : "bg-[#E3E7EE]"
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
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F4F6F9] border border-[#E3E7EE]/60 hover:bg-[#F4F6F9] rounded-lg transition-colors">
              <div>
                <h4 className="text-xs md:text-sm font-extrabold text-[#0F172A]">
                  {T("to.143")}
                </h4>
                <p className="text-[11px] text-[#475569] mt-0.5">
                  {D("تحويل الإصدار السابق تلقائياً إلى حالة")} "{D("ملغي (Superseded)")}" {D("ونقله لسجل الأرشيف")}
                </p>
              </div>

              <button
                type="button"
                dir="ltr"
                role="switch"
                aria-checked={settings.autoArchiveRevisions}
                onClick={() => handleToggle("autoArchiveRevisions")}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.autoArchiveRevisions ? "bg-[#0F172A]" : "bg-[#E3E7EE]"
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
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F4F6F9] border border-[#E3E7EE]/60 hover:bg-[#F4F6F9] rounded-lg transition-colors">
              <div>
                <h4 className="text-xs md:text-sm font-extrabold text-[#0F172A]">
                  {T("to.144")}
                </h4>
                <p className="text-[11px] text-[#475569] mt-0.5">
                  {T("to.145")}
                </p>
              </div>

              <button
                type="button"
                dir="ltr"
                role="switch"
                aria-checked={settings.autoAlertDelayedRfi}
                onClick={() => handleToggle("autoAlertDelayedRfi")}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.autoAlertDelayedRfi ? "bg-[#0F172A]" : "bg-[#E3E7EE]"
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
