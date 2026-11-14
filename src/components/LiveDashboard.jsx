import { useState } from "react";
import { FolderKanban, Wallet, Gauge, AlertTriangle, Plus, UserPlus, Check } from "lucide-react";
import { tr_ as T, E, money, intlLocale } from "../i18n";
import { projectsStore, inviteClient } from "../data/projects";
import { invoicesRepo, invoiceTotals } from "../data/invoices";
import { getActiveOrg } from "../lib/entitlements";
import { projectLimit } from "../lib/pricing";
import QuickActions from "./QuickActions";

const PLAN_NAME = { free: "plan.free", pro: "plan.pro", office: "plan.office", enterprise: "plan.enterprise" };
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString(intlLocale(), { day: "numeric", month: "short", year: "numeric" }) : "—");
/** Past deadline, or due within 14 days, while not finished. */
const needsAttention = (p, now = Date.now()) => p.progress < 100 && p.deadline && new Date(p.deadline).getTime() - now < 14 * 86400000;

/** Admin: invite the project's client by email (they sign up with it and see only this project). */
function InviteClient({ p }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const go = async (e) => {
    e.preventDefault(); setBusy(true); setMsg("");
    try { const r = await inviteClient(p.id, email.trim()); setMsg(T(r === "linked" ? "live.invLinked" : "live.invOk")); setOpen(false); setEmail(""); }
    catch (err) { setMsg(err.message || String(err)); }
    setBusy(false);
  };
  return (
    <div className="pt-1 text-xs">
      {p.clientEmail && <p className="flex items-center gap-1.5 text-[#56635B] mb-1.5">{p.clientLinked ? <Check className="w-3.5 h-3.5 text-[#5F6C61]" aria-hidden="true" /> : <UserPlus className="w-3.5 h-3.5" aria-hidden="true" />}<bdi dir="ltr">{p.clientEmail}</bdi> · {T(p.clientLinked ? "live.linked" : "live.pending")}</p>}
      {open ? (
        <form onSubmit={go} className="flex flex-wrap gap-2">
          <input required type="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={T("live.invitePh")} className="h-9 px-3 rounded-lg border border-[#DCE4DC] text-xs flex-1 min-w-40" />
          <button type="submit" disabled={busy} className="h-9 px-3 rounded-lg text-xs font-bold text-white bg-[#5F6C61] hover:bg-[#4B574D] disabled:opacity-50 cursor-pointer">{T("live.inviteGo")}</button>
        </form>
      ) : (
        <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-1.5 font-bold text-[#5F6C61] cursor-pointer"><UserPlus className="w-3.5 h-3.5" aria-hidden="true" />{T("live.invite")}</button>
      )}
      {msg && <p role="status" className="mt-1.5 text-[#56635B]">{msg}</p>}
    </div>
  );
}

/** Dashboard for a real office: numbers come only from its own projects (no demo data). */
export default function LiveDashboard({ setActiveTab, role = "Admin" }) {
  const isClient = role === "Client";
  const [projects] = projectsStore.use();
  const inv = invoiceTotals(invoicesRepo.use());
  const org = getActiveOrg();
  const total = projects.reduce((s, p) => s + (Number(p.contractValue) || 0), 0);
  const avg = projects.length ? Math.round(projects.reduce((s, p) => s + (Number(p.progress) || 0), 0) / projects.length) : 0;
  const attn = projects.filter((p) => needsAttention(p)).length;
  const max = org ? projectLimit(org.plan) : Infinity;
  const stats = [[T("live.projects"), projects.length, FolderKanban], [T("live.contracts"), money(total, { compact: true }), Wallet], [T("live.avg"), `${avg}%`, Gauge], ...(isClient ? [] : [[T("live.attn"), attn, AlertTriangle]]), [T("inv.paidTotal"), money(inv.paid, { compact: true }), Wallet], [T("inv.dueTotal"), money(inv.due, { compact: true }), Wallet]];
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent pb-24 font-ibm w-full max-w-full overflow-x-hidden">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-[#1F2A26]">{T(isClient ? "live.projects" : "live.title")}</h1>
            <p className="text-xs md:text-sm text-[#56635B] mt-1">{T("live.sub")}</p>
          </div>
          {org && !isClient && <p className="text-xs font-bold text-[#56635B] bg-white border border-[#DCE4DC] rounded-lg px-3 py-1.5 w-fit">{T("live.plan", { plan: T(PLAN_NAME[org.plan] || "plan.free") })} · {Number.isFinite(max) ? T("live.usage", { n: projects.length, max }) : T("live.unlimited", { n: projects.length })}</p>}
        </div>
        {!isClient && <QuickActions setActiveTab={setActiveTab} />}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {stats.map(([l, v, Ic], n) => (
            <div key={l} className={`tile ${["tile-mint", "tile-peach", "tile-sky", "tile-sand"][n % 4]}`}>
              <span className="chip-ic"><Ic className="w-[18px] h-[18px]" aria-hidden="true" /></span>
              <p className="mt-3 text-xs font-bold text-[#56635B]">{l}</p>
              <p className="mt-0.5 font-display text-2xl md:text-3xl font-semibold tabular-nums text-[#1F2A26]">{v}</p>
            </div>
          ))}
        </div>
        {projects.length === 0 && isClient ? <p className="text-sm text-[#56635B] bg-white rounded-2xl border border-[#DCE4DC] p-10 text-center">{T("proj.none")}</p> : projects.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#DCE4DC] p-10 text-center space-y-4">
            <p className="text-sm text-[#56635B]">{T("live.empty")}</p>
            <button type="button" onClick={() => setActiveTab("المشاريع الجارية")} className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-[#5F6C61] hover:bg-[#4B574D] cursor-pointer"><Plus className="w-4 h-4" aria-hidden="true" />{T("live.add")}</button>
          </div>
        ) : (
          <div className="grid gap-3">
            {projects.map((p) => (
              <article key={p.id} className="bg-white rounded-2xl border border-[#DCE4DC] p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0"><p className="text-base font-semibold text-[#1F2A26] truncate">{E(p.name)}</p><p className="text-xs text-[#56635B]">{p.client}{p.phase ? ` · ${E(p.phase)}` : ""}</p></div>
                  <span className={`text-xs font-bold tabular-nums shrink-0 ${needsAttention(p) ? "text-rose-700" : "text-[#56635B]"}`}>{T("live.deadline", { d: fmtDate(p.deadline) })}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-[#E8EFE9] overflow-hidden"><div className="h-full rounded-full bg-[#5F6C61]" style={{ width: `${Math.min(100, p.progress || 0)}%` }} /></div>
                  <span className="text-xs font-bold tabular-nums text-[#1F2A26] w-10 text-end">{p.progress || 0}%</span>
                </div>
                {!isClient && <InviteClient p={p} />}
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
