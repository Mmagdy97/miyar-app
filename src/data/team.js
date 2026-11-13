import { createPersistedStore } from "./persisted";
import { supabase } from "../lib/supabase";

// Team of the signed-in office (Supabase only, admin).
const live = createPersistedStore("live:team", [], (x) => x, { persist: false });
const fail = (error) => window.dispatchEvent(new CustomEvent("miyar:error", { detail: error.message || String(error) }));

export const MEMBER_ROLES = ["admin", "site_engineer", "technical_office"];

export async function loadTeam() {
  const { data, error } = await supabase.rpc("list_members");
  if (error) return fail(error);
  live.set((data || []).map((r) => ({ id: r.id, name: r.full_name || "", email: r.email, role: r.role, pending: Boolean(r.pending) })));
}

const run = async (q) => { const { error, data } = await q; if (error) { fail(error); return null; } await loadTeam(); return data; };

export const teamRepo = {
  use: () => live.use()[0],
  invite: (email, role) => run(supabase.rpc("invite_member", { p_email: email, p_role: role })),
  setRole: (id, role) => run(supabase.rpc("set_member_role", { p_user: id, p_role: role })),
  remove: (m) => run(supabase.rpc("remove_member", { p_user: m.id, p_email: m.email })),
};
