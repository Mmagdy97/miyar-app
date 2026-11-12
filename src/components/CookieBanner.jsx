import { useState } from "react";
import { useI18n } from "../i18n";

const KEY = "miyar:consent:v1";

export default function CookieBanner() {
  const { t } = useI18n();
  const [open, setOpen] = useState(() => { try { return !localStorage.getItem(KEY); } catch { return false; } });
  if (!open) return null;
  const ok = () => { try { localStorage.setItem(KEY, "1"); } catch { /* ignore */ } setOpen(false); };
  return (
    <div role="region" aria-label="Cookies" className="no-print fixed bottom-3 start-3 end-3 sm:start-auto sm:max-w-sm z-[90] rounded-xl border border-[#DAD3C2] bg-white p-4 shadow-lg text-start">
      <p className="text-xs text-[#535E78] leading-relaxed">{t("cookie.text")}</p>
      <button onClick={ok} className="btn-press mt-3 px-4 py-2 rounded-lg bg-[#24304D] text-white text-xs font-bold cursor-pointer">{t("cookie.ok")}</button>
    </div>
  );
}
