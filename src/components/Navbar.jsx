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
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-3 sm:px-4 md:px-6 bg-white/95 backdrop-blur-md border-b border-[#E5E6DF] w-full max-w-full">
      {/* Right in RTL: Mobile Menu Toggle + Logo & Platform Identity */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Hamburger Menu Toggle (Visible on Mobile < md) */}
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-1.5 -ms-1 rounded-lg text-[#202923] hover:bg-[#F5F3ED] transition-colors cursor-pointer"
          aria-label="القائمة الجانبية"
        >
          <Menu className="w-6 h-6 text-[#183C35]" />
        </button>

        {/* Brand Icon + Name */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#183C35] text-white shadow-xs transition-transform hover:scale-105 cursor-pointer">
            <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-black text-[#202923] tracking-tight leading-tight flex items-center gap-1.5">
              <span>معيار</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#F5F3ED] text-[#183C35] border border-[#E5E6DF] hidden sm:inline">
                MIYAR
              </span>
            </span>
            <span className="text-[10px] text-[#526257] font-medium hidden sm:inline leading-none">
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
            className="inline-flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-semibold bg-[#183C35] text-white hover:bg-[#202923] transition-all cursor-pointer shadow-2xs active:scale-95"
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
                ? "bg-[#F5F3ED] text-[#183C35] border border-[#E5E6DF]"
                : "text-[#526257] hover:text-[#183C35] hover:bg-[#F5F3ED]"
            }`}
            title={`الإشعارات (${roleNotifications.length})`}
            aria-label="الإشعارات والتنبيهات"
          >
            <Bell className="w-4 h-4" />
            {roleNotifications.length > 0 && (
              <span className="absolute -top-1 -start-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#183C35] text-white font-extrabold text-[10px] flex items-center justify-center ring-2 ring-white shadow-xs">
                {roleNotifications.length}
              </span>
            )}
          </button>

          {/* Minimalist Notifications Dropdown Card (Constrained so it NEVER bleeds off-screen) */}
          {isNotificationsOpen && (
            <div className="fixed sm:absolute top-16 sm:top-auto end-2 start-2 sm:end-0 sm:right-auto mt-2 w-[90vw] sm:w-80 max-w-[calc(100vw-1rem)] mx-auto sm:mx-0 bg-white rounded-xl shadow-lg border border-[#E5E6DF] py-3 z-50 text-start animate-in fade-in slide-in-from-top-1">
              {/* Dropdown Header */}
              <div className="px-4 pb-3 border-b border-[#E5E6DF] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-[#202923] tracking-tight">
                      الإشعارات والتنبيهات
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F5F3ED] text-[#183C35] border border-[#E5E6DF]">
                      {roleNotifications.length}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#526257] font-medium mt-0.5">
                    مخصصة لدور:{" "}
                    <strong className="text-[#202923]">
                      {ROLE_TITLES[currentRole]?.split(" ")[0]}
                    </strong>
                  </p>
                </div>

                {pendingCount > 0 && (
                  <span className="text-[10px] font-bold text-[#183C35] bg-[#5D8C70]/15 border border-[#5D8C70]/30 px-2 py-0.5 rounded-full">
                    {pendingCount} قيد المتابعة
                  </span>
                )}
              </div>

              {/* Notification Items List or Empty State */}
              <div className="max-h-80 overflow-y-auto divide-y divide-[#E5E6DF]/60 px-2 py-1">
                {roleNotifications.length === 0 ? (
                  <div className="py-8 text-center text-[#526257] space-y-2">
                    <div className="w-10 h-10 rounded-lg bg-[#F5F3ED] flex items-center justify-center mx-auto text-[#526257] border border-[#E5E6DF]">
                      <Inbox className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-[#202923]">
                      لا توجد إشعارات جديدة
                    </p>
                    <p className="text-[11px] text-[#526257] max-w-[200px] mx-auto">
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
                        className={`p-3 rounded-lg transition-colors hover:bg-[#F5F3ED] flex items-start gap-3 my-1 cursor-pointer ${
                          isNew
                            ? "bg-[#F5F3ED]/70 border border-[#E5E6DF]"
                            : ""
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 bg-[#F5F3ED] text-[#183C35] border border-[#E5E6DF]">
                          <CheckCircle2 className="w-4 h-4 text-[#5D8C70]" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[10px] font-bold text-[#526257] uppercase tracking-wider truncate">
                              {item.category || "تنبيه"}
                            </span>
                            <span className="text-[10px] font-bold text-[#526257] shrink-0">
                              {item.timestamp || item.time}
                            </span>
                          </div>

                          <h4 className="text-xs font-bold text-[#202923] mt-0.5 leading-snug">
                            {item.title}
                          </h4>

                          {item.subtitle && (
                            <p className="text-[11px] text-[#526257] mt-0.5 line-clamp-1">
                              {item.subtitle}
                            </p>
                          )}

                          <div className="flex items-center justify-between gap-2 mt-2">
                            <span className="text-[10px] text-[#526257]">
                              المشروع:{" "}
                              <strong className="text-[#202923]">
                                {item.project || "الموقع"}
                              </strong>
                            </span>

                            {isNew && (
                              <span className="inline-flex items-center gap-1 text-[9px] font-bold text-[#183C35] bg-[#5D8C70]/15 px-1.5 py-0.5 rounded-full border border-[#5D8C70]/30">
                                <span className="w-1 h-1 rounded-full bg-[#5D8C70]" />
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
              <div className="px-4 pt-2.5 mt-1 border-t border-[#E5E6DF] flex items-center justify-between text-[11px] text-[#526257]">
                <span>تحديث لحظي حسب الصلاحيات</span>
                <span className="text-[#183C35] font-bold hover:text-[#5D8C70] cursor-pointer">
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
            className="flex items-center gap-2 px-3 py-1.5 md:px-3.5 md:py-2 text-xs md:text-sm font-semibold text-[#202923] bg-[#F5F3ED] hover:bg-white rounded-lg transition-colors focus:outline-none focus:ring-1 focus:ring-[#183C35] border border-[#E5E6DF] shadow-2xs cursor-pointer"
          >
            <span className="text-[#526257] font-normal">
              الدور:
            </span>
            <span className="text-[#202923] font-bold">
              {ROLE_TITLES[currentRole]?.split(" ")[0] || currentRole}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-[#526257] transition-transform duration-200 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Role Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute end-0 mt-2 w-60 bg-white rounded-xl shadow-lg border border-[#E5E6DF] py-2 z-50 animate-in fade-in slide-in-from-top-1">
              <div className="px-3.5 py-1.5 mb-1 border-b border-[#E5E6DF]">
                <p className="text-[11px] font-bold text-[#526257] uppercase tracking-wider">
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
                        ? "bg-[#183C35] text-white font-bold rounded-lg shadow-xs"
                        : "text-[#526257] hover:bg-[#F5F3ED] hover:text-[#202923]"
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
        <div className="w-px h-6 bg-[#E5E6DF] hidden md:block" />

        {/* User Avatar & Profile */}
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#F5F3ED] text-[#183C35] font-extrabold text-xs border border-[#E5E6DF] shadow-2xs shrink-0">
            م.أ
          </div>
          {/* Profile Name & Role (Hidden on mobile < md as instructed) */}
          <div className="hidden md:block text-start">
            <p className="text-xs font-bold text-[#202923] leading-tight">
              م. محمد أحمد
            </p>
            <p className="text-[10px] text-[#526257] font-medium leading-tight mt-0.5">
              {ROLE_TITLES[currentRole]?.split(" ")[0]}
            </p>
          </div>
        </div>

        {/* Logout Button */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-[#526257] hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all cursor-pointer"
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
