import { Globe2, SunMoon, FileDown, Smartphone, Users, ShieldCheck, CreditCard, ImagePlus, BellRing, Building, Coins, Scale, Check, Clock } from "lucide-react";
import { useI18n } from "../i18n";

const ITEMS = [
  [Globe2, true], [SunMoon, true], [FileDown, true], [Smartphone, true], [Users, true],
  [ShieldCheck, false], [CreditCard, false], [ImagePlus, false], [BellRing, false], [Building, false], [Coins, false], [Scale, false],
];

export default function Capabilities() {
  const { t } = useI18n();
  return (
    <section id="capabilities" className="py-14 sm:py-14 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto w-full">
      <div className="max-w-2xl mb-12 text-start">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#16181C] leading-tight text-balance">{t("cap.title")}</h2>
        <p className="mt-4 text-sm sm:text-base text-[#5D6168] leading-relaxed font-medium">{t("cap.sub")}</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
        {ITEMS.map(([Icon, live], i) => (
          <div key={i} className="rounded-xl border border-[#E3E0D9] bg-white p-3.5 sm:p-5 text-start">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <Icon className="w-5 h-5 text-[#D9480F]" aria-hidden="true" />
              <span className={`inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-md border ${live ? "text-emerald-700 border-emerald-200 bg-emerald-50" : "text-[#5D6168] border-[#E3E0D9] bg-[#F6F5F1]"}`}>
                {live ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                {live ? t("cap.now") : t("cap.soon")}
              </span>
            </div>
            <h3 className="text-sm font-bold text-[#16181C]">{t(`cap.${i + 1}.t`)}</h3>
            <p className="mt-1.5 hidden sm:block text-xs text-[#5D6168] leading-relaxed">{t(`cap.${i + 1}.d`)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
