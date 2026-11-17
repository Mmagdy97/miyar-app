import LogoMark from "./LogoMark";
import { D } from "../data/dataI18n";
import { useState, useRef, useEffect } from "react";
import {
  Building2,
  Bell,
  CheckCircle2,
  ChevronDown,
  Inbox,
  LogOut,
  Menu,
  Download,
} from "lucide-react";
import { ROLES, roleTitle, roleShort } from "../config/roles";
import { useI18n } from "../i18n";
import { noticesRepo } from "../data/notices";
import PushToggle from "./PushToggle";
import SettingsSwitcher from "./SettingsSwitcher";

function Navbar({
  currentRole,
  onRoleChange,
  account = null,
  actionItems = [],
  setSelectedItem,
  onLogout,
  onToggleMobileMenu,
  isInstallable = false,
  onInstallClick,
}) {
  const { t } = useI18n();
  // Role switcher dropdown state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Notification Bell Dropdown state
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationsRef = useRef(null);

  // Dynamic Filtering based on currentRole
  const liveNotices = noticesRepo.use();
  const roleNotifications = account ? liveNotices : actionItems.filter(
    (item) => item.targetRole === currentRole
  );
  const pendingCount = roleNotifications.filter(
    (item) => item.status === "pending"
  ).length;

  // Close on Outside Click for both dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(e.target)
      ) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-3 sm:px-4 md:px-8 bg-[var(--paper)]/90 glass border-b border-[#E5E7EB] md:border-transparent w-full max-w-full">
      {/* Right in RTL: Mobile Menu Toggle + Logo & Platform Identity */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Hamburger Menu Toggle (Visible on Mobile < md) */}
        <button
          onClick={onToggleMobileMenu}
          className="hidden p-1.5 -ms-1 rounded-lg text-[#111827] hover:bg-[#F7F8FA] transition-colors cursor-pointer"
          aria-label={t("menu.open")}
        >
          <Menu className="w-6 h-6 text-[#111827]" />
        </button>

        {/* Brand Icon + Name */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-[10px] bg-[#3F5BD8] text-white transition-transform hover:scale-105 cursor-pointer">
            <LogoMark className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-base sm:text-lg font-semibold text-[#111827] leading-tight flex items-center gap-1.5">
              <span>{t("brand")}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Left in RTL: PWA Install + Bell + Role Switcher (Desktop) + Avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Compact PWA Install Button (Responsive: small on mobile) */}
        {isInstallable && (
          <button
            onClick={onInstallClick}
            className="inline-flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-semibold bg-[#3F5BD8] text-white hover:bg-[#3F5BD8] transition-all cursor-pointer shadow-2xs active:scale-95"
            title={t("pwa.installTip")}
          >
            <Download className="w-3.5 h-3.5" />
            <span className="text-[11px] sm:text-xs">{t("pwa.installShort")}</span>
          </button>
        )}

        <SettingsSwitcher />

        {/* Interactive Notification Bell with Dropdown */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => { if (account && !isNotificationsOpen && roleNotifications.some((n) => n.unread)) noticesRepo.markRead(); setIsNotificationsOpen((prev) => !prev); }}
            className={`relative flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-[var(--shadow-1)] transition-colors cursor-pointer ${
              isNotificationsOpen
                ? "bg-[#F7F8FA] text-[#111827] border border-[#E5E7EB]"
                : "text-[#4B5563] hover:text-[#111827] hover:bg-[#F7F8FA]"
            }`}
            title={`${t("notif.title")} (${roleNotifications.length})`}
            aria-label={t("notif.title")}
          >
            <Bell className="w-4 h-4" />
            {(account ? roleNotifications.filter((n) => n.unread).length : roleNotifications.length) > 0 && (
              <span className="absolute -top-1 -start-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#3F5BD8] text-white font-semibold text-[10px] flex items-center justify-center ring-2 ring-white shadow-xs">
                {account ? roleNotifications.filter((n) => n.unread).length : roleNotifications.length}
              </span>
            )}
          </button>

          {/* Minimalist Notifications Dropdown Card (Constrained so it NEVER bleeds off-screen) */}
          {isNotificationsOpen && (
            <div className="fixed sm:absolute top-16 sm:top-auto end-2 start-2 sm:end-0 sm:right-auto mt-2 w-[90vw] sm:w-80 max-w-[calc(100vw-1rem)] mx-auto sm:mx-0 bg-white rounded-xl shadow-lg border border-[#E5E7EB] py-3 z-50 text-start animate-in fade-in slide-in-from-top-1">
              {/* Dropdown Header */}
              <div className="px-4 pb-3 border-b border-[#E5E7EB] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-[#111827] tracking-tight">
                      {t("notif.title")}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F7F8FA] text-[#111827] border border-[#E5E7EB]">
                      {roleNotifications.length}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#4B5563] font-medium mt-0.5">
                    {t("notif.forRole")}{" "}
                    <strong className="text-[#111827]">
                      {roleShort(currentRole)}
                    </strong>
                  </p>
                </div>

                {pendingCount > 0 && (
                  <span className="text-[10px] font-bold text-[#111827] bg-[#3F5BD8]/15 border border-[#3F5BD8]/30 px-2 py-0.5 rounded-full">
                    {pendingCount} {t("notif.pending")}
                  </span>
                )}
              </div>

              {/* Notification Items List or Empty State */}
              <div className="max-h-80 overflow-y-auto divide-y divide-[#E5E7EB]/60 px-2 py-1">
                {roleNotifications.length === 0 ? (
                  <div className="py-8 text-center text-[#4B5563] space-y-2">
                    <div className="w-10 h-10 rounded-lg bg-[#F7F8FA] flex items-center justify-center mx-auto text-[#4B5563] border border-[#E5E7EB]">
                      <Inbox className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-[#111827]">
                      {t("notif.none")}
                    </p>
                    <p className="text-[11px] text-[#4B5563] max-w-[200px] mx-auto">
                      {t("notif.noneDesc")}
                    </p>
                  </div>
                ) : (
                  roleNotifications.map((item) => {
                    const isNew =
                      item.timestamp === "الآن" || item.time === "الآن";

                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          if (setSelectedItem && !item.live) setSelectedItem(item);
                          setIsNotificationsOpen(false);
                        }}
                        className={`p-3 rounded-lg transition-colors hover:bg-[#F7F8FA] flex items-start gap-3 my-1 cursor-pointer ${
                          isNew
                            ? "bg-[#F7F8FA]/70 border border-[#E5E7EB]"
                            : ""
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 bg-[#F7F8FA] text-[#111827] border border-[#E5E7EB]">
                          <CheckCircle2 className="w-4 h-4 text-[#3F5BD8]" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[10px] font-bold text-[#4B5563] uppercase tracking-wider truncate">
                              {item.category ? D(item.category) : D("تنبيه")}
                            </span>
                            <span className="text-[10px] font-bold text-[#4B5563] shrink-0">
                              {item.timestamp || item.time}
                            </span>
                          </div>

                          <h4 className="text-xs font-bold text-[#111827] mt-0.5 leading-snug">
                            {item.live ? item.title : D(item.title)}
                          </h4>

                          {item.subtitle && (
                            <p className="text-[11px] text-[#4B5563] mt-0.5 line-clamp-2">
                              {item.subtitle}
                            </p>
                          )}

                          <div className="flex items-center justify-between gap-2 mt-2">
                            {!item.live && <span className="text-[10px] text-[#4B5563]">
                              {t("notif.project")}{" "}
                              <strong className="text-[#111827]">
                                {item.project || D("الموقع")}
                              </strong>
                            </span>}

                            {isNew && (
                              <span className="inline-flex items-center gap-1 text-[9px] font-bold text-[#111827] bg-[#3F5BD8]/15 px-1.5 py-0.5 rounded-full border border-[#3F5BD8]/30">
                                <span className="w-1 h-1 rounded-full bg-[#3F5BD8]" />
                                {t("notif.new")}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {account && <PushToggle />}
              {/* Dropdown Footer */}
              <div className="px-4 pt-2.5 mt-1 border-t border-[#E5E7EB] flex items-center justify-between text-[11px] text-[#4B5563]">
                <span>{t("notif.live")}</span>
                <span className="text-[#111827] font-bold hover:text-[#3F5BD8] cursor-pointer">
                  {t("notif.markAll")}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Role Switcher (Hidden on mobile < md as instructed) */}
        <div className={`relative ${account ? "hidden" : "hidden md:block"}`} ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 px-3 py-1.5 md:px-3.5 md:py-2 text-xs md:text-sm font-semibold text-[#111827] bg-[#F7F8FA] hover:bg-white rounded-lg transition-colors focus:outline-none focus:ring-1 focus:ring-[#3F5BD8] border border-[#E5E7EB] shadow-2xs cursor-pointer"
          >
            <span className="text-[#4B5563] font-normal">
              {t("role.label")}
            </span>
            <span className="text-[#111827] font-bold">
              {roleShort(currentRole) || currentRole}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-[#4B5563] transition-transform duration-200 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Role Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute end-0 mt-2 w-60 bg-white rounded-xl shadow-lg border border-[#E5E7EB] py-2 z-50 animate-in fade-in slide-in-from-top-1">
              <div className="px-3.5 py-1.5 mb-1 border-b border-[#E5E7EB]">
                <p className="text-[11px] font-bold text-[#4B5563] uppercase tracking-wider">
                  {t("role.switch")}
                </p>
              </div>
              {ROLES.map((role) => {
                const isSelected = role === currentRole;
                return (
                  <button
                    key={role}
                    onClick={() => {
                      onRoleChange(role);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-start px-3.5 py-2.5 text-xs md:text-sm font-semibold flex items-center justify-between transition-colors duration-150 cursor-pointer ${
                      isSelected
                        ? "bg-[#3F5BD8] text-white font-bold rounded-lg shadow-xs"
                        : "text-[#4B5563] hover:bg-[#F7F8FA] hover:text-[#111827]"
                    }`}
                  >
                    <span>{roleTitle(role) || role}</span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Divider (Hidden on mobile < md) */}
        <div className="w-px h-6 bg-[#E5E7EB] hidden md:block" />

        {/* User Avatar & Profile */}
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#F7F8FA] text-[#111827] font-semibold text-xs border border-[#E5E7EB] shadow-2xs shrink-0">
            {account ? [...account.name.trim()].slice(0, 2).join("") : D("م.أ")}
          </div>
          {/* Profile Name & Role (Hidden on mobile < md as instructed) */}
          <div className="hidden md:block text-start">
            <p className="text-xs font-bold text-[#111827] leading-tight">
              {account ? account.name : D("م. محمد أحمد")}
            </p>
            <p className="text-[10px] text-[#4B5563] font-medium leading-tight mt-0.5">
              {roleShort(currentRole)}
            </p>
          </div>
        </div>

        {/* Logout Button */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="flex items-center justify-center w-10 h-10 rounded-lg text-[#4B5563] hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all cursor-pointer"
            title={t("logout")}
            aria-label={t("logout")}
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
}

export default Navbar;
