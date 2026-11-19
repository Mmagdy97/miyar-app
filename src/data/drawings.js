import { createPersistedStore } from "./persisted";
import { supabase } from "../lib/supabase";
import { fileToBlob } from "../lib/image";
import { nextRev } from "../lib/drawings";

// Drawing revisions of the signed-in office. Files: private bucket, short-lived signed URLs.
const live = createPersistedStore("live:drawings", [], (x) => x, { persist: false });
const fail = (error) => window.dispatchEvent(new CustomEvent("miyar:error", { detail: error.message || String(error) }));
const BUCKET = "drawings";
const MAX_BYTES = 15 * 1024 * 1024;
let orgId = null;

export const fromRow = (r) => ({
  id: r.id, projectId: r.project_id, code: r.code, name: r.name, discipline: r.discipline || "", rev: r.rev, status: r.status,
  note: r.note || "", file: r.file_path || "", by: r.uploaded_by || "", date: String(r.created_at || "").slice(0, 10),
});

async function reload() {
  const { data, error } = await supabase.from("drawing_files").select("*").order("id", { ascending: false });
  if (error) fail(error); else live.set((data || []).map(fromRow));
}
export async function attachDrawings(org) { orgId = org || null; live.set([]); if (orgId) await reload(); }
export async function drawingUrl(path) {
  const { data } = await supabase.storage.from(BUCKET).createSignedUrl(path, 3600);
  return data?.signedUrl || "";
}
const run = async (q) => { const { error } = await q; if (error) fail(error); await reload(); };

export const drawingsRepo = {
  use: () => live.use()[0],
  /** Upload a new revision (rev = previous + 1 for the same code). */
  add: async ({ projectId, code, name, discipline, note, file, by }) => {
    let path = null;
    if (file) {
      const isPdf = file.type === "application/pdf";
      if (!isPdf && !file.type.startsWith("image/")) { fail(new Error("PDF / image only")); return false; }
      if (file.size > MAX_BYTES) { fail(new Error("File too large (max 15MB)")); return false; }
      const body = isPdf ? file : await fileToBlob(file, 3000, 0.85);
      path = `${orgId}/${projectId}/${crypto.randomUUID()}.${isPdf ? "pdf" : "jpg"}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, body, { contentType: isPdf ? "application/pdf" : "image/jpeg" });
      if (error) { fail(error); return false; }
    }
    const { data } = await supabase.from("drawing_files").select("project_id,code,rev").eq("project_id", projectId).eq("code", code);
    const rev = nextRev((data || []).map((r) => ({ projectId: r.project_id, code: r.code, rev: r.rev })), projectId, code);
    await run(supabase.from("drawing_files").insert({ org_id: orgId, project_id: projectId, code, name, discipline: discipline || null, rev, note: note || null, file_path: path, uploaded_by: by || null }));
    return true;
  },
  setStatus: (id, status) => run(supabase.from("drawing_files").update({ status }).eq("id", id)),
};
