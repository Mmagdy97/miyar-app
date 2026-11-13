import { valueMoment } from "./nudge";
import { tr_ as T, E, money, intlLocale } from "../i18n";

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

/** Printable payment receipt (user saves it as PDF from the print dialog). */
export function receiptHtml(inv, project) {
  const rtl = intlLocale().startsWith("ar");
  const row = (k, v) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`;
  return `<!doctype html><html lang="${intlLocale()}" dir="${rtl ? "rtl" : "ltr"}"><head><meta charset="utf-8"><title>${esc(inv.receiptNo)}</title>
<style>body{font-family:'IBM Plex Sans Arabic',Inter,system-ui,sans-serif;color:#1F2421;margin:40px}h1{font-size:22px;margin:0 0 4px}
p{color:#555B53;margin:0 0 24px}table{width:100%;border-collapse:collapse}th,td{padding:10px 0;border-bottom:1px solid #E6DFD0;text-align:start;font-size:14px}
th{color:#555B53;font-weight:500;width:40%}.amt{font-size:20px;font-weight:700}.ok{color:#17614F;font-weight:700}</style></head><body>
<h1>${esc(T("rcpt.title"))}</h1><p>${esc(T("rcpt.brand"))}</p><table>
${row(T("rcpt.no"), inv.receiptNo)}${row(T("rcpt.project"), E(project))}${row(T("rcpt.for"), E(inv.title))}
${row(T("rcpt.date"), E(inv.paidDate || "—"))}<tr><th>${esc(T("rcpt.amount"))}</th><td class="amt">${esc(money(inv.amount))}</td></tr>
<tr><th>${esc(T("rcpt.status"))}</th><td class="ok">${esc(T("rcpt.paid"))}</td></tr></table></body></html>`;
}

export function printReceipt(inv, project) {
  valueMoment("receipt");
  const f = document.createElement("iframe");
  f.setAttribute("aria-hidden", "true");
  f.style.cssText = "position:fixed;width:0;height:0;border:0;inset-inline-start:-9999px";
  document.body.appendChild(f);
  const d = f.contentWindow.document;
  d.open(); d.write(receiptHtml(inv, project)); d.close();
  setTimeout(() => { try { f.contentWindow.focus(); f.contentWindow.print(); } catch { /* ignore */ } setTimeout(() => f.remove(), 1000); }, 150);
}
