import {
  FileText,
  Users,
  Camera,
  Check,
} from "lucide-react";

function ActionItemModal({ selectedItem, onClose, onApprove }) {
  if (!selectedItem) return null;

  return (
    <div
      className="fixed inset-0 bg-[#202923]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        dir="rtl"
        className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-[#E5E6DF] text-start animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E5E6DF] bg-[#F5F3ED]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white border border-[#E5E6DF] text-[#183C35] flex items-center justify-center font-bold shadow-2xs">
              <FileText className="w-4 h-4 text-[#183C35]" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#202923] leading-tight tracking-tight">
                {selectedItem.title}
              </h3>
              <p className="text-[11px] text-[#526257] font-medium mt-0.5">
                {selectedItem.category || "تقرير موقع"} • {selectedItem.project || "فيلا الياسمين - التجمع"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-[#526257] hover:text-[#202923] hover:bg-white flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
            title="إغلاق"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Submitter & Time Info */}
          <div className="flex items-center justify-between p-3.5 rounded-lg bg-[#F5F3ED] border border-[#E5E6DF] text-xs">
            <div>
              <span className="text-[#526257] block text-[10px] font-semibold">مقدم الطلب / المهندس</span>
              <span className="font-bold text-[#202923]">
                {selectedItem.user || selectedItem.submitter || "م. محمد (الموقع)"}
              </span>
            </div>
            <div className="text-end">
              <span className="text-[#526257] block text-[10px] font-semibold">توقيت الإرسال</span>
              <span className="font-bold text-[#202923] font-mono">
                {selectedItem.timestamp || selectedItem.time || "الآن"}
              </span>
            </div>
          </div>

          {/* Report Summary / Notes */}
          <div>
            <h4 className="text-xs font-bold text-[#202923] mb-1.5">
              تفاصيل الأعمال المنجزة والتقرير الفني:
            </h4>
            <div className="p-3.5 rounded-lg bg-[#F5F3ED] border border-[#E5E6DF] text-xs sm:text-sm text-[#202923] leading-relaxed font-medium">
              {selectedItem.subtitle ||
                "تم استكمال تمديدات شبكة الصرف والتغذية بالبدروم بنجاح، وتشوين شحنة أسمنت العزل المقاوم، وفحص ضغط الشبكة على ٨ بار لمدة ساعتين بدون أي تسريب مع مطابقة المنسوب المعماري."}
            </div>
          </div>

          {/* Weather Section */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg border border-[#E5E6DF] bg-white">
              <span className="text-[11px] font-bold text-[#526257] block mb-1">حالة الطقس الميدانية</span>
              <span className="text-xs font-bold text-[#202923] flex items-center gap-1.5">
                ☀️ مشمس ومستقر (٢٦° م)
              </span>
            </div>
            <div className="p-3 rounded-lg border border-[#E5E6DF] bg-white">
              <span className="text-[11px] font-bold text-[#526257] block mb-1">المعوقات والملاحظات</span>
              <span className="text-xs font-bold text-[#202923] flex items-center gap-1.5">
                🟢 لا توجد أي عوائق تشغيلية
              </span>
            </div>
          </div>

          {/* Labor Section */}
          <div className="p-3.5 rounded-lg border border-[#E5E6DF] bg-white space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#202923] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#202923]" />
                العمالة المتواجدة اليوم بالموقع:
              </span>
              <span className="text-xs font-bold text-[#183C35] bg-[#5D8C70]/15 px-2 py-0.5 rounded-md border border-[#5D8C70]/30">
                إجمالي ١١ عاملاً
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-[#526257] font-semibold">
              <span className="p-2 rounded-lg bg-[#F5F3ED] border border-[#E5E6DF] flex items-center justify-between">
                <span>سباك شبكات تغذية</span>
                <strong className="text-[#202923] font-mono">٢</strong>
              </span>
              <span className="p-2 rounded-lg bg-[#F5F3ED] border border-[#E5E6DF] flex items-center justify-between">
                <span>عمال تشوين ونظافة</span>
                <strong className="text-[#202923] font-mono">٣</strong>
              </span>
              <span className="p-2 rounded-lg bg-[#F5F3ED] border border-[#E5E6DF] flex items-center justify-between">
                <span>مبلط رخام وسيراميك</span>
                <strong className="text-[#202923] font-mono">٤</strong>
              </span>
              <span className="p-2 rounded-lg bg-[#F5F3ED] border border-[#E5E6DF] flex items-center justify-between">
                <span>كهربائي سحب أسلاك</span>
                <strong className="text-[#202923] font-mono">٢</strong>
              </span>
            </div>
          </div>

          {/* Visual Documentation Mock Grid */}
          <div>
            <span className="text-xs font-bold text-[#202923] mb-2 block flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-[#202923]" />
              التوثيق البصري المرفق من الموقع (٣ صور معتمدة):
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              <div className="h-24 rounded-lg bg-[#F5F3ED] border border-[#E5E6DF] flex flex-col items-center justify-center text-[#526257] hover:bg-white transition-colors p-2 text-center group cursor-pointer">
                <Camera className="w-5 h-5 text-[#526257] mb-1" />
                <span className="text-[10px] font-bold text-[#202923] truncate w-full">تمديدات الصرف</span>
                <span className="text-[9px] text-[#526257]">١٠:١٥ ص</span>
              </div>
              <div className="h-24 rounded-lg bg-[#F5F3ED] border border-[#E5E6DF] flex flex-col items-center justify-center text-[#526257] hover:bg-white transition-colors p-2 text-center group cursor-pointer">
                <Camera className="w-5 h-5 text-[#526257] mb-1" />
                <span className="text-[10px] font-bold text-[#202923] truncate w-full">تشوين الأسمنت</span>
                <span className="text-[9px] text-[#526257]">١١:٢٥ ص</span>
              </div>
              <div className="h-24 rounded-lg bg-[#F5F3ED] border border-[#E5E6DF] flex flex-col items-center justify-center text-[#526257] hover:bg-white transition-colors p-2 text-center group cursor-pointer">
                <Camera className="w-5 h-5 text-[#526257] mb-1" />
                <span className="text-[10px] font-bold text-[#202923] truncate w-full">اختبار الضغط</span>
                <span className="text-[9px] text-[#526257]">١٢:٠٠ م</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="p-4 bg-[#F5F3ED] border-t border-[#E5E6DF] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-bold text-[#526257] bg-white border border-[#E5E6DF] hover:bg-[#EFEEE8] transition-colors cursor-pointer shadow-2xs"
          >
            إغلاق
          </button>
          <button
            type="button"
            onClick={onApprove}
            className="px-5 py-2 rounded-lg text-xs font-medium text-white bg-[#183C35] hover:bg-[#202923] transition-all shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
          >
            <Check className="w-3.5 h-3.5 text-white" />
            اعتماد التقرير
          </button>
        </div>
      </div>
    </div>
  );
}

export default ActionItemModal;
