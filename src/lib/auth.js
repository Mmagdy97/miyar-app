import { supabase, isSupabaseConfigured } from "./supabase";

export { isSupabaseConfigured };

// DB role -> app role id
const ROLE = { admin: "Admin", site_engineer: "Site Engineer", technical_office: "Technical Office", client: "Client" };
const PENDING = "miyar:pendingOrg";

/** Profile + office of the signed-in user (null when signed out). */
export async function loadAccount() {
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: p } = await supabase.from("profiles").select("full_name, role, org_id").eq("id", user.id).maybeSingle();
  let org = null;
  if (p?.org_id) ({ data: org } = await supabase.from("organizations").select("name, plan, status, trial_ends_at, currency, locale, extra_features").eq("id", p.org_id).maybeSingle());
  const { data: owner } = await supabase.rpc("is_platform_admin");
  return { user, name: p?.full_name || user.email, role: ROLE[p?.role] || "Client", org, isOwner: owner === true, hasOrg: Boolean(p?.org_id), orgId: p?.org_id || null };
}

/** Create the office on first sign-in after signup (needs an authenticated session). */
async function finishOnboarding() {
  let pending; try { pending = JSON.parse(localStorage.getItem(PENDING)); } catch { pending = null; }
  if (!pending || !pending.office) return;
  const { error } = await supabase.rpc("create_organization", { p_name: pending.office, p_country: pending.country, p_currency: pending.currency, p_locale: pending.locale });
  if (!error || /already in an organization/.test(error.message)) localStorage.removeItem(PENDING);
}

export async function signIn(email, password) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  await finishOnboarding();
  return loadAccount();
}

/** Returns the account when signed in immediately, or null when email confirmation is required. */
export async function signUp({ email, password, name, office, country, currency, locale }) {
  localStorage.setItem(PENDING, JSON.stringify({ office, country, currency, locale }));
  const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name }, emailRedirectTo: window.location.origin } });
  if (error) throw error;
  if (!data.session) return null;
  await finishOnboarding();
  return loadAccount();
}

export const signOut = () => supabase?.auth.signOut();
