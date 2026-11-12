// On phones, data tables render as stacked cards; each cell needs its column name as a label.
function label(table) {
  const heads = [...table.querySelectorAll("thead th")].map((th) => th.innerText.trim());
  if (!heads.length) return;
  table.classList.add("has-labels");
  table.querySelectorAll("tbody tr").forEach((tr) => {
    let col = 0;
    [...tr.children].forEach((td) => {
      const name = heads[col] || "";
      if (td.getAttribute("data-label") !== name) td.setAttribute("data-label", name);
      col += Number(td.getAttribute("colspan")) || 1;
    });
  });
}

export function watchTableLabels(root = document.body) {
  let queued = false;
  const run = () => { queued = false; root.querySelectorAll("main table").forEach(label); };
  const mo = new MutationObserver(() => { if (!queued) { queued = true; requestAnimationFrame(run); } });
  mo.observe(root, { childList: true, subtree: true, characterData: true });
  run();
  return () => mo.disconnect();
}
