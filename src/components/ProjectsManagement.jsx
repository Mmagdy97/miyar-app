import { useState, useMemo } from "react";
import ProgressBar from "./ProgressBar";
import {
  FolderKanban,
  Plus,
  Clock,
  Calendar,
  User,
  Building2,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  X,
  Search,
  Filter,
  Sparkles,
  RotateCcw,
  TrendingUp,
  Layers,
  MapPin,
  Check,
  ArrowUpRight,
  Sliders,
  DollarSign,
} from "lucide-react";
import {
  PROJECTS as SEED_PROJECTS,
  PHASES as SEED_PHASES,
  PEOPLE,
  personById,
  formatEGP,
} from "../data/seed";

// Standard Phases in Construction & Interior Design
const PHASES = SEED_PHASES;

// Initial Projects Data (single source of truth: src/data/seed.js)
const INITIAL_PROJECTS = SEED_PROJECTS.map((p) => ({
  id: p.id,
  name: p.name,
  client: p.client,
  engineer: personById(p.engineerId).displayName,
  progress: p.progress,
  status: p.status,
  phase: p.phase,
  startDate: p.startDate,
  deadline: p.deadline,
  budget: formatEGP(p.contractValue),
  location: p.location,
  image: p.image,
}));

// Available Engineers for Assignment
const ENGINEERS_LIST = PEOPLE.filter((p) => p.role !== "مدير").map(
  (p) => p.displayName
);

function ProjectsManagement({ actionItems, setActionItems, setSelectedItem }) {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("الكل");
  const [toastMessage, setToastMessage] = useState(null);

  // Project Details Modal State
  const [selectedProject, setSelectedProject] = useState(null);

  // Edit Timeline Modal State
  const [editingTimelineProject, setEditingTimelineProject] = useState(null);
  const [timelineProgress, setTimelineProgress] = useState(0);
  const [timelinePhase, setTimelinePhase] = useState("تصميم");
  const [timelineStatus, setTimelineStatus] = useState("جاري العمل");

  // New Project Form State
  const [newProjectName, setNewProjectName] = useState("");
  const [newClientName, setNewClientName] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [newEngineer, setNewEngineer] = useState(ENGINEERS_LIST[0]);
  const [newBudget, setNewBudget] = useState("");
  const [newLocation, setNewLocation] = useState("");

  // Quick KPI Stats
  const stats = useMemo(() => {
    const total = projects.length;
    const delayed = projects.filter((p) => p.status === "متأخر").length;
    const onTrack = projects.filter((p) => p.status === "جاري العمل" || p.status === "متقدم عن الجدول").length;
    const avgProgress =
      total > 0
        ? Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / total)
        : 0;
    return { total, delayed, onTrack, avgProgress };
  }, [projects]);

  // Filtered Projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.engineer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.location && p.location.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = statusFilter === "الكل" || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [projects, searchQuery, statusFilter]);

  // Handle Create New Project Submit
  const handleCreateProjectSubmit = (e) => {
    e.preventDefault();
    if (!newProjectName.trim() || !newClientName.trim()) return;

    const todayStr = new Date().toISOString().split("T")[0];

    const newProject = {
      id: Date.now(),
      name: newProjectName.trim(),
      client: newClientName.trim(),
      engineer: newEngineer,
      progress: 0,
      status: "جاري العمل",
      phase: "تصميم",
      startDate: todayStr,
      deadline: newDeadline || "2027-03-31",
      budget: newBudget.trim() ? `${newBudget.trim()} ج.م` : "٣,٥٠٠,٠٠٠ ج.م",
      location: newLocation.trim() || "القاهرة الجديدة",
      image:
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80",
    };

    setProjects((prev) => [newProject, ...prev]);
    setIsAddProjectOpen(false);

    // Reset Form
    setNewProjectName("");
    setNewClientName("");
    setNewDeadline("");
    setNewEngineer(ENGINEERS_LIST[0]);
    setNewBudget("");
    setNewLocation("");

    // Toast
    setToastMessage(`تم إنشاء مشروع "${newProject.name}" بنجاح وإسناده لـ ${newProject.engineer}`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Open Edit Timeline Modal
  const handleOpenTimelineModal = (project) => {
    setEditingTimelineProject(project);
    setTimelineProgress(project.progress);
    setTimelinePhase(project.phase);
    setTimelineStatus(project.status);
  };

  // Save Timeline Changes
  const handleSaveTimeline = (e) => {
    e.preventDefault();
    if (!editingTimelineProject) return;

    setProjects((prev) =>
      prev.map((p) =>
        p.id === editingTimelineProject.id
          ? {
              ...p,
              progress: parseInt(timelineProgress, 10) || 0,
              phase: timelinePhase,
              status: timelineStatus,
            }
          : p
      )
    );

    setToastMessage(`تم تحديث الجدول الزمني ونسبة الإنجاز لمشروع "${editingTimelineProject.name}"`);
    setEditingTimelineProject(null);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Reset to default sample projects
  const handleResetProjects = () => {
    setProjects(INITIAL_PROJECTS);
    setToastMessage("تمت استعادة المشروعات التجريبية الافتراضية");
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent pb-24 font-ibm w-full max-w-full overflow-x-hidden" dir="rtl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 end-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#183C35] text-white rounded-xl shadow-xl border border-white/10 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-xs font-bold leading-relaxed">{toastMessage}</p>
        </div>
      )}

      {/* Header & Quick Action */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap mb-1">
            <h1 className="text-2xl md:text-3xl font-black text-[#202923] tracking-tight flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#EFEEE8] border border-[#E5E6DF] flex items-center justify-center text-[#202923]">
                <FolderKanban className="w-5 h-5" />
              </div>
              <span>إدارة المشاريع والجدول الزمني</span>
            </h1>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EFEEE8] text-[#202923] border border-[#E5E6DF]">
              {projects.length} مشاريع نشطة
            </span>
          </div>
          <p className="text-xs md:text-sm text-[#526257]">
            متابعة المخططات الزمنية ونسب الإنجاز الميداني، ومراحل التصميم والتنفيذ والتسليم لحظياً.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleResetProjects}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-[#526257] bg-white border border-[#E5E6DF] hover:bg-[#F5F3ED] transition-colors shadow-2xs cursor-pointer"
            title="استعادة البيانات الأصلية"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة ضبط</span>
          </button>

          {/* Requirement 2: Primary Button "+ إضافة مشروع جديد" */}
          <button
            onClick={() => setIsAddProjectOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold text-white bg-[#183C35] hover:bg-[#202923] transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ إضافة مشروع جديد</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        <div className="bg-white rounded-lg p-5 border border-[#E5E6DF] shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <span className="text-[11px] font-bold text-[#526257] block mb-1">إجمالي المشاريع</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl md:text-2xl font-black text-[#202923]">{stats.total}</span>
            <span className="text-[11px] font-bold text-[#526257] bg-[#EFEEE8] px-2 py-0.5 rounded-md border border-[#E5E6DF]">
              مشروع
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-[#E5E6DF] shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <span className="text-[11px] font-bold text-[#526257] block mb-1">مشاريع وفق الجدول</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl md:text-2xl font-black text-emerald-700">{stats.onTrack}</span>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              منتظم
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-[#E5E6DF] shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <span className="text-[11px] font-bold text-[#526257] block mb-1">مشاريع متأخرة</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl md:text-2xl font-black text-rose-700">{stats.delayed}</span>
            <span className="text-[11px] font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
              تتطلب تدخلاً
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-[#E5E6DF] shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <span className="text-[11px] font-bold text-[#526257] block mb-1">متوسط الإنجاز الكلي</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl md:text-2xl font-black text-[#202923]">%{stats.avgProgress}</span>
            <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              مكتمل
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-lg border border-[#E5E6DF] p-3.5 mb-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#526257] absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="بحث باسم المشروع أو العميل أو المهندس المشرف..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full ps-10 pe-4 py-2 rounded-lg border border-[#E5E6DF] bg-[#F5F3ED] text-xs md:text-sm font-semibold text-[#202923] placeholder-[#526257]/50 focus:outline-none focus:ring-1 focus:ring-1 focus:ring-[#183C35] focus:border-[#183C35] transition-all"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {["الكل", "جاري العمل", "متقدم عن الجدول", "متأخر"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer active:scale-95 ${
                statusFilter === status
                  ? "bg-[#183C35] text-white shadow-sm"
                  : "bg-[#EFEEE8] text-[#202923] hover:bg-[#E5E6DF]"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Requirement 3: Projects Grid Layout (Cards in grid-cols-1 md:grid-cols-2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((project) => {
          const isDelayed = project.status === "متأخر";
          const isAhead = project.status === "متقدم عن الجدول";

          // Status Badge Styling
          let statusBadgeClass = "bg-emerald-50 text-emerald-800 border-emerald-200";
          let statusDotClass = "bg-emerald-600";
          if (isDelayed) {
            statusBadgeClass = "bg-rose-50 text-rose-800 border-rose-200 animate-pulse";
            statusDotClass = "bg-rose-600";
          } else if (isAhead) {
            statusBadgeClass = "bg-amber-50 text-amber-800 border-amber-200";
            statusDotClass = "bg-amber-700";
          }

          // Active Phase Index
          const currentPhaseIndex = PHASES.indexOf(project.phase);

          return (
            <div
              key={project.id}
              className="bg-white rounded-lg border border-[#E5E6DF] shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              {/* Card Header: Project Name & Client Name + Status Badge */}
              <div className="p-5 md:p-6 pb-4 border-b border-[#EFEEE8] flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[#526257] bg-[#EFEEE8] px-2 py-0.5 rounded-md border border-[#E5E6DF]">
                      مشروع سكني / تجاري
                    </span>
                  </div>
                  <h3 className="text-base md:text-lg font-black text-[#202923] truncate tracking-tight group-hover:text-amber-800 transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-xs text-[#526257] mt-0.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#526257]" />
                    <span>العميل: <strong className="text-[#526257] font-bold">{project.client}</strong></span>
                  </p>
                </div>

                {/* Status Badge */}
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shrink-0 ${statusBadgeClass}`}
                >
                  <span className={`w-2 h-2 rounded-full ${statusDotClass}`} />
                  <span>{project.status}</span>
                </span>
              </div>

              {/* Card Body */}
              <div className="p-5 md:p-6 space-y-5 flex-1">
                {/* 1. Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#202923] flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-[#202923]" />
                      <span>نسبة الإنجاز الفعلي</span>
                    </span>
                    <span className="text-xs font-bold text-[#202923] tracking-wide font-mono">
                      %{project.progress}
                    </span>
                  </div>

                  <ProgressBar
                    value={project.progress}
                    isWarning={isDelayed}
                  />
                </div>

                {/* 2. Mini Timeline Tracker showing 4 phases: [تصميم -> تأسيس -> تشطيب -> تسليم] */}
                <div className="bg-[#F5F3ED] rounded-xl p-3.5 border border-[#E5E6DF]">
                  <span className="text-[11px] font-bold text-[#526257] block mb-2.5">
                    مسار المراحل الزمنية (Milestone Phases)
                  </span>

                  <div className="flex items-center justify-between relative">
                    {/* Connecting line */}
                    <div className="absolute top-1/2 start-4 end-4 -translate-y-1/2 h-0.5 bg-[#E5E6DF] z-0" />

                    {PHASES.map((phase, idx) => {
                      const isCompleted = idx < currentPhaseIndex;
                      const isCurrent = idx === currentPhaseIndex;

                      return (
                        <div
                          key={phase}
                          className="relative z-10 flex flex-col items-center gap-1"
                        >
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black transition-all ${
                              isCompleted
                                ? "bg-[#183C35] text-white shadow-xs"
                                : isCurrent
                                ? "bg-[#183C35] text-white ring-4 ring-[#183C35]/10 shadow-xs"
                                : "bg-white border-2 border-[#E5E6DF] text-[#526257]"
                            }`}
                          >
                            {isCompleted ? (
                              <Check className="w-3.5 h-3.5" />
                            ) : (
                              idx + 1
                            )}
                          </div>
                          <span
                            className={`text-[10px] font-bold ${
                              isCurrent
                                ? "text-[#202923] font-black scale-105"
                                : isCompleted
                                ? "text-[#202923]"
                                : "text-[#526257]"
                            }`}
                          >
                            {phase}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Details Row: Assigned Engineer, Start Date, and Deadline with clock icon */}
                <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs text-[#526257]">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-[#F5F3ED] border border-[#E5E6DF]/60">
                    <div className="w-7 h-7 rounded-lg bg-[#EFEEE8] text-[#526257] flex items-center justify-center shrink-0 border border-[#E5E6DF]">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] text-[#526257] block leading-none">المهندس المشرف</span>
                      <span className="font-bold text-[#202923] text-[11px] truncate block mt-0.5">
                        {project.engineer}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-lg bg-[#F5F3ED] border border-[#E5E6DF]/60">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center shrink-0 border border-amber-200">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] text-[#526257] block leading-none">موعد التسليم</span>
                      <span className="font-bold text-[#202923] text-[11px] truncate block mt-0.5 font-mono">
                        {project.deadline}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer (Actions): Two outline buttons */}
              <div className="p-4 md:px-6 bg-[#F5F3ED] border-t border-[#EFEEE8] flex items-center gap-2.5">
                {/* Button 1: تفاصيل المشروع */}
                <button
                  onClick={() => setSelectedProject(project)}
                  className="flex-1 py-2 px-3 rounded-lg border border-[#E5E6DF] bg-white hover:bg-[#F5F3ED] text-[#526257] text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Building2 className="w-3.5 h-3.5 text-[#526257]" />
                  <span>تفاصيل المشروع</span>
                </button>

                {/* Button 2: تعديل الجدول الزمني */}
                <button
                  onClick={() => handleOpenTimelineModal(project)}
                  className="flex-1 py-2 px-3 rounded-lg border border-[#D5D8D0] bg-[#EFEEE8] hover:bg-[#E5E6DF] text-[#202923] text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 text-[#202923]" />
                  <span>تعديل الجدول الزمني</span>
                </button>
              </div>
            </div>
          );
        })}

        {filteredProjects.length === 0 && (
          <div className="col-span-full py-16 text-center bg-white rounded-lg border border-[#E5E6DF] p-8">
            <FolderKanban className="w-10 h-10 mx-auto mb-2 text-[#C5A36B]" />
            <h4 className="text-base font-bold text-[#526257]">لم يتم العثور على أي مشاريع مطابقة</h4>
            <p className="text-xs text-[#526257] mt-1 max-w-sm mx-auto">
              جرّب تغيير حالة التصفية أو اسم البحث أو قم بإضافة مشروع جديد للمنصة.
            </p>
          </div>
        )}
      </div>

      {/* Requirement 4: "Create New Project" Modal */}
      {isAddProjectOpen && (
        <div className="fixed inset-0 z-50 bg-[#202923]/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-2xl border border-[#E5E6DF] max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 text-start animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#EFEEE8]">
              <h3 className="text-lg font-black text-[#202923] flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#202923]" />
                <span>إضافة مشروع جديد وبدء المخطط</span>
              </h3>
              <button
                onClick={() => setIsAddProjectOpen(false)}
                className="p-1.5 rounded-lg text-[#526257] hover:text-[#202923] hover:bg-[#EFEEE8] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateProjectSubmit} className="space-y-4 mt-4">
              {/* Field 1: Project Name */}
              <div>
                <label className="block text-xs font-bold text-[#526257] mb-1.5">
                  اسم المشروع <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: فيلا اللوتس - الشيخ زايد"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E6DF] text-xs md:text-sm font-semibold text-[#202923] placeholder-[#526257]/50 focus:outline-none focus:ring-1 focus:ring-1 focus:ring-[#183C35] focus:border-[#183C35] transition-all"
                />
              </div>

              {/* Field 2: Client Name */}
              <div>
                <label className="block text-xs font-bold text-[#526257] mb-1.5">
                  اسم العميل <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: أ. محمود فاروق"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E6DF] text-xs md:text-sm font-semibold text-[#202923] placeholder-[#526257]/50 focus:outline-none focus:ring-1 focus:ring-1 focus:ring-[#183C35] focus:border-[#183C35] transition-all"
                />
              </div>

              {/* Field 3: Expected Deadline & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#526257] mb-1.5">
                    تاريخ التسليم المتوقع <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-[#E5E6DF] text-xs font-semibold text-[#202923] focus:outline-none focus:ring-1 focus:ring-1 focus:ring-[#183C35] focus:border-[#183C35] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#526257] mb-1.5">
                    موقع المشروع
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: زايد، التجمع، المعادي"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-[#E5E6DF] text-xs font-semibold text-[#202923] focus:outline-none focus:ring-1 focus:ring-1 focus:ring-[#183C35] focus:border-[#183C35] transition-all"
                  />
                </div>
              </div>

              {/* Field 4: Assign Engineer & Estimated Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#526257] mb-1.5">
                    إسناد إلى مهندس <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={newEngineer}
                    onChange={(e) => setNewEngineer(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-[#E5E6DF] text-xs font-bold text-[#202923] bg-white focus:outline-none focus:ring-1 focus:ring-1 focus:ring-[#183C35] focus:border-[#183C35] transition-all cursor-pointer"
                  >
                    {ENGINEERS_LIST.map((eng) => (
                      <option key={eng} value={eng}>
                        {eng}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#526257] mb-1.5">
                    الميزانية التقديرية (ج.م)
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: ٤,٥٠٠,٠٠٠"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-[#E5E6DF] text-xs font-semibold text-[#202923] focus:outline-none focus:ring-1 focus:ring-1 focus:ring-[#183C35] focus:border-[#183C35] transition-all"
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50/60 rounded-lg border border-amber-200 text-xs text-amber-900">
                <p>
                  يبدأ المشروع تلقائياً بنسبة إنجاز ٠٪ في مرحلة <strong>"التصميم"</strong>، وسيتلقى المهندس والعميل إشعاراً فورياً.
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#EFEEE8]">
                <button
                  type="button"
                  onClick={() => setIsAddProjectOpen(false)}
                  className="px-4 py-2.5 rounded-lg text-xs font-bold text-[#526257] hover:bg-[#EFEEE8] transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#183C35] hover:bg-[#202923] hover:bg-[#202923] text-white font-bold text-xs md:text-sm transition-colors cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>إنشاء المشروع وبدء العمل</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Timeline Modal */}
      {editingTimelineProject && (
        <div className="fixed inset-0 z-50 bg-[#202923]/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-2xl border border-[#E5E6DF] max-w-md w-full p-6 md:p-8 text-start animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#EFEEE8]">
              <h3 className="text-base font-black text-[#202923] flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#202923]" />
                <span>تعديل الجدول الزمني: {editingTimelineProject.name}</span>
              </h3>
              <button
                onClick={() => setEditingTimelineProject(null)}
                className="p-1.5 rounded-lg text-[#526257] hover:text-[#202923] hover:bg-[#EFEEE8] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTimeline} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-[#526257] mb-1.5">
                  المرحلة التنفيذية الحالية
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {PHASES.map((p) => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setTimelinePhase(p)}
                      className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        timelinePhase === p
                          ? "bg-[#183C35] text-white shadow-sm"
                          : "bg-[#EFEEE8] text-[#202923] hover:bg-[#E5E6DF]"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#526257]">نسبة الإنجاز الفعلي</label>
                  <span className="text-xs font-black text-[#202923]">%{timelineProgress}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={timelineProgress}
                  onChange={(e) => setTimelineProgress(e.target.value)}
                  className="w-full accent-zinc-900 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#526257] mb-1.5">حالة المشروع</label>
                <select
                  value={timelineStatus}
                  onChange={(e) => setTimelineStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E5E6DF] text-xs font-bold text-[#202923] bg-white"
                >
                  <option value="جاري العمل">جاري العمل (On Track)</option>
                  <option value="متقدم عن الجدول">متقدم عن الجدول (Ahead)</option>
                  <option value="متأخر">متأخر (Delayed)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#EFEEE8]">
                <button
                  type="button"
                  onClick={() => setEditingTimelineProject(null)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-[#526257] hover:bg-[#EFEEE8]"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#183C35] hover:bg-[#202923] hover:bg-[#202923] text-white font-bold text-xs shadow-sm"
                >
                  حفظ التحديثات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-[#202923]/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-2xl border border-[#E5E6DF] max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 text-start animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#EFEEE8]">
              <div>
                <h3 className="text-lg font-black text-[#202923]">{selectedProject.name}</h3>
                <p className="text-xs text-[#526257] mt-0.5">{selectedProject.location}</p>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-1.5 rounded-lg text-[#526257] hover:text-[#202923] hover:bg-[#EFEEE8] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="my-4 rounded-lg overflow-hidden h-44 relative">
              <img
                src={selectedProject.image}
                alt={selectedProject.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 start-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#202923]/70 text-white backdrop-blur-xs">
                  المرحلة: {selectedProject.phase}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-[#EFEEE8]">
                <span className="text-[#526257]">العميل:</span>
                <span className="font-bold text-[#202923]">{selectedProject.client}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#EFEEE8]">
                <span className="text-[#526257]">المهندس المشرف:</span>
                <span className="font-bold text-[#202923]">{selectedProject.engineer}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#EFEEE8]">
                <span className="text-[#526257]">الميزانية التعاقدية:</span>
                <span className="font-black text-[#202923]">{selectedProject.budget}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#EFEEE8]">
                <span className="text-[#526257]">تاريخ البدء:</span>
                <span className="font-mono text-[#526257]">{selectedProject.startDate}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#EFEEE8]">
                <span className="text-[#526257]">موعد التسليم النهائي:</span>
                <span className="font-mono text-rose-700 font-bold">{selectedProject.deadline}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedProject(null)}
                className="w-full py-2.5 rounded-lg bg-[#183C35] hover:bg-[#202923] text-white text-xs font-bold hover:bg-[#202923] transition-colors shadow-sm"
              >
                إغلاق النافذة
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default ProjectsManagement;
