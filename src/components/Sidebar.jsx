import LogoMark from "./LogoMark";
import { isTabAllowed } from "../lib/entitlements";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Download, Building2, X } from "lucide-react";
import { ROLE_CONFIG, roleTitle as roleTitleOf, navLabel } from "../config/roles";
import { useI18n } from "../i18n";

function Sidebar({
  currentRole,
  activeTab,
  setActiveTab,
  collapsed = false,
  toggleSidebar,
  onItemClick,
  onCloseMobile,
  onRoleChange,
  hideHeader = false,
  isInstallable = false,
  onInstallClick,
}) {
  const items = (ROLE_CONFIG[currentRole] || []).filter((i) => isTabAllowed(i.id));
  const { t } = useI18n();
  const roleTitle = roleTitleOf(currentRole) || currentRole;
  const [tooltip, setTooltip] = useState({ visible: false, text: "", top: 0 });
  const sidebarRef = useRef(null);
  const navRef = useRef(null);
  const activeRef = useRef(null);
  const [ind, setInd] = useState({ y: 0, h: 0 });
  useLayoutEffect(() => {
    const measure = () => {
      const el = activeRef.current;
      if (el) setInd((p) => (p.y === el.offsetTop && p.h === el.offsetHeight ? p : { y: el.offsetTop, h: el.offsetHeight }));
    };
    measure();
    const id = setTimeout(measure, 320); // after the collapse transition settles
    return () => clearTimeout(id);
  });

  // Reset tooltip when expanding
  useEffect(() => {
    if (!collapsed) setTooltip({ visible: false, text: "", top: 0 });
  }, [collapsed]);

  const handleMouseEnter = (e, label) => {
    if (!collapsed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const sidebarRect = sidebarRef.current?.getBoundingClientRect();
    setTooltip({
      visible: true,
      text: label,
      top: rect.top - (sidebarRect?.top || 0) + rect.height / 2,
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ visible: false, text: "", top: 0 });
  };

  return (
    <aside
      ref={sidebarRef}
      className={`relative flex flex-col h-full bg-[var(--sand)] text-[var(--sand-ink)] transition-[width] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] shrink-0 select-none ${
        hideHeader ? "w-full border-none" : "border-e border-[var(--sand-line)]"
      } ${!hideHeader && (collapsed ? "md:w-[72px]" : "w-full md:w-64")}`}
    >
      {/* Sidebar Header */}
      {!hideHeader && (
        <div
          className={`flex items-center h-14 px-4 border-b border-[var(--sand-line)] ${
            collapsed ? "justify-center" : "justify-between"
          }`}
        >
          {/* Mobile Header: Logo + Close Drawer Button */}
          <div className="flex md:hidden items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#17614F] text-white">
                <LogoMark className="w-4 h-4 text-white" />
              </div>
              <span className="font-display text-base font-semibold text-[var(--sand-ink)]">{t("brand")}</span>
            </div>
            <button
              onClick={onCloseMobile || onItemClick}
              className="p-1.5 rounded-lg text-[#555B53] hover:text-[#1F2421] hover:bg-black/[.05] transition-colors cursor-pointer"
              aria-label={t("menu.close")}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Desktop Header: Label + Collapse Toggle */}
          <div className="hidden md:flex items-center justify-between w-full">
            {!collapsed && (
              <span className="text-[11px] font-semibold text-[#6F756B] uppercase tracking-widest">
                {t("menu.main")}
              </span>
            )}
            <button
              onClick={toggleSidebar}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-[#555B53] hover:text-[#1F2421] hover:bg-black/[.05] transition-colors duration-150 focus:outline-none cursor-pointer"
              aria-label={collapsed ? t("menu.expand") : t("menu.collapse")}
              title={collapsed ? t("menu.expand") : t("menu.collapse")}
            >
              {collapsed ? (
                <ChevronLeft className="ltr:-scale-x-100 w-4 h-4" />
              ) : (
                <ChevronRight className="ltr:-scale-x-100 w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Role Badge inside Sidebar (Pure White & Light Cream on Dark) */}
      {!collapsed && (
        <div className="mx-3 mt-3 mb-2 p-3 rounded-xl bg-white/70 border border-[var(--sand-line)]">
          <p className="text-xs text-[#6F756B] font-medium">
            {t("menu.currentRole")}
          </p>
          <p className="text-sm font-semibold text-[var(--sand-ink)] mt-0.5 truncate">
            {roleTitle}
          </p>
        </div>
      )}

      {/* Nav Items */}
      <nav ref={navRef} className="relative flex-1 px-2.5 mt-2 space-y-0.5 overflow-y-auto">
        <span aria-hidden="true" className="absolute inset-x-2.5 rounded-xl bg-white shadow-[0_1px_2px_rgba(58,44,20,.08),inset_3px_0_0_0_var(--brass)] rtl:shadow-[inset_-3px_0_0_0_var(--brass)] pointer-events-none transition-[transform,height,opacity] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]" style={{ transform: `translateY(${ind.y}px)`, height: ind.h, opacity: ind.h ? 1 : 0 }} />
        {items.map((item) => {
          const { id, name, icon: Icon } = item;
          const label = navLabel(currentRole, item);
          const itemName = name || id;

          // Robust check for active tab:
          const isItemDashboard =
            itemName === "لوحة التحكم" || id === "Dashboard";
          const isCurrentDashboard =
            activeTab === "لوحة التحكم" || activeTab === "Dashboard";

          const isActive =
            (isCurrentDashboard && isItemDashboard) ||
            activeTab === itemName ||
            activeTab === id ||
            activeTab === label;

          return (
            <button
              key={id || itemName}
              ref={isActive ? activeRef : null}
              onClick={() => {
                setActiveTab(itemName);
                if (onItemClick) onItemClick();
              }}
              onMouseEnter={(e) => handleMouseEnter(e, label)}
              onMouseLeave={handleMouseLeave}
              className={`group relative z-10 flex items-center w-full rounded-lg text-sm transition-colors duration-150 btn-press focus:outline-none cursor-pointer ${
                collapsed ? "justify-center px-2 py-3" : "px-3 py-2 gap-3"
              } ${
                isActive
                  ? "text-[#1F2421] font-semibold"
                  : "text-[#555B53] hover:bg-black/[.04] hover:text-[#1F2421]"
              }`}
            >
              <Icon
                className={`shrink-0 transition-colors duration-150 ${
                  collapsed ? "w-5 h-5" : "w-[18px] h-[18px]"
                } ${
                  isActive
                    ? "text-[#17614F]"
                    : "text-[#6F756B] group-hover:text-[#1F2421]"
                }`}
              />
              {!collapsed && (
                <span className="truncate leading-normal tracking-tight">{label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Tooltip for collapsed state (popping to the LEFT in RTL) */}
      {collapsed && tooltip.visible && (
        <div
          className="absolute start-[76px] z-50 px-3 py-1.5 text-xs font-semibold text-[#1F2421] bg-white border border-[#E6DFD0] rounded-lg shadow-md whitespace-nowrap pointer-events-none"
          style={{ top: tooltip.top, transform: "translateY(-50%)" }}
        >
          {tooltip.text}
          <div className="absolute -start-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-white border-t border-e border-[#E6DFD0] rotate-45" />
        </div>
      )}

      {/* PWA Install Button (Visible in desktop sidebar and mobile drawer) */}
      {isInstallable && (
        <div className={`px-3 py-2 border-t border-[var(--sand-line)] ${collapsed ? "flex justify-center" : ""}`}>
          <button
            onClick={onInstallClick}
            onMouseEnter={(e) => handleMouseEnter(e, t("pwa.installTip"))}
            onMouseLeave={handleMouseLeave}
            className={`flex items-center justify-center gap-2 rounded-lg bg-white text-[#17614F] border border-[var(--sand-line)] font-medium text-xs hover:bg-[#E3EFEA] transition-all cursor-pointer shadow-2xs active:scale-95 group ${
              collapsed ? "w-10 h-10 p-0" : "w-full px-3.5 py-2.5"
            }`}
            title={t("pwa.installTip")}
          >
            <Download className="w-4 h-4 shrink-0 transition-transform group-hover:-translate-y-0.5" />
            {!collapsed && <span>{t("pwa.install")}</span>}
          </button>
        </div>
      )}

      {/* Bottom section */}
      {!hideHeader && (
        <div className={`p-4 border-t border-[var(--sand-line)] ${collapsed ? "text-center" : ""}`}>
          {!collapsed ? (
            <div className="text-center">
              <p className="text-[11px] font-semibold text-[var(--sand-ink)]">
                {t("brand.footer1")}
              </p>
              <p className="text-[10px] text-[#6F756B] mt-0.5">
                {t("brand.footer2")}
              </p>
            </div>
          ) : (
            <p className="text-[10px] font-semibold text-[#6F756B]">v1.0</p>
          )}
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
