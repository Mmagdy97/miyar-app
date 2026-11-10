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
import { ROLES, ROLE_TITLES } from "../config/roles";

function Navbar({
  currentRole,
  onRoleChange,
  actionItems = [],
  setSelectedItem,
  onLogout,
  onToggleMobileMenu,
  isInstallable = false,
  onInstallClick,
}) {
  // Role switcher dropdown state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Notification Bell Dropdown state
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationsRef = useRef(null);

  // Dynamic Filtering based on currentRole
  const roleNotifications = actionItems.filter(
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
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-3 sm:px-4 md:px-6 bg-white/95 backdrop-blur-md border-b border-[#DDE1E5] w-full max-w-full">
      {/* Right in RTL: Mobile Menu Toggle + Logo & Platform Identity */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Hamburger Menu Toggle (Visible on Mobile < md) */}
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-1.5 -ms-1 rounded-lg text-[#1E2429] hover:bg-[#F3F4F6] transition-colors cursor-pointer"
          aria-label="القائمة الجانبية"
        >
          <Menu className="w-6 h-6 text-[#2B3138]" />
        </button>

        {/* Brand Icon + Name */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#2B3138] text-white shadow-xs transition-transform hover:scale-105 cursor-pointer">
            <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-black text-[#1E2429] tracking-tight leading-tight flex items-center gap-1.5">
              <span>معيار</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#F3F4F6] text-[#2B3138] border border-[#DDE1E5] hidden sm:inline">
                MIYAR
              </span>
            </span>
            <span className="text-[10px] text-[#5A646E] font-medium hidden sm:inline leading-none">
              استوديو المقاولات والتصميم المعماري
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
            className="inline-flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-semibold bg-[#2B3138] text-white hover:bg-[#1E2429] transition-all cursor-pointer shadow-2xs active:scale-95"
            title="تثبيت التطبيق على جهازك"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="text-[11px] sm:text-xs">تثبيت</span>
          </button>
        )}

        {/* Interactive Notification Bell with Dropdown */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setIsNotificationsOpen((prev) => !prev)}
            className={`relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg transition-colors cursor-pointer ${
              isNotificationsOpen
                ? "bg-[#F3F4F6] text-[#2B3138] border border-[#DDE1E5]"
                : "text-[#5A646E] hover:text-[#2B3138] hover:bg-[#F3F4F6]"
            }`}
            title={`الإشعارات (${roleNotifications.length})`}
            aria-label="الإشعارات والتنبيهات"
          >
            <Bell className="w-4 h-4" />
            {roleNotifications.length > 0 && (
              <span className="absolute -top-1 -start-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#2B3138] text-white font-extrabold text-[10px] flex items-center justify-center ring-2 ring-white shadow-xs">
                {roleNotifications.length}
              </span>
            )}
          </button>

          {/* Minimalist Notifications Dropdown Card (Constrained so it NEVER bleeds off-screen) */}
          {isNotificationsOpen && (
            <div className="fixed sm:absolute top-16 sm:top-auto end-2 start-2 sm:end-0 sm:right-auto mt-2 w-[90vw] sm:w-80 max-w-[calc(100vw-1rem)] mx-auto sm:mx-0 bg-white rounded-xl shadow-lg border border-[#DDE1E5] py-3 z-50 text-start animate-in fade-in slide-in-from-top-1">
              {/* Dropdown Header */}
              <div className="px-4 pb-3 border-b border-[#DDE1E5] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-[#1E2429] tracking-tight">
                      الإشعارات والتنبيهات
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F3F4F6] text-[#2B3138] border border-[#DDE1E5]">
                      {roleNotifications.length}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#5A646E] font-medium mt-0.5">
                    مخصصة لدور:{" "}
                    <strong className="text-[#1E2429]">
                      {ROLE_TITLES[currentRole]?.split(" ")[0]}
                    </strong>
                  </p>
                </div>

                {pendingCount > 0 && (
                  <span className="text-[10px] font-bold text-[#2B3138] bg-[#D9480F]/15 border border-[#D9480F]/30 px-2 py-0.5 rounded-full">
                    {pendingCount} قيد المتابعة
                  </span>
                )}
              </div>

              {/* Notification Items List or Empty State */}
              <div className="max-h-80 overflow-y-auto divide-y divide-[#DDE1E5]/60 px-2 py-1">
                {roleNotifications.length === 0 ? (
                  <div className="py-8 text-center text-[#5A646E] space-y-2">
                    <div className="w-10 h-10 rounded-lg bg-[#F3F4F6] flex items-center justify-center mx-auto text-[#5A646E] border border-[#DDE1E5]">
                      <Inbox className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-[#1E2429]">
                      لا توجد إشعارات جديدة
                    </p>
                    <p className="text-[11px] text-[#5A646E] max-w-[200px] mx-auto">
                      جميع التنبيهات الموجهة لصلاحية {ROLE_TITLES[currentRole]?.split(" ")[0]} محدثة بالكامل.
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
                          if (setSelectedItem) setSelectedItem(item);
                          setIsNotificationsOpen(false);
                        }}
                        className={`p-3 rounded-lg transition-colors hover:bg-[#F3F4F6] flex items-start gap-3 my-1 cursor-pointer ${
                          isNew
                            ? "bg-[#F3F4F6]/70 border border-[#DDE1E5]"
                            : ""
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 bg-[#F3F4F6] text-[#2B3138] border border-[#DDE1E5]">
                          <CheckCircle2 className="w-4 h-4 text-[#D9480F]" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[10px] font-bold text-[#5A646E] uppercase tracking-wider truncate">
                              {item.category || "تنبيه"}
                            </span>
                            <span className="text-[10px] font-bold text-[#5A646E] shrink-0">
                              {item.timestamp || item.time}
                            </span>
                          </div>

                          <h4 className="text-xs font-bold text-[#1E2429] mt-0.5 leading-snug">
                            {item.title}
                          </h4>

                          {item.subtitle && (
                            <p className="text-[11px] text-[#5A646E] mt-0.5 line-clamp-1">
                              {item.subtitle}
                            </p>
                          )}

                          <div className="flex items-center justify-between gap-2 mt-2">
                            <span className="text-[10px] text-[#5A646E]">
                              المشروع:{" "}
                              <strong className="text-[#1E2429]">
                                {item.project || "الموقع"}
                              </strong>
                            </span>

                            {isNew && (
                              <span className="inline-flex items-center gap-1 text-[9px] font-bold text-[#2B3138] bg-[#D9480F]/15 px-1.5 py-0.5 rounded-full border border-[#D9480F]/30">
                                <span className="w-1 h-1 rounded-full bg-[#D9480F]" />
                                جديد
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Dropdown Footer */}
              <div className="px-4 pt-2.5 mt-1 border-t border-[#DDE1E5] flex items-center justify-between text-[11px] text-[#5A646E]">
                <span>تحديث لحظي حسب الصلاحيات</span>
                <span className="text-[#2B3138] font-bold hover:text-[#D9480F] cursor-pointer">
                  تحديد الكل كمقروء
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Role Switcher (Hidden on mobile < md as instructed) */}
        <div className="relative hidden md:block" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 px-3 py-1.5 md:px-3.5 md:py-2 text-xs md:text-sm font-semibold text-[#1E2429] bg-[#F3F4F6] hover:bg-white rounded-lg transition-colors focus:outline-none focus:ring-1 focus:ring-[#2B3138] border border-[#DDE1E5] shadow-2xs cursor-pointer"
          >
            <span className="text-[#5A646E] font-normal">
              الدور:
            </span>
            <span className="text-[#1E2429] font-bold">
              {ROLE_TITLES[currentRole]?.split(" ")[0] || currentRole}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-[#5A646E] transition-transform duration-200 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Role Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute end-0 mt-2 w-60 bg-white rounded-xl shadow-lg border border-[#DDE1E5] py-2 z-50 animate-in fade-in slide-in-from-top-1">
              <div className="px-3.5 py-1.5 mb-1 border-b border-[#DDE1E5]">
                <p className="text-[11px] font-bold text-[#5A646E] uppercase tracking-wider">
                  تبديل الصلاحية والدور
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
                        ? "bg-[#2B3138] text-white font-bold rounded-lg shadow-xs"
                        : "text-[#5A646E] hover:bg-[#F3F4F6] hover:text-[#1E2429]"
                    }`}
                  >
                    <span>{ROLE_TITLES[role] || role}</span>
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
        <div className="w-px h-6 bg-[#DDE1E5] hidden md:block" />

        {/* User Avatar & Profile */}
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#F3F4F6] text-[#2B3138] font-extrabold text-xs border border-[#DDE1E5] shadow-2xs shrink-0">
            م.أ
          </div>
          {/* Profile Name & Role (Hidden on mobile < md as instructed) */}
          <div className="hidden md:block text-start">
            <p className="text-xs font-bold text-[#1E2429] leading-tight">
              م. محمد أحمد
            </p>
            <p className="text-[10px] text-[#5A646E] font-medium leading-tight mt-0.5">
              {ROLE_TITLES[currentRole]?.split(" ")[0]}
            </p>
          </div>
        </div>

        {/* Logout Button */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-[#5A646E] hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all cursor-pointer"
            title="تسجيل الخروج والعودة للرئيسية"
            aria-label="تسجيل الخروج"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
}

export default Navbar;
