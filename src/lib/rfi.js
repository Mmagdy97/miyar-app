/** RFI helpers. Status: open -> answered -> closed. */
export const isOverdue = (r, today = new Date().toISOString().slice(0, 10)) => r.status === "open" && !!r.due && r.due < today;
export const nextNo = (list, projectId) => list.filter((r) => r.projectId === projectId).reduce((m, r) => Math.max(m, r.no || 0), 0) + 1;
export const rfiCounts = (list, today) => ({
  open: list.filter((r) => r.status === "open").length,
  overdue: list.filter((r) => isOverdue(r, today)).length,
  answered: list.filter((r) => r.status === "answered").length,
});
