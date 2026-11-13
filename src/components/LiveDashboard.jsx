import { FolderKanban, Wallet, Gauge, AlertTriangle, Plus } from "lucide-react";
import { tr_ as T, E, money, intlLocale } from "../i18n";
import { projectsStore } from "../data/projects";
import { getActiveOrg } from "../lib/entitlements";
import { projectLimit } from "../lib/pricing";

const PLAN_NAME = { free: "plan.free", pro: "plan.pro", office: "plan.office", enterprise: "plan.enterprise" };
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString(intlLocale(), { day: "numeric", month: "short", year: "numeric" }) : "—");
/** Past deadline, or due within 14 days, while not finished. */
const needsAttention = (p, now = Date.now()) => p.progress < 100 && p.deadline && new Date(p.deadline).getTime() - now < 14 * 86400000;

/** Dashboard for a real office: numbers come only from its own projects (no demo data). */
export default function LiveDashboard({ setActiveTab }) {
  const [projects] = projectsStore.use();
  const org = getActiveOrg();
  const total = projects.reduce((s, p) => s + (Number(p.contractValue) || 0), 0);
  const avg = projects.length ? Math.round(projects.reduce((s, p) => s + (Number(p.progress) || 0), 0) / projects.length) : 0;
  const attn = projects.filter((p) => needsAttention(p)).length;
  const max = org ? projectLimit(org.plan) : Infinity;
  const stats = [[T("live.projects"), projects.length, FolderKanban], [T("live.contracts"), money(total, { compact: true }), Wallet], [T("live.avg"), `${avg}%`, Gauge], [T("live.attn"), attn, AlertTriangle]];
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent pb-24 font-ibm w-full max-w-full overflow-x-hidden">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-[#1F2421]">{T("live.title")}</h1>
            <p className="text-xs md:text-sm text-[#555B53] mt-1">{T("live.sub")}</p>
          </div>
          {org && <p className="text-xs font-bold text-[#555B53] bg-white border border-[#E6DFD0] rounded-lg px-3 py-1.5 w-fit">{T("live.plan", { plan: T(PLAN_NAME[org.plan] || "plan.free") })} · {Number.isFinite(max) ? T("live.usage", { n: projects.length, max }) : T("live.unlimited", { n: projects.length })}</p>}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map(([l, v, Ic]) => (
            <div key={l} className="bg-white rounded-xl border border-[#E6DFD0] p-4">
              <p className="text-[11px] font-bold text-[#555B53] flex items-center gap-1.5"><Ic className="w-3.5 h-3.5" aria-hidden="true" />{l}</p>
              <p className="mt-1 font-display text-xl md:text-2xl font-semibold tabular-nums text-[#1F2421]">{v}</p>
            </div>
          ))}
        </div>
        {projects.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E6DFD0] p-10 text-center space-y-4">
            <p className="text-sm text-[#555B53]">{T("live.empty")}</p>
            <button type="button" onClick={() => setActiveTab("المشاريع الجارية")} className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-[#17614F] hover:bg-[#104A3C] cursor-pointer"><Plus className="w-4 h-4" aria-hidden="true" />{T("live.add")}</button>
          </div>
        ) : (
          <div className="grid gap-3">
            {projects.map((p) => (
              <article key={p.id} className="bg-white rounded-2xl border border-[#E6DFD0] p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0"><p className="text-base font-semibold text-[#1F2421] truncate">{E(p.name)}</p><p className="text-xs text-[#555B53]">{p.client}{p.phase ? ` · ${E(p.phase)}` : ""}</p></div>
                  <span className={`text-xs font-bold tabular-nums shrink-0 ${needsAttention(p) ? "text-rose-700" : "text-[#555B53]"}`}>{T("live.deadline", { d: fmtDate(p.deadline) })}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-[#F0EADD] overflow-hidden"><div className="h-full rounded-full bg-[#17614F]" style={{ width: `${Math.min(100, p.progress || 0)}%` }} /></div>
                  <span className="text-xs font-bold tabular-nums text-[#1F2421] w-10 text-end">{p.progress || 0}%</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
