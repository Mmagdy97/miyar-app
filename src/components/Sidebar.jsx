import LogoMark from "./LogoMark";
import { isTabAllowed } from "../lib/entitlements";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X, Menu } from "lucide-react";
import { ROLE_CONFIG, navLabel } from "../config/roles";
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
}) {
  const items = (ROLE_CONFIG[currentRole] || []).filter((i) => isTabAllowed(i.id));
  const { t } = useI18n();
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

  const isActiveItem = (item) => {
    const itemName = item.name || item.id;
    const dash = activeTab === "لوحة التحكم" || activeTab === "Dashboard";
    return (dash && (itemName === "لوحة التحكم" || item.id === "Dashboard")) || activeTab === itemName || activeTab === item.id || activeTab === navLabel(currentRole, item);
  };

  // Collapsed (desktop): logo disc + dark pill rail; the active item pops out as a peach circle with a notch.
  if (collapsed) {
    return (
      <aside ref={sidebarRef} className="relative hidden md:flex flex-col items-center h-full w-full select-none bg-[var(--panel)] pt-4">
        <div className="w-12 h-12 shrink-0 flex items-center justify-center">
          <LogoMark className="w-7 h-7 text-[var(--peach)]" />
        </div>
        <div className="relative flex-1 min-h-0 w-full flex flex-col items-center pt-3 pb-4">
          <button type="button" onClick={toggleSidebar} aria-label={t("menu.expand")} title={t("menu.expand")} className="w-11 h-11 shrink-0 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 cursor-pointer">
            <Menu className="w-5 h-5" />
          </button>
          <nav className="flex-1 min-h-0 flex flex-col items-center justify-center py-3">
            <div className="relative flex flex-col items-center gap-1.5">
            <span aria-hidden="true" className="rail-ruler" />
            {items.map((item) => {
              const { id, name, icon: Icon } = item;
              const label = navLabel(currentRole, item);
              const active = isActiveItem(item);
              return (
                <button
                  key={id || name}
                  data-tour={id}
                  type="button"
                  aria-label={label}
                  aria-current={active ? "page" : undefined}
                  onClick={() => { setActiveTab(name || id); onItemClick?.(); }}
                  onMouseEnter={(e) => handleMouseEnter(e, label)}
                  onMouseLeave={handleMouseLeave}
                  className={`relative w-11 h-11 shrink-0 rounded-full flex items-center justify-center cursor-pointer transition-[transform,background-color,color] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                    active ? "bg-[var(--peach)] text-[color:var(--on-peach)] z-10" : "text-white/65 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </button>
              );
            })}
            </div>
          </nav>
        </div>
        {tooltip.visible && (
          <div className="absolute start-[76px] z-50 px-3 py-1.5 text-xs font-semibold text-white bg-[var(--panel)] rounded-full shadow-md whitespace-nowrap pointer-events-none" style={{ top: tooltip.top, transform: "translateY(-50%)" }}>
            {tooltip.text}
          </div>
        )}
      </aside>
    );
  }

  return (
    <aside
      ref={sidebarRef}
      className={`relative flex flex-col h-full bg-[var(--panel)] text-white overflow-hidden transition-[width] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] shrink-0 select-none ${
        hideHeader ? "w-full border-none" : ""
      } ${!hideHeader && "w-full"}`}
    >
      {/* Sidebar Header */}
      {!hideHeader && (
        <div
          className={`flex items-center h-16 px-4 ${
            collapsed ? "justify-center" : "justify-between"
          }`}
        >
          {/* Mobile Header: Logo + Close Drawer Button */}
          <div className="flex md:hidden items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#0B7C79] text-white">
                <LogoMark className="w-4 h-4 text-white" />
              </div>
              <span className="font-display text-base font-semibold text-white">{t("brand")}</span>
            </div>
            <button
              onClick={onCloseMobile || onItemClick}
              className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label={t("menu.close")}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Desktop Header: Label + Collapse Toggle */}
          <div className="hidden md:flex items-center justify-between w-full">
            {!collapsed && (
              <span className="text-[11px] font-semibold text-white/50 uppercase tracking-widest">
                {t("menu.main")}
              </span>
            )}
            <button
              onClick={toggleSidebar}
              className="flex items-center justify-center w-9 h-9 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors duration-150 focus:outline-none cursor-pointer"
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

      {/* Nav Items */}
      <nav ref={navRef} className="relative flex-1 ps-3 pe-0 mt-2 space-y-1 overflow-y-auto">
        <span aria-hidden="true" className="absolute start-3 end-0 rounded-s-2xl side-notch bg-[var(--paper)] pointer-events-none transition-[transform,height,opacity] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]" style={{ transform: `translateY(${ind.y}px)`, height: ind.h, opacity: ind.h ? 1 : 0 }} />
        {items.map((item, idx) => {
          const { id, name, icon: Icon } = item;
          const label = navLabel(currentRole, item);
          const itemName = name || id;
          const groupHead = item.group && item.group !== items[idx - 1]?.group ? item.group : null;

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
            <div key={id || itemName}>
            {groupHead && <p className={`text-[11px] font-semibold tracking-wide text-slate-400 px-3 mb-1 ${idx ? "mt-4" : "mt-1"}`}>{t("nav.g." + groupHead)}</p>}
            <button
              data-tour={id}
              ref={isActive ? activeRef : null}
              onClick={() => {
                setActiveTab(itemName);
                if (onItemClick) onItemClick();
              }}
              onMouseEnter={(e) => handleMouseEnter(e, label)}
              onMouseLeave={handleMouseLeave}
              className={`group relative z-10 flex items-center w-full rounded-2xl text-sm transition-colors duration-150 btn-press focus:outline-none cursor-pointer ${
                collapsed ? "justify-center px-2 py-3" : "px-3 py-2.5 gap-3"
              } ${
                isActive
                  ? "text-[color:var(--ink)] font-semibold rounded-e-none"
                  : "text-white/75 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon
                className={`shrink-0 transition-colors duration-150 ${
                  collapsed ? "w-5 h-5" : "w-[18px] h-[18px]"
                } ${
                  isActive
                    ? "text-[color:var(--brand)]"
                    : "text-white/60 group-hover:text-white"
                }`}
              />
              {!collapsed && (
                <span className="truncate leading-normal tracking-tight">{label}</span>
              )}
            </button>
            </div>
          );
        })}
      </nav>

      {/* Tooltip for collapsed state (popping to the LEFT in RTL) */}
      {collapsed && tooltip.visible && (
        <div
          className="absolute start-[76px] z-50 px-3 py-1.5 text-xs font-semibold text-[#0E2A47] bg-white border border-[#E2E8F0] rounded-lg shadow-md whitespace-nowrap pointer-events-none"
          style={{ top: tooltip.top, transform: "translateY(-50%)" }}
        >
          {tooltip.text}
          <div className="absolute -start-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-white border-t border-e border-[#E2E8F0] rotate-45" />
        </div>
      )}

      {/* Bottom section */}
      {!hideHeader && (
        <div className={`p-4 ${collapsed ? "text-center" : ""}`}>
          {!collapsed ? (
            <div className="text-center">
              <p className="text-[11px] font-semibold text-white/80">
                {t("brand.footer1")}
              </p>
              <p className="text-[10px] text-white/50 mt-0.5">
                {t("brand.footer2")}
              </p>
            </div>
          ) : (
            <p className="text-[10px] font-semibold text-white/50">v1.0</p>
          )}
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
