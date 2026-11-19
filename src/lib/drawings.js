/** Group drawing rows by project+code: newest revision first; `current` = newest approved revision (what site should build from). */
export function groupDrawings(rows) {
  const map = new Map();
  for (const r of rows) {
    const k = `${r.projectId}|${r.code}`;
    if (!map.has(k)) map.set(k, []);
    map.get(k).push(r);
  }
  return [...map.values()].map((v) => {
    const versions = [...v].sort((a, b) => b.rev - a.rev);
    return { code: versions[0].code, name: versions[0].name, discipline: versions[0].discipline, projectId: versions[0].projectId, latest: versions[0], current: versions.find((x) => x.status === "approved") || null, versions };
  }).sort((a, b) => a.code.localeCompare(b.code));
}
export const nextRev = (rows, projectId, code) => rows.filter((r) => r.projectId === projectId && r.code === code).reduce((m, r) => Math.max(m, r.rev), 0) + 1;
/** True when the newest revision is not the one approved for execution (site may be building from an older one). */
export const hasPendingRev = (g) => !g.current || g.latest.rev !== g.current.rev;
