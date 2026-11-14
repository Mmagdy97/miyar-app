import { useState } from "react";
import { useI18n } from "../i18n";

const KEY = "miyar:consent:v1";

export default function CookieBanner() {
  const { t } = useI18n();
  const [open, setOpen] = useState(() => { try { return !localStorage.getItem(KEY); } catch { return false; } });
  if (!open) return null;
  const ok = () => { try { localStorage.setItem(KEY, "1"); } catch { /* ignore */ } setOpen(false); };
  return (
    <div role="region" aria-label="Cookies" className="no-print fixed bottom-24 md:bottom-3 start-3 end-3 sm:start-auto sm:max-w-sm z-[90] rounded-xl border border-[#DCE4DC] bg-white p-2.5 sm:p-4 shadow-lg text-start flex items-center gap-3 sm:block">
      <p className="text-[11px] sm:text-xs text-[#56635B] leading-snug sm:leading-relaxed line-clamp-2 sm:line-clamp-none">{t("cookie.text")}</p>
      <button onClick={ok} className="btn-press shrink-0 sm:mt-3 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-[#5F6C61] text-white text-xs font-bold cursor-pointer">{t("cookie.ok")}</button>
    </div>
  );
}
