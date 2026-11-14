import AdminDashboard from "./AdminDashboard";
import { tr_ as T } from "../i18n";
import SiteEngineerDashboard from "./SiteEngineerDashboard";
import SiteEngineerTasks from "./SiteEngineerTasks";
import SiteEngineerSnagList from "./SiteEngineerSnagList";
import SiteEngineerMaterialRequests from "./SiteEngineerMaterialRequests";
import ClientPortal from "./ClientPortal";
import ClientProjects from "./ClientProjects";
import ClientProgress from "./ClientProgress";
import ClientInvoices from "./ClientInvoices";
import ClientTimeline from "./ClientTimeline";
import TechnicalOfficeDashboard from "./TechnicalOfficeDashboard";
import TechnicalOfficeBlueprints from "./TechnicalOfficeBlueprints";
import TechnicalOfficeSettings from "./TechnicalOfficeSettings";
import SmartBOQ from "./SmartBOQ";
import Certificates from "./Certificates";
import Procurement from "./Procurement";
import ChangeOrders from "./ChangeOrders";
import Selections from "./Selections";
import Moodboard from "./Moodboard";
import SiteEngineerAttendance from "./SiteEngineerAttendance";
import FinancialsDashboard from "./FinancialsDashboard";
import TeamManagement from "./TeamManagement";
import ProjectsManagement from "./ProjectsManagement";
import ModulePlaceholder from "./ModulePlaceholder";
import { ROLE_CONFIG } from "../config/roles";
import LiveDashboard from "./LiveDashboard";
import LiveFinance from "./LiveFinance";
import LiveBoq from "./LiveBoq";
import LiveSite from "./LiveSite";
import LiveTeam from "./LiveTeam";
import LiveInvoices from "./LiveInvoices";
import { projectsStore } from "../data/projects";

// Real (signed-in) offices: only connected sections show data. Others are held back so no demo data leaks in.
const LIVE_READY = new Set(["Projects", "Financials & Petty Cash", "Attendance", "Procurement", "Change Orders", "Certificates", "Selections", "Moodboard"]);

const DASHBOARD_TAB = "لوحة التحكم";

/** Tabs a role may open (matches id, name or label from ROLE_CONFIG). */
function getAllowedTabs(role) {
  return new Set(
    (ROLE_CONFIG[role] || []).flatMap((item) => [item.id, item.name, item.label])
  );
}

function MainContent({
  currentRole,
  activeTab: requestedTab,
  setActiveTab,
  actionItems,
  setActionItems,
  setSelectedItem,
}) {
  // Role guard: a role can never render a screen that is not in its own menu.
  const activeTab = getAllowedTabs(currentRole).has(requestedTab)
    ? requestedTab
    : DASHBOARD_TAB;

  const renderScreen = () => {
    // Logic Structure:
    // IF activeTab is "لوحة التحكم" (or "Dashboard"):
    //   - If Role is "Admin" -> render <AdminDashboard />
    //   - If Role is "Site Engineer" -> render <SiteEngineerDashboard />
    //   - If Role is "Technical Office" -> render <TechnicalOfficeDashboard />
    //   - If Role is "Client" -> render <ClientPortal />
    const isDashboard =
      activeTab === "لوحة التحكم" ||
      activeTab === "Dashboard" ||
      activeTab === "لوحة التحكم الميدانية" ||
      activeTab === "لوحة التحكم الهندسية" ||
      activeTab === "بوابة العميل";

    if (projectsStore.isLive) {
      if (isDashboard) return <LiveDashboard setActiveTab={setActiveTab} role={currentRole} />;
      const id = (ROLE_CONFIG[currentRole] || []).find((i) => [i.id, i.name, i.label].includes(activeTab))?.id;
      if (currentRole === "Client") {
        if (id === "Invoices & Payments") return <LiveInvoices readOnly />;
        if (["My Projects", "Progress Overview", "Schedule"].includes(id)) return <LiveDashboard setActiveTab={setActiveTab} role="Client" />;
      }
      if (id === "Financials & Petty Cash") return <LiveFinance />;
      if (id === "Team" && currentRole === "Admin") return <LiveTeam />;
      const SITE = { "My Tasks": "tasks", "Snag List": "snags", "Material Requests": "requests" };
      if (SITE[id] && currentRole !== "Client") return <LiveSite kind={SITE[id]} />;
      if ((id === "BOQ & Approvals" || id === "BOQ Management") && currentRole !== "Client") return <LiveBoq />;
      if (!LIVE_READY.has(id)) {
        return (
          <main className="flex-1 flex items-center justify-center p-6 font-ibm">
            <div className="bg-white rounded-2xl border border-[#DCE4DC] p-8 text-center max-w-md space-y-2">
              <h1 className="text-lg font-semibold text-[#1F2A26]">{T("live.soonTitle")}</h1>
              <p className="text-sm text-[#56635B]">{T("live.soonBody")}</p>
            </div>
          </main>
        );
      }
    }

    if (isDashboard) {
      if (currentRole === "Admin") {
        return (
          <AdminDashboard
            actionItems={actionItems}
            setActionItems={setActionItems}
            setSelectedItem={setSelectedItem}
            setActiveTab={setActiveTab}
          />
        );
      }

      if (currentRole === "Site Engineer") {
        return (
          <SiteEngineerDashboard
            setActionItems={setActionItems}
          />
        );
      }

      if (currentRole === "Technical Office") {
        return (
          <TechnicalOfficeDashboard
            actionItems={actionItems}
            setActionItems={setActionItems}
            setSelectedItem={setSelectedItem}
          />
        );
      }

      if (currentRole === "Client") {
        return (
          <ClientPortal
            actionItems={actionItems}
            setActionItems={setActionItems}
            setSelectedItem={setSelectedItem}
          />
        );
      }
    }

    if (activeTab === "الموودبورد" || activeTab === "Moodboard") return <Moodboard role={currentRole === "Client" ? "Client" : "Admin"} />;
    if (activeTab === "الاختيارات وFF&E" || activeTab === "اختياراتي" || activeTab === "Selections") return <Selections role={currentRole === "Client" ? "Client" : "Admin"} restricted={currentRole === "Technical Office"} />;
    if (activeTab === "أوامر التغيير" || activeTab === "Change Orders") return <ChangeOrders role={currentRole === "Client" ? "Client" : "Admin"} />;

    // Client Dedicated Role Navigation Routing
    if (currentRole === "Client") {
      if (activeTab === "مشاريعي" || activeTab === "My Projects") {
        return <ClientProjects />;
      }

      if (activeTab === "نسب الإنجاز" || activeTab === "Progress Overview") {
        return <ClientProgress />;
      }

      if (activeTab === "الفواتير والدفعات" || activeTab === "Invoices & Payments") {
        return <ClientInvoices />;
      }

      if (activeTab === "الجدول الزمني" || activeTab === "Schedule") {
        return <ClientTimeline />;
      }

      // Default Client fallback
      return (
        <ClientPortal
          actionItems={actionItems}
          setActionItems={setActionItems}
          setSelectedItem={setSelectedItem}
        />
      );
    }

    // Site Engineer Sub-Components Routing
    const isTasksTab =
      activeTab === "مهامي الميدانية" ||
      activeTab === "My Tasks";

    if (isTasksTab) {
      return <SiteEngineerTasks />;
    }

    const isSnagListTab =
      activeTab === "قائمة الملاحظات" ||
      activeTab === "قائمة الملاحظات (Snag List)" ||
      activeTab === "Snag List";

    if (isSnagListTab) {
      return <SiteEngineerSnagList />;
    }

    if (activeTab === "الحضور والعمالة" || activeTab === "Attendance") return <SiteEngineerAttendance />;

    const isMaterialRequestsTab =
      activeTab === "طلبات تشوين المواد" ||
      activeTab === "Material Requests";

    if (isMaterialRequestsTab) {
      return (
        <SiteEngineerMaterialRequests
          actionItems={actionItems}
          setActionItems={setActionItems}
          setSelectedItem={setSelectedItem}
        />
      );
    }

    const isDailyReportsTab =
      activeTab === "التقارير اليومية" ||
      activeTab === "Daily Reports";

    if (isDailyReportsTab) {
      return <SiteEngineerDashboard setActionItems={setActionItems} />;
    }

    // Technical Office Sub-Components Routing
    const isBlueprintsTab =
      activeTab === "المخططات والمستندات" ||
      activeTab === "Drawings & Docs";

    if (isBlueprintsTab) {
      return (
        <TechnicalOfficeBlueprints
          actionItems={actionItems}
          setActionItems={setActionItems}
          setSelectedItem={setSelectedItem}
        />
      );
    }

    const isSettingsTab =
      activeTab === "الإعدادات والنماذج" ||
      activeTab === "Settings" ||
      activeTab === "الإعدادات";

    if (isSettingsTab) {
      return <TechnicalOfficeSettings />;
    }

    // Projects Management Tab Routing for "المشاريع الجارية"
    const isProjectsTab =
      activeTab === "المشاريع الجارية" ||
      activeTab === "Projects" ||
      activeTab === "مشاريعي" ||
      activeTab === "My Projects" ||
      activeTab === "متابعة التنفيذ" ||
      activeTab === "Project Tracking";

    if (isProjectsTab) {
      return (
        <ProjectsManagement
          actionItems={actionItems}
          setActionItems={setActionItems}
          setSelectedItem={setSelectedItem}
        />
      );
    }

    // SmartBOQ Tab Routing for "المقايسات والاعتمادات" & "إدارة المقايسات"
    const isBOQTab =
      activeTab === "المقايسات والاعتمادات" ||
      activeTab === "BOQ & Approvals" ||
      activeTab === "إدارة المقايسات" ||
      activeTab === "BOQ Management";

    if (isBOQTab) {
      return (
        <SmartBOQ
          restricted={currentRole === "Technical Office"}
          actionItems={actionItems}
          setActionItems={setActionItems}
          setSelectedItem={setSelectedItem}
        />
      );
    }

    // Financials & Petty Cash Tab Routing for "الحسابات والعهد"
    const isFinancialsTab =
      activeTab === "الحسابات والعهد" ||
      activeTab === "Financials & Petty Cash" ||
      activeTab === "الحسابات" ||
      activeTab === "الفواتير والدفعات";

    if (isFinancialsTab) {
      return (
        <FinancialsDashboard
          actionItems={actionItems}
          setActionItems={setActionItems}
          setSelectedItem={setSelectedItem}
        />
      );
    }

    if (activeTab === "الباطن والمشتريات" || activeTab === "Procurement") return <Procurement />;
    if (activeTab === "المستخلصات والمحتجزات" || activeTab === "Certificates") return <Certificates />;

    // Team Management Tab Routing for "فريق العمل"
    const isTeamTab =
      activeTab === "فريق العمل" ||
      activeTab === "Team";

    if (isTeamTab) {
      return (
        <TeamManagement />
      );
    }

    // ELSE: Render the premium Glassmorphic Placeholder Component for any other tab
    return (
      <ModulePlaceholder
        activeTab={activeTab}
        currentRole={currentRole}
        setActiveTab={setActiveTab}
      />
    );
  };

  return (
    <main
      id="main-content"
      tabIndex={-1}
      key={`${currentRole}-${activeTab}`}
      className="flex-1 flex flex-col min-h-0 min-w-0 w-full max-w-full overflow-hidden tab-page-transition outline-none"
    >
      {renderScreen()}
    </main>
  );
}

export default MainContent;
