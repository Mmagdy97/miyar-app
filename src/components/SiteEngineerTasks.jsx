import { useState, useMemo } from "react";
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
  عادي: "bg-[#EFEEE8] text-[#526257] border-[#E5E6DF]",
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

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header & Quick Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap mb-1">
              <h1 className="text-2xl md:text-3xl font-black text-[#202923] tracking-tight flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#EFEEE8] border border-[#E5E6DF] flex items-center justify-center text-[#202923]">
                  <ListTodo className="w-5 h-5" />
                </div>
                <span>المهام الميدانية المسندة</span>
              </h1>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EFEEE8] text-[#202923] border border-[#E5E6DF]">
                م. محمد (الموقع)
              </span>
            </div>
            <p className="text-xs md:text-sm text-[#526257]">
              قائمة البنود التنفيذية الواجب استلامها وتدقيقها اليوم في موقع فيلا الياسمين.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold text-white bg-[#183C35] hover:bg-[#202923] transition-colors shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ إضافة مهمة للموقع</span>
          </button>
        </div>

        {/* KPI Mini Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          <div className="bg-white rounded-lg p-4 border border-[#E5E6DF] shadow-xs text-center">
            <span className="text-[11px] font-bold text-[#526257] block mb-1">إجمالي المهام</span>
            <span className="text-xl md:text-2xl font-black text-[#202923]">{stats.total}</span>
          </div>

          <div className="bg-white rounded-lg p-4 border border-[#E5E6DF] shadow-xs text-center">
            <span className="text-[11px] font-bold text-[#526257] block mb-1">قيد التنفيذ</span>
            <span className="text-xl md:text-2xl font-black text-amber-800">{stats.pending}</span>
          </div>

          <div className="bg-white rounded-lg p-4 border border-[#E5E6DF] shadow-xs text-center">
            <span className="text-[11px] font-bold text-[#526257] block mb-1">تم الإنجاز</span>
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
                  ? "bg-[#183C35] text-white shadow-sm"
                  : "bg-white text-[#526257] border border-[#E5E6DF] hover:bg-[#F5F3ED]"
              }`}
            >
              {tab}
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
                    ? "bg-[#F5F3ED] border-[#E5E6DF]/80 rounded-lg opacity-75"
                    : "bg-white border-[#E5E6DF] rounded-lg shadow-xs hover:border-[#5D8C70]"
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
                        ? "bg-[#183C35] border-white/10 text-white shadow-xs"
                        : "border-[#D5D8D0] bg-white group-hover:border-[#183C35]"
                    }`}
                  >
                    {task.completed && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${priorityClass}`}
                      >
                        {task.priority}
                      </span>
                      <span className="text-[11px] text-[#526257] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#526257]" />
                        <span>{task.dueTime}</span>
                      </span>
                    </div>

                    <h3
                      className={`text-sm md:text-base font-extrabold leading-snug transition-all ${
                        task.completed
                          ? "line-through text-[#526257]"
                          : "text-[#202923] group-hover:text-[#202923]"
                      }`}
                    >
                      {task.title}
                    </h3>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#EFEEE8] flex items-center justify-between text-xs text-[#526257]">
                  <span className="flex items-center gap-1.5 text-[#526257] text-[11px]">
                    <Building2 className="w-3.5 h-3.5 text-[#526257]" />
                    <span>{task.location}</span>
                  </span>

                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-lg ${
                      task.completed
                        ? "text-emerald-800 bg-emerald-50"
                        : "text-[#526257] bg-[#EFEEE8]"
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
          <div className="py-12 text-center bg-white rounded-lg border border-[#E5E6DF] p-8">
            <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-emerald-500" />
            <h4 className="text-sm font-bold text-[#202923]">لا توجد مهام مطابقة</h4>
            <p className="text-xs text-[#526257] mt-1">
              جميع المهام التنفيذية في هذا القسم محدثة ومكتملة.
            </p>
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#202923]/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-2xl border border-[#E5E6DF] max-w-md w-full p-6 md:p-8 text-start animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#EFEEE8]">
              <h3 className="text-base font-black text-[#202923] flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#202923]" />
                <span>إضافة مهمة استلام ميداني</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-[#526257] hover:text-[#202923] hover:bg-[#EFEEE8]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-[#526257] mb-1.5">
                  عنوان المهمة <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: استلام دهانات الريسبشن وجه بطانة..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E6DF] text-xs md:text-sm font-semibold text-[#202923] focus:outline-none focus:ring-2 focus:ring-[#183C35]/10 focus:border-[#183C35]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#526257] mb-1.5">
                  مكان التنفيذ بالموقع
                </label>
                <input
                  type="text"
                  placeholder="مثال: الدور الأول - الغرفة الرئيسية"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-[#E5E6DF] text-xs font-semibold text-[#202923] focus:outline-none focus:ring-2 focus:ring-[#183C35]/10 focus:border-[#183C35]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#526257] mb-1.5">درجة الأهمية</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#E5E6DF] text-xs font-bold text-[#202923] bg-white"
                  >
                    <option value="عاجل">عاجل</option>
                    <option value="متوسط">متوسط</option>
                    <option value="عادي">عادي</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#526257] mb-1.5">الوقت المستهدف</label>
                  <input
                    type="text"
                    placeholder="اليوم، ٠٣:٠٠ م"
                    value={newDueTime}
                    onChange={(e) => setNewDueTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#E5E6DF] text-xs font-semibold text-[#202923]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#EFEEE8]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-[#526257] hover:bg-[#EFEEE8]"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#183C35] hover:bg-[#202923] hover:bg-[#202923] text-white font-bold text-xs shadow-sm"
                >
                  إضافة المهمة
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
