// Decision insights per project: earned value, forecast cost at completion,
// forecast margin, budget overrun and schedule slip. Pure, no UI.
const DAY = 86_400_000;

export function projectInsight(p, now = Date.now()) {
  const budget = Number(p.budget) || 0;
  const spent = Number(p.spentActual) || 0;
  const contract = Number(p.contractValue) || 0;
  const prog = Math.min(100, Math.max(0, Number(p.progress) || 0)) / 100;
  const earned = budget * prog;
  const cpi = spent > 0 ? earned / spent : 1;
  const eac = prog > 0 ? spent / prog : budget; // forecast cost at completion
  const overrun = Math.max(0, eac - budget);
  const overrunPct = budget ? overrun / budget : 0;
  const plannedMargin = contract - budget;
  const forecastMargin = contract - eac;
  const start = Date.parse(p.startDate), end = Date.parse(p.deadline);
  const elapsed = end > start ? Math.min(1, Math.max(0, (now - start) / (end - start))) : 0;
  const slip = Math.round((elapsed - prog) * 100); // + = behind schedule (pp)
  const daysLeft = Math.ceil((end - now) / DAY);
  const unbilled = Math.max(0, earned * (contract / (budget || 1)) - (Number(p.collected) || 0));
  let level = "ok";
  if (overrunPct > 0.05 || forecastMargin < 0 || slip > 20) level = "risk";
  else if (overrunPct > 0 || slip > 10) level = "watch";
  return { id: p.id, budget, spent, contract, earned, cpi, eac, overrun, overrunPct, plannedMargin, forecastMargin, elapsed, slip, daysLeft, unbilled, level };
}

export function portfolio(projects, now) {
  const rows = projects.map((p) => ({ p, i: projectInsight(p, now) }));
  const order = { risk: 0, watch: 1, ok: 2 };
  rows.sort((a, b) => order[a.i.level] - order[b.i.level] || b.i.overrun - a.i.overrun);
  const sum = (f) => rows.reduce((s, r) => s + f(r.i), 0);
  return {
    rows,
    plannedMargin: sum((i) => i.plannedMargin),
    forecastMargin: sum((i) => i.forecastMargin),
    overrun: sum((i) => i.overrun),
    atRisk: rows.filter((r) => r.i.level === "risk").length,
  };
}
