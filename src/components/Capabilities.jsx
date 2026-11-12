import { Globe2, SunMoon, FileDown, Smartphone, Users, ShieldCheck, CreditCard, ImagePlus, BellRing, Building, Coins, Scale, Check, Clock, MessageCircle, FileText, Receipt, HardHat, Armchair, QrCode, WifiOff } from "lucide-react";
import { useI18n } from "../i18n";

// [icon, live, dictionary number]: live cards first.
const ITEMS = [
  [Globe2, true, 1], [SunMoon, true, 2], [FileDown, true, 3], [Smartphone, true, 4], [Users, true, 5],
  [MessageCircle, true, 13], [FileText, true, 14], [Receipt, true, 15],
  [Receipt, true, 16], [HardHat, true, 17], [Armchair, true, 18], [QrCode, true, 19], [WifiOff, true, 20],
  [ShieldCheck, false, 6], [CreditCard, false, 7], [ImagePlus, false, 8], [BellRing, false, 9], [Building, false, 10], [Coins, false, 11], [Scale, false, 12],
];

export default function Capabilities() {
  const { t } = useI18n();
  return (
    <section id="capabilities" className="py-14 sm:py-16 sm:py-32 px-5 max-w-5xl mx-auto w-full">
      <div className="text-start mb-8 sm:mb-10">
        <h2 className="text-3xl sm:text-4xl font-semibold text-[#1A2236] leading-[1.2] text-balance">{t("cap.title")}</h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg sm:text-xl text-[#535E78] leading-relaxed">{t("cap.sub")}</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
        {ITEMS.map(([Icon, live, n]) => (
          <div key={n} className="rounded-xl border border-[#DAD3C2] bg-white p-4 sm:p-7 text-start">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <Icon className="w-5 h-5 text-[#B5452B]" aria-hidden="true" />
              <span className={`inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-md border ${live ? "text-emerald-700 border-emerald-200 bg-emerald-50" : "text-[#535E78] border-[#DAD3C2] bg-[#F3EFE6]"}`}>
                {live ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                {live ? t("cap.now") : t("cap.soon")}
              </span>
            </div>
            <h3 className="text-sm font-bold text-[#1A2236]">{t(`cap.${n}.t`)}</h3>
            <p className="mt-1.5 hidden sm:block text-xs text-[#535E78] leading-relaxed">{t(`cap.${n}.d`)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
