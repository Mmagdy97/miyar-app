import { Globe, Coins } from "lucide-react";
import { useI18n } from "../i18n";
import { CURRENCIES } from "../lib/currency";
import { LOCALES } from "../config/locale";

/** Language + currency pickers (persisted; page reloads to rebuild formatted data). */
export default function SettingsSwitcher({ compact = false, dark = false }) {
  const { t, locale, currency, setLocale, setCurrency } = useI18n();
  const box = `flex items-center gap-1.5 rounded-lg border px-2 py-1.5 text-xs font-bold ${
    dark ? "bg-white/10 border-white/20 text-white" : "bg-white border-[#DDE1E5] text-[#1E2429]"
  }`;
  const sel = "bg-transparent outline-none cursor-pointer max-w-[110px]";
  return (
    <div className="flex items-center gap-2">
      <label className={box}>
        <Globe className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        <span className="sr-only">{t("settings.language")}</span>
        <select value={locale} onChange={(e) => setLocale(e.target.value)} className={sel}>
          {Object.entries(LOCALES).map(([k, v]) => (
            <option key={k} value={k} className="text-[#1E2429]">{v.name}</option>
          ))}
        </select>
      </label>
      <label className={box}>
        <Coins className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        <span className="sr-only">{t("settings.currency")}</span>
        <select value={currency} onChange={(e) => setCurrency(e.target.value)} className={sel}>
          {Object.values(CURRENCIES).map((c) => (
            <option key={c.code} value={c.code} className="text-[#1E2429]">
              {compact ? c.code : `${c.code} — ${c.name}`}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
