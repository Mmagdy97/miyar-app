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

const INITIAL_INVOICES = [
  {
    id: 1,
    title: "الدفعة الأولى: التعاقد واعتماد المخططات 3D",
    milestone: "مقدم التعاقد وبدء أعمال التصميم",
    amount: 1350000,
    dueDate: "٢٠٢٦/٠٩/٠١",
    paidDate: "٢٠٢٦/٠٩/٠٣",
    status: "مدفوع",
    receiptNo: "INV-2026-001",
  },
  {
    id: 2,
    title: "الدفعة الثانية: أعمال التأسيس والمرافق (MEP)",
    milestone: "استلام شبكات السباكة والكهرباء والعزل",
    amount: 1350000,
    dueDate: "٢٠٢٦/١٠/٠١",
    paidDate: "٢٠٢٦/١٠/٠٥",
    status: "مدفوع",
    receiptNo: "INV-2026-002",
  },
  {
    id: 3,
    title: "الدفعة الثالثة: توريد وتركيب الرخام والجبسوم بورد",
    milestone: "مرحلة أعمال التشطيبات المعمارية الكبرى",
    amount: 1350000,
    dueDate: "٢٠٢٦/١١/١٥",
    paidDate: null,
    status: "مستحق",
    receiptNo: "INV-2026-003",
  },
  {
    id: 4,
    title: "الدفعة الرابعة: الدهانات النهائية والأبواب والتجهيزات",
    milestone: "التشطيبات الدقيقة والألوان والإنارة",
    amount: 810000,
    dueDate: "٢٠٢٦/١٢/١٠",
    paidDate: null,
    status: "مستحق",
    receiptNo: "INV-2026-004",
  },
  {
    id: 5,
    title: "الدفعة الخامسة: التسليم النهائي وشهادة الضمان",
    milestone: "المعاينة الختامية والتسليم المفتاحي",
    amount: 540000,
    dueDate: "٢٠٢٦/١٢/٣٠",
    paidDate: null,
    status: "مستحق",
    receiptNo: "INV-2026-005",
  },
];

function ClientInvoices() {
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
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
                paidDate: new Date().toLocaleDateString("ar-EG"),
              }
            : inv
        )
      );

      setIsProcessing(false);
      setPayingInvoice(null);
      setToastMessage(
        `تمت معالجة الدفع بنجاح عبر Stripe بقيمة ${payingInvoice.amount.toLocaleString(
          "ar-EG"
        )} ج.م ✓`
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
    <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent pb-24 font-ibm" dir="rtl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 left-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#183C35] text-white rounded-xl shadow-xl border border-white/10 animate-in fade-in slide-in-from-bottom-3 duration-200">
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
              <h1 className="text-2xl md:text-3xl font-black text-[#202923] tracking-tight flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#EFEEE8] border border-[#E5E6DF] flex items-center justify-center text-[#202923]">
                  <CreditCard className="w-5 h-5" />
                </div>
                <span>الدفعات المالية والفواتير</span>
              </h1>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EFEEE8] text-[#202923] border border-[#E5E6DF]/80">
                مشروع: فيلا الياسمين
              </span>
            </div>
            <p className="text-xs md:text-sm text-[#526257]">
              جدول الدفعات والمستحقات التعاقدية الشفافة والإيصالات الضريبية المعتمدة.
            </p>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>بوابة دفع آمنة مشفرة (Stripe 256-bit)</span>
          </span>
        </div>

        {/* Financial KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-6 border border-[#E5E6DF] shadow-sm">
            <span className="text-xs font-bold text-[#EFEEE8]/80 block mb-1">إجمالي قيمة التعاقد</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-[#202923] tracking-tight">
                {totalContract.toLocaleString("ar-EG")}
              </span>
              <span className="text-xs font-bold text-[#EFEEE8]/80">ج.م</span>
            </div>
            <span className="text-[11px] text-[#526257] mt-2 block">
              شامل التوريد والتنفيذ والضمان
            </span>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[#E5E6DF] shadow-sm">
            <span className="text-xs font-bold text-[#EFEEE8]/80 block mb-1">إجمالي المدفوع حتى الآن</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-emerald-600 tracking-tight">
                {totalPaid.toLocaleString("ar-EG")}
              </span>
              <span className="text-xs font-bold text-[#EFEEE8]/80">ج.م</span>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-2">
              %{Math.round((totalPaid / totalContract) * 100)} مسدد بالكامل
            </span>
          </div>

          <div className="bg-[#183C35] text-white rounded-xl p-6 border border-[#14322c] shadow-sm">
            <span className="text-xs font-bold text-[#EFEEE8] block mb-1">المتبقي للاستحقاق</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white tracking-tight">
                {totalDue.toLocaleString("ar-EG")}
              </span>
              <span className="text-xs font-bold text-[#EFEEE8]/80">ج.م</span>
            </div>
            <span className="text-[11px] text-[#EFEEE8] mt-2 block">
              مقسم على الدفعات المتبقية وفق جدول التسليم
            </span>
          </div>
        </div>

        {/* Invoices Table Card */}
        <div className="bg-white rounded-lg border border-[#E5E6DF] shadow-sm overflow-hidden overflow-x-auto w-full">
          <div className="p-5 border-b border-[#EFEEE8] flex items-center justify-between">
            <h3 className="text-base font-extrabold text-[#202923]">
              جدول الدفعات والمستحقات المرحلية
            </h3>
            <span className="text-xs text-[#526257] font-mono">٥ دفعات تعاقدية</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-[#F5F3ED]/90 text-[#526257] text-xs font-bold border-b border-[#E5E6DF]">
                  <th className="py-4 px-5 min-w-[240px]">الدفعة والمرحلة المستهدفة</th>
                  <th className="py-4 px-4 w-40 text-center">المبلغ المستحق</th>
                  <th className="py-4 px-4 w-36 text-center">تاريخ الاستحقاق</th>
                  <th className="py-4 px-4 w-32 text-center">الحالة</th>
                  <th className="py-4 px-5 w-44 text-center">الإجراء المالي</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFEEE8] text-xs md:text-sm">
                {invoices.map((inv) => {
                  const isPaid = inv.status === "مدفوع";

                  return (
                    <tr
                      key={inv.id}
                      className="hover:bg-[#EFEEE8]/20 transition-colors duration-150"
                    >
                      {/* Milestone Title */}
                      <td className="py-4 px-5">
                        <h4 className="font-extrabold text-[#202923] leading-snug">
                          {inv.title}
                        </h4>
                        <span className="text-[11px] text-[#526257] mt-0.5 block">
                          {inv.milestone}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-4 text-center">
                        <span className="font-mono font-black text-[#202923] text-sm md:text-base">
                          {inv.amount.toLocaleString("ar-EG")}
                        </span>
                        <span className="text-[10px] text-[#526257] block font-sans">ج.م</span>
                      </td>

                      {/* Due Date */}
                      <td className="py-4 px-4 text-center text-xs text-[#526257] font-mono">
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
                          <span>{inv.status}</span>
                        </span>
                      </td>

                      {/* Action Button: Download Receipt or Pay Now with Stripe */}
                      <td className="py-4 px-5 text-center">
                        {isPaid ? (
                          <button
                            onClick={() => handleDownloadReceipt(inv.receiptNo)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E6DF] bg-white hover:bg-[#F5F3ED] text-[#526257] text-xs font-bold transition-all shadow-2xs cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5 text-[#526257]" />
                            <span>تحميل الإيصال</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => setPayingInvoice(inv)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#183C35] hover:bg-[#202923] text-white hover:bg-[#202923] transition-colors text-xs font-bold shadow-sm transition-all cursor-pointer"
                          >
                            <Lock className="w-3.5 h-3.5" />
                            <span>ادفع الآن عبر Stripe</span>
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
        <div className="fixed inset-0 z-50 bg-[#202923]/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-2xl border border-[#E5E6DF] border border-[#E5E6DF] max-w-md w-full p-6 md:p-8 text-right animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#EFEEE8]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#EFEEE8] text-[#202923] flex items-center justify-center font-bold">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#202923]">سداد الدفعة عبر Stripe</h3>
                  <p className="text-[10px] text-[#526257]">بوابة دفع مشفرة وآمنة</p>
                </div>
              </div>
              <button
                onClick={() => setPayingInvoice(null)}
                className="p-1 rounded-lg text-[#526257] hover:text-[#526257] hover:bg-[#EFEEE8]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4 p-4 bg-[#F5F3ED] rounded-lg border border-[#E5E6DF] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#526257]">الدفعة المستحقة:</span>
                <span className="font-bold text-[#202923]">{payingInvoice.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#526257]">المبلغ المطلوب:</span>
                <span className="font-black text-[#202923] text-base">
                  {payingInvoice.amount.toLocaleString("ar-EG")} ج.م
                </span>
              </div>
            </div>

            <form onSubmit={handleStripePaySubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#526257] mb-1">
                  رقم البطاقة الائتمانية (Visa / Mastercard)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    defaultValue="٤٢٤٢ •••• •••• ٤٢٤٢"
                    className="w-full pl-3 pr-10 py-2 rounded-lg border border-[#E5E6DF] text-xs font-mono font-bold text-[#202923] focus:outline-none focus:ring-2 focus:ring-[#183C35]/10 focus:border-[#183C35]"
                  />
                  <CreditCard className="w-4 h-4 text-[#526257] absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#526257] mb-1">تاريخ الانتهاء</label>
                  <input
                    type="text"
                    required
                    defaultValue="١٢/٢٨"
                    className="w-full px-3 py-2 rounded-lg border border-[#E5E6DF] text-xs font-mono text-center text-[#202923]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#526257] mb-1">رمز الأمان (CVC)</label>
                  <input
                    type="text"
                    required
                    defaultValue="٨٨٨"
                    className="w-full px-3 py-2 rounded-lg border border-[#E5E6DF] text-xs font-mono text-center text-[#202923]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-[#EFEEE8]">
                <button
                  type="button"
                  onClick={() => setPayingInvoice(null)}
                  className="w-1/3 py-2.5 rounded-lg text-xs font-bold text-[#526257] hover:bg-[#EFEEE8]"
                >
                  إلغاء
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
                      : `تأكيد دفع ${payingInvoice.amount.toLocaleString("ar-EG")} ج.م`}
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
