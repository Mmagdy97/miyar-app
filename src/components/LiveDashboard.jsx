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
import { invoicesRepo, invoiceTotals, isOverdue } from "../data/invoices";
import { boqRepo } from "../data/boq";
import { projectVariance } from "../lib/variance";
import { getActiveOrg } from "../lib/entitlements";
import { projectLimit } from "../lib/pricing";

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
    <div className="pt-1 text-xs border-t border-[#E0D6C2]/60 space-y-2">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="font-bold text-[#2B3052] cursor-pointer">{T("rep.clientTitle", { 0: list.length })}</button>
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
      {p.clientEmail && <p className="flex items-center gap-1.5 text-[#4F5470] mb-1.5">{p.clientLinked ? <Check className="w-3.5 h-3.5 text-[#2B3052]" aria-hidden="true" /> : <UserPlus className="w-3.5 h-3.5" aria-hidden="true" />}<bdi dir="ltr">{displayId(p.clientEmail)}</bdi> · {T(p.clientLinked ? "live.linked" : "live.pending")}
        <button type="button" onClick={async () => { if (await askConfirm(T("live.rmClientConfirm"))) { try { await removeClient(p.id); } catch (err) { setMsg(err.message || String(err)); } } }} aria-label={T("cash.delete")} className="p-1 rounded-md text-[#666B86] hover:text-rose-700 hover:bg-rose-50 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button></p>}
      {open ? (
        <form onSubmit={go} className="flex flex-wrap gap-2">
          <input required type="text" autoCapitalize="none" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={T("live.invitePh")} className="h-9 px-3 rounded-lg border border-[#E0D6C2] text-xs flex-1 min-w-40" />
          <button type="submit" disabled={busy} className="h-9 px-3 rounded-lg text-xs font-bold text-white bg-[#2B3052] hover:bg-[#3A4070] disabled:opacity-50 cursor-pointer">{T("live.inviteGo")}</button>
        </form>
      ) : (
        <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-1.5 font-bold text-[#2B3052] cursor-pointer"><UserPlus className="w-3.5 h-3.5" aria-hidden="true" />{T("live.invite")}</button>
      )}
      {msg && <p role="status" className="mt-1.5 text-[#4F5470]">{msg}</p>}
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
  const boqItems = boqRepo.use();
  const actuals = boqRepo.actuals();
  const [openId, setOpenId] = useState(null);
  const invs = invoicesRepo.use();
  const late = invs.filter((i) => isOverdue(i));
  const lateSum = late.reduce((s, i) => s + i.amount, 0);
  const soon = projects.filter((p) => needsAttention(p));
  const waiting = projects.filter((p) => p.quoteStatus === "sent");
  const overBudget = isClient ? [] : projects.flatMap((p) => projectVariance(boqItems.filter((b) => b.projectId === p.id), actuals).rows.filter((r) => r.level === "over" || r.level === "warn").map((r) => ({ p, r })));
  const today = new Date().toLocaleDateString(intlLocale(), { weekday: "long", day: "numeric", month: "long" });
  const kpis = isClient
    ? [["live.projects", projects.length, `${T("live.avg")} ${avg}%`, FolderKanban], ["inv.paidTotal", money(inv.paid, { compact: true }), null, Wallet], ["inv.dueTotal", money(inv.due, { compact: true }), null, Wallet]]
    : [["live.projects", projects.length, `${T("live.avg")} ${avg}%`, FolderKanban], ["live.contracts", money(total, { compact: true }), null, Wallet], ["inv.paidTotal", money(inv.paid, { compact: true }), `${T("inv.dueTotal")} ${money(inv.due, { compact: true })}`, Gauge], ["live.attn", attn + late.length + overBudget.length, null, AlertTriangle]];
  const decisions = [
    ...late.map((i) => ({ k: "i" + i.id, tone: "rose", text: T("dash.lateInv", { 0: i.title, 1: money(i.amount) }), tab: "الحسابات والعهد" })),
    ...overBudget.map(({ p, r }) => ({ k: "b" + r.item.id, tone: r.level === "over" ? "rose" : "amber", text: T(r.level === "over" ? "dash.over" : "dash.warn", { 0: r.item.name, 1: E(p.name) }), tab: "المقايسات والاعتمادات" })),
    ...soon.map((p) => ({ k: "p" + p.id, tone: "amber", text: T("dash.soon", { 0: E(p.name), 1: fmtDate(p.deadline) }), tab: "المشاريع الجارية" })),
    ...waiting.map((p) => ({ k: "q" + p.id, tone: "navy", text: T("dash.waiting", { 0: E(p.name) }), tab: "المقايسات والاعتمادات" })),
  ];
  const TONE = { rose: "bg-rose-600", amber: "bg-amber-500", navy: "bg-[#2B3052]" };
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent pb-24 font-ibm w-full max-w-full overflow-x-hidden">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex flex-wrap items-end gap-4">
          <div className="me-auto min-w-0">
            <p className="text-xs font-semibold text-[#666B86]">{today}</p>
            <h1 className="mt-1 font-display text-2xl md:text-3xl font-semibold text-[#1E223D] truncate">{isClient ? T("live.projects") : org?.name || T("live.title")}</h1>
          </div>
          {org && !isClient && (
            <div className="text-xs text-[#4F5470] min-w-44">
              <div className="flex justify-between font-semibold"><span>{T("live.plan", { plan: T(PLAN_NAME[org.plan] || "plan.free") })}</span><span className="tabular-nums">{Number.isFinite(max) ? `${projects.length}/${max}` : projects.length}</span></div>
              {Number.isFinite(max) && <div className="mt-1.5 h-1.5 rounded-full bg-[#E9DFCB] overflow-hidden"><div className="h-full bg-[#2B3052]" style={{ width: `${Math.min(100, (projects.length / max) * 100)}%` }} /></div>}
            </div>
          )}
          {!isClient && <button type="button" onClick={() => setActiveTab("المشاريع الجارية")} className="inline-flex items-center gap-1.5 h-11 px-5 rounded-xl text-sm font-bold text-white bg-[#1E223D] hover:bg-[#2B3052] cursor-pointer"><Plus className="w-4 h-4" aria-hidden="true" />{T("live.add")}</button>}
        </header>

        <div className={`grid grid-cols-2 ${isClient ? "md:grid-cols-3" : "md:grid-cols-4"} gap-3`}>
          {kpis.map(([k, v, sub, Ic]) => {
            const alert = k === "live.attn" && v > 0;
            return (
              <div key={k} className={`rounded-2xl p-4 border ${alert ? "bg-[#FBEDE6] border-[#F4C7B3]" : "bg-white border-[#E6DCC8]"}`}>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#4F5470]"><Ic className={`w-4 h-4 ${alert ? "text-[#C03A12]" : "text-[#8A8FA8]"}`} aria-hidden="true" />{T(k)}</div>
                <p className={`mt-2 font-display text-2xl md:text-[28px] font-semibold tabular-nums ${alert ? "text-[#C03A12]" : "text-[#1E223D]"}`}>{v}</p>
                {sub && <p className="mt-0.5 text-[11px] text-[#666B86] tabular-nums truncate">{sub}</p>}
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 items-start">
          <section className="lg:col-span-2 bg-white rounded-2xl border border-[#E6DCC8]">
            <h2 className="px-5 pt-4 pb-3 text-sm font-semibold text-[#1E223D] border-b border-[#F1EADB]">{T("live.projects")} <span className="text-[#8A8FA8] tabular-nums">({projects.length})</span></h2>
            {projects.length === 0 ? (
              <div className="p-10 text-center space-y-4">
                <p className="text-sm text-[#4F5470]">{T(isClient ? "proj.none" : "live.empty")}</p>
                {!isClient && <button type="button" onClick={() => setActiveTab("المشاريع الجارية")} className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-[#2B3052] cursor-pointer"><Plus className="w-4 h-4" aria-hidden="true" />{T("live.add")}</button>}
              </div>
            ) : (
              <ul>
                {projects.map((p) => {
                  const hot = needsAttention(p);
                  const open = openId === p.id || isClient;
                  return (
                    <li key={p.id} className="border-b last:border-b-0 border-[#F1EADB]">
                      <button type="button" onClick={() => !isClient && setOpenId(open ? null : p.id)} aria-expanded={open} className={`w-full px-5 py-3.5 grid grid-cols-[1fr_auto] sm:grid-cols-[minmax(0,1fr)_9rem_6.5rem] items-center gap-x-4 gap-y-1.5 text-start ${isClient ? "cursor-default" : "hover:bg-[#FAF7F0] cursor-pointer"}`}>
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold text-[#1E223D] truncate">{E(p.name)}</span>
                          <span className="block text-[11px] text-[#666B86] truncate">{p.client || "—"}{p.quoteStatus && p.quoteStatus !== "none" ? ` · ${T("quote.st." + p.quoteStatus)}` : ""}</span>
                        </span>
                        <span className="flex items-center gap-2 col-span-2 sm:col-span-1 row-start-2 sm:row-start-auto">
                          <span className="flex-1 h-1.5 rounded-full bg-[#F1EADB] overflow-hidden"><span className="block h-full rounded-full bg-[#2B3052]" style={{ width: `${Math.min(100, p.progress || 0)}%` }} /></span>
                          <span className="text-[11px] font-bold tabular-nums text-[#1E223D] w-8 text-end">{p.progress || 0}%</span>
                        </span>
                        <span className={`text-[11px] font-semibold tabular-nums text-end ${hot ? "text-[#C03A12]" : "text-[#666B86]"}`}>{fmtDate(p.deadline)}</span>
                      </button>
                      {open && (
                        <div className="px-5 pb-4 space-y-2">
                          {isClient && p.quote && p.quoteStatus !== "none" && (
                            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                              <span className="font-bold text-[#1E223D] me-auto">{T("quote.title")}: {money(p.quoteTotal)} · {T("quote.st." + p.quoteStatus)}</span>
                              <button type="button" onClick={() => printQuote(p, p.quote)} className="px-3 h-9 rounded-lg font-bold border border-[#E0D6C2] cursor-pointer">{T("quote.pdf")}</button>
                              {p.quoteStatus === "sent" && <button type="button" onClick={async () => { if (await askConfirm(T("quote.approveConfirm"), { danger: false, yes: T("quote.approve") })) { try { await approveQuote(p.id); } catch (err) { window.dispatchEvent(new CustomEvent("miyar:error", { detail: err.message })); } } }} className="px-4 h-9 rounded-lg font-bold text-white bg-[#2B3052] cursor-pointer">{T("quote.approve")}</button>}
                            </div>
                          )}
                          {isClient && <ClientReports p={p} />}
                          {!isClient && <InviteClient p={p} />}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <aside className="space-y-6">
            {role === "Admin" && <StartChecklist go={setActiveTab} />}
            {!isClient && (
              <section className="bg-white rounded-2xl border border-[#E6DCC8]">
                <h2 className="px-5 pt-4 pb-3 text-sm font-semibold text-[#1E223D] border-b border-[#F1EADB]">{T("dash.decide")} {decisions.length > 0 && <span className="ms-1 inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-[11px] font-bold text-white bg-[#C03A12] tabular-nums">{decisions.length}</span>}</h2>
                {decisions.length === 0 ? <p className="px-5 py-6 text-xs text-[#666B86] text-center">{T("dash.clear")}</p> : (
                  <ul className="max-h-96 overflow-y-auto">
                    {decisions.slice(0, 12).map((d) => (
                      <li key={d.k}><button type="button" onClick={() => setActiveTab(d.tab)} className="w-full flex items-start gap-2.5 px-5 py-3 text-start text-xs text-[#1E223D] hover:bg-[#FAF7F0] border-b last:border-b-0 border-[#F1EADB] cursor-pointer"><span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${TONE[d.tone]}`} aria-hidden="true" /><span className="leading-relaxed">{d.text}</span></button></li>
                    ))}
                  </ul>
                )}
                {lateSum > 0 && <p className="px-5 py-3 text-[11px] font-bold text-[#C03A12] border-t border-[#F1EADB]">{T("dash.lateSum", { 0: money(lateSum) })}</p>}
              </section>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
