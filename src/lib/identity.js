// Login id = email OR mobile number. A mobile number maps to a private email-shaped id so Supabase email+password auth
// handles both (no SMS provider). Confirm-email must be OFF in Supabase for phone accounts.
const DOMAIN = import.meta.env.VITE_PHONE_AUTH_DOMAIN || "phone.miyarapp.com";
const CC = { EGP: "20", SAR: "966", AED: "971", TRY: "90", USD: "20", EUR: "39" };

const defaultCc = () => {
  try { return CC[JSON.parse(localStorage.getItem("miyar:settings:v1")).currency] || "20"; } catch { return "20"; }
};

export const isPhoneEmail = (e) => String(e || "").toLowerCase().endsWith("@" + DOMAIN);

/** "0100 123 4567" | "+20 100…" | "0020100…" -> "20100…" (digits, with country code) or null if not a phone. */
export function normalizePhone(raw) {
  const s = String(raw || "").trim();
  if (!/^[+\d\s()\-.]+$/.test(s)) return null;
  let d = s.replace(/\D/g, "");
  if (s.startsWith("+")) { /* already international */ }
  else if (d.startsWith("00")) d = d.slice(2);
  else if (d.startsWith("0")) d = defaultCc() + d.slice(1);
  return d.length >= 9 && d.length <= 15 ? d : null;
}

/** Email as typed, or the private id for a phone number. Throws when it is neither. */
export function toAuthEmail(input) {
  const v = String(input || "").trim();
  if (v.includes("@")) return v;
  const d = normalizePhone(v);
  if (!d) throw new Error("INVALID_ID");
  return `${d}@${DOMAIN}`;
}

/** What to show a person: "+201001234567" for phone ids, the email otherwise. */
export const displayId = (email) => (isPhoneEmail(email) ? "+" + String(email).split("@")[0] : email || "");

/** Random 10-char password without look-alike characters. */
export function genPassword() {
  const c = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const a = new Uint32Array(10); crypto.getRandomValues(a);
  return Array.from(a, (n) => c[n % c.length]).join("");
}
