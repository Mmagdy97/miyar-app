import { useEffect, useState } from "react";
import { Check, Circle } from "lucide-react";
import { tr_ as T } from "../i18n";
import { teamRepo, loadTeam } from "../data/team";
import { projectsStore } from "../data/projects";
import { boqRepo } from "../data/boq";
import { getActiveOrg } from "../lib/entitlements";

const key = () => `tour:check:${getActiveOrg()?.id || "org"}`;

/** "Get started" list for a new office: tick off as the office does each first step. Hides itself when done or dismissed. */
export default function StartChecklist({ go }) {
  const team = teamRepo.use();
  const [projects] = projectsStore.use();
  const boq = boqRepo.use();
  const [hidden, setHidden] = useState(() => { try { return localStorage.getItem(key()) === "1"; } catch { return false; } });
  useEffect(() => { loadTeam(); }, []);
  const steps = [
    ["team", team.length > 1, "Team"],
    ["project", projects.length > 0, "Projects"],
    ["boq", boq.length > 0, "BOQ & Approvals"],
    ["quote", projects.some((p) => p.quoteStatus && p.quoteStatus !== "none"), "BOQ & Approvals"],
  ];
  const done = steps.filter((s) => s[1]).length;
  if (hidden || done === steps.length) return null;
  const hide = () => { try { localStorage.setItem(key(), "1"); } catch { /* ignore */ } setHidden(true); };
  return (
    <section className="bg-white rounded-2xl border border-[#E4DDCE] p-4 space-y-3">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-semibold text-[#0E1A1B]">{T("start.title")}</h2>
        <span className="text-[11px] font-bold text-[#4A5757] tabular-nums">{done}/{steps.length}</span>
        <button type="button" onClick={hide} className="ms-auto text-[11px] font-bold text-[#64706F] cursor-pointer">{T("start.hide")}</button>
      </div>
      <div className="h-1.5 rounded-full bg-[#EFE9DC] overflow-hidden"><div className="h-full bg-[#D97706]" style={{ width: `${(done / steps.length) * 100}%` }} /></div>
      <ul className="grid gap-1.5">
        {steps.map(([k, ok, tab]) => (
          <li key={k} className="flex items-center gap-2 text-xs">
            {ok ? <Check className="w-4 h-4 text-emerald-700 shrink-0" aria-hidden="true" /> : <Circle className="w-4 h-4 text-[#B8AE98] shrink-0" aria-hidden="true" />}
            <span className={ok ? "text-[#64706F] line-through" : "font-semibold text-[#0E1A1B]"}>{T("start." + k)}</span>
            {!ok && <button type="button" onClick={() => go(tab)} className="ms-auto px-3 h-8 rounded-lg text-[11px] font-bold border border-[#E4DDCE] cursor-pointer">{T("start.go")}</button>}
          </li>
        ))}
      </ul>
    </section>
  );
}
