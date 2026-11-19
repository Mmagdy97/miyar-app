import { useMemo } from "react";
import { createPersistedStore } from "./persisted";
import { supabase } from "../lib/supabase";
import { fileToBlob } from "../lib/image";

// Supplier (purchase) invoices of the signed-in office. Files: private bucket, short-lived signed URLs.
const live = createPersistedStore("live:purchases", [], (x) => x, { persist: false });
const fail = (error) => window.dispatchEvent(new CustomEvent("miyar:error", { detail: error.message || String(error) }));
const BUCKET = "purchase-invoices";
let orgId = null;

const fromRow = (r) => ({ id: r.id, projectId: r.project_id, title: r.title, supplier: r.supplier || "", amount: Number(r.amount) || 0, file: r.file_path || "", visible: Boolean(r.visible_to_client), archivedAt: r.archived_at || null, at: r.created_at });

async function reload() {
  const { data, error } = await supabase.from("purchase_invoices").select("*").order("id", { ascending: false });
  if (error) fail(error); else live.set((data || []).map(fromRow));
}
export async function attachPurchases(org) { orgId = org || null; live.set([]); if (orgId) await reload(); }

export async function purchaseFileUrl(path) {
  const { data } = await supabase.storage.from(BUCKET).createSignedUrl(path, 3600);
  return data?.signedUrl || "";
}

const run = async (q) => { const { error } = await q; if (error) fail(error); await reload(); };
const MAX_BYTES = 8 * 1024 * 1024;

export const purchasesRepo = {
  use: () => { const r = live.use()[0]; return useMemo(() => r.filter((i) => !i.archivedAt), [r]); },
  useArchived: () => { const r = live.use()[0]; return useMemo(() => r.filter((i) => i.archivedAt), [r]); },
  add: async ({ projectId, title, supplier, amount, file, visible = false }) => {
    let path = null;
    if (file) {
      const isPdf = file.type === "application/pdf";
      if (!isPdf && !file.type.startsWith("image/")) { fail(new Error("PDF / image only")); return false; }
      if (file.size > MAX_BYTES) { fail(new Error("File too large (max 8MB)")); return false; }
      const body = isPdf ? file : await fileToBlob(file, 1800, 0.8);
      path = `${orgId}/${projectId}/${crypto.randomUUID()}.${isPdf ? "pdf" : "jpg"}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, body, { contentType: isPdf ? "application/pdf" : "image/jpeg" });
      if (error) { fail(error); return false; }
    }
    await run(supabase.from("purchase_invoices").insert({ org_id: orgId, project_id: projectId, title, supplier: supplier || null, amount, file_path: path, visible_to_client: Boolean(visible) }));
    return true;
  },
  setVisible: (id, visible) => run(supabase.from("purchase_invoices").update({ visible_to_client: visible }).eq("id", id)),
  archive: (id) => run(supabase.from("purchase_invoices").update({ archived_at: new Date().toISOString() }).eq("id", id)),
  restore: (id) => run(supabase.from("purchase_invoices").update({ archived_at: null }).eq("id", id)),
};
