import { useEffect, useState } from "react";
import { WifiOff, Wifi } from "lucide-react";
import { tr_ as T } from "../i18n";

/** Shows a small pill when the device is offline; work keeps saving locally. */
export default function OfflineBanner() {
  const [online, setOnline] = useState(() => (typeof navigator === "undefined" ? true : navigator.onLine));
  const [back, setBack] = useState(false);
  useEffect(() => {
    let timer;
    const on = () => { setOnline(true); setBack(true); timer = setTimeout(() => setBack(false), 3000); };
    const off = () => { setOnline(false); setBack(false); };
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); clearTimeout(timer); };
  }, []);
  if (online && !back) return null;
  return (
    <div role="status" className={`no-print fixed bottom-4 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 z-[60] flex items-center gap-2 px-4 py-2 rounded-full shadow-lg text-xs font-bold text-white ${online ? "bg-emerald-600" : "bg-[#2B3138] border border-amber-400/40"}`}>
      {online ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4 text-amber-400" />}
      <span>{T(online ? "off.back" : "off.msg")}</span>
    </div>
  );
}
