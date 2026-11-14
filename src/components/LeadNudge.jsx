import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { tr_ as T, getCurrency } from "../i18n";
import { ROLE_CONFIG, navLabel } from "../config/roles";
import { trackTab, shouldNudge, dismiss, markDone, visitSummary, waLink } from "../lib/nudge";

const ROLE_KEY = { Admin: "admin", "Site Engineer": "site", "Technical Office": "tech", Client: "client" };

/** Corner card that appears only after real engagement; one tap opens WhatsApp with the visit's context. */
export default function LeadNudge({ currentRole, activeTab }) {
  const [open, setOpen] = useState(false);

  useEffect(() => { if (currentRole && activeTab) trackTab(currentRole, activeTab); }, [currentRole, activeTab]);

  useEffect(() => {
    const check = () => {
      // never on top of a dialog or while the visitor is typing
      const busy = document.querySelector('[role="dialog"], [aria-modal="true"]') || ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName);
      if (!busy && shouldNudge()) setOpen(true);
    };
    const id = setInterval(check, 5000);
    const onValue = () => setTimeout(check, 1500);
    window.addEventListener("miyar:value", onValue);
    return () => { clearInterval(id); window.removeEventListener("miyar:value", onValue); };
  }, []);

  if (!open) return null;

  const close = () => { dismiss(); setOpen(false); };
  const rk = ROLE_KEY[currentRole] || "admin";
  const screens = [...new Set(visitSummary().tabs.map((k) => {
    const [r, t] = k.split("|");
    const item = (ROLE_CONFIG[r] || []).find((i) => i.name === t || i.id === t);
    return item ? navLabel(r, item) : null;
  }).filter(Boolean))].slice(0, 4).join("، ");
  const text = T("nudge.msg", { role: T("nudge.role." + rk), screens: screens || "—", cur: getCurrency() });

  return (
    <aside role="complementary" aria-label={T("nudge.title")}
      className="nudge-in fixed z-40 end-3 bottom-[5.5rem] md:bottom-6 md:end-6 w-[calc(100%-1.5rem)] max-w-sm rounded-xl border border-[#DCE4DC] bg-white shadow-lg p-4">
      <button type="button" onClick={close} aria-label={T("nudge.close")} className="absolute top-2 end-2 p-2 rounded-lg text-[#6E7B72] hover:bg-[#E8EFE9] cursor-pointer"><X className="w-4 h-4" /></button>
      <p className="pe-8 text-[15px] font-bold text-[#1F2A26]">{T("nudge.title")}</p>
      <p className="mt-1 text-sm leading-relaxed text-[#56635B]">{T("nudge.body." + rk)}</p>
      <div className="mt-3 flex items-center gap-2">
        <a href={waLink(text)} target="_blank" rel="noopener noreferrer" onClick={() => { markDone(); setOpen(false); }}
          className="btn-press inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-[#5F6C61] hover:bg-[#4B574D] text-white text-sm font-bold">
          <MessageCircle className="w-4 h-4" aria-hidden="true" />{T("nudge.cta")}
        </a>
        <button type="button" onClick={close} className="h-10 px-3 rounded-lg text-sm font-semibold text-[#56635B] hover:bg-[#E8EFE9] cursor-pointer">{T("nudge.later")}</button>
      </div>
      <p className="mt-2 text-[11px] text-[#6E7B72]">{T("nudge.note")}</p>
    </aside>
  );
}
