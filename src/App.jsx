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
  const saved = (() => {
    try { return JSON.parse(sessionStorage.getItem("miyar:session")) || {}; } catch { return {}; }
  })();
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(saved.auth));
  const [currentRole, setCurrentRole] = useState(saved.role || "");
  const [activeTab, setActiveTab] = useState(saved.tab || "لوحة التحكم");
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

  useEffect(() => {
    try {
      sessionStorage.setItem("miyar:session", JSON.stringify({ auth: isAuthenticated, role: currentRole, tab: activeTab }));
    } catch { /* ignore */ }
  }, [isAuthenticated, currentRole, activeTab]);

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
      className="min-h-screen w-full relative isolate flex flex-col md:flex-row h-screen overflow-hidden font-ibm bg-[#F3F4F6] text-[#1E2429] selection:bg-[#2B3138] selection:text-white"
    >
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:start-2 focus:z-[100] focus:bg-[#2B3138] focus:text-white focus:px-4 focus:py-2 focus:rounded-lg">
        تخطي إلى المحتوى
      </a>
      {/* Ambient Restful Studio Glow Orbs */}
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      >
        <div className="absolute top-[-10%] start-[-5%] w-[500px] h-[500px] rounded-full bg-[#D9480F]/10 blur-[130px]" />
        <div className="absolute bottom-[-10%] end-[-10%] w-[600px] h-[600px] rounded-full bg-[#7B848E]/8 blur-[130px]" />
      </div>

      {/* Mobile Drawer Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar: Slide-over Drawer on Mobile (< md), Static on Desktop (md:) */}
      <div
        className={`fixed inset-y-0 start-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:block ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } ${sidebarCollapsed ? "md:w-[72px]" : "md:w-64"} w-72 shrink-0 h-full`}
      >
        <Sidebar
          currentRole={currentRole}
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setIsMobileMenuOpen(false);
          }}
          collapsed={sidebarCollapsed}
          toggleSidebar={toggleSidebar}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          onItemClick={() => setIsMobileMenuOpen(false)}
          isInstallable={isInstallable}
          onInstallClick={handleInstallClick}
          onRoleChange={handleRoleChange}
        />
      </div>

      {/* Main Area: Navbar + Content */}
      <div className="flex flex-col flex-1 min-w-0 w-full max-w-full overflow-x-hidden relative h-full">
        <Navbar
          currentRole={currentRole}
          onRoleChange={handleRoleChange}
          actionItems={actionItems}
          setSelectedItem={setSelectedItem}
          onLogout={() => {
            setIsAuthenticated(false);
            setCurrentRole("");
          }}
          onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
          isInstallable={isInstallable}
          onInstallClick={handleInstallClick}
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
