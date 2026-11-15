import { useEffect, useState } from "react";
import { KeyRound } from "lucide-react";
import { Users, UserPlus, Trash2 } from "lucide-react";
import { tr_ as T } from "../i18n";
import { supabase } from "../lib/supabase";
import { teamRepo, loadTeam, MEMBER_ROLES } from "../data/team";
import { displayId, genPassword, toAuthEmail } from "../lib/identity";

const input = "px-3 py-2 rounded-lg border border-[#E0D6C2] text-xs font-bold text-[#1E223D] bg-white min-w-0";

/** Admin of a real office: invite staff by email and manage roles. */
export default function LiveTeam() {
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
          <h1 className="text-2xl md:text-3xl font-semibold text-[#1E223D] flex items-center gap-2.5"><Users className="w-7 h-7" /><span>{T("team.title")}</span></h1>
          <p className="text-xs md:text-sm text-[#4F5470] mt-1">{T("team.sub")}</p>
        </div>
        <form onSubmit={addMember} className="bg-white rounded-2xl border border-[#E0D6C2] p-4 grid gap-2 sm:grid-cols-2">
          <h2 className="sm:col-span-2 text-sm font-semibold text-[#1E223D]">{T("team.addDirect")}</h2>
          <input required minLength={2} value={nm.name} onChange={(e) => setNm({ ...nm, name: e.target.value })} aria-label={T("login.name")} placeholder={T("login.name")} className={input} />
          <input required dir="ltr" autoCapitalize="none" value={nm.login} onChange={(e) => setNm({ ...nm, login: e.target.value })} aria-label={T("pm.eng.email")} placeholder={T("pm.eng.email")} className={input} />
          <div className="flex gap-2">
            <input required minLength={8} dir="ltr" value={nm.password} onChange={(e) => setNm({ ...nm, password: e.target.value })} aria-label={T("login.password")} className={input + " flex-1 font-mono"} />
            <button type="button" onClick={() => setNm({ ...nm, password: genPassword() })} className="px-3 py-2 rounded-lg text-xs font-bold text-[#2B3052] border border-[#E0D6C2] cursor-pointer">{T("team.pwGen")}</button>
          </div>
          <select value={nm.role} onChange={(e) => setNm({ ...nm, role: e.target.value })} className={input}>
            {MEMBER_ROLES.map((r) => <option key={r} value={r}>{T(`team.r.${r}`)}</option>)}
          </select>
          <button type="submit" className="sm:col-span-2 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold text-white bg-[#2B3052] hover:bg-[#3A4070] cursor-pointer"><UserPlus className="w-4 h-4" aria-hidden="true" />{T("team.addGo")}</button>
        </form>
        <p className="text-[11px] text-[#666B86]">{T("team.orInvite")}</p>
        <form onSubmit={submit} className="bg-white rounded-2xl border border-[#E0D6C2] p-4 flex flex-wrap gap-2 items-end">
          <input required type="text" autoCapitalize="none" dir="ltr" placeholder={T("pm.eng.email")} value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} className={input + " flex-1 min-w-48"} />
          <select value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })} className={input}>
            {MEMBER_ROLES.map((r) => <option key={r} value={r}>{T(`team.r.${r}`)}</option>)}
          </select>
          <button type="submit" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#2B3052] hover:bg-[#3A4070] cursor-pointer"><UserPlus className="w-4 h-4" />{T("team.invite")}</button>
        </form>
        {msg && <p role="status" className="text-xs text-[#4F5470]">{msg}</p>}
        <div className="grid gap-2">
          {members.map((m) => {
            const me = m.id && m.id === myId;
            return (
              <article key={m.id || m.email} className="bg-white rounded-2xl border border-[#E0D6C2] p-4 flex flex-wrap items-center gap-3">
                <div className="flex-1 min-w-48">
                  <p className="text-sm font-semibold text-[#1E223D]">{m.name || displayId(m.email)}{me && <span className="text-[11px] text-[#666B86]"> · {T("team.you")}</span>}</p>
                  <p className="text-[11px] text-[#666B86]" dir="ltr">{displayId(m.email)}</p>
                </div>
                {m.pending && <span className="text-[10px] font-bold px-2 py-0.5 rounded-md border bg-amber-50 text-amber-800 border-amber-200">{T("live.pending")}</span>}
                {m.pending || me ? <span className="text-xs font-bold text-[#4F5470]">{T(`team.r.${m.role}`)}</span> : (
                  <select value={m.role} onChange={(e) => teamRepo.setRole(m.id, e.target.value)} className={input}>
                    {MEMBER_ROLES.map((r) => <option key={r} value={r}>{T(`team.r.${r}`)}</option>)}
                  </select>
                )}
                {!me && !m.pending && <button type="button" onClick={() => setPw({ id: m.id, value: genPw() })} aria-label={T("team.pwReset")} title={T("team.pwReset")} className="p-1.5 rounded-lg text-[#666B86] hover:text-[#1E223D] hover:bg-[#EFE7D6] cursor-pointer"><KeyRound className="w-4 h-4" aria-hidden="true" /></button>}
                {pw?.id === m.id && (
                  <form onSubmit={savePw} className="basis-full flex flex-wrap gap-2 items-center pt-1">
                    <input required minLength={8} dir="ltr" value={pw.value} onChange={(e) => setPw({ ...pw, value: e.target.value })} aria-label={T("team.pwNew")} className={input + " flex-1 min-w-40 font-mono"} />
                    <button type="button" onClick={() => setPw({ ...pw, value: genPw() })} className="px-3 py-2 rounded-lg text-xs font-bold text-[#2B3052] border border-[#E0D6C2] cursor-pointer">{T("team.pwGen")}</button>
                    <button type="submit" className="px-3 py-2 rounded-lg text-xs font-bold text-white bg-[#2B3052] cursor-pointer">{T("team.pwSave")}</button>
                    <button type="button" onClick={() => setPw(null)} className="px-2 py-2 text-xs font-bold text-[#4F5470] cursor-pointer">{T("boq.cancel")}</button>
                  </form>
                )}
                {!me && <button type="button" onClick={() => teamRepo.remove(m)} aria-label={T("cash.delete")} className="p-1.5 rounded-lg text-[#666B86] hover:text-rose-700 hover:bg-rose-50 cursor-pointer"><Trash2 className="w-4 h-4" /></button>}
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
