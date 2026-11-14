import { Inbox } from "lucide-react";

/** Friendly empty list: what this area is for and the first step to fill it. */
export default function EmptyState({ title, hint, icon: Icon = Inbox, action }) {
  return (
    <div className="bg-white rounded-[22px] border border-dashed border-[#C9D3CA] px-6 py-8 text-center">
      <span className="mx-auto w-12 h-12 rounded-2xl bg-[#E8EFE9] text-[#5F6C61] flex items-center justify-center"><Icon className="w-6 h-6" aria-hidden="true" /></span>
      <p className="mt-3 font-semibold text-[#1F2A26]">{title}</p>
      {hint && <p className="mt-1 text-sm text-[#56635B] max-w-sm mx-auto leading-relaxed">{hint}</p>}
      {action}
    </div>
  );
}
