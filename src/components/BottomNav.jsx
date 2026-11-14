import { Menu } from "lucide-react";
import { isTabAllowed } from "../lib/entitlements";
import { ROLE_CONFIG, navLabel } from "../config/roles";
import { useI18n } from "../i18n";

// The 4 screens each role opens most from a phone; everything else sits behind "More".
const PRIMARY = {
  Admin: ["Dashboard", "Projects", "Financials & Petty Cash", "BOQ & Approvals"],
  "Site Engineer": ["Dashboard", "Daily Reports", "Attendance", "My Tasks"],
  "Technical Office": ["Dashboard", "BOQ Management", "Drawings & Docs", "Project Tracking"],
  Client: ["Dashboard", "Progress Overview", "Invoices & Payments", "Selections"],
};

// Mobile-only primary navigation: icon + short label for every slot, "More" opens the full drawer.
export default function BottomNav({ currentRole, activeTab, setActiveTab, onMore }) {
  const { t } = useI18n();
  const all = (ROLE_CONFIG[currentRole] || []).filter((i) => isTabAllowed(i.id));
  const pick = PRIMARY[currentRole] || [];
  const items = [...all.filter((i) => pick.includes(i.id)).sort((a, b) => pick.indexOf(a.id) - pick.indexOf(b.id)), ...all.filter((i) => !pick.includes(i.id))].slice(0, 4);
  const isActive = (item) => {
    const name = item.name || item.id;
    const dash = (activeTab === "لوحة التحكم" || activeTab === "Dashboard") && (name === "لوحة التحكم" || item.id === "Dashboard");
    return dash || activeTab === name || activeTab === item.id || activeTab === navLabel(currentRole, item);
  };
  const moreActive = !items.some(isActive);
  const short = (item) => { const k = "navs." + item.id; const v = t(k); return v === k ? navLabel(currentRole, item) : v; };
  const base = "flex-1 min-w-0 flex flex-col items-center justify-center gap-0.5 h-14 rounded-[20px] cursor-pointer btn-press transition-colors";
  const tone = (on) => (on ? "bg-[var(--peach)] text-[var(--on-peach)]" : "text-[var(--panel-ink)]/75");
  return (
    <nav aria-label={t("menu.main")} className="md:hidden shrink-0 px-3 pt-1 pb-[max(.6rem,env(safe-area-inset-bottom))]">
      <div className="flex items-stretch gap-1 rounded-[26px] bg-[var(--panel)] p-1.5 shadow-[0_14px_34px_-12px_rgba(0,0,0,.5)]">
        {items.map((item) => {
          const Icon = item.icon;
          const on = isActive(item);
          return (
            <button key={item.id} type="button" onClick={() => setActiveTab(item.name || item.id)} aria-current={on ? "page" : undefined} title={navLabel(currentRole, item)} className={`${base} ${tone(on)}`}>
              <Icon className="w-5 h-5 shrink-0" aria-hidden="true" />
              <span className="text-[11px] font-semibold leading-tight truncate max-w-full px-1">{short(item)}</span>
            </button>
          );
        })}
        <button type="button" onClick={onMore} aria-current={moreActive ? "page" : undefined} className={`${base} ${tone(moreActive)}`}>
          <Menu className="w-5 h-5" aria-hidden="true" />
          <span className="text-[11px] font-semibold leading-tight">{t("menu.more")}</span>
        </button>
      </div>
    </nav>
  );
}
