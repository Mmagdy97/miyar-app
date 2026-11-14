import { useEffect, useState } from "react";
import { Users, UserPlus, Trash2 } from "lucide-react";
import { tr_ as T } from "../i18n";
import { supabase } from "../lib/supabase";
import { teamRepo, loadTeam, MEMBER_ROLES } from "../data/team";

const input = "px-3 py-2 rounded-lg border border-[#DCE4DC] text-xs font-bold text-[#1F2A26] bg-white min-w-0";

/** Admin of a real office: invite staff by email and manage roles. */
export default function LiveTeam() {
  const [myId, setMyId] = useState(null);
  const members = teamRepo.use();
  const [f, setF] = useState({ email: "", role: "site_engineer" });
  const [msg, setMsg] = useState("");
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
          <h1 className="text-2xl md:text-3xl font-semibold text-[#1F2A26] flex items-center gap-2.5"><Users className="w-7 h-7" /><span>{T("team.title")}</span></h1>
          <p className="text-xs md:text-sm text-[#56635B] mt-1">{T("team.sub")}</p>
        </div>
        <form onSubmit={submit} className="bg-white rounded-2xl border border-[#DCE4DC] p-4 flex flex-wrap gap-2 items-end">
          <input required type="email" dir="ltr" placeholder={T("live.invitePh")} value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} className={input + " flex-1 min-w-48"} />
          <select value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })} className={input}>
            {MEMBER_ROLES.map((r) => <option key={r} value={r}>{T(`team.r.${r}`)}</option>)}
          </select>
          <button type="submit" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#5F6C61] hover:bg-[#4B574D] cursor-pointer"><UserPlus className="w-4 h-4" />{T("team.invite")}</button>
        </form>
        {msg && <p role="status" className="text-xs text-[#56635B]">{msg}</p>}
        <div className="grid gap-2">
          {members.map((m) => {
            const me = m.id && m.id === myId;
            return (
              <article key={m.id || m.email} className="bg-white rounded-2xl border border-[#DCE4DC] p-4 flex flex-wrap items-center gap-3">
                <div className="flex-1 min-w-48">
                  <p className="text-sm font-semibold text-[#1F2A26]">{m.name || m.email}{me && <span className="text-[11px] text-[#6E7B72]"> · {T("team.you")}</span>}</p>
                  <p className="text-[11px] text-[#6E7B72]" dir="ltr">{m.email}</p>
                </div>
                {m.pending && <span className="text-[10px] font-bold px-2 py-0.5 rounded-md border bg-amber-50 text-amber-800 border-amber-200">{T("live.pending")}</span>}
                {m.pending || me ? <span className="text-xs font-bold text-[#56635B]">{T(`team.r.${m.role}`)}</span> : (
                  <select value={m.role} onChange={(e) => teamRepo.setRole(m.id, e.target.value)} className={input}>
                    {MEMBER_ROLES.map((r) => <option key={r} value={r}>{T(`team.r.${r}`)}</option>)}
                  </select>
                )}
                {!me && <button type="button" onClick={() => teamRepo.remove(m)} aria-label={T("cash.delete")} className="p-1.5 rounded-lg text-[#6E7B72] hover:text-rose-700 hover:bg-rose-50 cursor-pointer"><Trash2 className="w-4 h-4" /></button>}
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
