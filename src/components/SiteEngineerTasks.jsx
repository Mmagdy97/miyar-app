import { createPersistedStore } from "../data/persisted";
import { useState, useMemo } from "react";
import { problemsStore } from "../data/stores";
import { localize, D, DF } from "../data/dataI18n";
import { tr_ as T, E } from "../i18n";
import {
  ListTodo,
  CheckCircle2,
  Clock,
  Plus,
  AlertTriangle,
  Building2,
  Calendar,
  Sparkles,
  X,
  RotateCcw,
  Check,
  Flag,
} from "lucide-react";

const INITIAL_TASKS = localize([
  {
    id: 1,
    title: "استلام بند السباكة وتغذية الحمامات",
    project: D("فيلا الياسمين - التجمع"),
    location: "الدور الأرضي - حمام الضيوف",
    dueTime: D("اليوم، ١٢:٠٠ م"),
    priority: "عاجل",
    completed: true,
  },
  {
    id: 2,
    title: "مراجعة شرب الكهرباء وتكسير مسارات العلب",
    project: D("فيلا الياسمين - التجمع"),
    location: "الدور الأول - غرف النوم",
    dueTime: D("اليوم، ٠٢:٣٠ م"),
    priority: "متوسط",
    completed: false,
  },
  {
    id: 3,
    title: "فحص عزل الحمامات واختبار ضغط المياه (٨ بار)",
    project: D("فيلا الياسمين - التجمع"),
    location: "البدروم والرووف",
    dueTime: D("اليوم، ٠٤:٠٠ م"),
    priority: "عاجل",
    completed: false,
  },
  {
    id: 4,
    title: "مطابقة وزنات شاسيهات الجبسوم بورد وبيت النور",
    project: D("فيلا الياسمين - التجمع"),
    location: "منطقة الاستقبال والصالون",
    dueTime: D("غداً، ١٠:٠٠ ص"),
    priority: "عادي",
    completed: false,
  },
  {
    id: 5,
    title: "استلام شحنة البورسلين والفرز الأول مع مسؤول التشوين",
    project: D("فيلا الياسمين - التجمع"),
    location: "المخزن الخارجي للموقع",
    dueTime: D("غداً، ٠١:٠٠ م"),
    priority: "عادي",
    completed: true,
  },
]);

const PRIORITY_BADGES = localize({
  عاجل: "bg-rose-50 text-rose-800 border-rose-200",
  متوسط: "bg-amber-50 text-amber-800 border-amber-200",
  عادي: "bg-[#EEF1F5] text-[#475569] border-[#E3E7EE]",
});

const tasksStore = createPersistedStore("miyar:tasks:v1", INITIAL_TASKS);

function SiteEngineerTasks() {
  const [tasks, setTasks] = tasksStore.use();
  const [filter, setFilter] = useState("الكل");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // New task form state
  const [newTitle, setNewTitle] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newPriority, setNewPriority] = useState("متوسط");
  const [newDueTime, setNewDueTime] = useState("اليوم، ٠٣:٠٠ م");

  // Problem reporting
  const [problems, setProblems] = problemsStore.use();
  const [probTask, setProbTask] = useState(null);
  const [probType, setProbType] = useState("materials");
  const [probSev, setProbSev] = useState("medium");
  const [probDesc, setProbDesc] = useState("");
  const [probStop, setProbStop] = useState(true);

  const openProblem = (task) => {
    setProbTask(task);
    setProbType("materials");
    setProbSev("medium");
    setProbDesc("");
    setProbStop(true);
  };

  const submitProblem = (e) => {
    e.preventDefault();
    if (!probDesc.trim()) return;
    setProblems((prev) => [
      {
        id: Date.now(),
        taskId: probTask.id,
        task: probTask.title,
        project: probTask.project,
        type: probType,
        severity: probSev,
        desc: probDesc.trim(),
        status: "open",
        at: new Date().toISOString(),
      },
      ...prev,
    ]);
    if (probStop) setTasks((prev) => prev.map((t) => (t.id === probTask.id ? { ...t, blocked: true } : t)));
    setToastMessage(T("prob.sent", { 0: probTask.title }));
    setTimeout(() => setToastMessage(null), 3500);
    setProbTask(null);
  };

  const resolveProblem = (pr) => {
    setProblems((prev) => prev.map((x) => (x.id === pr.id ? { ...x, status: "resolved" } : x)));
    setTasks((prev) =>
      prev.map((t) =>
        t.id === pr.taskId && !problems.some((x) => x.id !== pr.id && x.taskId === pr.taskId && x.status === "open")
          ? { ...t, blocked: false }
          : t
      )
    );
  };

  // Toggle task completed status
  const handleToggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const newStatus = !t.completed;
          if (newStatus) {
            setToastMessage(DF("أحسنت! تم إنجاز مهمة: \"{0}\"", t.title));
            setTimeout(() => setToastMessage(null), 3000);
          }
          return { ...t, completed: newStatus };
        }
        return t;
      })
    );
  };

  // Add new task submit
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask = {
      id: Date.now(),
      title: newTitle.trim(),
      project: D("فيلا الياسمين - التجمع"),
      location: newLocation.trim() || D("الموقع العام"),
      dueTime: newDueTime.trim() || D("اليوم"),
      priority: newPriority,
      completed: false,
    };

    setTasks((prev) => [newTask, ...prev]);
    setIsModalOpen(false);
    setNewTitle("");
    setNewLocation("");
    setToastMessage(DF("تمت إضافة مهمة جديدة: \"{0}\"", newTask.title));
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Stats
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    return { total, completed, pending };
  }, [tasks]);

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    if (filter ==="قيد التنفيذ") return tasks.filter((t) => !t.completed);
    if (filter ==="المكتملة") return tasks.filter((t) => t.completed);
    return tasks;
  }, [tasks, filter]);

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent pb-24 font-ibm w-full max-w-full overflow-x-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 end-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#0F172A] text-white rounded-xl shadow-xl border border-white/10 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-xs font-bold leading-relaxed">{toastMessage}</p>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header & Quick Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap mb-1">
              <h1 className="text-2xl md:text-3xl font-black text-[#0F172A] tracking-tight flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#EEF1F5] border border-[#E3E7EE] flex items-center justify-center text-[#0F172A]">
                  <ListTodo className="w-5 h-5" />
                </div>
                <span>{T("se.105")}</span>
              </h1>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EEF1F5] text-[#0F172A] border border-[#E3E7EE]">
                {T("se.106")}
              </span>
            </div>
            <p className="text-xs md:text-sm text-[#475569]">
              {T("se.107")}
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold text-white bg-[#0F172A] hover:bg-[#0F172A] transition-colors shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{T("se.108")}</span>
          </button>
        </div>

        {/* KPI Mini Row */}
        <div className="grid stat-grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          <div className="bg-white rounded-lg p-4 border border-[#E3E7EE] shadow-xs text-center">
            <span className="text-[11px] font-bold text-[#475569] block mb-1">{T("se.109")}</span>
            <span className="text-xl md:text-2xl font-black text-[#0F172A]">{stats.total}</span>
          </div>

          <div className="bg-white rounded-lg p-4 border border-[#E3E7EE] shadow-xs text-center">
            <span className="text-[11px] font-bold text-[#475569] block mb-1">{T("se.110")}</span>
            <span className="text-xl md:text-2xl font-black text-amber-800">{stats.pending}</span>
          </div>

          <div className="bg-white rounded-lg p-4 border border-[#E3E7EE] shadow-xs text-center">
            <span className="text-[11px] font-bold text-[#475569] block mb-1">{T("se.111")}</span>
            <span className="text-xl md:text-2xl font-black text-emerald-700">{stats.completed}</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          {["الكل", D("قيد التنفيذ"), D("المكتملة")].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filter === tab
                  ? "bg-[#0F172A] text-white shadow-sm"
                  : "bg-white text-[#475569] border border-[#E3E7EE] hover:bg-[#F4F6F9]"
              }`}
            >
              {E(tab)}
            </button>
          ))}
        </div>

        {/* Task Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTasks.map((task) => {
            const priorityClass =
              PRIORITY_BADGES[task.priority] || PRIORITY_BADGES["عادي"];

            return (
              <div
                key={task.id}
                onClick={() => handleToggleTask(task.id)}
                className={`p-4 md:p-5 rounded-lg border transition-all duration-200 cursor-pointer select-none group flex flex-col justify-between ${
                  task.completed
                    ? "bg-[#F4F6F9] border-[#E3E7EE]/80 rounded-lg opacity-75"
                    : "bg-white border-[#E3E7EE] rounded-lg shadow-xs hover:border-[#0F766E]"
                }`}
              >
                <div className="flex items-start gap-3.5 mb-3">
                  {/* Status Checkbox Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleTask(task.id);
                    }}
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-all cursor-pointer ${
                      task.completed
                        ? "bg-[#0F172A] border-white/10 text-white shadow-xs"
                        : "border-[#CBD2DC] bg-white group-hover:border-[#0F172A]"
                    }`}
                  >
                    {task.completed && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${priorityClass}`}
                      >
                        {E(task.priority)}
                      </span>
                      <span className="text-[11px] text-[#475569] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#475569]" />
                        <span>{task.dueTime}</span>
                      </span>
                    </div>

                    <h3
                      className={`text-sm md:text-base font-extrabold leading-snug transition-all ${
                        task.completed
                          ? "line-through text-[#475569]"
                          : "text-[#0F172A] group-hover:text-[#0F172A]"
                      }`}
                    >
                      {task.title}
                    </h3>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#EEF1F5] flex items-center justify-between text-xs text-[#475569]">
                  <span className="flex items-center gap-1.5 text-[#475569] text-[11px]">
                    <Building2 className="w-3.5 h-3.5 text-[#475569]" />
                    <span>{task.location}</span>
                  </span>

                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-lg ${
                      task.completed
                        ? "text-emerald-800 bg-emerald-50"
                        : "text-[#475569] bg-[#EEF1F5]"
                    }`}
                  >
                    {task.completed ? D("تم الإنجاز ✓") : D("انقر للاكتمال")}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between gap-2">
                  {task.blocked ? (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {T("prob.blocked")}
                    </span>
                  ) : (
                    <span />
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openProblem(task);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 cursor-pointer"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    {T("prob.btn")}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredTasks.length === 0 && (
          <div className="py-12 text-center bg-white rounded-lg border border-[#E3E7EE] p-8">
            <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-emerald-500" />
            <h4 className="text-sm font-bold text-[#0F172A]">{T("se.112")}</h4>
            <p className="text-xs text-[#475569] mt-1">
              {T("se.113")}
            </p>
          </div>
        )}

        {/* Reported problems */}
        <section className="space-y-3">
          <h2 className="text-base font-black text-[#0F172A] flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <span>{T("prob.sec")}</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#EEF1F5] border border-[#E3E7EE]">{problems.length}</span>
          </h2>
          {problems.length === 0 ? (
            <p className="text-xs text-[#475569] bg-white rounded-lg border border-[#E3E7EE] p-4 text-center">{T("prob.empty")}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {problems.map((pr) => (
                <div key={pr.id} className={`p-4 rounded-lg border bg-white ${pr.status === "resolved" ? "opacity-60 border-[#E3E7EE]" : "border-rose-200"}`}>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#EEF1F5] border border-[#E3E7EE]">{T("prob.t." + pr.type)}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${pr.severity === "high" ? "bg-rose-50 text-rose-700 border-rose-200" : pr.severity === "medium" ? "bg-amber-50 text-amber-800 border-amber-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"}`}>{T("prob.s." + pr.severity)}</span>
                  </div>
                  <p className="text-sm font-extrabold text-[#0F172A] leading-snug">{pr.task}</p>
                  <p className="text-xs text-[#475569] mt-1 leading-relaxed">{pr.desc}</p>
                  <div className="mt-3 flex items-center justify-between text-[11px]">
                    <span className="text-[#475569]">{new Date(pr.at).toLocaleString()}</span>
                    {pr.status === "open" ? (
                      <button type="button" onClick={() => resolveProblem(pr)} className="px-3 py-1 rounded-lg font-bold text-white bg-[#0F172A] hover:bg-[#0F172A] cursor-pointer">{T("prob.resolve")}</button>
                    ) : (
                      <span className="font-bold text-emerald-700">{T("prob.resolved")}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Report Problem Modal */}
      {probTask && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-[#E3E7EE] max-w-md w-full p-6 text-start max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#EEF1F5]">
              <h3 className="text-base font-black text-[#0F172A] flex items-center gap-2">
                <Flag className="w-5 h-5 text-rose-600" />
                <span>{T("prob.title")}</span>
              </h3>
              <button type="button" onClick={() => setProbTask(null)} className="p-1 rounded-lg text-[#475569] hover:bg-[#EEF1F5]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs font-bold text-[#475569] mt-3">{T("prob.for", { 0: probTask.title })}</p>
            <form onSubmit={submitProblem} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-[#475569] mb-1.5">{T("prob.type")}</label>
                <select value={probType} onChange={(e) => setProbType(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-[#E3E7EE] text-xs font-bold text-[#0F172A] bg-white">
                  {["materials", "safety", "quality", "design", "equipment", "labor", "other"].map((k) => (
                    <option key={k} value={k}>{T("prob.t." + k)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#475569] mb-1.5">{T("prob.sev")}</label>
                <div className="grid grid-cols-3 gap-2">
                  {["high", "medium", "low"].map((k) => (
                    <button key={k} type="button" onClick={() => setProbSev(k)} className={`py-2 rounded-lg text-xs font-bold border cursor-pointer ${probSev === k ? "bg-[#0F172A] text-white border-[#0F172A]" : "bg-white text-[#475569] border-[#E3E7EE]"}`}>
                      {T("prob.s." + k)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#475569] mb-1.5">{T("prob.desc")} <span className="text-rose-500">*</span></label>
                <textarea required rows={3} value={probDesc} onChange={(e) => setProbDesc(e.target.value)} placeholder={T("prob.desc.ph")} className="w-full px-3.5 py-2.5 rounded-lg border border-[#E3E7EE] text-xs font-semibold text-[#0F172A]" />
              </div>
              <label className="flex items-center gap-2 text-xs font-bold text-[#0F172A] cursor-pointer">
                <input type="checkbox" checked={probStop} onChange={(e) => setProbStop(e.target.checked)} />
                {T("prob.stop")}
              </label>
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#EEF1F5]">
                <button type="button" onClick={() => setProbTask(null)} className="px-4 py-2 rounded-lg text-xs font-bold text-[#475569] hover:bg-[#EEF1F5]">{T("se.124")}</button>
                <button type="submit" className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm">{T("prob.send")}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-2xl border border-[#E3E7EE] max-w-md w-full p-6 md:p-8 text-start animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#EEF1F5]">
              <h3 className="text-base font-black text-[#0F172A] flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#0F172A]" />
                <span>{T("se.114")}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-[#475569] hover:text-[#0F172A] hover:bg-[#EEF1F5]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-[#475569] mb-1.5">
                  عنوان المهمة <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={T("se.115")}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E3E7EE] text-xs md:text-sm font-semibold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0F172A]/10 focus:border-[#0F172A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#475569] mb-1.5">
                  {T("se.116")}
                </label>
                <input
                  type="text"
                  placeholder={T("se.117")}
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-[#E3E7EE] text-xs font-semibold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0F172A]/10 focus:border-[#0F172A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#475569] mb-1.5">{T("se.118")}</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#E3E7EE] text-xs font-bold text-[#0F172A] bg-white"
                  >
                    <option value="عاجل">{T("se.119")}</option>
                    <option value="متوسط">{T("se.120")}</option>
                    <option value="عادي">{T("se.121")}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#475569] mb-1.5">{T("se.122")}</label>
                  <input
                    type="text"
                    placeholder={T("se.123")}
                    value={newDueTime}
                    onChange={(e) => setNewDueTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#E3E7EE] text-xs font-semibold text-[#0F172A]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#EEF1F5]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-[#475569] hover:bg-[#EEF1F5]"
                >
                  {T("se.124")}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#0F172A] hover:bg-[#0F172A] hover:bg-[#0F172A] text-white font-bold text-xs shadow-sm"
                >
                  {T("se.125")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default SiteEngineerTasks;
