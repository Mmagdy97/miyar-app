import { useState, useMemo } from "react";
import ProgressBar from "./ProgressBar";
import {
  Wallet,
  Banknote,
  TrendingUp,
  CheckCircle2,
  Clock,
  Receipt,
  Eye,
  Check,
  X,
  Plus,
  Building2,
  AlertCircle,
  Calendar,
  ArrowUpRight,
  ShieldCheck,
  FileText,
  Sparkles,
  RefreshCw,
  Coins,
  DollarSign,
} from "lucide-react";
import { ENGINEER_CASH, personById, projectById, initialsOf } from "../data/seed";

// Initial Engineers Petty Cash State (single source: src/data/seed.js)
const INITIAL_ENGINEERS_CASH = ENGINEER_CASH.map((c) => {
  const person = personById(c.engineerId);
  return {
    id: c.id,
    name: person.displayName,
    site: projectById(c.projectId).name,
    totalGiven: c.totalGiven,
    spent: c.spent,
    avatar: initialsOf(person.name),
    color: person.color,
  };
});

// Initial Pending Expenses State
const INITIAL_PENDING_EXPENSES = [
  {
    id: 101,
    engId: 1,
    engName: "م. أحمد الشناوي (موقع زايد)",
    description: "تشوين أسمنت ورمل سريع لعزل البدروم",
    amount: 1500,
    date: "اليوم، ١١:٣٠ ص",
    category: "تشوين ونولون",
    receiptNumber: "REC-9821",
    invoiceImg:
      "https://images.unsplash.com/photo-1554415707-9e4c018a482a?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 102,
    engId: 2,
    engName: "م. كريم مصطفى (فيلا الياسمين)",
    description: "شراء وصلات سباكة نحاس إضافية وغراء عزل",
    amount: 2850,
    date: "اليوم، ٠٩:٤٥ ص",
    category: "خامات سباكة",
    receiptNumber: "REC-9822",
    invoiceImg:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 103,
    engId: 3,
    engName: "م. عمر عادل (نيو جيزة)",
    description: "يومية عمالة طارئة لتنزيل ألواح الجبسوم بورد",
    amount: 1200,
    date: "أمس، ٠٥:١٥ م",
    category: "مصاريف عمالة",
    receiptNumber: "REC-9823",
    invoiceImg:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 104,
    engId: 2,
    engName: "م. كريم مصطفى (فيلا الياسمين)",
    description: "إكراميات ونولون نقل عينات رخام من شق التعبان",
    amount: 650,
    date: "أمس، ٠٢:٠٠ م",
    category: "نقل ونثريات",
    receiptNumber: "REC-9824",
    invoiceImg:
      "https://images.unsplash.com/photo-1580048915913-4f8f5cb481c4?auto=format&fit=crop&w=700&q=80",
  },
];

function FinancialsDashboard({ actionItems, setActionItems, setSelectedItem }) {
  const [engineersCash, setEngineersCash] = useState(INITIAL_ENGINEERS_CASH);
  const [pendingExpenses, setPendingExpenses] = useState(INITIAL_PENDING_EXPENSES);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Top-Up Petty Cash Modal State
  const [topUpModalOpen, setTopUpModalOpen] = useState(false);
  const [topUpEngId, setTopUpEngId] = useState(1);
  const [topUpAmount, setTopUpAmount] = useState(10000);

  // Auto-calculated KPI Widgets
  const { totalGiven, totalSpent, remainingInField, overallSpentRatio } = useMemo(() => {
    const given = engineersCash.reduce((sum, eng) => sum + (Number(eng.totalGiven) || 0), 0);
    const spent = engineersCash.reduce((sum, eng) => sum + (Number(eng.spent) || 0), 0);
    const remaining = given - spent;
    const ratio = given > 0 ? Math.round((spent / given) * 100) : 0;
    return {
      totalGiven: given,
      totalSpent: spent,
      remainingInField: remaining,
      overallSpentRatio: ratio,
    };
  }, [engineersCash]);

  // Handle Approve Expense Interactivity (Requirement 4)
  const handleApproveExpense = (expense) => {
    // 1. Find the expense amount and engineer
    const { id, engId, amount, description } = expense;

    // 2. Update engineersCash state: Add this amount to the specific engineer's spent value
    setEngineersCash((prev) =>
      prev.map((eng) =>
        eng.id === engId ? { ...eng, spent: eng.spent + amount } : eng
      )
    );

    // 3. Remove this expense from the pendingExpenses array
    setPendingExpenses((prev) => prev.filter((e) => e.id !== id));

    // Close receipt modal if it was open for this expense
    if (selectedReceipt && selectedReceipt.id === id) {
      setSelectedReceipt(null);
    }

    // 4. Update actionItems if linked
    if (setActionItems) {
      setActionItems((prev) =>
        prev.filter((item) => !item.amount?.includes(amount.toLocaleString("ar-EG")))
      );
    }

    // 5. Show toast notification
    setToastMessage(`تم اعتماد فاتورة: "${description}" بمبلغ ${amount.toLocaleString("ar-EG")} ج.م بنجاح`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handle Reject Expense
  const handleRejectExpense = (id) => {
    setPendingExpenses((prev) => prev.filter((e) => e.id !== id));
    if (selectedReceipt && selectedReceipt.id === id) {
      setSelectedReceipt(null);
    }
    setToastMessage("تم رفض الفاتورة وإعادتها للمهندس للمراجعة");
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Reset demo expenses
  const handleResetData = () => {
    setEngineersCash(INITIAL_ENGINEERS_CASH);
    setPendingExpenses(INITIAL_PENDING_EXPENSES);
    setToastMessage("تمت استعادة البيانات الافتراضية للعهد والمصروفات");
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Top Up Petty Cash Submission
  const handleTopUpSubmit = (e) => {
    e.preventDefault();
    const amountNum = parseFloat(topUpAmount) || 0;
    if (amountNum <= 0) return;

    setEngineersCash((prev) =>
      prev.map((eng) =>
        eng.id === parseInt(topUpEngId)
          ? { ...eng, totalGiven: eng.totalGiven + amountNum }
          : eng
      )
    );

    setTopUpModalOpen(false);
    setToastMessage(`تم صرف دفعة عهدة إضافية بقيمة ${amountNum.toLocaleString("ar-EG")} ج.م بنجاح`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent pb-20 font-ibm w-full max-w-full overflow-x-hidden" dir="rtl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 end-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#183C35] text-white rounded-xl shadow-xl border border-white/10 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
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
                <Banknote className="w-5 h-5" />
              </div>
              <span>إدارة العهد النقدية والمصروفات</span>
            </h1>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EFEEE8] text-[#202923] border border-[#E5E6DF]/80">
              نظام الصرف المالي اللحظي
            </span>
          </div>
          <p className="text-xs md:text-sm text-[#526257]">
            متابعة أرصدة العهد الميدانية المفتوحة، وتدقيق فواتير المصروفات النثرية للمواقع واعتمادها فوراً.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleResetData}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-[#202923] bg-white border border-[#E5E6DF] hover:bg-[#F5F3ED] transition-colors shadow-2xs cursor-pointer"
            title="استعادة البيانات الأصلية"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>إعادة ضبط</span>
          </button>
          <button
            onClick={() => setTopUpModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs md:text-sm font-medium text-white bg-[#183C35] hover:bg-[#202923] hover:bg-[#202923] transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ صرف دفعة عهدة جديدة</span>
          </button>
        </div>
      </div>

      {/* Requirement 2: 3 Glassmorphic KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Card 1: Total Given (إجمالي العهد المفتوحة) */}
        <div className="relative bg-white rounded-lg p-6 border border-[#E5E6DF] shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#526257]">إجمالي العهد المفتوحة</span>
            <div className="w-10 h-10 rounded-lg bg-[#EFEEE8] text-[#202923] flex items-center justify-center border border-[#E5E6DF]">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-black text-[#202923] tracking-tight transition-all duration-300">
              {totalGiven.toLocaleString("ar-EG")}
            </span>
            <span className="text-xs font-bold text-[#526257]">جنيه مصري</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-[#526257]">
            <span className="font-bold text-[#202923] bg-[#EFEEE8] px-2 py-0.5 rounded-md border border-[#E5E6DF]">
              {engineersCash.length} مهندسين
            </span>
            <span>بمواقع العمل المختلفة</span>
          </div>
        </div>

        {/* Card 2: Total Spent (إجمالي المنصرف المعتمد) */}
        <div className="relative bg-white rounded-lg p-6 border border-[#E5E6DF] shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#526257]">إجمالي المنصرف المعتمد</span>
            <div className="w-10 h-10 rounded-lg bg-[#EFEEE8] text-[#202923] flex items-center justify-center border border-[#E5E6DF]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-black text-[#202923] tracking-tight transition-all duration-300">
              {totalSpent.toLocaleString("ar-EG")}
            </span>
            <span className="text-xs font-bold text-[#526257]">جنيه مصري</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-[#526257]">
            <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              %{overallSpentRatio} نسبة الصرف
            </span>
            <span>فواتير وإيصالات معتمدة</span>
          </div>
        </div>

        {/* Card 3: Remaining in Field (الرصيد المتبقي بالمواقع) */}
        <div className="relative bg-[#183C35] text-white rounded-xl p-6 border border-[#14322c] shadow-sm overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#EFEEE8]">الرصيد المتبقي بالمواقع</span>
            <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center border border-white/20">
              <Coins className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-black text-white tracking-tight transition-all duration-300">
              {remainingInField.toLocaleString("ar-EG")}
            </span>
            <span className="text-xs font-bold text-[#EFEEE8]/80">جنيه مصري</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-[#EFEEE8]">
            <span className="font-bold text-white bg-white/15 px-2 py-0.5 rounded-md border border-white/20 text-white">
              سيولة متاحة
            </span>
            <span>جاهزة للمصروفات النثرية الطارئة</span>
          </div>
        </div>
      </div>

      {/* Requirement 3: Main Two Columns Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Right Column in RTL (7 cols): أرصدة المهندسين (Engineers Balances) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-lg border border-[#E5E6DF] shadow-[0_4px_24px_rgba(0,0,0,0.02)] p-6 md:p-8">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#EFEEE8]">
              <div>
                <h2 className="text-base md:text-lg font-black text-[#202923] flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-[#202923]" />
                  <span>أرصدة المهندسين ومتابعة العهد (Engineers Balances)</span>
                </h2>
                <p className="text-xs text-[#526257] mt-0.5">
                  نسبة استهلاك كل مهندس للعهدة المالية المسلمة له ورصيده النقدي المتبقي
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#EFEEE8] text-[#526257] border border-[#E5E6DF]">
                {engineersCash.length} مهندسين
              </span>
            </div>

            {/* List of Engineers */}
            <div className="space-y-4">
              {engineersCash.map((eng) => {
                const available = eng.totalGiven - eng.spent;
                const ratio =
                  eng.totalGiven > 0 ? Math.min(100, Math.round((eng.spent / eng.totalGiven) * 100)) : 0;

                // Color code progress bar
                let progressColor = "bg-[#183C35]";
                let badgeColor = "bg-[#EFEEE8] text-[#202923] border-[#E5E6DF]";
                if (ratio >= 85) {
                  progressColor = "bg-rose-600";
                  badgeColor = "bg-rose-50 text-rose-800 border-rose-200";
                } else if (ratio >= 70) {
                  progressColor = "bg-amber-600";
                  badgeColor = "bg-amber-50 text-amber-800 border-amber-200";
                }

                return (
                  <div
                    key={eng.id}
                    className="p-4 rounded-lg border border-[#E5E6DF] bg-white hover:bg-[#F5F3ED]/50 transition-all shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg ${eng.color} text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs`}
                        >
                          {eng.avatar}
                        </div>
                        <div>
                          <h3 className="text-sm font-extrabold text-[#202923] leading-tight">
                            {eng.name}
                          </h3>
                          <p className="text-xs text-[#526257] mt-0.5 flex items-center gap-1">
                            <Building2 className="w-3 h-3 text-[#526257]" />
                            <span>{eng.site}</span>
                          </p>
                        </div>
                      </div>

                      {/* Available Balance Tag */}
                      <div className="text-end">
                        <span className="text-[10px] font-bold text-[#526257] block">
                          الرصيد المتاح
                        </span>
                        <span className="text-sm md:text-base font-black text-[#202923] tracking-tight">
                          {available.toLocaleString("ar-EG")}{" "}
                          <span className="text-[11px] font-normal text-[#526257]">ج.م</span>
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar Container */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[11px] text-[#526257]">
                          المنصرف:{" "}
                          <strong className="text-[#202923] font-bold">
                            {eng.spent.toLocaleString("ar-EG")} ج.م
                          </strong>{" "}
                          من أصل {eng.totalGiven.toLocaleString("ar-EG")} ج.م
                        </span>
                        <span className="text-xs font-bold text-[#202923] tracking-wide">
                          %{ratio} مستهلك
                        </span>
                      </div>

                      <ProgressBar
                        value={ratio}
                        warningThreshold={85}
                        customFillClass={
                          ratio >= 85
                            ? "bg-rose-600"
                            : ratio >= 70
                            ? "bg-amber-600"
                            : undefined
                        }
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Note */}
            <div className="mt-5 p-3 rounded-lg bg-[#F5F3ED] border border-[#E5E6DF] flex items-center gap-2.5 text-xs text-[#526257]">
              <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                يتم تحديث نسب الاستهلاك والأرصدة الحرة في ثوانٍ بمجرد قيامك باعتماد أي فاتورة جديدة.
              </span>
            </div>
          </div>
        </div>

        {/* Left Column in RTL (5 cols): فواتير بانتظار الاعتماد (Pending Expenses) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-lg border border-[#E5E6DF] shadow-[0_4px_24px_rgba(0,0,0,0.02)] p-6 md:p-8">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#EFEEE8]">
              <div>
                <h2 className="text-base md:text-lg font-black text-[#202923] flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-amber-700" />
                  <span>فواتير بانتظار الاعتماد</span>
                </h2>
                <p className="text-xs text-[#526257] mt-0.5">
                  فواتير نقدية وإيصالات تم رفعها من المواقع وتنتظر الموافقة المالية
                </p>
              </div>
              <span className="text-xs font-black px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                {pendingExpenses.length} معلقة
              </span>
            </div>

            {/* Expenses List */}
            <div className="space-y-3.5">
              {pendingExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="p-4 rounded-lg border border-[#E5E6DF] hover:border-[#5D8C70] bg-white shadow-2xs transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#EFEEE8] text-[#526257] border border-[#E5E6DF] mb-1.5">
                        {expense.category}
                      </span>
                      <h4 className="text-xs md:text-sm font-extrabold text-[#202923] leading-snug">
                        {expense.description}
                      </h4>
                      <p className="text-[11px] text-[#526257] mt-1 flex items-center gap-1.5">
                        <span className="font-semibold text-[#202923]">{expense.engName}</span>
                        <span>•</span>
                        <span className="text-[#526257]">{expense.date}</span>
                      </p>
                    </div>

                    {/* Amount */}
                    <div className="text-end shrink-0">
                      <span className="text-sm md:text-base font-black text-rose-700 block">
                        {expense.amount.toLocaleString("ar-EG")}
                      </span>
                      <span className="text-[10px] font-bold text-[#526257]">جنيه مصري</span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#EFEEE8] mt-3">
                    {/* View Receipt Button */}
                    <button
                      onClick={() => setSelectedReceipt(expense)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-[#526257] hover:text-[#202923] hover:bg-[#EFEEE8] transition-colors cursor-pointer"
                      title="معاينة صورة الفاتورة"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>معاينة الإيصال</span>
                    </button>

                    {/* Action Buttons: Reject & Approve */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleRejectExpense(expense.id)}
                        className="p-1.5 rounded-lg text-[#526257] hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="رفض الفاتورة"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      {/* The "اعتماد" (Approve) Button */}
                      <button
                        onClick={() => handleApproveExpense(expense)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#183C35] hover:bg-[#202923] text-white hover:bg-[#202923] transition-colors font-bold text-xs shadow-sm transition-all cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>اعتماد</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Empty state when all expenses approved */}
              {pendingExpenses.length === 0 && (
                <div className="py-12 px-4 text-center rounded-lg bg-[#F5F3ED] border border-[#E5E6DF]">
                  <div className="w-12 h-12 rounded-lg bg-[#EFEEE8] text-[#202923] flex items-center justify-center mx-auto mb-3 border border-[#E5E6DF]">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-extrabold text-[#202923] mb-1">
                    رائع! تم اعتماد جميع الفواتير المعلقة
                  </h4>
                  <p className="text-xs text-[#526257] max-w-xs mx-auto mb-4">
                    لا توجد فواتير أو إيصالات بانتظار التدقيق المالي في الوقت الحالي.
                  </p>
                  <button
                    onClick={handleResetData}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white border border-[#E5E6DF] text-xs font-bold text-[#202923] hover:bg-[#F5F3ED] transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>إعادة تجربة التدقيق المالي</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* View Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-[#202923]/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-2xl border border-[#E5E6DF] max-w-md w-full overflow-hidden text-start animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-[#EFEEE8] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-[#202923]">
                  معاينة إيصال: {selectedReceipt.receiptNumber}
                </h3>
                <p className="text-[11px] text-[#526257]">{selectedReceipt.engName}</p>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="p-1.5 rounded-lg text-[#526257] hover:text-[#526257] hover:bg-[#EFEEE8] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Receipt Image Mock */}
            <div className="relative bg-[#EFEEE8] h-56 overflow-hidden flex items-center justify-center">
              <img
                src={selectedReceipt.invoiceImg}
                alt="Receipt Mock"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#202923]/70 via-transparent to-transparent flex items-end p-4">
                <span className="text-white text-xs font-bold flex items-center gap-1.5 bg-[#202923]/50 backdrop-blur-xs px-2.5 py-1 rounded-lg">
                  <Receipt className="w-3.5 h-3.5 text-emerald-400" />
                  <span>فاتورة إلكترونية موثقة من الموقع</span>
                </span>
              </div>
            </div>

            {/* Details Body */}
            <div className="p-5 space-y-3">
              <div className="flex justify-between items-center text-xs pb-2 border-b border-[#EFEEE8]">
                <span className="text-[#526257]">وصف المصروف:</span>
                <span className="font-bold text-[#202923]">{selectedReceipt.description}</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-2 border-b border-[#EFEEE8]">
                <span className="text-[#526257]">التصنيف المحاسبي:</span>
                <span className="font-bold text-[#202923]">{selectedReceipt.category}</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-2 border-b border-[#EFEEE8]">
                <span className="text-[#526257]">تاريخ التحرير:</span>
                <span className="font-bold text-[#202923]">{selectedReceipt.date}</span>
              </div>
              <div className="flex justify-between items-center text-sm pt-1">
                <span className="font-bold text-[#526257]">المبلغ الإجمالي:</span>
                <span className="text-lg font-black text-rose-700">
                  {selectedReceipt.amount.toLocaleString("ar-EG")} ج.م
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-[#F5F3ED] border-t border-[#EFEEE8] flex items-center gap-2">
              <button
                onClick={() => setSelectedReceipt(null)}
                className="w-1/3 py-2.5 rounded-lg border border-[#E5E6DF] text-xs font-bold text-[#526257] hover:bg-[#EFEEE8] transition-colors cursor-pointer"
              >
                إغلاق
              </button>
              <button
                onClick={() => handleApproveExpense(selectedReceipt)}
                className="w-2/3 py-2.5 rounded-lg bg-[#183C35] hover:bg-[#202923] text-white hover:bg-[#202923] transition-colors text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>اعتماد الفاتورة الآن</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top-Up Petty Cash Modal */}
      {topUpModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#202923]/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-2xl border border-[#E5E6DF] max-w-md w-full p-6 md:p-8 text-start animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#EFEEE8]">
              <h3 className="text-base font-black text-[#202923] flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#202923]" />
                <span>صرف دفعة عهدة نقدية جديدة للمهندس</span>
              </h3>
              <button
                onClick={() => setTopUpModalOpen(false)}
                className="p-1 rounded-lg text-[#526257] hover:text-[#526257] hover:bg-[#EFEEE8]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTopUpSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-[#526257] mb-1.5">
                  اختر المهندس والموقع
                </label>
                <select
                  value={topUpEngId}
                  onChange={(e) => setTopUpEngId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E5E6DF] text-xs font-bold text-[#202923] focus:outline-none focus:ring-2 border-[#D5D8D0] focus:border-[#183C35] focus:ring-1 focus:ring-[#183C35]"
                >
                  {engineersCash.map((eng) => (
                    <option key={eng.id} value={eng.id}>
                      {eng.name} — {eng.site}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#526257] mb-1.5">
                  مبلغ الدفعة الإضافية (ج.م)
                </label>
                <input
                  type="number"
                  min="1000"
                  step="500"
                  required
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E5E6DF] text-sm font-black text-[#202923] focus:outline-none focus:ring-2 border-[#D5D8D0] focus:border-[#183C35] focus:ring-1 focus:ring-[#183C35]"
                />
              </div>

              <div className="p-3 bg-amber-50/60 rounded-lg border border-amber-200 text-xs text-amber-900">
                <p>
                  سيتم تحويل المبلغ لحساب العهدة الخاص بالمهندس وستنعكس الزيادة في شاشة الجوال
                  الميدانية فوراً.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#EFEEE8]">
                <button
                  type="button"
                  onClick={() => setTopUpModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-[#526257] hover:bg-[#EFEEE8] cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#183C35] hover:bg-[#202923] text-white hover:bg-[#202923] transition-colors text-xs font-bold shadow-sm cursor-pointer"
                >
                  تأكيد صرف العهدة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default FinancialsDashboard;
