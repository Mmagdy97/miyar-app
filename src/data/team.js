import { createPersistedStore } from "./persisted";
import { supabase } from "../lib/supabase";
import { toAuthEmail } from "../lib/identity";

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
  invite: (id, role) => run(supabase.rpc("invite_member", { p_email: toAuthEmail(id), p_role: role })),
  setRole: (id, role) => run(supabase.rpc("set_member_role", { p_user: id, p_role: role })),
  create: async ({ name, login, password, role }) => { const { data, error } = await supabase.rpc("admin_create_member", { p_name: name, p_login: toAuthEmail(login), p_password: password, p_role: role }); if (error) throw error; await loadTeam(); return data; },
  resetPassword: async (id, password) => { const { error } = await supabase.rpc("admin_reset_password", { p_user: id, p_password: password }); if (error) throw error; },
  remove: (m) => run(supabase.rpc("remove_member", { p_user: m.id, p_email: m.email })),
};
