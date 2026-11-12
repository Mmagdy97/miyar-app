import { useState, useEffect } from "react";

export default function ProgressBar({
  value = 0,
  warningThreshold = 85,
  isWarning = false,
  isCompleted = false,
  customFillClass,
  className = "",
  trackClassName = "",
}) {
  const [width, setWidth] = useState(0);

  const numericValue =
    typeof value === "string" ? parseFloat(value.replace(/[^0-9.]/g, "")) : value;
  const actualPercentage = Math.min(100, Math.max(0, Number(numericValue) || 0));

  useEffect(() => {
    const timeout = setTimeout(() => {
      setWidth(actualPercentage);
    }, 100);
    return () => clearTimeout(timeout);
  }, [actualPercentage]);

  // Determine fill color (Miyar: Forest Green #0F172A, Sand Gold #64748B for warning, Sage Green #0F766E for completed)
  let fillClass = "bg-[#0F172A]";
  if (customFillClass) {
    fillClass = customFillClass;
  } else if (isWarning || actualPercentage >= warningThreshold) {
    fillClass = "bg-[#64748B]";
  } else if (isCompleted || actualPercentage === 100) {
    fillClass = "bg-[#0F766E]";
  }

  return (
    <div
      className={`w-full h-2.5 bg-[#EEF1F5] rounded-full overflow-hidden shadow-inner mt-2 ${trackClassName} ${className}`}
    >
      <div
        className={`h-full rounded-full transition-all duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${fillClass}`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
