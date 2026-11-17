import { useEffect, useState } from "react";
import { BellRing } from "lucide-react";
import { tr_ as T } from "../i18n";
import { pushState, enablePush, disablePush } from "../lib/push";

/** Turn phone/browser notifications on or off for this device. */
export default function PushToggle() {
  const [st, setSt] = useState("off");
  const [err, setErr] = useState("");
  useEffect(() => { pushState().then(setSt); }, []);
  const toggle = async () => {
    setErr("");
    try { if (st === "on") await disablePush(); else await enablePush(); setSt(await pushState()); }
    catch (e) { setErr(e.message === "denied" ? T("push.denied") : e.message || String(e)); setSt(await pushState()); }
  };
  return (
    <div className="px-4 pt-2.5 mt-1 border-t border-[#E4DDCE] text-[11px]">
      {st !== "unsupported" && <button type="button" onClick={toggle} disabled={st === "denied"} className="w-full inline-flex items-center justify-center gap-1.5 h-9 rounded-lg font-bold border border-[#E4DDCE] text-[#0E1A1B] disabled:opacity-50 cursor-pointer">
        <BellRing className="w-4 h-4" aria-hidden="true" />{T(st === "on" ? "push.off" : "push.on")}
      </button>}
      <button type="button" onClick={() => window.dispatchEvent(new Event("miyar:tour"))} className="w-full mt-1.5 h-9 rounded-lg font-bold text-[#4A5757] cursor-pointer">{T("tour.again")}</button>
      {(err || st === "denied") && <p role="status" className="mt-1.5 text-rose-700">{err || T("push.denied")}</p>}
    </div>
  );
}
