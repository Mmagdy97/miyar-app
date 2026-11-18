// Which site this build is serving. Same code, three faces:
//   landing  -> marketing page only (miyarapp.com)
//   app      -> real accounts only, no demo (app.miyarapp.com)
//   demo     -> sample data only, no real login (demo.miyarapp.com)
// Until the domains exist, Vercel serves them as /, /app and /demo.
function detect() {
  if (typeof window === "undefined") return "landing";
  const forced = import.meta.env.VITE_SITE;
  if (forced === "app" || forced === "demo" || forced === "landing") return forced;
  const h = window.location.hostname;
  if (h.startsWith("app.")) return "app";
  if (h.startsWith("demo.")) return "demo";
  const p = window.location.pathname;
  if (p === "/app" || p.startsWith("/app/")) return "app";
  if (p === "/demo" || p.startsWith("/demo/")) return "demo";
  return "landing";
}

export const SITE = detect();

const env = import.meta.env;
export const APP_URL = env.VITE_APP_URL || "/app";
export const DEMO_URL = env.VITE_DEMO_URL || "/demo";
export const LANDING_URL = env.VITE_LANDING_URL || "/";

export function goApp(mode = "in") { window.location.href = `${APP_URL}${mode === "up" ? "?signup=1" : ""}`; }
export function goDemo(role = "Admin") { window.location.href = `${DEMO_URL}?role=${encodeURIComponent(role)}`; }
export function goLanding() { window.location.href = LANDING_URL; }

export const SESSION_KEY = `miyar:session:${SITE}`;
