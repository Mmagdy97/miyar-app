// Share-link + WhatsApp helpers. The link carries a read-only snapshot in the URL (no backend needed);
// once Supabase is connected the same route can resolve a live record by id instead.

const toB64Url = (s) => {
  const bytes = new TextEncoder().encode(s);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};
const fromB64Url = (s) => {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4);
  const bin = atob(b64);
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
};

const str = (v, max = 200) => (typeof v === "string" ? v.slice(0, max) : "");
const num = (v, lo = 0, hi = Number.MAX_SAFE_INTEGER) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : 0;
};

/** Whitelist + clamp: whatever arrives in a URL is untrusted. */
export function sanitizeSnapshot(raw) {
  if (!raw || typeof raw !== "object") return null;
  const phases = Array.isArray(raw.phases) ? raw.phases.slice(0, 8).map((p) => str(p, 40)) : [];
  const timeline = Array.isArray(raw.timeline)
    ? raw.timeline.slice(0, 12).map((t) => ({ title: str(t?.title, 80), pct: num(t?.pct, 0, 100) }))
    : [];
  return {
    office: str(raw.office, 80),
    phone: str(raw.phone, 30).replace(/[^\d+]/g, ""),
    name: str(raw.name, 120),
    client: str(raw.client, 80),
    location: str(raw.location, 160),
    phase: str(raw.phase, 40),
    status: str(raw.status, 40),
    progress: num(raw.progress, 0, 100),
    deadline: str(raw.deadline, 20),
    updated: str(raw.updated, 30),
    phases,
    timeline,
    currency: str(raw.currency, 3),
    contract: num(raw.contract),
    collected: num(raw.collected),
    note: str(raw.note, 400),
  };
}

export function encodeSnapshot(snap) {
  return toB64Url(JSON.stringify(sanitizeSnapshot(snap)));
}

export function decodeSnapshot(payload) {
  try {
    return sanitizeSnapshot(JSON.parse(fromB64Url(payload)));
  } catch {
    return null;
  }
}

export function buildShareUrl(snap, origin = window.location.origin) {
  return `${origin}/?share=${encodeSnapshot(snap)}`;
}

export const whatsappLink = (text, phone = "") =>
  `https://wa.me/${String(phone).replace(/[^\d]/g, "")}?text=${encodeURIComponent(text)}`;

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }
}
