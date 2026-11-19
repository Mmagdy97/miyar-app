import { Inbox } from "lucide-react";

/** Friendly empty list: what this area is for and the first step to fill it. */
export default function EmptyState({ title, hint, icon: Icon = Inbox, action }) {
  return (
    <div className="bg-white rounded-[22px] border border-dashed border-[#CBD5E1] px-6 py-8 text-center">
      <span className="mx-auto w-12 h-12 rounded-2xl bg-[#EEF1F5] text-[#0B7C79] flex items-center justify-center"><Icon className="w-6 h-6" aria-hidden="true" /></span>
      <p className="mt-3 font-semibold text-[#0E2A47]">{title}</p>
      {hint && <p className="mt-1 text-sm text-[#475569] max-w-sm mx-auto leading-relaxed">{hint}</p>}
      {action}
    </div>
  );
}
