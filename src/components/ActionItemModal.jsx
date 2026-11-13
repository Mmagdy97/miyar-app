import { tr_ as T } from "../i18n";
import { D } from "../data/dataI18n";
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
      className="fixed inset-0 bg-[#1F2421]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
       
        className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-[#E6DFD0] text-start animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E6DFD0] bg-[#F7F3EA]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white border border-[#E6DFD0] text-[#1F2421] flex items-center justify-center font-bold shadow-2xs">
              <FileText className="w-4 h-4 text-[#1F2421]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#1F2421] leading-tight tracking-tight">
                {D(selectedItem.title)}
              </h3>
              <p className="text-[11px] text-[#555B53] font-medium mt-0.5">
                {D(selectedItem.category || "تقرير موقع")} • {D(selectedItem.project || "فيلا الياسمين - التجمع")}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-[#555B53] hover:text-[#1F2421] hover:bg-white flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
            title={T("ld.155")}
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Submitter & Time Info */}
          <div className="flex items-center justify-between p-3.5 rounded-lg bg-[#F7F3EA] border border-[#E6DFD0] text-xs">
            <div>
              <span className="text-[#555B53] block text-[10px] font-semibold">{T("ld.156")}</span>
              <span className="font-bold text-[#1F2421]">
                {D(selectedItem.user || selectedItem.submitter || "م. محمد (الموقع)")}
              </span>
            </div>
            <div className="text-end">
              <span className="text-[#555B53] block text-[10px] font-semibold">{T("ld.157")}</span>
              <span className="font-bold text-[#1F2421] font-mono">
                {D(selectedItem.timestamp || selectedItem.time || "الآن")}
              </span>
            </div>
          </div>

          {/* Report Summary / Notes */}
          <div>
            <h4 className="text-xs font-bold text-[#1F2421] mb-1.5">
              {T("ld.158")}
            </h4>
            <div className="p-3.5 rounded-lg bg-[#F7F3EA] border border-[#E6DFD0] text-xs sm:text-sm text-[#1F2421] leading-relaxed font-medium">
              {D(selectedItem.subtitle) ||
                D("تم استكمال تمديدات شبكة الصرف والتغذية بالبدروم بنجاح، وتشوين شحنة أسمنت العزل المقاوم، وفحص ضغط الشبكة على ٨ بار لمدة ساعتين بدون أي تسريب مع مطابقة المنسوب المعماري.")}
            </div>
          </div>

          {/* Weather Section */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg border border-[#E6DFD0] bg-white">
              <span className="text-[11px] font-bold text-[#555B53] block mb-1">{T("ld.159")}</span>
              <span className="text-xs font-bold text-[#1F2421] flex items-center gap-1.5">
                ☀️ مشمس ومستقر (٢٦° م)
              </span>
            </div>
            <div className="p-3 rounded-lg border border-[#E6DFD0] bg-white">
              <span className="text-[11px] font-bold text-[#555B53] block mb-1">{T("ld.161")}</span>
              <span className="text-xs font-bold text-[#1F2421] flex items-center gap-1.5">
                {T("ld.162")}
              </span>
            </div>
          </div>

          {/* Labor Section */}
          <div className="p-3.5 rounded-lg border border-[#E6DFD0] bg-white space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1F2421] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#1F2421]" />
                {T("ld.163")}
              </span>
              <span className="text-xs font-bold text-[#1F2421] bg-[#17614F]/15 px-2 py-0.5 rounded-md border border-[#17614F]/30">
                إجمالي ١١ عاملاً
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-[#555B53] font-semibold">
              <span className="p-2 rounded-lg bg-[#F7F3EA] border border-[#E6DFD0] flex items-center justify-between">
                <span>{T("ld.165")}</span>
                <strong className="text-[#1F2421] font-mono">٢</strong>
              </span>
              <span className="p-2 rounded-lg bg-[#F7F3EA] border border-[#E6DFD0] flex items-center justify-between">
                <span>{T("ld.167")}</span>
                <strong className="text-[#1F2421] font-mono">٣</strong>
              </span>
              <span className="p-2 rounded-lg bg-[#F7F3EA] border border-[#E6DFD0] flex items-center justify-between">
                <span>{T("ld.169")}</span>
                <strong className="text-[#1F2421] font-mono">٤</strong>
              </span>
              <span className="p-2 rounded-lg bg-[#F7F3EA] border border-[#E6DFD0] flex items-center justify-between">
                <span>{T("ld.171")}</span>
                <strong className="text-[#1F2421] font-mono">٢</strong>
              </span>
            </div>
          </div>

          {/* Visual Documentation Mock Grid */}
          <div>
            <span className="text-xs font-bold text-[#1F2421] mb-2 block flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-[#1F2421]" />
              التوثيق البصري المرفق من الموقع (٣ صور معتمدة):
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              <div className="h-24 rounded-lg bg-[#F7F3EA] border border-[#E6DFD0] flex flex-col items-center justify-center text-[#555B53] hover:bg-white transition-colors p-2 text-center group cursor-pointer">
                <Camera className="w-5 h-5 text-[#555B53] mb-1" />
                <span className="text-[10px] font-bold text-[#1F2421] truncate w-full">{T("ld.173")}</span>
                <span className="text-[9px] text-[#555B53]">١٠:١٥ ص</span>
              </div>
              <div className="h-24 rounded-lg bg-[#F7F3EA] border border-[#E6DFD0] flex flex-col items-center justify-center text-[#555B53] hover:bg-white transition-colors p-2 text-center group cursor-pointer">
                <Camera className="w-5 h-5 text-[#555B53] mb-1" />
                <span className="text-[10px] font-bold text-[#1F2421] truncate w-full">{T("ld.175")}</span>
                <span className="text-[9px] text-[#555B53]">١١:٢٥ ص</span>
              </div>
              <div className="h-24 rounded-lg bg-[#F7F3EA] border border-[#E6DFD0] flex flex-col items-center justify-center text-[#555B53] hover:bg-white transition-colors p-2 text-center group cursor-pointer">
                <Camera className="w-5 h-5 text-[#555B53] mb-1" />
                <span className="text-[10px] font-bold text-[#1F2421] truncate w-full">{T("ld.177")}</span>
                <span className="text-[9px] text-[#555B53]">١٢:٠٠ م</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="p-4 bg-[#F7F3EA] border-t border-[#E6DFD0] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-bold text-[#555B53] bg-white border border-[#E6DFD0] hover:bg-[#F0EADD] transition-colors cursor-pointer shadow-2xs"
          >
            {T("ld.155")}
          </button>
          <button
            type="button"
            onClick={onApprove}
            className="px-5 py-2 rounded-lg text-xs font-medium text-white bg-[#17614F] hover:bg-[#17614F] transition-all shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
          >
            <Check className="w-3.5 h-3.5 text-white" />
            {T("ld.179")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ActionItemModal;
