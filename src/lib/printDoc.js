// Print a branded, standalone document (A4) through a hidden iframe: the user picks "Save as PDF".
import { officeStore } from "../data/office";
import { getLocale } from "../i18n";

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
export { esc };

export function brandHeader(title, meta = []) {
  const o = officeStore.get();
  const color = /^#[0-9a-f]{6}$/i.test(o.color || "") ? o.color : "#3E5A48";
  return `<div class="brand" style="border-color:${color}">
    <div class="who">${o.logo ? `<img src="${esc(o.logo)}" alt="">` : ""}<div>
      <div class="office">${esc(o.name || "Miyar")}</div>
      <div class="muted">${[o.address, o.phone, o.email, o.taxId].filter(Boolean).map(esc).join(" · ")}</div></div></div>
    <div class="doc"><div class="title" style="color:${color}">${esc(title)}</div>${meta.map((m) => `<div class="muted">${esc(m)}</div>`).join("")}</div>
  </div>`;
}

export function printDocument(title, bodyHtml) {
  const rtl = getLocale() === "ar";
  const html = `<!doctype html><html lang="${getLocale()}" dir="${rtl ? "rtl" : "ltr"}"><head><meta charset="utf-8"><title>${esc(title)}</title>
  <style>
    @page { size: A4; margin: 14mm; }
    * { box-sizing: border-box; }
    body { font-family: "IBM Plex Sans Arabic", "Segoe UI", Tahoma, sans-serif; color: #1F2A26; font-size: 12px; margin: 0; }
    .brand { display: flex; justify-content: space-between; gap: 16px; align-items: flex-start; border-bottom: 3px solid; padding-bottom: 10px; margin-bottom: 14px; }
    .who { display: flex; gap: 10px; align-items: center; } .who img { height: 46px; max-width: 120px; object-fit: contain; }
    .office { font-size: 17px; font-weight: 700; } .title { font-size: 16px; font-weight: 700; text-align: end; } .doc { text-align: end; }
    .muted { color: #56635B; font-size: 11px; }
    h2 { font-size: 13px; margin: 16px 0 6px; }
    table { width: 100%; border-collapse: collapse; font-size: 11.5px; } td:first-child { width: 22%; } td:last-child { width: 24%; } th, td { padding: 6px 5px; border-bottom: 1px solid #DCE4DC; text-align: start; vertical-align: top; }
    th { background: #F2F5F1; font-size: 11px; } td.n, th.n { text-align: end; white-space: nowrap; font-variant-numeric: tabular-nums; }
    .kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; } .kpi { border: 1px solid #DCE4DC; border-radius: 8px; padding: 8px; }
    .kpi b { display: block; font-size: 14px; margin-top: 2px; }
    .risk { color: #9A2E20; font-weight: 700; } .watch { color: #7A4B0C; font-weight: 700; } .ok { color: #1F6B49; font-weight: 700; }
    .foot { margin-top: 18px; color: #6E7B72; font-size: 10px; border-top: 1px solid #DCE4DC; padding-top: 6px; }
  </style></head><body>${bodyHtml}</body></html>`;
  const f = document.createElement("iframe");
  f.setAttribute("aria-hidden", "true");
  Object.assign(f.style, { position: "fixed", width: "0", height: "0", border: "0", insetInlineStart: "-9999px" });
  document.body.appendChild(f);
  const d = f.contentDocument; d.open(); d.write(html); d.close();
  const go = () => { try { f.contentWindow.focus(); f.contentWindow.print(); } finally { setTimeout(() => f.remove(), 1500); } };
  const imgs = [...d.images];
  if (!imgs.length) setTimeout(go, 50);
  else Promise.all(imgs.map((im) => (im.complete ? 0 : new Promise((r) => { im.onload = im.onerror = r; })))).then(go);
}
