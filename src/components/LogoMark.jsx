/** Miyar mark: an "M" over a dimension line (the architect's measure). Inherits colour via currentColor. */
export default function LogoMark({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <path d="M12 38V12l20 20 20-20v26" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 52h40M12 48v8M52 48v8" stroke="currentColor" strokeOpacity=".85" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
