import { useState } from "react";
import { ImageOff } from "lucide-react";

/** Image that never shows a broken icon: lazy, no referrer, and a calm placeholder if the file can't load. */
export default function Photo({ src, alt = "", className = "", fallbackClass = "", label }) {
  const [failed, setFailed] = useState(!src);
  if (failed) {
    return (
      <div role="img" aria-label={alt} className={`w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#E5E7EB] via-[#F1F3F6] to-[#F7F8FA] text-[#6B7280] ${fallbackClass}`}>
        <ImageOff className="w-6 h-6" aria-hidden="true" />
        {label && <span className="text-xs font-semibold px-3 text-center">{label}</span>}
      </div>
    );
  }
  return <img src={src} alt={alt} loading="lazy" decoding="async" referrerPolicy="no-referrer" onError={() => setFailed(true)} className={className} />;
}
