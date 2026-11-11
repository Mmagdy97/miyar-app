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
      <div className="text-center mb-10 sm:mb-14">
        <p className="text-sm sm:text-base font-semibold text-[#D9480F]">{T("mods.kicker")}</p>
        <h2 className="mt-3 text-4xl sm:text-6xl font-semibold tracking-tight text-[#16181C] leading-[1.1] text-balance">{T("mods.title")}</h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg sm:text-xl text-[#5D6168] leading-relaxed">{T("mods.sub")}</p>
      </div>

      <div role="tablist" className="flex flex-wrap justify-center gap-2 mb-8">
        {ROLES.map((r) => (
          <button key={r} role="tab" aria-selected={role === r} onClick={() => setRole(r)} className={`h-10 px-5 rounded-full text-sm font-semibold cursor-pointer transition-colors ${role === r ? "bg-[#16181C] text-white" : "bg-white border border-[#E3E0D9] text-[#5D6168] hover:text-[#16181C]"}`}>
            {T(`mods.role.${r}`)}
          </button>
        ))}
      </div>

      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {items.map(({ id, icon: Icon }) => (
          <li key={id} className="rounded-3xl border border-[#E3E0D9] bg-white p-5 sm:p-6 text-start">
            <Icon className="w-5 h-5 text-[#D9480F]" aria-hidden="true" />
            <h3 className="mt-3 text-base font-bold text-[#16181C]">{T(`md.${role}.${id}.t`)}</h3>
            <p className="mt-1.5 text-sm text-[#5D6168] leading-relaxed">{T(`md.${role}.${id}.d`)}</p>
          </li>
        ))}
      </ul>
      <div className="mt-8 text-center">
        <button onClick={() => openModal(role)} className="group inline-flex items-center gap-1 text-base sm:text-lg font-medium text-[#D9480F] hover:underline underline-offset-4 cursor-pointer">
          {T("mods.try")}
          <ChevronRight className="w-5 h-5 rtl:-scale-x-100" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
