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

  // Determine fill color (Miyar: Forest Green #2B3138, Sand Gold #80848B for warning, Sage Green #D9480F for completed)
  let fillClass = "bg-[#2B3138]";
  if (customFillClass) {
    fillClass = customFillClass;
  } else if (isWarning || actualPercentage >= warningThreshold) {
    fillClass = "bg-[#80848B]";
  } else if (isCompleted || actualPercentage === 100) {
    fillClass = "bg-[#D9480F]";
  }

  return (
    <div
      className={`w-full h-2.5 bg-[#EEECE6] rounded-full overflow-hidden shadow-inner mt-2 ${trackClassName} ${className}`}
    >
      <div
        className={`h-full rounded-full transition-all duration-[1500ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${fillClass}`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
