import { currencySymbol, intlLocale, useI18n, currencyName, E } from "../i18n";
import { toAr } from "../data/seed";
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
import { cashStore, expensesStore } from "../data/stores";

function FinancialsDashboard({ actionItems, setActionItems, setSelectedItem }) {
  const { t } = useI18n();
  const [engineersCash, setEngineersCash] = cashStore.use();
  const [pendingExpenses, setPendingExpenses] = expensesStore.use();
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
        prev.filter((item) => !item.amount?.includes(amount.toLocaleString(intlLocale())))
      );
    }

    // 5. Show toast notification
    setToastMessage(t("fin.toastApproved", { desc: description, amt: `${amount.toLocaleString(intlLocale())} ${currencySymbol()}` }));
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handle Reject Expense
  const handleRejectExpense = (id) => {
    setPendingExpenses((prev) => prev.filter((e) => e.id !== id));
    if (selectedReceipt && selectedReceipt.id === id) {
      setSelectedReceipt(null);
    }
    setToastMessage(t("fin.toastRejected"));
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Reset demo expenses
  const handleResetData = () => {
    cashStore.reset();
    expensesStore.reset();
    setToastMessage(t("fin.toastReset"));
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
    setToastMessage(t("fin.toastTopUp", { amt: `${amountNum.toLocaleString(intlLocale())} ${currencySymbol()}` }));
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent pb-20 font-ibm w-full max-w-full overflow-x-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 end-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#2B3138] text-white rounded-xl shadow-xl border border-white/10 animate-in fade-in slide-in-from-bottom-3 duration-200">
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
            <h1 className="text-2xl md:text-3xl font-black text-[#16181C] tracking-tight flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#EEECE6] border border-[#E3E0D9] flex items-center justify-center text-[#16181C]">
                <Banknote className="w-5 h-5" />
              </div>
              <span>{t("fin.title")}</span>
            </h1>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EEECE6] text-[#16181C] border border-[#E3E0D9]/80">
              {t("fin.badge")}
            </span>
          </div>
          <p className="text-xs md:text-sm text-[#5D6168]">
            {t("fin.intro")}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleResetData}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-[#16181C] bg-white border border-[#E3E0D9] hover:bg-[#F6F5F1] transition-colors shadow-2xs cursor-pointer"
            title={t("fin.resetTip")}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{t("fin.reset")}</span>
          </button>
          <button
            onClick={() => setTopUpModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs md:text-sm font-medium text-white bg-[#2B3138] hover:bg-[#16181C] hover:bg-[#16181C] transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t("fin.topUpBtn")}</span>
          </button>
        </div>
      </div>

      {/* Requirement 2: 3 Glassmorphic KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Card 1: Total Given (إجمالي العهد المفتوحة) */}
        <div className="relative bg-white rounded-lg p-6 border border-[#E3E0D9] shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#5D6168]">{t("fin.openTotal")}</span>
            <div className="w-10 h-10 rounded-lg bg-[#EEECE6] text-[#16181C] flex items-center justify-center border border-[#E3E0D9]">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-black text-[#16181C] tracking-tight transition-all duration-300">
              {totalGiven.toLocaleString(intlLocale())}
            </span>
            <span className="text-xs font-bold text-[#5D6168]">{currencyName()}</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-[#5D6168]">
            <span className="font-bold text-[#16181C] bg-[#EEECE6] px-2 py-0.5 rounded-md border border-[#E3E0D9]">
              {t("fin.engineers", { n: toAr(engineersCash.length) })}
            </span>
            <span>{t("fin.onSites")}</span>
          </div>
        </div>

        {/* Card 2: Total Spent (إجمالي المنصرف المعتمد) */}
        <div className="relative bg-white rounded-lg p-6 border border-[#E3E0D9] shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#5D6168]">{t("fin.spentTotal")}</span>
            <div className="w-10 h-10 rounded-lg bg-[#EEECE6] text-[#16181C] flex items-center justify-center border border-[#E3E0D9]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-black text-[#16181C] tracking-tight transition-all duration-300">
              {totalSpent.toLocaleString(intlLocale())}
            </span>
            <span className="text-xs font-bold text-[#5D6168]">{currencyName()}</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-[#5D6168]">
            <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              {t("fin.spentRatio", { p: `${toAr(overallSpentRatio)}${t("sym.pct")}` })}
            </span>
            <span>{t("fin.approvedDocs")}</span>
          </div>
        </div>

        {/* Card 3: Remaining in Field (الرصيد المتبقي بالمواقع) */}
        <div className="relative bg-[#171B21] text-white rounded-xl p-6 border border-[#20262C] shadow-sm overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#EEECE6]">{t("fin.remaining")}</span>
            <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center border border-white/20">
              <Coins className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-black text-white tracking-tight transition-all duration-300">
              {remainingInField.toLocaleString(intlLocale())}
            </span>
            <span className="text-xs font-bold text-[#EEECE6]/80">{currencyName()}</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-[#EEECE6]">
            <span className="font-bold text-white bg-white/15 px-2 py-0.5 rounded-md border border-white/20 text-white">
              {t("fin.liquid")}
            </span>
            <span>{t("fin.readyEmergency")}</span>
          </div>
        </div>
      </div>

      {/* Requirement 3: Main Two Columns Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Right Column in RTL (7 cols): أرصدة المهندسين (Engineers Balances) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-lg border border-[#E3E0D9] shadow-[0_4px_24px_rgba(0,0,0,0.02)] p-6 md:p-8">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#EEECE6]">
              <div>
                <h2 className="text-base md:text-lg font-black text-[#16181C] flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-[#16181C]" />
                  <span>{t("fin.balancesTitle")}</span>
                </h2>
                <p className="text-xs text-[#5D6168] mt-0.5">
                  {t("fin.balancesSub")}
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#EEECE6] text-[#5D6168] border border-[#E3E0D9]">
                {t("fin.engineers", { n: toAr(engineersCash.length) })}
              </span>
            </div>

            {/* List of Engineers */}
            <div className="space-y-4">
              {engineersCash.map((eng) => {
                const available = eng.totalGiven - eng.spent;
                const ratio =
                  eng.totalGiven > 0 ? Math.min(100, Math.round((eng.spent / eng.totalGiven) * 100)) : 0;

                // Color code progress bar
                let progressColor = "bg-[#2B3138]";
                let badgeColor = "bg-[#EEECE6] text-[#16181C] border-[#E3E0D9]";
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
                    className="p-4 rounded-lg border border-[#E3E0D9] bg-white hover:bg-[#F6F5F1]/50 transition-all shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg ${eng.color} text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs`}
                        >
                          {eng.avatar}
                        </div>
                        <div>
                          <h3 className="text-sm font-extrabold text-[#16181C] leading-tight">
                            {eng.name}
                          </h3>
                          <p className="text-xs text-[#5D6168] mt-0.5 flex items-center gap-1">
                            <Building2 className="w-3 h-3 text-[#5D6168]" />
                            <span>{eng.site}</span>
                          </p>
                        </div>
                      </div>

                      {/* Available Balance Tag */}
                      <div className="text-end">
                        <span className="text-[10px] font-bold text-[#5D6168] block">
                          {t("fin.available")}
                        </span>
                        <span className="text-sm md:text-base font-black text-[#16181C] tracking-tight">
                          {available.toLocaleString(intlLocale())}{" "}
                          <span className="text-[11px] font-normal text-[#5D6168]">{currencySymbol()}</span>
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar Container */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[11px] text-[#5D6168]">
                          {t("fin.spentLabel")}{" "}
                          <strong className="text-[#16181C] font-bold">
                            {eng.spent.toLocaleString(intlLocale())} {currencySymbol()}
                          </strong>{" "}
                          {t("fin.outOf", { amt: `${eng.totalGiven.toLocaleString(intlLocale())} ${currencySymbol()}` })}
                        </span>
                        <span className="text-xs font-bold text-[#16181C] tracking-wide">
                          {t("fin.consumed", { p: `${toAr(ratio)}${t("sym.pct")}` })}
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
            <div className="mt-5 p-3 rounded-lg bg-[#F6F5F1] border border-[#E3E0D9] flex items-center gap-2.5 text-xs text-[#5D6168]">
              <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                {t("fin.liveNote")}
              </span>
            </div>
          </div>
        </div>

        {/* Left Column in RTL (5 cols): فواتير بانتظار الاعتماد (Pending Expenses) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-lg border border-[#E3E0D9] shadow-[0_4px_24px_rgba(0,0,0,0.02)] p-6 md:p-8">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#EEECE6]">
              <div>
                <h2 className="text-base md:text-lg font-black text-[#16181C] flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-amber-700" />
                  <span>{t("fin.pendingTitle")}</span>
                </h2>
                <p className="text-xs text-[#5D6168] mt-0.5">
                  {t("fin.pendingSub")}
                </p>
              </div>
              <span className="text-xs font-black px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                {t("fin.pendingCount", { n: toAr(pendingExpenses.length) })}
              </span>
            </div>

            {/* Expenses List */}
            <div className="space-y-3.5">
              {pendingExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="p-4 rounded-lg border border-[#E3E0D9] hover:border-[#D9480F] bg-white shadow-2xs transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#EEECE6] text-[#5D6168] border border-[#E3E0D9] mb-1.5">
                        {E(expense.category)}
                      </span>
                      <h4 className="text-xs md:text-sm font-extrabold text-[#16181C] leading-snug">
                        {expense.description}
                      </h4>
                      <p className="text-[11px] text-[#5D6168] mt-1 flex items-center gap-1.5">
                        <span className="font-semibold text-[#16181C]">{expense.engName}</span>
                        <span>•</span>
                        <span className="text-[#5D6168]">{expense.date}</span>
                      </p>
                    </div>

                    {/* Amount */}
                    <div className="text-end shrink-0">
                      <span className="text-sm md:text-base font-black text-rose-700 block">
                        {expense.amount.toLocaleString(intlLocale())}
                      </span>
                      <span className="text-[10px] font-bold text-[#5D6168]">{currencyName()}</span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#EEECE6] mt-3">
                    {/* View Receipt Button */}
                    <button
                      onClick={() => setSelectedReceipt(expense)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-[#5D6168] hover:text-[#16181C] hover:bg-[#EEECE6] transition-colors cursor-pointer"
                      title={t("fin.previewTip")}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{t("fin.preview")}</span>
                    </button>

                    {/* Action Buttons: Reject & Approve */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleRejectExpense(expense.id)}
                        className="p-1.5 rounded-lg text-[#5D6168] hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                        title={t("fin.rejectTip")}
                      >
                        <X className="w-4 h-4" />
                      </button>

                      {/* The "اعتماد" (Approve) Button */}
                      <button
                        onClick={() => handleApproveExpense(expense)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2B3138] hover:bg-[#16181C] text-white hover:bg-[#16181C] transition-colors font-bold text-xs shadow-sm transition-all cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{t("fin.approveBtn")}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Empty state when all expenses approved */}
              {pendingExpenses.length === 0 && (
                <div className="py-12 px-4 text-center rounded-lg bg-[#F6F5F1] border border-[#E3E0D9]">
                  <div className="w-12 h-12 rounded-lg bg-[#EEECE6] text-[#16181C] flex items-center justify-center mx-auto mb-3 border border-[#E3E0D9]">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-extrabold text-[#16181C] mb-1">
                    {t("fin.allDone")}
                  </h4>
                  <p className="text-xs text-[#5D6168] max-w-xs mx-auto mb-4">
                    {t("fin.allDoneSub")}
                  </p>
                  <button
                    onClick={handleResetData}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white border border-[#E3E0D9] text-xs font-bold text-[#16181C] hover:bg-[#F6F5F1] transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>{t("fin.retry")}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* View Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-[#16181C]/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-2xl border border-[#E3E0D9] max-w-md w-full overflow-hidden text-start animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-[#EEECE6] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-[#16181C]">
                  {t("fin.receiptTitle", { no: selectedReceipt.receiptNumber })}
                </h3>
                <p className="text-[11px] text-[#5D6168]">{selectedReceipt.engName}</p>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="p-1.5 rounded-lg text-[#5D6168] hover:text-[#5D6168] hover:bg-[#EEECE6] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Receipt Image Mock */}
            <div className="relative bg-[#EEECE6] h-56 overflow-hidden flex items-center justify-center">
              {selectedReceipt.invoiceImg ? (
                <img
                  src={selectedReceipt.invoiceImg}
                  alt={t("fin.receiptAlt")}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Receipt className="w-12 h-12 text-[#5D6168]/40" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#16181C]/70 via-transparent to-transparent flex items-end p-4">
                <span className="text-white text-xs font-bold flex items-center gap-1.5 bg-[#16181C]/50 backdrop-blur-xs px-2.5 py-1 rounded-lg">
                  <Receipt className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t("fin.einvoice")}</span>
                </span>
              </div>
            </div>

            {/* Details Body */}
            <div className="p-5 space-y-3">
              <div className="flex justify-between items-center text-xs pb-2 border-b border-[#EEECE6]">
                <span className="text-[#5D6168]">{t("fin.desc")}</span>
                <span className="font-bold text-[#16181C]">{selectedReceipt.description}</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-2 border-b border-[#EEECE6]">
                <span className="text-[#5D6168]">{t("fin.category")}</span>
                <span className="font-bold text-[#16181C]">{E(selectedReceipt.category)}</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-2 border-b border-[#EEECE6]">
                <span className="text-[#5D6168]">{t("fin.date")}</span>
                <span className="font-bold text-[#16181C]">{selectedReceipt.date}</span>
              </div>
              <div className="flex justify-between items-center text-sm pt-1">
                <span className="font-bold text-[#5D6168]">{t("fin.totalAmt")}</span>
                <span className="text-lg font-black text-rose-700">
                  {selectedReceipt.amount.toLocaleString(intlLocale())} {currencySymbol()}
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-[#F6F5F1] border-t border-[#EEECE6] flex items-center gap-2">
              <button
                onClick={() => setSelectedReceipt(null)}
                className="w-1/3 py-2.5 rounded-lg border border-[#E3E0D9] text-xs font-bold text-[#5D6168] hover:bg-[#EEECE6] transition-colors cursor-pointer"
              >
                {t("fin.close")}
              </button>
              <button
                onClick={() => handleApproveExpense(selectedReceipt)}
                className="w-2/3 py-2.5 rounded-lg bg-[#2B3138] hover:bg-[#16181C] text-white hover:bg-[#16181C] transition-colors text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>{t("fin.approveNow")}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top-Up Petty Cash Modal */}
      {topUpModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#16181C]/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-2xl border border-[#E3E0D9] max-w-md w-full p-6 md:p-8 text-start animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#EEECE6]">
              <h3 className="text-base font-black text-[#16181C] flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#16181C]" />
                <span>{t("fin.topUpTitle")}</span>
              </h3>
              <button
                onClick={() => setTopUpModalOpen(false)}
                className="p-1 rounded-lg text-[#5D6168] hover:text-[#5D6168] hover:bg-[#EEECE6]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTopUpSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-[#5D6168] mb-1.5">
                  {t("fin.pickEng")}
                </label>
                <select
                  value={topUpEngId}
                  onChange={(e) => setTopUpEngId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E3E0D9] text-xs font-bold text-[#16181C] focus:outline-none focus:ring-2 border-[#D1CDC5] focus:border-[#2B3138] focus:ring-1 focus:ring-[#2B3138]"
                >
                  {engineersCash.map((eng) => (
                    <option key={eng.id} value={eng.id}>
                      {eng.name} — {eng.site}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5D6168] mb-1.5">
                  {t("fin.topUpAmt", { cur: currencySymbol() })}
                </label>
                <input
                  type="number"
                  min="1000"
                  step="500"
                  required
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E3E0D9] text-sm font-black text-[#16181C] focus:outline-none focus:ring-2 border-[#D1CDC5] focus:border-[#2B3138] focus:ring-1 focus:ring-[#2B3138]"
                />
              </div>

              <div className="p-3 bg-amber-50/60 rounded-lg border border-amber-200 text-xs text-amber-900">
                <p>
                  {t("fin.topUpNote")}
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#EEECE6]">
                <button
                  type="button"
                  onClick={() => setTopUpModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-[#5D6168] hover:bg-[#EEECE6] cursor-pointer"
                >
                  {t("fin.cancel")}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#2B3138] hover:bg-[#16181C] text-white hover:bg-[#16181C] transition-colors text-xs font-bold shadow-sm cursor-pointer"
                >
                  {t("fin.confirmTopUp")}
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
