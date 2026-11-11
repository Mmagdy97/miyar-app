import { currencySymbol, E } from "../i18n";
import { D, DF } from "../data/dataI18n";
import { tr_ as T } from "../i18n";
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
      budget: newBudget.trim() ? `${newBudget.trim()} ${currencySymbol()}` : `${formatEGP(3500000)}`,
      location: newLocation.trim() || D("القاهرة الجديدة"),
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
    setToastMessage(DF("تم إنشاء مشروع \"{0}\" بنجاح وإسناده لـ {1}", newProject.name, newProject.engineer));
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

    setToastMessage(DF("تم تحديث الجدول الزمني ونسبة الإنجاز لمشروع \"{0}\"", editingTimelineProject.name));
    setEditingTimelineProject(null);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Reset to default sample projects
  const handleResetProjects = () => {
    setProjects(INITIAL_PROJECTS);
    setToastMessage(D("تمت استعادة المشروعات التجريبية الافتراضية"));
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent pb-24 font-ibm w-full max-w-full overflow-x-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 end-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#2B3138] text-white rounded-xl shadow-xl border border-white/10 animate-in fade-in slide-in-from-bottom-3 duration-200">
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
            <h1 className="text-2xl md:text-3xl font-black text-[#16181C] tracking-tight flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#EEECE6] border border-[#E3E0D9] flex items-center justify-center text-[#16181C]">
                <FolderKanban className="w-5 h-5" />
              </div>
              <span>{T("proj.1")}</span>
            </h1>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EEECE6] text-[#16181C] border border-[#E3E0D9]">
              {T("proj.2", { v0: projects.length })}
            </span>
          </div>
          <p className="text-xs md:text-sm text-[#5D6168]">
            {T("proj.3")}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleResetProjects}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-[#5D6168] bg-white border border-[#E3E0D9] hover:bg-[#F6F5F1] transition-colors shadow-2xs cursor-pointer"
            title={T("proj.4")}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{T("proj.5")}</span>
          </button>

          {/* Requirement 2: Primary Button "+ إضافة مشروع جديد" */}
          <button
            onClick={() => setIsAddProjectOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold text-white bg-[#2B3138] hover:bg-[#16181C] transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{T("proj.6")}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        <div className="bg-white rounded-lg p-5 border border-[#E3E0D9] shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <span className="text-[11px] font-bold text-[#5D6168] block mb-1">{T("proj.7")}</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl md:text-2xl font-black text-[#16181C]">{stats.total}</span>
            <span className="text-[11px] font-bold text-[#5D6168] bg-[#EEECE6] px-2 py-0.5 rounded-md border border-[#E3E0D9]">
              {T("proj.8")}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-[#E3E0D9] shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <span className="text-[11px] font-bold text-[#5D6168] block mb-1">{T("proj.9")}</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl md:text-2xl font-black text-emerald-700">{stats.onTrack}</span>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              {T("proj.10")}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-[#E3E0D9] shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <span className="text-[11px] font-bold text-[#5D6168] block mb-1">{T("proj.11")}</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl md:text-2xl font-black text-rose-700">{stats.delayed}</span>
            <span className="text-[11px] font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
              {T("proj.12")}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-[#E3E0D9] shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <span className="text-[11px] font-bold text-[#5D6168] block mb-1">{T("proj.13")}</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl md:text-2xl font-black text-[#16181C]">%{stats.avgProgress}</span>
            <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              {T("proj.14")}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-lg border border-[#E3E0D9] p-3.5 mb-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#5D6168] absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={T("proj.15")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full ps-10 pe-4 py-2 rounded-lg border border-[#E3E0D9] bg-[#F6F5F1] text-xs md:text-sm font-semibold text-[#16181C] placeholder-[#5D6168]/50 focus:outline-none focus:ring-1 focus:ring-1 focus:ring-[#2B3138] focus:border-[#2B3138] transition-all"
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
                  ? "bg-[#2B3138] text-white shadow-sm"
                  : "bg-[#EEECE6] text-[#16181C] hover:bg-[#E3E0D9]"
              }`}
            >
              {E(status)}
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
              className="bg-white rounded-lg border border-[#E3E0D9] shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              {/* Card Header: Project Name & Client Name + Status Badge */}
              <div className="p-5 md:p-6 pb-4 border-b border-[#EEECE6] flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[#5D6168] bg-[#EEECE6] px-2 py-0.5 rounded-md border border-[#E3E0D9]">
                      {T("proj.16")}
                    </span>
                  </div>
                  <h3 className="text-base md:text-lg font-black text-[#16181C] truncate tracking-tight group-hover:text-amber-800 transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-xs text-[#5D6168] mt-0.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#5D6168]" />
                    <span>{T("proj.17")} <strong className="text-[#5D6168] font-bold">{project.client}</strong></span>
                  </p>
                </div>

                {/* Status Badge */}
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shrink-0 ${statusBadgeClass}`}
                >
                  <span className={`w-2 h-2 rounded-full ${statusDotClass}`} />
                  <span>{E(project.status)}</span>
                </span>
              </div>

              {/* Card Body */}
              <div className="p-5 md:p-6 space-y-5 flex-1">
                {/* 1. Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#16181C] flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-[#16181C]" />
                      <span>{T("proj.18")}</span>
                    </span>
                    <span className="text-xs font-bold text-[#16181C] tracking-wide font-mono">
                      %{project.progress}
                    </span>
                  </div>

                  <ProgressBar
                    value={project.progress}
                    isWarning={isDelayed}
                  />
                </div>

                {/* 2. Mini Timeline Tracker showing 4 phases: [تصميم -> تأسيس -> تشطيب -> تسليم] */}
                <div className="bg-[#F6F5F1] rounded-xl p-3.5 border border-[#E3E0D9]">
                  <span className="text-[11px] font-bold text-[#5D6168] block mb-2.5">
                    {T("proj.19")}
                  </span>

                  <div className="flex items-center justify-between relative">
                    {/* Connecting line */}
                    <div className="absolute top-1/2 start-4 end-4 -translate-y-1/2 h-0.5 bg-[#E3E0D9] z-0" />

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
                                ? "bg-[#2B3138] text-white shadow-xs"
                                : isCurrent
                                ? "bg-[#2B3138] text-white ring-4 ring-[#2B3138]/10 shadow-xs"
                                : "bg-white border-2 border-[#E3E0D9] text-[#5D6168]"
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
                                ? "text-[#16181C] font-black scale-105"
                                : isCompleted
                                ? "text-[#16181C]"
                                : "text-[#5D6168]"
                            }`}
                          >
                            {D(phase)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Details Row: Assigned Engineer, Start Date, and Deadline with clock icon */}
                <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs text-[#5D6168]">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-[#F6F5F1] border border-[#E3E0D9]/60">
                    <div className="w-7 h-7 rounded-lg bg-[#EEECE6] text-[#5D6168] flex items-center justify-center shrink-0 border border-[#E3E0D9]">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] text-[#5D6168] block leading-none">{T("proj.20")}</span>
                      <span className="font-bold text-[#16181C] text-[11px] truncate block mt-0.5">
                        {project.engineer}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-lg bg-[#F6F5F1] border border-[#E3E0D9]/60">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center shrink-0 border border-amber-200">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] text-[#5D6168] block leading-none">{T("proj.21")}</span>
                      <span className="font-bold text-[#16181C] text-[11px] truncate block mt-0.5 font-mono">
                        {project.deadline}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer (Actions): Two outline buttons */}
              <div className="p-4 md:px-6 bg-[#F6F5F1] border-t border-[#EEECE6] flex items-center gap-2.5">
                {/* Button 1: تفاصيل المشروع */}
                <button
                  onClick={() => setSelectedProject(project)}
                  className="flex-1 py-2 px-3 rounded-lg border border-[#E3E0D9] bg-white hover:bg-[#F6F5F1] text-[#5D6168] text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Building2 className="w-3.5 h-3.5 text-[#5D6168]" />
                  <span>{T("proj.22")}</span>
                </button>

                {/* Button 2: تعديل الجدول الزمني */}
                <button
                  onClick={() => handleOpenTimelineModal(project)}
                  className="flex-1 py-2 px-3 rounded-lg border border-[#D1CDC5] bg-[#EEECE6] hover:bg-[#E3E0D9] text-[#16181C] text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 text-[#16181C]" />
                  <span>{T("proj.23")}</span>
                </button>
              </div>
            </div>
          );
        })}

        {filteredProjects.length === 0 && (
          <div className="col-span-full py-16 text-center bg-white rounded-lg border border-[#E3E0D9] p-8">
            <FolderKanban className="w-10 h-10 mx-auto mb-2 text-[#80848B]" />
            <h4 className="text-base font-bold text-[#5D6168]">{T("proj.24")}</h4>
            <p className="text-xs text-[#5D6168] mt-1 max-w-sm mx-auto">
              {T("proj.25")}
            </p>
          </div>
        )}
      </div>

      {/* Requirement 4: "Create New Project" Modal */}
      {isAddProjectOpen && (
        <div className="fixed inset-0 z-50 bg-[#16181C]/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-2xl border border-[#E3E0D9] max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 text-start animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#EEECE6]">
              <h3 className="text-lg font-black text-[#16181C] flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#16181C]" />
                <span>{T("proj.26")}</span>
              </h3>
              <button
                onClick={() => setIsAddProjectOpen(false)}
                className="p-1.5 rounded-lg text-[#5D6168] hover:text-[#16181C] hover:bg-[#EEECE6] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateProjectSubmit} className="space-y-4 mt-4">
              {/* Field 1: Project Name */}
              <div>
                <label className="block text-xs font-bold text-[#5D6168] mb-1.5">
                  اسم المشروع <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={T("proj.27")}
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E3E0D9] text-xs md:text-sm font-semibold text-[#16181C] placeholder-[#5D6168]/50 focus:outline-none focus:ring-1 focus:ring-1 focus:ring-[#2B3138] focus:border-[#2B3138] transition-all"
                />
              </div>

              {/* Field 2: Client Name */}
              <div>
                <label className="block text-xs font-bold text-[#5D6168] mb-1.5">
                  اسم العميل <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={T("proj.28")}
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E3E0D9] text-xs md:text-sm font-semibold text-[#16181C] placeholder-[#5D6168]/50 focus:outline-none focus:ring-1 focus:ring-1 focus:ring-[#2B3138] focus:border-[#2B3138] transition-all"
                />
              </div>

              {/* Field 3: Expected Deadline & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#5D6168] mb-1.5">
                    تاريخ التسليم المتوقع <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-[#E3E0D9] text-xs font-semibold text-[#16181C] focus:outline-none focus:ring-1 focus:ring-1 focus:ring-[#2B3138] focus:border-[#2B3138] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5D6168] mb-1.5">
                    {T("proj.29")}
                  </label>
                  <input
                    type="text"
                    placeholder={T("proj.30")}
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-[#E3E0D9] text-xs font-semibold text-[#16181C] focus:outline-none focus:ring-1 focus:ring-1 focus:ring-[#2B3138] focus:border-[#2B3138] transition-all"
                  />
                </div>
              </div>

              {/* Field 4: Assign Engineer & Estimated Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#5D6168] mb-1.5">
                    إسناد إلى مهندس <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={newEngineer}
                    onChange={(e) => setNewEngineer(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-[#E3E0D9] text-xs font-bold text-[#16181C] bg-white focus:outline-none focus:ring-1 focus:ring-1 focus:ring-[#2B3138] focus:border-[#2B3138] transition-all cursor-pointer"
                  >
                    {ENGINEERS_LIST.map((eng) => (
                      <option key={eng} value={eng}>
                        {eng}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5D6168] mb-1.5">
                    {T("proj.31", { v0: currencySymbol() })}
                  </label>
                  <input
                    type="text"
                    placeholder={T("proj.32")}
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-[#E3E0D9] text-xs font-semibold text-[#16181C] focus:outline-none focus:ring-1 focus:ring-1 focus:ring-[#2B3138] focus:border-[#2B3138] transition-all"
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50/60 rounded-lg border border-amber-200 text-xs text-amber-900">
                <p>
                  يبدأ المشروع تلقائياً بنسبة إنجاز ٠٪ في مرحلة <strong>D("التصميم")</strong>، وسيتلقى المهندس والعميل إشعاراً فورياً.
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#EEECE6]">
                <button
                  type="button"
                  onClick={() => setIsAddProjectOpen(false)}
                  className="px-4 py-2.5 rounded-lg text-xs font-bold text-[#5D6168] hover:bg-[#EEECE6] transition-colors cursor-pointer"
                >
                  {T("proj.34")}
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#2B3138] hover:bg-[#16181C] hover:bg-[#16181C] text-white font-bold text-xs md:text-sm transition-colors cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>{T("proj.35")}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Timeline Modal */}
      {editingTimelineProject && (
        <div className="fixed inset-0 z-50 bg-[#16181C]/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-2xl border border-[#E3E0D9] max-w-md w-full p-6 md:p-8 text-start animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#EEECE6]">
              <h3 className="text-base font-black text-[#16181C] flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#16181C]" />
                <span>{T("proj.36", { v0: editingTimelineProject.name })}</span>
              </h3>
              <button
                onClick={() => setEditingTimelineProject(null)}
                className="p-1.5 rounded-lg text-[#5D6168] hover:text-[#16181C] hover:bg-[#EEECE6] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTimeline} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-[#5D6168] mb-1.5">
                  {T("proj.37")}
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {PHASES.map((p) => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setTimelinePhase(p)}
                      className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        timelinePhase === p
                          ? "bg-[#2B3138] text-white shadow-sm"
                          : "bg-[#EEECE6] text-[#16181C] hover:bg-[#E3E0D9]"
                      }`}
                    >
                      {D(p)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#5D6168]">{T("proj.18")}</label>
                  <span className="text-xs font-black text-[#16181C]">%{timelineProgress}</span>
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
                <label className="block text-xs font-bold text-[#5D6168] mb-1.5">{T("proj.38")}</label>
                <select
                  value={timelineStatus}
                  onChange={(e) => setTimelineStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E3E0D9] text-xs font-bold text-[#16181C] bg-white"
                >
                  <option value="جاري العمل">{T("proj.39")}</option>
                  <option value="متقدم عن الجدول">{T("proj.40")}</option>
                  <option value="متأخر">{T("proj.41")}</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#EEECE6]">
                <button
                  type="button"
                  onClick={() => setEditingTimelineProject(null)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-[#5D6168] hover:bg-[#EEECE6]"
                >
                  {T("proj.34")}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#2B3138] hover:bg-[#16181C] hover:bg-[#16181C] text-white font-bold text-xs shadow-sm"
                >
                  {T("proj.42")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-[#16181C]/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-2xl border border-[#E3E0D9] max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 text-start animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#EEECE6]">
              <div>
                <h3 className="text-lg font-black text-[#16181C]">{selectedProject.name}</h3>
                <p className="text-xs text-[#5D6168] mt-0.5">{selectedProject.location}</p>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-1.5 rounded-lg text-[#5D6168] hover:text-[#16181C] hover:bg-[#EEECE6] cursor-pointer"
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
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#16181C]/70 text-white backdrop-blur-xs">
                  {T("proj.43", { v0: selectedProject.phase })}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-[#EEECE6]">
                <span className="text-[#5D6168]">{T("proj.17")}</span>
                <span className="font-bold text-[#16181C]">{selectedProject.client}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#EEECE6]">
                <span className="text-[#5D6168]">{T("proj.44")}</span>
                <span className="font-bold text-[#16181C]">{selectedProject.engineer}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#EEECE6]">
                <span className="text-[#5D6168]">{T("proj.45")}</span>
                <span className="font-black text-[#16181C]">{selectedProject.budget}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#EEECE6]">
                <span className="text-[#5D6168]">{T("proj.46")}</span>
                <span className="font-mono text-[#5D6168]">{selectedProject.startDate}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#EEECE6]">
                <span className="text-[#5D6168]">{T("proj.47")}</span>
                <span className="font-mono text-rose-700 font-bold">{selectedProject.deadline}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedProject(null)}
                className="w-full py-2.5 rounded-lg bg-[#2B3138] hover:bg-[#16181C] text-white text-xs font-bold hover:bg-[#16181C] transition-colors shadow-sm"
              >
                {T("proj.48")}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default ProjectsManagement;
