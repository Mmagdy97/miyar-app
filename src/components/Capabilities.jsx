import { Globe2, SunMoon, FileDown, Smartphone, Users, ShieldCheck, CreditCard, ImagePlus, BellRing, Building, Coins, Scale, Check, Clock } from "lucide-react";
import { useI18n } from "../i18n";

const ITEMS = [
  [Globe2, true], [SunMoon, true], [FileDown, true], [Smartphone, true], [Users, true],
  [ShieldCheck, false], [CreditCard, false], [ImagePlus, false], [BellRing, false], [Building, false], [Coins, false], [Scale, false],
];

export default function Capabilities() {
  const { t } = useI18n();
  return (
    <section id="capabilities" className="py-14 sm:py-16 sm:py-32 px-5 max-w-5xl mx-auto w-full">
      <div className="text-center mb-12 sm:mb-16">
        <h2 className="text-4xl sm:text-6xl font-semibold tracking-tight text-[#16181C] leading-[1.1] text-balance">{t("cap.title")}</h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg sm:text-xl text-[#5D6168] leading-relaxed">{t("cap.sub")}</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
        {ITEMS.map(([Icon, live], i) => (
          <div key={i} className="rounded-3xl border border-[#E3E0D9] bg-white p-4 sm:p-7 text-start">
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
