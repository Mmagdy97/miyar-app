// Smart, low-friction contact nudge for demo visitors (no form, no login wall).
export const SALES_WHATSAPP = "201557788744"; // +20 155 778 8744

const SS = "miyar:nudge:v1";
const DONE = "miyar:nudge:done";
const read = () => { try { return JSON.parse(sessionStorage.getItem(SS)) || {}; } catch { return {}; } };
const write = (s) => { try { sessionStorage.setItem(SS, JSON.stringify(s)); } catch { /* ignore */ } };
const state = () => { const s = read(); return { start: s.start || Date.now(), tabs: s.tabs || [], wins: s.wins || [], dismissed: !!s.dismissed }; };

/** A "value moment": the visitor just got something real out of the product (export, print, send, approve). */
export function valueMoment(kind) {
  const s = state();
  if (!s.wins.includes(kind)) s.wins.push(kind);
  write(s);
  window.dispatchEvent(new Event("miyar:value"));
}

export function trackTab(role, tab) {
  const s = state();
  const k = `${role}|${tab}`;
  if (!s.tabs.includes(k)) s.tabs.push(k);
  write(s);
}

export const dismiss = () => { const s = state(); s.dismissed = true; write(s); };
export const markDone = () => { try { localStorage.setItem(DONE, "1"); } catch { /* ignore */ } };
const isDone = () => { try { return localStorage.getItem(DONE) === "1"; } catch { return false; } };

/**
 * Show only after real engagement, never as a wall:
 * a value moment after 45s, or 5+ screens explored, or 3 minutes of use. Once per visit; never again after contact.
 */
export function shouldNudge(now = Date.now(), s = state(), done = isDone()) {
  if (done || s.dismissed) return false;
  const t = now - s.start;
  return (s.wins.length > 0 && t >= 45_000) || s.tabs.length >= 5 || t >= 180_000;
}

export const visitSummary = () => state();

export function waLink(text) {
  return `https://wa.me/${SALES_WHATSAPP}?text=${encodeURIComponent(text)}`;
}
