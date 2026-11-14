// Whole-office backup of everything Miyar keeps on this device (localStorage "miyar:*").
const SKIP = new Set(["miyar:consent:v1", "miyar:cookies"]);
export const BACKUP_APP = "miyar";

export function collectBackup(storage, now = new Date()) {
  const data = {};
  for (let i = 0; i < storage.length; i++) {
    const k = storage.key(i);
    if (k && k.startsWith("miyar:") && !SKIP.has(k)) data[k] = storage.getItem(k);
  }
  return { app: BACKUP_APP, version: 1, at: now.toISOString(), data };
}

/** Returns { ok, keys, at } or { ok:false, reason }. Never writes anything. */
export function validateBackup(obj) {
  if (!obj || typeof obj !== "object" || obj.app !== BACKUP_APP || typeof obj.data !== "object" || !obj.data) return { ok: false, reason: "format" };
  const keys = Object.keys(obj.data).filter((k) => k.startsWith("miyar:") && typeof obj.data[k] === "string");
  if (!keys.length) return { ok: false, reason: "empty" };
  for (const k of keys) { try { JSON.parse(obj.data[k]); } catch { return { ok: false, reason: "corrupt" }; } }
  return { ok: true, keys, at: obj.at };
}

export function restoreBackup(storage, obj) {
  const v = validateBackup(obj);
  if (!v.ok) return v;
  for (const k of v.keys) storage.setItem(k, obj.data[k]);
  return v;
}
