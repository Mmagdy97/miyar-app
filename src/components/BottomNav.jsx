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
  const base = "flex items-center justify-center gap-2 h-12 min-w-12 rounded-full cursor-pointer btn-press transition-colors";
  return (
    <nav aria-label={t("menu.main")} className="md:hidden shrink-0 px-4 pt-1 pb-[max(.75rem,env(safe-area-inset-bottom))]">
      <div className="flex items-center justify-between gap-1 rounded-full bg-[var(--panel)] p-1.5 shadow-[0_14px_34px_-12px_rgba(0,0,0,.5)]">
        {items.map((item) => {
          const Icon = item.icon;
          const on = isActive(item);
          const label = navLabel(currentRole, item);
          return (
            <button key={item.id} onClick={() => setActiveTab(item.name || item.id)} aria-current={on ? "page" : undefined} aria-label={label} title={label}
              className={`${base} ${on ? "ps-3 bg-[var(--peach)] text-[var(--on-peach)] shadow-[0_0_0_4px_rgba(255,255,255,.08)]" : "text-[var(--panel-ink)]/70"}`}>
              <Icon className="w-5 h-5 shrink-0" aria-hidden="true" />
              {on && <span className="text-xs font-bold pe-3 truncate max-w-[7.5rem]">{label}</span>}
            </button>
          );
        })}
        <button onClick={onMore} aria-label={t("menu.more")} title={t("menu.more")} className={`${base} text-[var(--panel-ink)]/70`}>
          <Menu className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
