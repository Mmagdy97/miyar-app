import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import MainContent from "./components/MainContent";
import ActionItemModal from "./components/ActionItemModal";
import LandingAndLogin from "./components/LandingAndLogin";
import { ROLE_CONFIG, ROLE_TITLES } from "./config/roles";
import { Menu, X, Building2, Download } from "lucide-react";

// Role-Based Initial Action Items & Notifications in Arabic
const INITIAL_ACTION_ITEMS = [
  {
    id: 1,
    title: "مراجعة أمر تغيير (VO #03) - فيلا الياسمين",
    subtitle: "ترقية إلى رخام كلكتا جولد إيطالي لبهو المدخل الرئيسي",
    user: "فريق استوديو فيلا الياسمين",
    project: "فيلا الياسمين - التجمع",
    category: "أمر تغيير (VO)",
    amount: "+٨٥,٠٠٠ ج.م",
    timestamp: "منذ ساعتين",
    time: "منذ ساعتين",
    targetRole: "Admin",
    type: "vo",
    status: "pending",
  },
  {
    id: 2,
    title: "تم اعتماد طلب البورسلين وتجهيز الشحنة",
    subtitle: "٤٥٠ م² مقاس ٦٠×١٢٠ سم — جاهزة للاستلام والتشوين بالموقع",
    user: "الإدارة التنفيذية",
    project: "مقر إداري - الشيخ زايد",
    category: "اعتماد توريد",
    amount: "١٤٥,٠٠٠ ج.م",
    timestamp: "منذ ساعة",
    time: "منذ ساعة",
    targetRole: "Site Engineer",
    type: "material",
    status: "approved",
  },
  {
    id: 3,
    title: "تحديث جديد لصور الموقع ونسب الإنجاز",
    subtitle: "تم توثيق اختبار ضغط شبكة الصرف وإنهاء أعمال التأسيس",
    user: "م. محمد (الموقع)",
    project: "فيلا الياسمين - التجمع",
    category: "تقرير ميداني",
    amount: "نسبة الإنجاز ٧٨٪",
    timestamp: "الآن",
    time: "الآن",
    targetRole: "Client",
    type: "report",
    status: "pending",
  },
  {
    id: 4,
    title: "تصفية عهدة (نقل وتشوين أسمنت) - م. أحمد",
    subtitle: "نولون نقل سريع لشحنة أسمنت مقاوم للكبريتات لعزل البدروم",
    user: "م. أحمد (مهندس موقع)",
    project: "مقر إداري - الشيخ زايد",
    category: "تسوية عهدة",
    amount: "١,٢٠٠ ج.م",
    timestamp: "اليوم، ١١:٣٠ ص",
    time: "اليوم، ١١:٣٠ ص",
    targetRole: "Admin",
    type: "expense",
    status: "pending",
  },
  {
    id: 5,
    title: "مطلوب مراجعة مخطط التكييف والإنارة المعمارية",
    subtitle: "مخططات الأسقف المعلقة بالدور الأول تتطلب مطابقة مع التصميم الداخلي",
    user: "المكتب الفني",
    project: "دوبلكس نيو جيزة",
    category: "مخططات ومستندات",
    amount: "مراجعة كود",
    timestamp: "منذ ٣ ساعات",
    time: "منذ ٣ ساعات",
    targetRole: "Technical Office",
    type: "report",
    status: "pending",
  },
];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentRole, setCurrentRole] = useState("");
  const [activeTab, setActiveTab] = useState("لوحة التحكم");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Requirement 2: PWA Install State & Event Handler
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent browser's default install banner
      e.preventDefault();
      // Stash prompt event for user-triggered installation
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
      console.log("Miyar PWA has been installed successfully.");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    if (choiceResult && choiceResult.outcome === "accepted") {
      setIsInstallable(false);
      setDeferredPrompt(null);
    }
  };

  // Shared state for real-time synchronization between Engineer and Admin with role-based targeting
  const [actionItems, setActionItems] = useState(INITIAL_ACTION_ITEMS);

  // Requirement 1: Global Modal State in the parent App Shell
  const [selectedItem, setSelectedItem] = useState(null);

  // Requirement 4: When role changes, automatically reset the active tab back to "لوحة التحكم"
  const handleRoleChange = (role) => {
    setCurrentRole(role);
    setActiveTab("لوحة التحكم");
    setIsMobileMenuOpen(false);
  };

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);

  // Requirement 5: Modal Approval Logic filters out item from actionItems and closes modal
  const handleApproveModal = () => {
    if (selectedItem) {
      setActionItems((prev) => prev.filter((i) => i.id !== selectedItem.id));
      setSelectedItem(null);
    }
  };

  // Public Landing & Login Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <LandingAndLogin
        onLogin={(role) => {
          setCurrentRole(role || "Admin");
          setIsAuthenticated(true);
        }}
      />
    );
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen w-full relative isolate flex flex-col md:flex-row h-screen overflow-hidden font-ibm bg-[#F5F3ED] text-[#202923] selection:bg-[#183C35] selection:text-white"
    >
      {/* Ambient Restful Studio Glow Orbs */}
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      >
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[#5D8C70]/10 blur-[130px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#C5A36B]/8 blur-[130px]" />
      </div>

      {/* 1. Mobile Top Navbar (Visible only on mobile < md) */}
      <div className="flex md:hidden items-center justify-between p-4 bg-white/95 backdrop-blur-md border-b border-[#E5E6DF] z-30 shrink-0">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 -mr-2 rounded-lg text-[#202923] hover:bg-[#F5F3ED] transition-colors cursor-pointer"
          aria-label="القائمة الجانبية"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* App Logo */}
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#183C35] text-white shadow-sm">
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-black text-[#202923] tracking-tight">
            معيار
          </span>
        </div>

        {/* Current Role Badge & Install Action if eligible */}
        <div className="flex items-center gap-2">
          {isInstallable && (
            <button
              onClick={handleInstallClick}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-[#183C35] text-white hover:bg-[#202923] transition-all cursor-pointer shadow-2xs active:scale-95"
              title="تثبيت التطبيق على جهازك"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تثبيت</span>
            </button>
          )}
          <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#F5F3ED] text-[#202923] border border-[#E5E6DF] shadow-2xs">
            {ROLE_TITLES[currentRole] || currentRole}
          </span>
        </div>
      </div>

      {/* 2. Desktop Standard Sidebar (Hidden on mobile) */}
      <div className="hidden md:flex md:w-64 md:flex-col shrink-0">
        <Sidebar
          currentRole={currentRole}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collapsed={sidebarCollapsed}
          toggleSidebar={toggleSidebar}
          isInstallable={isInstallable}
          onInstallClick={handleInstallClick}
        />
      </div>

      {/* 3. Mobile Sidebar Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden" dir="rtl">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#202923]/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer (Anchored to Right in RTL - Forest Green Miyar Theme) */}
          <div className="relative w-64 bg-[#183C35] text-white h-full p-4 flex flex-col shadow-xl z-10 animate-in slide-in-from-right duration-200 border-l border-[#5D8C70]/20">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#5D8C70]/20">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#5D8C70]/30 text-white shadow-sm">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-black text-white">معيار</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-[#EFEEE8]/70 hover:text-white hover:bg-[#5D8C70]/20 transition-colors cursor-pointer"
                aria-label="إغلاق القائمة"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sidebar inside drawer */}
            <div className="flex-1 overflow-y-auto">
              <Sidebar
                currentRole={currentRole}
                activeTab={activeTab}
                setActiveTab={(tab) => {
                  setActiveTab(tab);
                  setIsMobileMenuOpen(false);
                }}
                collapsed={false}
                toggleSidebar={() => setIsMobileMenuOpen(false)}
                onItemClick={() => setIsMobileMenuOpen(false)}
                hideHeader={true}
                isInstallable={isInstallable}
                onInstallClick={handleInstallClick}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Area: Navbar + Content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
        <Navbar
          currentRole={currentRole}
          onRoleChange={handleRoleChange}
          actionItems={actionItems}
          setSelectedItem={setSelectedItem}
          onLogout={() => {
            setIsAuthenticated(false);
            setCurrentRole("");
          }}
        />
        <MainContent
          currentRole={currentRole}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          actionItems={actionItems}
          setActionItems={setActionItems}
          setSelectedItem={setSelectedItem}
        />
      </div>

      {/* Requirement 2: Global Modal Rendering (Overlays ANY screen) */}
      {selectedItem && (
        <ActionItemModal
          selectedItem={selectedItem}
          onClose={() => setSelectedItem(null)}
          onApprove={handleApproveModal}
        />
      )}
    </div>
  );
}

export default App;
