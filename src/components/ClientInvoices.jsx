import { currencySymbol, intlLocale, E } from "../i18n";
import { tr_ as T } from "../i18n";
import { invoicesStore } from "../data/stores";
import { useState, useMemo } from "react";
import {
  CreditCard,
  CheckCircle2,
  Clock,
  Download,
  AlertCircle,
  Building2,
  Sparkles,
  ShieldCheck,
  Check,
  X,
  Lock,
  ArrowUpRight,
} from "lucide-react";
import { CLIENT_INVOICES } from "../data/seed";


function ClientInvoices() {
  const [invoices, setInvoices] = invoicesStore.use();
  const [payingInvoice, setPayingInvoice] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Financial Stats
  const { totalContract, totalPaid, totalDue } = useMemo(() => {
    const total = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const paid = invoices
      .filter((inv) => inv.status === "مدفوع")
      .reduce((sum, inv) => sum + inv.amount, 0);
    const due = total - paid;
    return { totalContract: total, totalPaid: paid, totalDue: due };
  }, [invoices]);

  // Handle Mock Stripe Payment
  const handleStripePaySubmit = (e) => {
    e.preventDefault();
    if (!payingInvoice) return;

    setIsProcessing(true);

    setTimeout(() => {
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === payingInvoice.id
            ? {
                ...inv,
                status: "مدفوع",
                paidDate: new Date().toLocaleDateString(intlLocale()),
              }
            : inv
        )
      );

      setIsProcessing(false);
      setPayingInvoice(null);
      setToastMessage(
        `تمت معالجة الدفع بنجاح عبر Stripe بقيمة ${payingInvoice.amount.toLocaleString(
          intlLocale()
        )} ${currencySymbol()} ✓`
      );
      setTimeout(() => setToastMessage(null), 3500);
    }, 1200);
  };

  // Mock Receipt Download
  const handleDownloadReceipt = (receiptNo) => {
    setToastMessage(`جاري تنزيل الإيصال الضريبي المعتمد: ${receiptNo}.pdf`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent pb-24 font-ibm w-full max-w-full overflow-x-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 end-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#2B3138] text-white rounded-xl shadow-xl border border-white/10 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold leading-relaxed">{toastMessage}</p>
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap mb-1">
              <h1 className="text-2xl md:text-3xl font-black text-[#1E2429] tracking-tight flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#ECEEF0] border border-[#DDE1E5] flex items-center justify-center text-[#1E2429]">
                  <CreditCard className="w-5 h-5" />
                </div>
                <span>{T("cli.1")}</span>
              </h1>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#ECEEF0] text-[#1E2429] border border-[#DDE1E5]/80">
                {T("cli.124")}
              </span>
            </div>
            <p className="text-xs md:text-sm text-[#5A646E]">
              {T("cli.3")}
            </p>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{T("cli.4")}</span>
          </span>
        </div>

        {/* Financial KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-6 border border-[#DDE1E5] shadow-sm">
            <span className="text-xs font-bold text-[#ECEEF0]/80 block mb-1">{T("cli.5")}</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-[#1E2429] tracking-tight">
                {totalContract.toLocaleString(intlLocale())}
              </span>
              <span className="text-xs font-bold text-[#ECEEF0]/80">{currencySymbol()}</span>
            </div>
            <span className="text-[11px] text-[#5A646E] mt-2 block">
              {T("cli.6")}
            </span>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[#DDE1E5] shadow-sm">
            <span className="text-xs font-bold text-[#ECEEF0]/80 block mb-1">{T("cli.74")}</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-emerald-600 tracking-tight">
                {totalPaid.toLocaleString(intlLocale())}
              </span>
              <span className="text-xs font-bold text-[#ECEEF0]/80">{currencySymbol()}</span>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-2">
              {T("cli.8", { v0: Math.round((totalPaid / totalContract) * 100) })}
            </span>
          </div>

          <div className="bg-[#171B21] text-white rounded-xl p-6 border border-[#20262C] shadow-sm">
            <span className="text-xs font-bold text-[#ECEEF0] block mb-1">{T("cli.9")}</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white tracking-tight">
                {totalDue.toLocaleString(intlLocale())}
              </span>
              <span className="text-xs font-bold text-[#ECEEF0]/80">{currencySymbol()}</span>
            </div>
            <span className="text-[11px] text-[#ECEEF0] mt-2 block">
              {T("cli.10")}
            </span>
          </div>
        </div>

        {/* Invoices Table Card */}
        <div className="bg-white rounded-lg border border-[#DDE1E5] shadow-sm overflow-hidden overflow-x-auto w-full">
          <div className="p-5 border-b border-[#ECEEF0] flex items-center justify-between">
            <h3 className="text-base font-extrabold text-[#1E2429]">
              {T("cli.11")}
            </h3>
            <span className="text-xs text-[#5A646E] font-mono">{T("cli.12")}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse">
              <thead>
                <tr className="bg-[#F3F4F6]/90 text-[#5A646E] text-xs font-bold border-b border-[#DDE1E5]">
                  <th className="py-4 px-5 min-w-[240px]">{T("cli.13")}</th>
                  <th className="py-4 px-4 w-40 text-center">{T("cli.14")}</th>
                  <th className="py-4 px-4 w-36 text-center">{T("cli.15")}</th>
                  <th className="py-4 px-4 w-32 text-center">{T("cli.16")}</th>
                  <th className="py-4 px-5 w-44 text-center">{T("cli.17")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECEEF0] text-xs md:text-sm">
                {invoices.map((inv) => {
                  const isPaid = inv.status === "مدفوع";

                  return (
                    <tr
                      key={inv.id}
                      className="hover:bg-[#ECEEF0]/20 transition-colors duration-150"
                    >
                      {/* Milestone Title */}
                      <td className="py-4 px-5">
                        <h4 className="font-extrabold text-[#1E2429] leading-snug">
                          {inv.title}
                        </h4>
                        <span className="text-[11px] text-[#5A646E] mt-0.5 block">
                          {inv.milestone}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-4 text-center">
                        <span className="font-mono font-black text-[#1E2429] text-sm md:text-base">
                          {inv.amount.toLocaleString(intlLocale())}
                        </span>
                        <span className="text-[10px] text-[#5A646E] block font-sans">{currencySymbol()}</span>
                      </td>

                      {/* Due Date */}
                      <td className="py-4 px-4 text-center text-xs text-[#5A646E] font-mono">
                        {inv.dueDate}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                            isPaid
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : "bg-amber-50 text-amber-800 border-amber-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isPaid ? "bg-emerald-600" : "bg-amber-500 animate-pulse"
                            }`}
                          />
                          <span>{E(inv.status)}</span>
                        </span>
                      </td>

                      {/* Action Button: Download Receipt or Pay Now with Stripe */}
                      <td className="py-4 px-5 text-center">
                        {isPaid ? (
                          <button
                            onClick={() => handleDownloadReceipt(inv.receiptNo)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DDE1E5] bg-white hover:bg-[#F3F4F6] text-[#5A646E] text-xs font-bold transition-all shadow-2xs cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5 text-[#5A646E]" />
                            <span>{T("cli.18")}</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => setPayingInvoice(inv)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#2B3138] hover:bg-[#1E2429] text-white hover:bg-[#1E2429] transition-colors text-xs font-bold shadow-sm transition-all cursor-pointer"
                          >
                            <Lock className="w-3.5 h-3.5" />
                            <span>{T("cli.19")}</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Stripe Payment Modal */}
      {payingInvoice && (
        <div className="fixed inset-0 z-50 bg-[#1E2429]/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-2xl border border-[#DDE1E5] border border-[#DDE1E5] max-w-md w-full p-6 md:p-8 text-start animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#ECEEF0]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#ECEEF0] text-[#1E2429] flex items-center justify-center font-bold">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#1E2429]">{T("cli.20")}</h3>
                  <p className="text-[10px] text-[#5A646E]">{T("cli.21")}</p>
                </div>
              </div>
              <button
                onClick={() => setPayingInvoice(null)}
                className="p-1 rounded-lg text-[#5A646E] hover:text-[#5A646E] hover:bg-[#ECEEF0]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4 p-4 bg-[#F3F4F6] rounded-lg border border-[#DDE1E5] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#5A646E]">{T("cli.22")}</span>
                <span className="font-bold text-[#1E2429]">{payingInvoice.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5A646E]">{T("cli.23")}</span>
                <span className="font-black text-[#1E2429] text-base">
                  {payingInvoice.amount.toLocaleString(intlLocale())} {currencySymbol()}
                </span>
              </div>
            </div>

            <form onSubmit={handleStripePaySubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#5A646E] mb-1">
                  {T("cli.24")}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    defaultValue="٤٢٤٢ •••• •••• ٤٢٤٢"
                    className="w-full pe-3 ps-10 py-2 rounded-lg border border-[#DDE1E5] text-xs font-mono font-bold text-[#1E2429] focus:outline-none focus:ring-2 focus:ring-[#2B3138]/10 focus:border-[#2B3138]"
                  />
                  <CreditCard className="w-4 h-4 text-[#5A646E] absolute start-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#5A646E] mb-1">{T("cli.25")}</label>
                  <input
                    type="text"
                    required
                    defaultValue="١٢/٢٨"
                    className="w-full px-3 py-2 rounded-lg border border-[#DDE1E5] text-xs font-mono text-center text-[#1E2429]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5A646E] mb-1">{T("cli.26")}</label>
                  <input
                    type="text"
                    required
                    defaultValue="٨٨٨"
                    className="w-full px-3 py-2 rounded-lg border border-[#DDE1E5] text-xs font-mono text-center text-[#1E2429]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-[#ECEEF0]">
                <button
                  type="button"
                  onClick={() => setPayingInvoice(null)}
                  className="w-1/3 py-2.5 rounded-lg text-xs font-bold text-[#5A646E] hover:bg-[#ECEEF0]"
                >
                  {T("cli.96")}
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-2/3 py-2.5 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>
                    {isProcessing
                      ? "جاري التأكيد مع البنك..."
                      : `تأكيد دفع ${payingInvoice.amount.toLocaleString(intlLocale())} ${currencySymbol()}`}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default ClientInvoices;
