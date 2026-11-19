import { useState } from "react";
import { FolderKanban, Wallet, Gauge, AlertTriangle, Plus, UserPlus, Check, Trash2 } from "lucide-react";
import { tr_ as T, E, money, intlLocale } from "../i18n";
import { reportsRepo } from "../data/reports";
import ReportCard from "./ReportCard";
import StartChecklist from "./StartChecklist";
import { printQuote } from "../lib/quote";
import { askConfirm } from "../lib/confirm";
import { displayId } from "../lib/identity";
import { projectsStore, inviteClient, removeClient, approveQuote } from "../data/projects";
import { invoicesRepo, invoiceTotals } from "../data/invoices";
import { cashRepo } from "../data/cash";
import { getActiveOrg } from "../lib/entitlements";
import { projectLimit } from "../lib/pricing";
import QuickActions from "./QuickActions";
import DashHero from "./DashHero";

const PLAN_NAME = { free: "plan.free", pro: "plan.pro", office: "plan.office", enterprise: "plan.enterprise" };
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString(intlLocale(), { day: "numeric", month: "short", year: "numeric" }) : "—");
/** Past deadline, or due within 14 days, while not finished. */
const needsAttention = (p, now = Date.now()) => p.progress < 100 && p.deadline && new Date(p.deadline).getTime() - now < 14 * 86400000;

/** Admin: invite the project's client by email (they sign up with it and see only this project). */
/** Client portal: the project's daily reports with photos (latest first, expandable). */
function ClientReports({ p }) {
  const [open, setOpen] = useState(false);
  const list = reportsRepo.use().filter((r) => r.projectId === p.id);
  if (!list.length) return null;
  return (
    <div className="pt-1 text-xs border-t border-[#E2E8F0]/60 space-y-2">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="font-bold text-[#0B7C79] cursor-pointer">{T("rep.clientTitle", { 0: list.length })}</button>
      {open && <div className="grid gap-2">{list.slice(0, 10).map((r) => <ReportCard key={r.id} r={r} />)}</div>}
    </div>
  );
}

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
      {p.clientEmail && <p className="flex items-center gap-1.5 text-[#475569] mb-1.5">{p.clientLinked ? <Check className="w-3.5 h-3.5 text-[#0B7C79]" aria-hidden="true" /> : <UserPlus className="w-3.5 h-3.5" aria-hidden="true" />}<bdi dir="ltr">{displayId(p.clientEmail)}</bdi> · {T(p.clientLinked ? "live.linked" : "live.pending")}
        <button type="button" onClick={async () => { if (await askConfirm(T("live.rmClientConfirm"))) { try { await removeClient(p.id); } catch (err) { setMsg(err.message || String(err)); } } }} aria-label={T("cash.delete")} className="p-1 rounded-md text-[#64748B] hover:text-rose-700 hover:bg-rose-50 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button></p>}
      {open ? (
        <form onSubmit={go} className="flex flex-wrap gap-2">
          <input required type="text" autoCapitalize="none" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={T("live.invitePh")} className="h-9 px-3 rounded-lg border border-[#E2E8F0] text-xs flex-1 min-w-40" />
          <button type="submit" disabled={busy} className="h-9 px-3 rounded-lg text-xs font-bold text-white bg-[#0B7C79] hover:bg-[#086663] disabled:opacity-50 cursor-pointer">{T("live.inviteGo")}</button>
        </form>
      ) : (
        <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-1.5 font-bold text-[#0B7C79] cursor-pointer"><UserPlus className="w-3.5 h-3.5" aria-hidden="true" />{T("live.invite")}</button>
      )}
      {msg && <p role="status" className="mt-1.5 text-[#475569]">{msg}</p>}
    </div>
  );
}

/** Dashboard for a real office: numbers come only from its own projects (no demo data). */
export default function LiveDashboard({ setActiveTab, role = "Admin" }) {
  const isClient = role === "Client";
  const [projects] = projectsStore.use();
  const inv = invoiceTotals(invoicesRepo.use());
  const cash = cashRepo.use();
  const given = cash.custodies.reduce((a, c) => a + c.amount, 0);
  const spent = cash.expenses.reduce((a, x) => a + x.amount, 0);
  const org = getActiveOrg();
  const total = projects.reduce((s, p) => s + (Number(p.contractValue) || 0), 0);
  const avg = projects.length ? Math.round(projects.reduce((s, p) => s + (Number(p.progress) || 0), 0) / projects.length) : 0;
  const attn = projects.filter((p) => needsAttention(p)).length;
  const max = org ? projectLimit(org.plan) : Infinity;
  const stats = [[T("live.projects"), projects.length, FolderKanban], [T("live.contracts"), money(total, { compact: true }), Wallet], [T("live.avg"), `${avg}%`, Gauge], ...(isClient ? [] : [[T("live.attn"), attn, AlertTriangle]]), [T("inv.paidTotal"), money(inv.paid, { compact: true }), Wallet], [T("inv.dueTotal"), money(inv.due, { compact: true }), Wallet]];
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent pb-24 font-ibm w-full max-w-full overflow-x-hidden">
      <div className="max-w-5xl mx-auto space-y-6">
        {role === "Admin" && <StartChecklist go={setActiveTab} />}
        <DashHero img={isClient ? "couple" : "villa"} title={T(isClient ? "live.projects" : "live.title")} sub={T("live.sub")}
          stats={org && !isClient ? [[T("live.plan", { plan: T(PLAN_NAME[org.plan] || "plan.free") }), Number.isFinite(max) ? T("live.usage", { n: projects.length, max }) : T("live.unlimited", { n: projects.length })]] : []} />
        {!isClient && <QuickActions setActiveTab={setActiveTab} compact />}
        {role === "Admin" && (
          <button type="button" onClick={() => setActiveTab("الحسابات والعهد")} className="w-full text-start bg-white rounded-2xl border border-[#E2E8F0] p-4 flex flex-wrap items-center gap-4 hover:border-[#0B7C79] cursor-pointer">
            <span className="chip-ic"><Wallet className="w-[18px] h-[18px]" aria-hidden="true" /></span>
            <span className="flex-1 min-w-32"><b className="block text-sm text-[#0E2A47]">{T("cash.title")}</b><span className="text-[11px] text-[#64748B]">{T("cash.dashHint", { n: cash.custodies.length })}</span></span>
            {[["cash.given", given], ["cash.spent", spent], ["cash.left", given - spent]].map(([k, v]) => (
              <span key={k} className="text-[11px] font-bold text-[#475569] text-center">{T(k)}<b className={`block text-sm tabular-nums ${k === "cash.left" && v < 0 ? "text-rose-700" : "text-[#0E2A47]"}`}>{money(v, { compact: true })}</b></span>
            ))}
          </button>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {stats.map(([l, v, Ic], n) => (
            <div key={l} className={`tile ${["tile-mint", "tile-peach", "tile-sky", "tile-sand"][n % 4]}`}>
              <span className="chip-ic"><Ic className="w-[18px] h-[18px]" aria-hidden="true" /></span>
              <p className="mt-3 text-xs font-bold text-[#475569]">{l}</p>
              <p className="mt-0.5 font-display text-2xl md:text-3xl font-semibold tabular-nums text-[#0E2A47]">{v}</p>
            </div>
          ))}
        </div>
        {projects.length === 0 && isClient ? <p className="text-sm text-[#475569] bg-white rounded-2xl border border-[#E2E8F0] p-10 text-center">{T("proj.none")}</p> : projects.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-10 text-center space-y-4">
            <p className="text-sm text-[#475569]">{T("live.empty")}</p>
            <button type="button" onClick={() => setActiveTab("المشاريع الجارية")} className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-[#0B7C79] hover:bg-[#086663] cursor-pointer"><Plus className="w-4 h-4" aria-hidden="true" />{T("live.add")}</button>
          </div>
        ) : (
          <div className="grid gap-3">
            {projects.map((p) => (
              <article key={p.id} className="bg-white rounded-2xl border border-[#E2E8F0] p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0"><p className="text-base font-semibold text-[#0E2A47] truncate">{E(p.name)}</p><p className="text-xs text-[#475569]">{p.client}{p.phase ? ` · ${E(p.phase)}` : ""}</p></div>
                  <span className={`text-xs font-bold tabular-nums shrink-0 ${needsAttention(p) ? "text-rose-700" : "text-[#475569]"}`}>{T("live.deadline", { d: fmtDate(p.deadline) })}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-[#EEF1F5] overflow-hidden"><div className="h-full rounded-full bg-[#0B7C79]" style={{ width: `${Math.min(100, p.progress || 0)}%` }} /></div>
                  <span className="text-xs font-bold tabular-nums text-[#0E2A47] w-10 text-end">{p.progress || 0}%</span>
                </div>
                {isClient && p.quote && p.quoteStatus !== "none" && (
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs border-t border-[#E2E8F0]/60">
                    <span className="font-bold text-[#0E2A47] me-auto">{T("quote.title")}: {money(p.quoteTotal)} · {T("quote.st." + p.quoteStatus)}</span>
                    <button type="button" onClick={() => printQuote(p, p.quote)} className="px-3 h-9 rounded-lg font-bold border border-[#E2E8F0] cursor-pointer">{T("quote.pdf")}</button>
                    {p.quoteStatus === "sent" && <button type="button" onClick={async () => { if (await askConfirm(T("quote.approveConfirm"), { danger: false, yes: T("quote.approve") })) { try { await approveQuote(p.id); } catch (err) { window.dispatchEvent(new CustomEvent("miyar:error", { detail: err.message })); } } }} className="px-4 h-9 rounded-lg font-bold text-white bg-[#0B7C79] cursor-pointer">{T("quote.approve")}</button>}
                  </div>
                )}
                {isClient && <ClientReports p={p} />}
                {!isClient && <InviteClient p={p} />}
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
