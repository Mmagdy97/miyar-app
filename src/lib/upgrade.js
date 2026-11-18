import { askConfirm } from "./confirm";
import { getActiveOrg, withinLimit, hasFeature } from "./entitlements";
import { waLink } from "./nudge";
import { tr_ as T } from "../i18n";

const open = (msg) => window.open(waLink(msg), "_blank", "noopener");

/** Returns true when the office may add one more `key` (projects, cashEngineers...). Otherwise offers upgrade via WhatsApp. */
export async function checkLimit(key, count) {
  const org = getActiveOrg();
  if (withinLimit(org, key, count)) return true;
  const ok = await askConfirm(T("up.limit"), { yes: T("up.cta"), no: T("up.later") });
  if (ok) open(T("up.msgLimit", { plan: org?.plan || "free", what: T("up.k." + key) }));
  return false;
}

/** Same for a locked feature. */
export async function checkFeature(f) {
  const org = getActiveOrg();
  if (hasFeature(org, f)) return true;
  const ok = await askConfirm(T("up.feature"), { yes: T("up.cta"), no: T("up.later") });
  if (ok) open(T("up.msgFeature", { plan: org?.plan || "free", what: T("up.f." + f) }));
  return false;
}
