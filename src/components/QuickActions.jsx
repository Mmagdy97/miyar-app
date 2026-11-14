import { FolderKanban, Receipt, ClipboardCheck, Armchair, UsersRound, Users, FilePenLine, Wallet } from "lucide-react";
import { tr_ as T } from "../i18n";
import { isTabAllowed } from "../lib/entitlements";

// Shortcut tiles ("What do you need?"): round icon on a soft card; the first one is the dark primary action.
const ACTIONS = [
  ["Projects", "المشاريع الجارية", "qa.project", FolderKanban],
  ["Financials & Petty Cash", "الحسابات والعهد", "qa.invoice", Receipt],
  ["BOQ & Approvals", "المقايسات والاعتمادات", "qa.boq", ClipboardCheck],
  ["Selections", "الاختيارات وFF&E", "qa.selections", Armchair],
  ["Change Orders", "أوامر التغيير", "qa.co", FilePenLine],
  ["Certificates", "المستخلصات والمحتجزات", "qa.cert", Wallet],
  ["Attendance", "الحضور والعمالة", "qa.attendance", UsersRound],
  ["Team", "فريق العمل", "qa.team", Users],
];

export default function QuickActions({ setActiveTab }) {
  const list = ACTIONS.filter(([id]) => isTabAllowed(id));
  return (
    <section aria-labelledby="qa-title" className="space-y-3">
      <div>
        <h2 id="qa-title" className="font-display text-xl md:text-2xl font-semibold text-[#1F2A26]">{T("qa.title")}</h2>
        <p className="text-xs md:text-sm text-[#6E7B72]">{T("qa.sub")}</p>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 md:gap-3">
        {list.map(([id, tab, key, Ic], n) => (
          <button key={id} type="button" onClick={() => setActiveTab?.(tab)} className={`qa-tile group ${n === 0 ? "qa-main" : ""}`}>
            <span className="qa-ic"><Ic className="w-5 h-5 md:w-6 md:h-6" aria-hidden="true" /></span>
            <span className="text-[11px] md:text-xs font-semibold text-[#1F2A26] text-center leading-tight">{T(key)}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
