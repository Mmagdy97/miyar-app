// Error tracking (Sentry). Off unless VITE_SENTRY_DSN is set, and loaded lazily so it adds nothing to first paint.
// No personal data: no IPs, emails or form contents; only the error, the page and the role/site tags.
const DSN = import.meta.env.VITE_SENTRY_DSN;
let sentry = null;
const queue = [];

export function initMonitoring() {
  if (!DSN || typeof window === "undefined") return;
  const early = (e) => queue.push(e.reason || e.error || e);
  window.addEventListener("error", early);
  window.addEventListener("unhandledrejection", early);
  import("@sentry/react").then((S) => {
    S.init({
      dsn: DSN,
      environment: import.meta.env.VITE_SITE || "app",
      release: import.meta.env.VITE_RELEASE || undefined,
      sendDefaultPii: false,
      tracesSampleRate: 0,
      beforeSend(event) {
        if (event.request) delete event.request.cookies;
        if (event.user) event.user = { id: event.user.id };
        return event;
      },
    });
    sentry = S;
    window.removeEventListener("error", early);
    window.removeEventListener("unhandledrejection", early);
    queue.splice(0).forEach((err) => S.captureException(err));
  }).catch(() => { /* monitoring must never break the app */ });
}

/** Report a caught error (e.g. from the React error boundary). */
export function reportError(error, context) {
  if (!DSN) return;
  if (sentry) sentry.captureException(error, context ? { extra: context } : undefined);
  else queue.push(error);
}

/** Tag later events with the role and an anonymous org id (no names or emails). */
export function setMonitorContext({ role, orgId } = {}) {
  if (!sentry) return;
  if (role) sentry.setTag("role", role);
  if (orgId) sentry.setUser({ id: String(orgId) });
}
