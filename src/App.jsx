import { flushSync } from "react-dom";
import { initMotion, withTransition } from "./lib/motion";
import { createPersistedStore } from "./data/persisted";
import { useState, useEffect } from "react";
import { localize, D } from "./data/dataI18n";
import Sidebar from "./components/Sidebar";
import OfflineBanner from "./components/OfflineBanner";
import Navbar from "./components/Navbar";
import BottomNav from "./components/BottomNav";
import LeadNudge from "./components/LeadNudge";
import { watchTableLabels } from "./lib/tableLabels";
import MainContent from "./components/MainContent";
import ActionItemModal from "./components/ActionItemModal";
import LandingAndLogin from "./components/LandingAndLogin";
import { ROLE_CONFIG, ROLE_TITLES } from "./config/roles";
import { Menu, X, Building2, Download } from "lucide-react";
import { loadAccount, signOut } from "./lib/auth";
import OwnerAdmin from "./components/OwnerAdmin";
import { setActiveOrg } from "./lib/entitlements";
import { attachProjects } from "./data/projects";
import { attachInvoices } from "./data/invoices";
import { attachCash } from "./data/cash";
import { attachBoq } from "./data/boq";
import { attachAttendance } from "./data/attendance";
import { attachProcurement } from "./data/procurement";
import { attachChangeOrders } from "./data/changeorders";
import { attachCertificates } from "./data/certificates";
import { attachSelections } from "./data/selections";
import { attachMood } from "./data/moodboard";

// Role-Based Initial Action Items & Notifications in Arabic
const INITIAL_ACTION_ITEMS = localize([
  {
    id: 1,
    title: "مراجعة أمر تغيير (VO #03) - فيلا الياسمين",
    subtitle: "ترقية إلى رخام كلكتا جولد إيطالي لبهو المدخل الرئيسي",
    user: "فريق استوديو فيلا الياسمين",
    project: D("فيلا الياسمين - التجمع"),
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
    project: D("فيلا الياسمين - التجمع"),
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
    project: D("دوبلكس نيو جيزة"),
    category: "مخططات ومستندات",
    amount: "مراجعة كود",
    timestamp: "منذ ٣ ساعات",
    time: "منذ ٣ ساعات",
    targetRole: "Technical Office",
    type: "report",
    status: "pending",
  },
]);

const actionItemsStore = createPersistedStore("miyar:actions:v1", INITIAL_ACTION_ITEMS);

function App() {
  const saved = (() => {
    try { return JSON.parse(sessionStorage.getItem("miyar:session")) || {}; } catch { return {}; }
  })();
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(saved.auth));
  // "guest" = demo on local sample data; real accounts (Supabase) will add "user".
  const [account, setAccount] = useState(null);
  const [ownerView, setOwnerView] = useState(true);
  const [authMode, setAuthMode] = useState(saved.mode || "guest");
  setActiveOrg(authMode === "user" ? account?.org : null); // sidebar/nav read it during this render
  const [currentRole, setCurrentRole] = useState(saved.role || "");
  const [activeTab, setActiveTab] = useState(saved.tab || "لوحة التحكم");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Requirement 2: PWA Install State & Event Handler
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => watchTableLabels(), []);
  // Restore a real account after reload; drop the session if it expired.
  useEffect(() => {
    if (!isAuthenticated || authMode !== "user") return;
    loadAccount().then((acc) => { if (acc) { setAccount(acc); attachProjects(acc.orgId); attachInvoices(acc.orgId); attachCash(acc.orgId); attachBoq(acc.orgId); attachAttendance(acc.orgId); attachProcurement(acc.orgId); attachChangeOrders(acc.orgId); attachCertificates(acc.orgId); attachSelections(acc.orgId); attachMood(acc.orgId); } else { setIsAuthenticated(false); setAuthMode("guest"); } }).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  const [actionItems, setActionItems] = actionItemsStore.use();

  // Requirement 1: Global Modal State in the parent App Shell
  const [selectedItem, setSelectedItem] = useState(null);

  // Requirement 4: When role changes, automatically reset the active tab back to "لوحة التحكم"
  const handleRoleChange = (role) => {
    setCurrentRole(role);
    setActiveTab("لوحة التحكم");
    setIsMobileMenuOpen(false);
  };

  // Browser back/forward moves between tabs (hash keeps the tab shareable per session).
  useEffect(() => {
    if (!isAuthenticated) return;
    if (history.state?.tab !== activeTab) history.pushState({ tab: activeTab }, "", "#app");
  }, [activeTab, isAuthenticated]);
  useEffect(() => {
    const onPop = (e) => { if (e.state?.tab) setActiveTab(e.state.tab); };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem("miyar:session", JSON.stringify({ auth: isAuthenticated, role: currentRole, tab: activeTab, mode: authMode }));
    } catch { /* ignore */ }
  }, [isAuthenticated, currentRole, activeTab, authMode]);

  const goTab = (tab) => withTransition(() => flushSync(() => setActiveTab(tab)));
  useEffect(() => initMotion(), []);
  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);

  // Requirement 5: Modal Approval Logic filters out item from actionItems and closes modal
  const handleApproveModal = () => {
    if (selectedItem) {
      setActionItems((prev) => prev.filter((i) => i.id !== selectedItem.id));
      setSelectedItem(null);
    }
  };

  const doLogout = () => {
    if (authMode === "user") signOut();
    setAuthMode("guest"); setAccount(null); setOwnerView(true); attachProjects(null); attachInvoices(null); attachCash(null); attachBoq(null); attachAttendance(null); attachProcurement(null); attachChangeOrders(null); attachCertificates(null); attachSelections(null); attachMood(null);
    setIsAuthenticated(false);
    setCurrentRole("");
  };
  // Platform owner lands on the owner dashboard; can open the regular app from there.
  if (isAuthenticated && authMode === "user" && account?.isOwner && ownerView) {
    return <OwnerAdmin name={account.name} onOpenApp={() => setOwnerView(false)} onLogout={doLogout} />;
  }

  // Public Landing & Login Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <LandingAndLogin
        onLogin={(role, mode = "guest", acc = null) => {
          setAuthMode(mode); setAccount(acc); attachProjects(mode === "user" ? acc?.orgId : null); attachInvoices(mode === "user" ? acc?.orgId : null); attachCash(mode === "user" ? acc?.orgId : null); attachBoq(mode === "user" ? acc?.orgId : null); attachAttendance(mode === "user" ? acc?.orgId : null); attachProcurement(mode === "user" ? acc?.orgId : null); attachChangeOrders(mode === "user" ? acc?.orgId : null); attachCertificates(mode === "user" ? acc?.orgId : null); attachSelections(mode === "user" ? acc?.orgId : null); attachMood(mode === "user" ? acc?.orgId : null);
          setCurrentRole(role || "Admin");
          setIsAuthenticated(true);
        }}
      />
    );
  }

  return (
    <div
      className="w-full relative isolate flex flex-col md:flex-row h-dvh overflow-hidden font-ibm bg-[#F7F3EA] text-[#1F2421] selection:bg-[#17614F] selection:text-white"
    >
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:start-2 focus:z-[100] focus:bg-[#17614F] focus:text-white focus:px-4 focus:py-2 focus:rounded-lg">
        {D("تخطي إلى المحتوى")}
      </a>
      <OfflineBanner />
      {account?.isOwner && (
        <button type="button" onClick={() => setOwnerView(true)} className="fixed bottom-4 start-4 z-[60] h-10 px-4 rounded-full bg-[var(--brass)] text-[#1F2421] text-xs font-bold shadow-lg cursor-pointer">لوحة المالك</button>
      )}
      {/* Mobile Drawer Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar: Slide-over Drawer on Mobile (< md), Static on Desktop (md:) */}
      <div
        className={`fixed inset-y-0 start-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:ltr:translate-x-0 md:rtl:translate-x-0 md:block ${
          isMobileMenuOpen ? "translate-x-0" : "ltr:-translate-x-full rtl:translate-x-full"
        } ${sidebarCollapsed ? "md:w-[72px]" : "md:w-64"} w-72 shrink-0 h-full`}
      >
        <Sidebar
          currentRole={currentRole}
          activeTab={activeTab}
          setActiveTab={(tab) => {
            goTab(tab);
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
          onLogout={doLogout}
          onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
          isInstallable={isInstallable}
          onInstallClick={handleInstallClick}
        />
        <MainContent
          currentRole={currentRole}
          activeTab={activeTab}
          setActiveTab={goTab}
          actionItems={actionItems}
          setActionItems={setActionItems}
          setSelectedItem={setSelectedItem}
        />
        <BottomNav currentRole={currentRole} activeTab={activeTab} setActiveTab={goTab} onMore={() => setIsMobileMenuOpen(true)} />
        <LeadNudge currentRole={currentRole} activeTab={activeTab} />
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
