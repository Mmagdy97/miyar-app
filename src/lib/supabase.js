import { createClient } from "@supabase/supabase-js";

// The URL and publishable key are public by design (RLS protects the data); env vars override them.
const url = import.meta.env.VITE_SUPABASE_URL || "https://ekpjeurepyqwhmankjxk.supabase.co";
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_9LHDV74WgM4dxuhvcuPxIA_ZBj0YikQ";

// When env vars are missing the app keeps running in demo mode (seed data).
export const isSupabaseConfigured = Boolean(url && key);
export const supabase = isSupabaseConfigured ? createClient(url, key) : null;
