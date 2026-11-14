// Calm motion helpers: figure count-up + tab cross-fade. All respect prefers-reduced-motion.
const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const AR = "0123456789";
const TOKEN = /[0-90-9][0-90-9.,.٬]*/;

function parse(tok) {
  const arabic = /[0-9]/.test(tok);
  const latin = tok.replace(/[0-9]/g, (d) => String(AR.indexOf(d)));
  const hasThousands = /[,٬]/.test(latin);
  const dec = /[..]/.exec(latin);
  const thouChar = hasThousands ? (/٬/.test(latin) ? "٬" : ",") : "";
  const decChar = dec ? dec[0] : "";
  const clean = latin.replace(/[,٬]/g, "").replace(/./g, ".");
  const value = parseFloat(clean);
  if (!isFinite(value)) return null;
  const places = decChar ? clean.split(".")[1]?.length ?? 0 : 0;
  return { arabic, thouChar, decChar, places, value };
}
function fmt(v, f) {
  let s = v.toFixed(f.places);
  let [i, d] = s.split(".");
  if (f.thouChar) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, f.thouChar);
  s = d != null ? i + f.decChar + d : i;
  return f.arabic ? s.replace(/[0-9]/g, (c) => AR[+c]) : s;
}
const done = new WeakSet();
function countUp(el) {
  if (done.has(el)) return; done.add(el);
  const node = [...el.childNodes].find((n) => n.nodeType === 3 && TOKEN.test(n.nodeValue));
  if (!node) return;
  const m = TOKEN.exec(node.nodeValue); const f = parse(m[0]);
  if (!f || f.value === 0 || f.value > 1e9 || m[0].length < 2 && f.value < 10) return;
  const text = node.nodeValue, pre = text.slice(0, m.index), post = text.slice(m.index + m[0].length);
  const start = performance.now(), ms = 900;
  const tick = (now) => {
    const t = Math.min(1, (now - start) / ms), e = 1 - (1 - t) ** 3;
    node.nodeValue = pre + (t < 1 ? fmt(f.value * e, f) : m[0]) + post;
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

export function initMotion() {
  if (reduced() || typeof IntersectionObserver === "undefined") return () => {};
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { countUp(e.target); io.unobserve(e.target); } }), { threshold: 0.4 });
  const seen = new WeakSet();
  const scan = () => document.querySelectorAll("main .stat-grid :is(.text-2xl,.text-3xl,.text-4xl)").forEach((el) => { if (!seen.has(el)) { seen.add(el); io.observe(el); } });
  scan();
  const mo = new MutationObserver(() => scan());
  mo.observe(document.body, { childList: true, subtree: true });
  return () => { mo.disconnect(); io.disconnect(); };
}

/** Run a state change inside a View Transition (soft cross-fade) when supported. */
export function withTransition(fn) {
  if (reduced() || !document.startViewTransition) { fn(); return; }
  document.startViewTransition(fn);
}
