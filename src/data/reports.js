import { createPersistedStore } from "./persisted";
import { supabase } from "../lib/supabase";
import { fileToBlob } from "../lib/image";

// Daily site reports + photos (Supabase Storage, private bucket; shown through short-lived signed URLs).
const live = createPersistedStore("live:reports", [], (x) => x, { persist: false });
const fail = (error) => window.dispatchEvent(new CustomEvent("miyar:error", { detail: error.message || String(error) }));
const BUCKET = "site-photos";
export const MAX_PHOTOS = 6;
let orgId = null;

const from = (r) => ({ id: r.id, projectId: r.project_id, author: r.author_name || "", day: r.day, note: r.note || "", progress: r.progress, photos: r.photos || [], at: r.created_at });

async function reload() {
  const { data, error } = await supabase.from("daily_reports").select("*").order("day", { ascending: false }).order("id", { ascending: false }).limit(200);
  if (error) fail(error); else live.set((data || []).map(from));
}
export async function attachReports(org) { orgId = org || null; live.set([]); if (orgId) await reload(); }

/** Signed URLs for stored photo paths: { path: url }. */
export async function photoUrls(paths) {
  if (!paths.length) return {};
  const { data } = await supabase.storage.from(BUCKET).createSignedUrls(paths, 3600);
  return Object.fromEntries((data || []).filter((d) => d.signedUrl).map((d) => [d.path, d.signedUrl]));
}

export const reportsRepo = {
  use: () => live.use()[0],
  add: async ({ projectId, note, progress, files }) => {
    const user = (await supabase.auth.getUser()).data?.user;
    const authorName = (await supabase.from("profiles").select("full_name").eq("id", user?.id).maybeSingle()).data?.full_name || null;
    const paths = [];
    for (const file of files.slice(0, MAX_PHOTOS)) {
      const blob = await fileToBlob(file);
      const path = `${orgId}/${projectId}/${crypto.randomUUID()}.jpg`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, blob, { contentType: "image/jpeg" });
      if (error) { fail(error); return false; }
      paths.push(path);
    }
    const { error } = await supabase.from("daily_reports").insert({ org_id: orgId, project_id: projectId, author_id: user?.id, author_name: authorName || null, note: note || null, progress: progress === "" || progress == null ? null : Number(progress), photos: paths });
    if (error) { fail(error); return false; }
    await reload();
    return true;
  },
  remove: async (r) => {
    if (r.photos.length) await supabase.storage.from(BUCKET).remove(r.photos);
    const { error } = await supabase.from("daily_reports").delete().eq("id", r.id);
    if (error) fail(error);
    await reload();
  },
};
