/** Miyar mark: an "M" whose left leg is cut by a measuring scale (ticks). Inherits colour via currentColor. */
export default function LogoMark({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <defs>
        <mask id="miyar-notch" maskUnits="userSpaceOnUse" x="0" y="0" width="64" height="64">
          <rect width="64" height="64" fill="#fff" />
          <path d="M22.25 26h5.5M22.25 38h5.5" stroke="#000" strokeWidth="2.2" />
        </mask>
      </defs>
      <path d="M25 47V18l12 14 12-14v29" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" mask="url(#miyar-notch)" />
      <path d="M13 26h9.5M17 32h5.5M13 38h9.5M17 44h5.5" stroke="currentColor" strokeOpacity=".8" strokeWidth="2.2" />
    </svg>
  );
}
