import { Menu } from "lucide-react";
import { isTabAllowed } from "../lib/entitlements";
import { ROLE_CONFIG, navLabel } from "../config/roles";
import { useI18n } from "../i18n";

// Mobile-only primary navigation: first 4 destinations + "More" (opens the full drawer).
export default function BottomNav({ currentRole, activeTab, setActiveTab, onMore }) {
  const { t } = useI18n();
  const items = (ROLE_CONFIG[currentRole] || []).filter((i) => isTabAllowed(i.id)).slice(0, 4);
  const isActive = (item) => {
    const name = item.name || item.id;
    const dash = (activeTab === "لوحة التحكم" || activeTab === "Dashboard") && (name === "لوحة التحكم" || item.id === "Dashboard");
    return dash || activeTab === name || activeTab === item.id || activeTab === navLabel(currentRole, item);
  };
  const base = "flex flex-col items-center justify-center gap-0.5 min-w-0 h-16 text-[11px] font-medium cursor-pointer btn-press";
  return (
    <nav aria-label={t("menu.main")} className="md:hidden shrink-0 grid grid-cols-5 bg-white border-t border-[#DCE4DC] pb-[env(safe-area-inset-bottom)]">
      {items.map((item) => {
        const Icon = item.icon;
        const on = isActive(item);
        return (
          <button key={item.id} onClick={() => setActiveTab(item.name || item.id)} aria-current={on ? "page" : undefined}
            className={`${base} ${on ? "text-[#5F6C61]" : "text-[#6E7B72]"}`}>
            <span className={`flex items-center justify-center w-12 h-7 rounded-full ${on ? "bg-[#5F6C61]/12" : ""}`}><Icon className="w-5 h-5" aria-hidden="true" /></span>
            <span className="line-clamp-2 text-center leading-[1.15] max-w-full px-1">{navLabel(currentRole, item)}</span>
          </button>
        );
      })}
      <button onClick={onMore} className={`${base} text-[#6E7B72]`}>
        <span className="flex items-center justify-center w-12 h-7"><Menu className="w-5 h-5" aria-hidden="true" /></span>
        <span>{t("menu.more")}</span>
      </button>
    </nav>
  );
}
