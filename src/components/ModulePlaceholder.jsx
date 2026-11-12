import { tr_ as T } from "../i18n";
import {
  Construction,
  Clock,
  LayoutDashboard,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { ROLE_TITLES } from "../config/roles";

function ModulePlaceholder({ activeTab, currentRole, setActiveTab }) {
  const roleDisplay = ROLE_TITLES[currentRole] || currentRole;

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent w-full max-w-full overflow-x-hidden">
      <div className="flex items-center justify-center min-h-[calc(100vh-8.5rem)]">
        <div className="w-full max-w-2xl">
          {/* Architectural Luxury Card */}
          <div className="bg-white rounded-lg border border-[#DAD3C2] shadow-sm p-6 sm:p-10 text-center">
            {/* Icon Header */}
            <div className="relative inline-flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-[#E9E3D5] border border-[#DAD3C2] text-[#1A2236] shadow-xs">
              <Construction className="w-8 h-8" />
              <span className="absolute -bottom-1 -start-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
              </span>
            </div>

            {/* Status Pills */}
            <div className="flex items-center justify-center gap-2 flex-wrap mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                {T("ld.180", { v0: roleDisplay })}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E9E3D5] text-[#535E78] border border-[#DAD3C2]">
                <Clock className="w-3.5 h-3.5 text-[#535E78]" />
                {T("ld.181", { v0: activeTab })}
              </span>
            </div>

            {/* Primary Heading */}
            <h2 className="text-2xl sm:text-3xl font-black text-[#1A2236] tracking-tight mb-3">
              {T("ld.182", { v0: activeTab })}
            </h2>

            {/* Subtitle */}
            <p className="text-[#535E78] text-sm sm:text-base leading-relaxed max-w-lg mx-auto mb-8 font-medium">
              {T("ld.183")}
            </p>

            {/* Feature Preview Box */}
            <div className="bg-[#F3EFE6] rounded-lg border border-[#DAD3C2] p-5 mb-8 text-start">
              <div className="flex items-center gap-2 mb-3 text-xs font-bold text-[#1A2236]">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>{T("ld.184")}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[#535E78]">
                <div className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-[#DAD3C2]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{T("ld.185")}</span>
                </div>
                <div className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-[#DAD3C2]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{T("ld.186")}</span>
                </div>
                <div className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-[#DAD3C2]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{T("ld.187")}</span>
                </div>
                <div className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-[#DAD3C2]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{T("ld.188")}</span>
                </div>
              </div>
            </div>

            {/* Action Button: Return to Dashboard */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setActiveTab("لوحة التحكم")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#24304D] text-white hover:bg-[#1A2236] transition-colors shadow-sm rounded-lg font-bold text-sm cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>{T("ld.189")}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ModulePlaceholder;
