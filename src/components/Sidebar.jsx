import { useState, useEffect, useRef } from "react";
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
  const items = ROLE_CONFIG[currentRole] || [];
  const { t } = useI18n();
  const roleTitle = roleTitleOf(currentRole) || currentRole;
  const [tooltip, setTooltip] = useState({ visible: false, text: "", top: 0 });
  const sidebarRef = useRef(null);

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
      className={`relative flex flex-col h-full bg-[#171B21] text-white transition-all duration-300 ease-in-out shrink-0 select-none ${
        hideHeader ? "w-full border-none" : "border-s border-[#D9480F]/20"
      } ${!hideHeader && (collapsed ? "md:w-[72px]" : "w-full md:w-64")}`}
    >
      {/* Sidebar Header */}
      {!hideHeader && (
        <div
          className={`flex items-center h-16 px-4 border-b border-[#D9480F]/20 ${
            collapsed ? "justify-center" : "justify-between"
          }`}
        >
          {/* Mobile Header: Logo + Close Drawer Button */}
          <div className="flex md:hidden items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#D9480F]/30 text-white shadow-2xs">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-black text-white tracking-tight">{t("brand")}</span>
            </div>
            <button
              onClick={onCloseMobile || onItemClick}
              className="p-1.5 rounded-lg text-[#ECEEF0]/80 hover:text-white hover:bg-[#D9480F]/20 transition-colors cursor-pointer"
              aria-label={t("menu.close")}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Desktop Header: Label + Collapse Toggle */}
          <div className="hidden md:flex items-center justify-between w-full">
            {!collapsed && (
              <span className="text-[11px] font-bold text-[#ECEEF0]/80 uppercase tracking-widest font-ibm">
                {t("menu.main")}
              </span>
            )}
            <button
              onClick={toggleSidebar}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-[#ECEEF0]/70 hover:text-white hover:bg-[#D9480F]/20 transition-colors duration-150 focus:outline-none cursor-pointer"
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
        <div className="mx-3 mt-3 mb-2 p-3.5 rounded-xl bg-white/10 border border-white/15 shadow-2xs">
          <p className="text-xs text-[#ECEEF0]/70 font-medium">
            {t("menu.currentRole")}
          </p>
          <p className="text-sm font-bold text-white mt-0.5 truncate tracking-tight">
            {roleTitle}
          </p>
        </div>
      )}

      {/* Nav Items */}
      <nav className="flex-1 px-2.5 mt-2 space-y-1.5 overflow-y-auto">
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
              onClick={() => {
                setActiveTab(itemName);
                if (onItemClick) onItemClick();
              }}
              onMouseEnter={(e) => handleMouseEnter(e, label)}
              onMouseLeave={handleMouseLeave}
              className={`group relative flex items-center w-full rounded-xl text-sm transition-all duration-150 focus:outline-none cursor-pointer ${
                collapsed ? "justify-center px-2 py-3" : "px-3.5 py-2.5 gap-3"
              } ${
                isActive
                  ? "bg-[#D9480F] text-white font-bold shadow-sm"
                  : "text-[#ECEEF0]/80 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon
                className={`shrink-0 transition-colors duration-150 ${
                  collapsed ? "w-5 h-5" : "w-[18px] h-[18px]"
                } ${
                  isActive
                    ? "text-white"
                    : "text-[#ECEEF0]/80 group-hover:text-white"
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
          className="absolute start-[76px] z-50 px-3 py-1.5 text-xs font-semibold text-white bg-[#1E2429] border border-[#D9480F]/30 rounded-lg shadow-md whitespace-nowrap pointer-events-none"
          style={{ top: tooltip.top, transform: "translateY(-50%)" }}
        >
          {tooltip.text}
          <div className="absolute -start-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#1E2429] border-t border-e border-[#D9480F]/30 rotate-45" />
        </div>
      )}

      {/* PWA Install Button (Visible in desktop sidebar and mobile drawer) */}
      {isInstallable && (
        <div className={`px-3 py-2 border-t border-[#D9480F]/20 ${collapsed ? "flex justify-center" : ""}`}>
          <button
            onClick={onInstallClick}
            onMouseEnter={(e) => handleMouseEnter(e, t("pwa.installTip"))}
            onMouseLeave={handleMouseLeave}
            className={`flex items-center justify-center gap-2 rounded-lg bg-[#D9480F]/20 text-white border border-[#D9480F]/30 font-medium text-xs hover:bg-[#D9480F]/35 transition-all cursor-pointer shadow-2xs active:scale-95 group ${
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
        <div className={`p-4 border-t border-[#D9480F]/20 ${collapsed ? "text-center" : ""}`}>
          {!collapsed ? (
            <div className="text-center">
              <p className="text-[11px] font-bold text-white">
                {t("brand.footer1")}
              </p>
              <p className="text-[10px] text-[#ECEEF0]/60 mt-0.5 font-medium">
                {t("brand.footer2")}
              </p>
            </div>
          ) : (
            <p className="text-[10px] font-bold text-[#ECEEF0]/60">v1.0</p>
          )}
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
