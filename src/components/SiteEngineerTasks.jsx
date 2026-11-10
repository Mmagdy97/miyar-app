import { useState, useMemo } from "react";
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
} from "lucide-react";

const INITIAL_TASKS = [
  {
    id: 1,
    title: "استلام بند السباكة وتغذية الحمامات",
    project: "فيلا الياسمين - التجمع",
    location: "الدور الأرضي - حمام الضيوف",
    dueTime: "اليوم، ١٢:٠٠ م",
    priority: "عاجل",
    completed: true,
  },
  {
    id: 2,
    title: "مراجعة شرب الكهرباء وتكسير مسارات العلب",
    project: "فيلا الياسمين - التجمع",
    location: "الدور الأول - غرف النوم",
    dueTime: "اليوم، ٠٢:٣٠ م",
    priority: "متوسط",
    completed: false,
  },
  {
    id: 3,
    title: "فحص عزل الحمامات واختبار ضغط المياه (٨ بار)",
    project: "فيلا الياسمين - التجمع",
    location: "البدروم والرووف",
    dueTime: "اليوم، ٠٤:٠٠ م",
    priority: "عاجل",
    completed: false,
  },
  {
    id: 4,
    title: "مطابقة وزنات شاسيهات الجبسوم بورد وبيت النور",
    project: "فيلا الياسمين - التجمع",
    location: "منطقة الاستقبال والصالون",
    dueTime: "غداً، ١٠:٠٠ ص",
    priority: "عادي",
    completed: false,
  },
  {
    id: 5,
    title: "استلام شحنة البورسلين والفرز الأول مع مسؤول التشوين",
    project: "فيلا الياسمين - التجمع",
    location: "المخزن الخارجي للموقع",
    dueTime: "غداً، ٠١:٠٠ م",
    priority: "عادي",
    completed: true,
  },
];

const PRIORITY_BADGES = {
  عاجل: "bg-rose-50 text-rose-800 border-rose-200",
  متوسط: "bg-amber-50 text-amber-800 border-amber-200",
  عادي: "bg-[#ECEEF0] text-[#5A646E] border-[#DDE1E5]",
};

function SiteEngineerTasks() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [filter, setFilter] = useState("الكل");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // New task form state
  const [newTitle, setNewTitle] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newPriority, setNewPriority] = useState("متوسط");
  const [newDueTime, setNewDueTime] = useState("اليوم، ٠٣:٠٠ م");

  // Toggle task completed status
  const handleToggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const newStatus = !t.completed;
          if (newStatus) {
            setToastMessage(`أحسنت! تم إنجاز مهمة: "${t.title}"`);
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
      project: "فيلا الياسمين - التجمع",
      location: newLocation.trim() || "الموقع العام",
      dueTime: newDueTime.trim() || "اليوم",
      priority: newPriority,
      completed: false,
    };

    setTasks((prev) => [newTask, ...prev]);
    setIsModalOpen(false);
    setNewTitle("");
    setNewLocation("");
    setToastMessage(`تمت إضافة مهمة جديدة: "${newTask.title}"`);
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
    if (filter === "قيد التنفيذ") return tasks.filter((t) => !t.completed);
    if (filter === "المكتملة") return tasks.filter((t) => t.completed);
    return tasks;
  }, [tasks, filter]);

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

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header & Quick Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap mb-1">
              <h1 className="text-2xl md:text-3xl font-black text-[#1E2429] tracking-tight flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#ECEEF0] border border-[#DDE1E5] flex items-center justify-center text-[#1E2429]">
                  <ListTodo className="w-5 h-5" />
                </div>
                <span>{T("se.105")}</span>
              </h1>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#ECEEF0] text-[#1E2429] border border-[#DDE1E5]">
                {T("se.106")}
              </span>
            </div>
            <p className="text-xs md:text-sm text-[#5A646E]">
              {T("se.107")}
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold text-white bg-[#2B3138] hover:bg-[#1E2429] transition-colors shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{T("se.108")}</span>
          </button>
        </div>

        {/* KPI Mini Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          <div className="bg-white rounded-lg p-4 border border-[#DDE1E5] shadow-xs text-center">
            <span className="text-[11px] font-bold text-[#5A646E] block mb-1">{T("se.109")}</span>
            <span className="text-xl md:text-2xl font-black text-[#1E2429]">{stats.total}</span>
          </div>

          <div className="bg-white rounded-lg p-4 border border-[#DDE1E5] shadow-xs text-center">
            <span className="text-[11px] font-bold text-[#5A646E] block mb-1">{T("se.110")}</span>
            <span className="text-xl md:text-2xl font-black text-amber-800">{stats.pending}</span>
          </div>

          <div className="bg-white rounded-lg p-4 border border-[#DDE1E5] shadow-xs text-center">
            <span className="text-[11px] font-bold text-[#5A646E] block mb-1">{T("se.111")}</span>
            <span className="text-xl md:text-2xl font-black text-emerald-700">{stats.completed}</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          {["الكل", "قيد التنفيذ", "المكتملة"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filter === tab
                  ? "bg-[#2B3138] text-white shadow-sm"
                  : "bg-white text-[#5A646E] border border-[#DDE1E5] hover:bg-[#F3F4F6]"
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
                    ? "bg-[#F3F4F6] border-[#DDE1E5]/80 rounded-lg opacity-75"
                    : "bg-white border-[#DDE1E5] rounded-lg shadow-xs hover:border-[#D9480F]"
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
                        ? "bg-[#2B3138] border-white/10 text-white shadow-xs"
                        : "border-[#CBD0D6] bg-white group-hover:border-[#2B3138]"
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
                      <span className="text-[11px] text-[#5A646E] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#5A646E]" />
                        <span>{task.dueTime}</span>
                      </span>
                    </div>

                    <h3
                      className={`text-sm md:text-base font-extrabold leading-snug transition-all ${
                        task.completed
                          ? "line-through text-[#5A646E]"
                          : "text-[#1E2429] group-hover:text-[#1E2429]"
                      }`}
                    >
                      {task.title}
                    </h3>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#ECEEF0] flex items-center justify-between text-xs text-[#5A646E]">
                  <span className="flex items-center gap-1.5 text-[#5A646E] text-[11px]">
                    <Building2 className="w-3.5 h-3.5 text-[#5A646E]" />
                    <span>{task.location}</span>
                  </span>

                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-lg ${
                      task.completed
                        ? "text-emerald-800 bg-emerald-50"
                        : "text-[#5A646E] bg-[#ECEEF0]"
                    }`}
                  >
                    {task.completed ? "تم الإنجاز ✓" : "انقر للاكتمال"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {filteredTasks.length === 0 && (
          <div className="py-12 text-center bg-white rounded-lg border border-[#DDE1E5] p-8">
            <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-emerald-500" />
            <h4 className="text-sm font-bold text-[#1E2429]">{T("se.112")}</h4>
            <p className="text-xs text-[#5A646E] mt-1">
              {T("se.113")}
            </p>
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#1E2429]/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-2xl border border-[#DDE1E5] max-w-md w-full p-6 md:p-8 text-start animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#ECEEF0]">
              <h3 className="text-base font-black text-[#1E2429] flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#1E2429]" />
                <span>{T("se.114")}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-[#5A646E] hover:text-[#1E2429] hover:bg-[#ECEEF0]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-[#5A646E] mb-1.5">
                  عنوان المهمة <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={T("se.115")}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#DDE1E5] text-xs md:text-sm font-semibold text-[#1E2429] focus:outline-none focus:ring-2 focus:ring-[#2B3138]/10 focus:border-[#2B3138]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5A646E] mb-1.5">
                  {T("se.116")}
                </label>
                <input
                  type="text"
                  placeholder={T("se.117")}
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-[#DDE1E5] text-xs font-semibold text-[#1E2429] focus:outline-none focus:ring-2 focus:ring-[#2B3138]/10 focus:border-[#2B3138]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#5A646E] mb-1.5">{T("se.118")}</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#DDE1E5] text-xs font-bold text-[#1E2429] bg-white"
                  >
                    <option value="عاجل">{T("se.119")}</option>
                    <option value="متوسط">{T("se.120")}</option>
                    <option value="عادي">{T("se.121")}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5A646E] mb-1.5">{T("se.122")}</label>
                  <input
                    type="text"
                    placeholder={T("se.123")}
                    value={newDueTime}
                    onChange={(e) => setNewDueTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#DDE1E5] text-xs font-semibold text-[#1E2429]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#ECEEF0]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-[#5A646E] hover:bg-[#ECEEF0]"
                >
                  {T("se.124")}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#2B3138] hover:bg-[#1E2429] hover:bg-[#1E2429] text-white font-bold text-xs shadow-sm"
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
