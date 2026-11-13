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

  // Determine fill color (brand teal; amber when at risk; green when complete)
  let fillClass = "bg-[#17614F]";
  if (customFillClass) {
    fillClass = customFillClass;
  } else if (isWarning || actualPercentage >= warningThreshold) {
    fillClass = "bg-amber-500";
  } else if (isCompleted || actualPercentage === 100) {
    fillClass = "bg-emerald-600";
  }

  return (
    <div
      className={`w-full h-2.5 bg-[#F0EADD] rounded-full overflow-hidden shadow-inner mt-2 ${trackClassName} ${className}`}
    >
      <div
        className={`h-full rounded-full transition-all duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${fillClass}`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
