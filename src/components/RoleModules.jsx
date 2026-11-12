import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { tr_ as T } from "../i18n";
import { ROLE_CONFIG } from "../config/roles";

const ROLES = ["Admin", "Site Engineer", "Technical Office", "Client"];
const has = (role, id) => T(`md.${role}.${id}.t`) !== `md.${role}.${id}.t`;

/** Landing: what each role gets, one tab per role. Built from the real navigation config. */
export default function RoleModules({ openModal }) {
  const [role, setRole] = useState("Admin");
  const items = ROLE_CONFIG[role].filter((m) => has(role, m.id));
  return (
    <section id="modules" className="py-14 sm:py-32 px-5 max-w-6xl mx-auto w-full">
      <div className="text-start mb-8 sm:mb-10">
        <p className="text-sm sm:text-base font-semibold text-[#B5452B]">{T("mods.kicker")}</p>
        <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-[#1A2236] leading-[1.2] text-balance">{T("mods.title")}</h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg sm:text-xl text-[#535E78] leading-relaxed">{T("mods.sub")}</p>
      </div>

      <div role="tablist" className="flex flex-wrap justify-center gap-2 mb-8">
        {ROLES.map((r) => (
          <button key={r} role="tab" aria-selected={role === r} onClick={() => setRole(r)} className={`h-10 px-5 rounded-lg text-sm font-semibold cursor-pointer transition-colors ${role === r ? "bg-[#1A2236] text-white" : "bg-white border border-[#DAD3C2] text-[#535E78] hover:text-[#1A2236]"}`}>
            {T(`mods.role.${r}`)}
          </button>
        ))}
      </div>

      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {items.map(({ id, icon: Icon }) => (
          <li key={id} className="rounded-xl border border-[#DAD3C2] bg-white p-5 sm:p-6 text-start">
            <Icon className="w-5 h-5 text-[#B5452B]" aria-hidden="true" />
            <h3 className="mt-3 text-base font-bold text-[#1A2236]">{T(`md.${role}.${id}.t`)}</h3>
            <p className="mt-1.5 text-sm text-[#535E78] leading-relaxed">{T(`md.${role}.${id}.d`)}</p>
          </li>
        ))}
      </ul>
      <div className="mt-8 text-start">
        <button onClick={() => openModal(role)} className="group inline-flex items-center gap-1 text-base sm:text-lg font-medium text-[#B5452B] hover:underline underline-offset-4 cursor-pointer">
          {T("mods.try")}
          <ChevronRight className="w-5 h-5 rtl:-scale-x-100" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
