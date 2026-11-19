import { useEffect, useState } from "react";
import { KeyRound } from "lucide-react";
import { Users, UserPlus, Trash2 } from "lucide-react";
import { tr_ as T } from "../i18n";
import { askConfirm } from "../lib/confirm";
import { supabase } from "../lib/supabase";
import { teamRepo, loadTeam, MEMBER_ROLES } from "../data/team";
import { displayId, genPassword, toAuthEmail } from "../lib/identity";

const input = "px-3 py-2 rounded-lg border border-[#E2E8F0] text-xs font-bold text-[#0E2A47] bg-white min-w-0";

/** Admin of a real office: invite staff by email and manage roles. */
export default function LiveTeam({ secretary = false }) {
  const ROLES_ALLOWED = secretary ? MEMBER_ROLES.filter((r) => r !== "admin" && r !== "secretary") : MEMBER_ROLES;
  const [myId, setMyId] = useState(null);
  const members = teamRepo.use();
  const [f, setF] = useState({ email: "", role: "site_engineer" });
  const [nm, setNm] = useState({ name: "", login: "", password: genPassword(), role: "site_engineer" });
  const addMember = async (e) => {
    e.preventDefault(); setMsg("");
    try {
      await teamRepo.create(nm);
      setMsg(T("team.created") + " " + displayId(toAuthEmail(nm.login)) + " / " + nm.password);
      setNm({ name: "", login: "", password: genPassword(), role: nm.role });
    } catch (err) { setMsg(err.message === "INVALID_ID" ? T("login.badId") : T("login.err") + (err.message || "")); }
  };
  const [msg, setMsg] = useState("");
  const [pw, setPw] = useState(null); // { id, value }
  const genPw = genPassword;
  const savePw = async (e) => {
    e.preventDefault();
    try { await teamRepo.resetPassword(pw.id, pw.value); setMsg(T("team.pwDone") + " " + pw.value); setPw(null); }
    catch (err) { setMsg(T("login.err") + (err.message || "")); }
  };
  useEffect(() => { loadTeam(); supabase.auth.getUser().then(({ data }) => setMyId(data?.user?.id || null)); }, []);
  const submit = async (e) => {
    e.preventDefault();
    const r = await teamRepo.invite(f.email.trim(), f.role);
    if (r) { setMsg(T(r === "linked" ? "team.linked" : "team.invited")); setF({ ...f, email: "" }); }
  };
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 font-ibm w-full max-w-full overflow-x-hidden">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-[#0E2A47] flex items-center gap-2.5"><Users className="w-7 h-7" /><span>{T("team.title")}</span></h1>
          <p className="text-xs md:text-sm text-[#475569] mt-1">{T("team.sub")}</p>
        </div>
        <form onSubmit={addMember} className="bg-white rounded-2xl border border-[#E2E8F0] p-4 grid gap-2 sm:grid-cols-2">
          <h2 className="sm:col-span-2 text-sm font-semibold text-[#0E2A47]">{T("team.addDirect")}</h2>
          <input required minLength={2} value={nm.name} onChange={(e) => setNm({ ...nm, name: e.target.value })} aria-label={T("login.name")} placeholder={T("login.name")} className={input} />
          <input required dir="ltr" autoCapitalize="none" value={nm.login} onChange={(e) => setNm({ ...nm, login: e.target.value })} aria-label={T("pm.eng.email")} placeholder={T("pm.eng.email")} className={input} />
          <div className="flex gap-2">
            <input required minLength={8} dir="ltr" value={nm.password} onChange={(e) => setNm({ ...nm, password: e.target.value })} aria-label={T("login.password")} className={input + " flex-1 font-mono"} />
            <button type="button" onClick={() => setNm({ ...nm, password: genPassword() })} className="px-3 py-2 rounded-lg text-xs font-bold text-[#0B7C79] border border-[#E2E8F0] cursor-pointer">{T("team.pwGen")}</button>
          </div>
          <select value={nm.role} onChange={(e) => setNm({ ...nm, role: e.target.value })} className={input}>
            {ROLES_ALLOWED.map((r) => <option key={r} value={r}>{T(`team.r.${r}`)}</option>)}
          </select>
          <button type="submit" className="sm:col-span-2 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold text-white bg-[#0B7C79] hover:bg-[#086663] cursor-pointer"><UserPlus className="w-4 h-4" aria-hidden="true" />{T("team.addGo")}</button>
        </form>
        {!secretary && <>
        <p className="text-[11px] text-[#64748B]">{T("team.orInvite")}</p>
        <form onSubmit={submit} className="bg-white rounded-2xl border border-[#E2E8F0] p-4 flex flex-wrap gap-2 items-end">
          <input required type="text" autoCapitalize="none" dir="ltr" placeholder={T("pm.eng.email")} value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} className={input + " flex-1 min-w-48"} />
          <select value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })} className={input}>
            {ROLES_ALLOWED.map((r) => <option key={r} value={r}>{T(`team.r.${r}`)}</option>)}
          </select>
          <button type="submit" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#0B7C79] hover:bg-[#086663] cursor-pointer"><UserPlus className="w-4 h-4" />{T("team.invite")}</button>
        </form>
        </>}
        {msg && <p role="status" className="text-xs text-[#475569]">{msg}</p>}
        <div className="grid gap-2">
          {members.map((m) => {
            const me = m.id && m.id === myId;
            return (
              <article key={m.id || m.email} className="bg-white rounded-2xl border border-[#E2E8F0] p-4 flex flex-wrap items-center gap-3">
                <div className="flex-1 min-w-48">
                  <p className="text-sm font-semibold text-[#0E2A47]">{m.name || displayId(m.email)}{me && <span className="text-[11px] text-[#64748B]"> · {T("team.you")}</span>}</p>
                  <p className="text-[11px] text-[#64748B]" dir="ltr">{displayId(m.email)}</p>
                </div>
                {m.pending && <span className="text-[10px] font-bold px-2 py-0.5 rounded-md border bg-amber-50 text-amber-800 border-amber-200">{T("live.pending")}</span>}
                {m.pending || me || secretary ? <span className="text-xs font-bold text-[#475569]">{T(`team.r.${m.role}`)}</span> : (
                  <select value={m.role} onChange={(e) => teamRepo.setRole(m.id, e.target.value)} className={input}>
                    {ROLES_ALLOWED.map((r) => <option key={r} value={r}>{T(`team.r.${r}`)}</option>)}
                  </select>
                )}
                {!secretary && !me && !m.pending && <button type="button" onClick={() => setPw({ id: m.id, value: genPw() })} aria-label={T("team.pwReset")} title={T("team.pwReset")} className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0E2A47] hover:bg-[#EEF1F5] cursor-pointer"><KeyRound className="w-4 h-4" aria-hidden="true" /></button>}
                {pw?.id === m.id && (
                  <form onSubmit={savePw} className="basis-full flex flex-wrap gap-2 items-center pt-1">
                    <input required minLength={8} dir="ltr" value={pw.value} onChange={(e) => setPw({ ...pw, value: e.target.value })} aria-label={T("team.pwNew")} className={input + " flex-1 min-w-40 font-mono"} />
                    <button type="button" onClick={() => setPw({ ...pw, value: genPw() })} className="px-3 py-2 rounded-lg text-xs font-bold text-[#0B7C79] border border-[#E2E8F0] cursor-pointer">{T("team.pwGen")}</button>
                    <button type="submit" className="px-3 py-2 rounded-lg text-xs font-bold text-white bg-[#0B7C79] cursor-pointer">{T("team.pwSave")}</button>
                    <button type="button" onClick={() => setPw(null)} className="px-2 py-2 text-xs font-bold text-[#475569] cursor-pointer">{T("boq.cancel")}</button>
                  </form>
                )}
                {!me && !(secretary && (m.role === "admin" || m.role === "secretary")) && <button type="button" onClick={async () => { if (await askConfirm(T("team.rmConfirm"))) teamRepo.remove(m); }} aria-label={T("cash.delete")} className="p-1.5 rounded-lg text-[#64748B] hover:text-rose-700 hover:bg-rose-50 cursor-pointer"><Trash2 className="w-4 h-4" /></button>}
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
