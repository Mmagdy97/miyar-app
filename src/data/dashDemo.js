import { PROJECTS as SEED } from "./seed";

// Guest-mode sample for the dashboard (texts are i18n keys, resolved by the dashboard).
const iso = (d) => new Date(Date.now() + d * 86400000).toISOString().slice(0, 10);
export const demoProjects = (rows) => rows.map((p, n) => {
  const s = SEED.find((x) => x.id === p.id) || {};
  return { ...p, contractValue: s.contractValue || 0, quoteStatus: n === 2 ? "sent" : n === 0 ? "approved" : "none" };
});
export const demoInv = () => {
  const paid = SEED.reduce((t, p) => t + (p.collected || 0), 0);
  const total = SEED.reduce((t, p) => t + (p.contractValue || 0), 0);
  return { paid, due: total - paid };
};
export const DEMO_LATE = [{ id: "d1", title: "demo.inv1", amount: 450000, projectId: 2 }, { id: "d2", title: "demo.inv2", amount: 180000, projectId: 3 }];
export const DEMO_BUDGET = [{ pid: 2, id: "b1", name: "demo.b1", level: "over" }, { pid: 1, id: "b2", name: "demo.b2", level: "warn" }];
export const DEMO_SITE = {
  tasks: [{ id: "t1", title: "demo.t1", priority: "high", due: iso(0), done: false }, { id: "t2", title: "demo.t2", priority: "medium", due: iso(-1), done: false }, { id: "t3", title: "demo.t3", priority: "low", due: iso(3), done: false }],
  snags: [{ id: "s1", title: "demo.s1", severity: "high", resolved: false }, { id: "s2", title: "demo.s2", severity: "medium", resolved: false }],
  requests: [{ id: "r1", material: "demo.r1", status: "review" }, { id: "r2", material: "demo.r2", status: "shipping" }],
};
