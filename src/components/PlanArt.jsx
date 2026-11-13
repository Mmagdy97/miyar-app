import { intlLocale } from "../i18n";

/** Blueprint floor plan that draws itself: walls, doors, furniture, dimension lines. Decorative only. */
export default function PlanArt({ className = "" }) {
  const n = (v) => { try { return v.toLocaleString(intlLocale(), { minimumFractionDigits: 2, maximumFractionDigits: 2 }); } catch { return String(v); } };
  const d = (p, extra = "") => <path d={p} pathLength="1" className={"plan-draw " + extra} />;
  return (
    <svg viewBox="0 0 560 420" fill="none" aria-hidden="true" className={className} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <g className="plan-walls" strokeWidth="2.4">
        {d("M60 70H500V350H60Z")}
        {d("M60 70H500V350H60Z", "plan-d1")}
        {d("M290 70V210")}
        {d("M60 210H380")}
        {d("M380 210V350")}
        {d("M380 280H500")}
      </g>
      <g className="plan-doors">
        {d("M290 150A44 44 0 0 1 246 194", "plan-d2")}
        {d("M200 210A40 40 0 0 0 240 250", "plan-d2")}
        {d("M380 300A40 40 0 0 1 420 280", "plan-d2")}
      </g>
      <g className="plan-furn" strokeWidth="1.1" opacity=".75">
        {d("M90 100h110v44H90zM90 100v44M200 100v44", "plan-d3")}
        {d("M330 100h130v70H330z", "plan-d3")}
        {d("M345 112h46v46h-46zM400 112h46v46h-46z", "plan-d3")}
        {d("M100 245h70a0 0 0 0 1 0 0v70H100z", "plan-d3")}
        <circle cx="440" cy="245" r="22" pathLength="1" className="plan-draw plan-d3" />
        {d("M410 320h70v20h-70z", "plan-d3")}
      </g>
      <g stroke="var(--brass)" strokeWidth="1.2" className="plan-dim">
        {d("M60 40H500", "plan-d4")}
        {d("M60 32v16M500 32v16", "plan-d4")}
        {d("M530 70V350", "plan-d4")}
        {d("M522 70h16M522 350h16", "plan-d4")}
        {d("M290 380H500", "plan-d4")}
        {d("M290 372v16M500 372v16", "plan-d4")}
      </g>
      <g fill="var(--brass)" stroke="none" fontSize="12" fontFamily="var(--font-display)" textAnchor="middle" className="plan-label">
        <text x="280" y="30">{n(8.8)}</text>
        <text x="395" y="404">{n(4.2)}</text>
        <text x="552" y="214" transform="rotate(90 552 214)">{n(5.6)}</text>
      </g>
    </svg>
  );
}
