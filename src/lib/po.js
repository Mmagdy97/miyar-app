import { valueMoment } from "./nudge";
import { tr_ as T, E, money, intlLocale } from "../i18n";
import { lineCost } from "./selections";

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

/** Stable PO number per project + supplier + day. */
export const poNumber = (project, supplier, date) => {
  let h = 0;
  for (const c of String(supplier)) h = (h * 31 + c.charCodeAt(0)) % 9973;
  return `PO-${project.code}-${String(date).replaceAll("-", "").slice(2)}-${String(h).padStart(4, "0")}`;
};

/** Printable purchase order to a supplier (cost prices only — never the client's selling prices). */
export function poHtml(po, project, date) {
  const rtl = intlLocale().startsWith("ar");
  const no = poNumber(project, po.supplier, date);
  const rows = po.list.map((i) => `<tr><td>${esc(i.room)}</td><td>${esc(i.name)}${i.code ? `<br><small>${esc(i.code)}</small>` : ""}${i.dims ? `<br><small>${esc(E(i.dims))}</small>` : ""}${i.material ? `<br><small>${esc(E(i.material))}</small>` : ""}</td><td class="n">${esc(i.qty)}</td><td class="n">${esc(money(i.cost))}</td><td class="n">${esc(money(lineCost(i)))}</td></tr>`).join("");
  return `<!doctype html><html lang="${intlLocale()}" dir="${rtl ? "rtl" : "ltr"}"><head><meta charset="utf-8"><title>${esc(no)}</title>
<style>body{font-family:'IBM Plex Sans Arabic',Inter,system-ui,sans-serif;color:#1F2421;margin:40px}h1{font-size:22px;margin:0 0 4px}p{color:#555B53;margin:0 0 4px;font-size:13px}
table{width:100%;border-collapse:collapse;margin-top:20px}th,td{padding:8px 6px;border-bottom:1px solid #E6DFD0;text-align:start;font-size:13px;vertical-align:top}th{color:#555B53;font-weight:600}
small{color:#6F756B}.n{text-align:end;white-space:nowrap}.tot{font-size:16px;font-weight:700;margin-top:16px;text-align:end}</style></head><body>
<h1>${esc(T("sel.poTitle"))} ${esc(no)}</h1><p>${esc(T("sel.poSupplier"))}: ${esc(E(po.supplier) || T("sel.noSupplier"))}</p><p>${esc(T("sel.poProject"))}: ${esc(E(project.name))}</p><p>${esc(T("sel.poDate"))}: ${esc(date)}</p>
<table><thead><tr><th>${esc(T("sel.room"))}</th><th>${esc(T("sel.item"))}</th><th class="n">${esc(T("sel.qty"))}</th><th class="n">${esc(T("sel.cost"))}</th><th class="n">${esc(T("sel.total"))}</th></tr></thead><tbody>${rows}</tbody></table>
<p class="tot">${esc(T("sel.poTotal"))}: ${esc(money(po.total))}</p></body></html>`;
}

export function printPO(po, project, date) {
  valueMoment("receipt");
  const f = document.createElement("iframe");
  f.setAttribute("aria-hidden", "true");
  f.style.cssText = "position:fixed;width:0;height:0;border:0;inset-inline-start:-9999px";
  document.body.appendChild(f);
  const d = f.contentWindow.document;
  d.open(); d.write(poHtml(po, project, date)); d.close();
  setTimeout(() => { try { f.contentWindow.focus(); f.contentWindow.print(); } catch { /* ignore */ } setTimeout(() => f.remove(), 1000); }, 150);
}
