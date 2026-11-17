import { whatsappLink } from "./share";
import { isPhoneEmail } from "./identity";
import { getActiveOrg } from "./entitlements";
import { tr_ as T, money } from "../i18n";

// WhatsApp click-to-chat (wa.me): opens WhatsApp with a ready message. No API, no cost; the sender taps Send.
/** Client's number when they signed in by mobile; "" otherwise (WhatsApp then asks who to send to). */
export const clientPhone = (p) => (isPhoneEmail(p?.clientEmail) ? String(p.clientEmail).split("@")[0] : "");

const sign = () => `\n— ${getActiveOrg()?.name || "Miyar"}\n${typeof window !== "undefined" ? window.location.origin : ""}`;
const hello = (p) => T("wa.hello", { 0: p.client || "" });

export const quoteWa = (p, total) => whatsappLink(`${hello(p)}\n${T("wa.quote", { 0: p.name, 1: money(total) })}${sign()}`, clientPhone(p));
export const reportWa = (p, r) => whatsappLink(`${hello(p)}\n${T("wa.report", { 0: p.name, 1: r.day, 2: r.progress != null ? r.progress + "%" : "—" })}${r.note ? `\n${r.note.slice(0, 280)}` : ""}${sign()}`, clientPhone(p));
export const dueWa = (p, inv) => whatsappLink(`${hello(p)}\n${T("wa.due", { 0: inv.title, 1: money(inv.amount), 2: p.name, 3: inv.dueDate || "—" })}${sign()}`, clientPhone(p));
