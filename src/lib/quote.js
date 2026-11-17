import { brandHeader, printDocument, esc } from "./printDoc";
import { tr_ as T, money } from "../i18n";
import { itemPrice } from "../data/boq";

/** Frozen client-facing snapshot: names, quantities and selling prices only (never cost or margin). */
export function buildQuote(items) {
  const lines = items.map((i) => ({ cat: i.category || "", name: i.name, unit: i.unit || "", qty: i.quantity, unitPrice: i.quantity ? Math.round((itemPrice(i) / i.quantity) * 100) / 100 : 0, total: Math.round(itemPrice(i) * 100) / 100 }));
  return { lines, total: Math.round(lines.reduce((s, l) => s + l.total, 0) * 100) / 100, at: new Date().toISOString().slice(0, 10) };
}

export function quoteHtml(project, q) {
  const cats = [...new Set(q.lines.map((l) => l.cat))];
  const body = cats.map((c) => `<h2>${esc(c || T("boq.noCat"))}</h2><table><thead><tr><th>${esc(T("boq.name"))}</th><th class="n">${esc(T("boq.qty"))}</th><th class="n">${esc(T("quote.unitPrice"))}</th><th class="n">${esc(T("sel.total"))}</th></tr></thead><tbody>${q.lines.filter((l) => l.cat === c).map((l) => `<tr><td>${esc(l.name)}</td><td class="n">${esc(l.qty)} ${esc(l.unit)}</td><td class="n">${esc(money(l.unitPrice))}</td><td class="n">${esc(money(l.total))}</td></tr>`).join("")}</tbody></table>`).join("");
  return brandHeader(T("quote.title"), [project.name, project.client, q.at]) + body + `<h2 style="text-align:end">${esc(T("quote.total"))}: ${esc(money(q.total))}</h2><div class="foot">${esc(T("quote.terms"))}</div>`;
}
export const printQuote = (project, q) => printDocument(T("quote.title"), quoteHtml(project, q));
