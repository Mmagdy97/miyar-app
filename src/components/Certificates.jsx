import { useState } from "react";
import { Receipt, Lock, Unlock } from "lucide-react";
import { tr_ as T, E, money, getCurrency } from "../i18n";
import { pct } from "../data/dataI18n";
import { PROJECTS } from "../data/seed";
import { certsStore } from "../data/stores";
import { officeStore, defaultVat } from "../data/office";
import { computeCertificate, totals } from "../lib/hakedis";

const NEXT = { draft: "approved", approved: "paid" };

/** Admin: progress-billing certificates (مستخلصات) with retention (محتجزات) and advance recovery. */
export default function Certificates() {
  const [certs, setCerts] = certsStore.use();
  const [office] = officeStore.use();
  const vatRate = office.vatRate ?? defaultVat(getCurrency());
  const [projectId, setProjectId] = useState(PROJECTS[0].id);
  const project = PROJECTS.find((p) => p.id === Number(projectId));
  const mine = certs.filter((c) => c.projectId === project.id).sort((a, b) => a.no - b.no);
  const prev = mine.length ? mine[mine.length - 1] : null;
  const prevPct = prev ? prev.cumPct : 0;
  const [cumPct, setCumPct] = useState("");
  const [retPct, setRetPct] = useState(5);
  const [advance, setAdvance] = useState(0);

  const pctNum = cumPct === "" ? project.progress : Number(cumPct);
  const calc = computeCertificate({
    contractValue: project.contractValue,
    cumPct: pctNum,
    prevCumValue: prev ? prev.cumValue : 0,
    retentionPct: retPct,
    advanceRecovery: advance,
    vatRate,
    currency: "EGP",
  });
  const valid = pctNum > prevPct && pctNum <= 100;
  const t = totals(mine);

  const issue = () => {
    if (!valid) return;
    setCerts((p) => [
      ...p,
      { id: Date.now(), projectId: project.id, no: mine.length + 1, date: new Date().toISOString().slice(0, 10), cumPct: pctNum, retentionPct: Number(retPct), vatRate, ...calc, status: "draft", retentionReleased: false },
    ]);
    setCumPct("");
    setAdvance(0);
  };
  const advanceStatus = (id) => setCerts((p) => p.map((c) => (c.id === id && NEXT[c.status] ? { ...c, status: NEXT[c.status] } : c)));
  const release = (id) => setCerts((p) => p.map((c) => (c.id === id ? { ...c, retentionReleased: !c.retentionReleased } : c)));

  const row = (k, v, strong) => (
    <div className={`flex items-center justify-between text-xs ${strong ? "font-black text-[#0F172A] pt-2 border-t border-[#EEF1F5]" : "text-[#475569] font-bold"}`}>
      <span>{k}</span>
      <span>{v}</span>
    </div>
  );
  const input = "w-full px-3 py-2 rounded-lg border border-[#E3E7EE] text-xs font-bold text-[#0F172A] bg-white";

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent pb-24 font-ibm w-full max-w-full overflow-x-hidden">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-[#0F172A] flex items-center gap-2.5">
            <Receipt className="w-7 h-7" />
            <span>{T("cert.title")}</span>
          </h1>
          <p className="text-xs md:text-sm text-[#475569] mt-1">{T("cert.sub")}</p>
        </div>

        <select value={projectId} onChange={(e) => setProjectId(e.target.value)} className={input + " max-w-md"}>
          {PROJECTS.map((p) => (
            <option key={p.id} value={p.id}>{E(p.name)}</option>
          ))}
        </select>

        <div className="grid stat-grid grid-cols-2 md:grid-cols-4 gap-3">
          {[["cert.k.contract", money(project.contractValue, { compact: true })], ["cert.k.certified", money(t.gross, { compact: true })], ["cert.k.retention", money(t.retentionHeld, { compact: true })], ["cert.k.outstanding", money(t.outstanding, { compact: true })]].map(([k, v]) => (
            <div key={k} className="bg-white rounded-lg p-4 border border-[#E3E7EE] text-center">
              <span className="text-[11px] font-bold text-[#475569] block mb-1">{T(k)}</span>
              <span className="text-lg md:text-xl font-black text-[#0F172A]">{v}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
          <section className="lg:col-span-2 bg-white rounded-lg border border-[#E3E7EE] p-5 space-y-4">
            <h2 className="text-sm font-black text-[#0F172A]">{T("cert.new")} #{mine.length + 1}</h2>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1.5">{T("cert.cum")} ({T("cert.prev")}: {pct(prevPct)})</label>
              <input type="number" min={prevPct} max={100} value={cumPct} placeholder={String(project.progress)} onChange={(e) => setCumPct(e.target.value)} className={input} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#475569] mb-1.5">{T("cert.ret")} %</label>
                <input type="number" min={0} max={20} value={retPct} onChange={(e) => setRetPct(e.target.value)} className={input} />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#475569] mb-1.5">{T("cert.adv")}</label>
                <input type="number" min={0} value={advance} onChange={(e) => setAdvance(e.target.value)} className={input} />
              </div>
            </div>
            <div className="space-y-2 bg-[#F4F6F9] rounded-lg p-3">
              {row(T("cert.gross"), money(calc.gross))}
              {row("− " + T("cert.retention"), money(calc.retention))}
              {row("− " + T("cert.advrec"), money(calc.advance))}
              {row("+ " + T("cert.vat") + " " + pct(vatRate), money(calc.vat))}
              {row(T("cert.net"), money(calc.net), true)}
            </div>
            {!valid && <p className="text-[11px] font-bold text-rose-700">{T("cert.invalid")}</p>}
            <button type="button" disabled={!valid} onClick={issue} className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-[#0F172A] hover:bg-[#0F172A] disabled:opacity-40 cursor-pointer">{T("cert.issue")}</button>
          </section>

          <section className="lg:col-span-3 space-y-3">
            {mine.length === 0 && <p className="text-xs text-[#475569] bg-white rounded-lg border border-[#E3E7EE] p-6 text-center">{T("cert.empty")}</p>}
            {[...mine].reverse().map((c) => (
              <div key={c.id} className="bg-white rounded-lg border border-[#E3E7EE] p-4">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-sm font-black text-[#0F172A]">{T("cert.no")} {c.no} · {pct(c.cumPct)}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${c.status === "paid" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : c.status === "approved" ? "bg-amber-50 text-amber-800 border-amber-200" : "bg-[#EEF1F5] text-[#475569] border-[#E3E7EE]"}`}>{T("cert.s." + c.status)}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-[#475569] font-bold">
                  <span>{T("cert.gross")}<b className="block text-[#0F172A] text-xs">{money(c.gross, { compact: true })}</b></span>
                  <span>{T("cert.retention")}<b className="block text-[#0F172A] text-xs">{money(c.retention, { compact: true })}</b></span>
                  <span>{T("cert.vat")}<b className="block text-[#0F172A] text-xs">{money(c.vat, { compact: true })}</b></span>
                  <span>{T("cert.net")}<b className="block text-[#0F172A] text-xs">{money(c.net, { compact: true })}</b></span>
                </div>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <button type="button" onClick={() => release(c.id)} className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#475569] hover:text-[#0F172A] cursor-pointer">
                    {c.retentionReleased ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                    {c.retentionReleased ? T("cert.released") : T("cert.release")}
                  </button>
                  {NEXT[c.status] && (
                    <button type="button" onClick={() => advanceStatus(c.id)} className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-white bg-[#0F172A] hover:bg-[#0F172A] cursor-pointer">{T("cert.to." + NEXT[c.status])}</button>
                  )}
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>
    </main>
  );
}
