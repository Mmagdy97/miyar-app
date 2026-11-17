import { tr_ as T } from "../i18n";

export const TYPES = ["apartment", "villa", "office", "shop"];
export const FINISH = ["eco", "mid", "lux"];
const input = "w-full px-3 py-2 rounded-lg border border-[#E5E7EB] text-xs font-bold text-[#111827] bg-white min-w-0";

/** Project data that drives automatic BOQ quantities. */
export default function SpecFields({ spec, onChange }) {
  const set = (k) => (e) => onChange({ ...spec, [k]: e.target.value });
  const num = (k, ph, step = "1") => <input type="number" min={0} step={step} value={spec[k]} onChange={set(k)} placeholder={T(ph)} aria-label={T(ph)} className={input} />;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {num("area", "spec.area", "any")}
      {num("rooms", "spec.rooms")}
      {num("baths", "spec.baths")}
      {num("height", "spec.height", "any")}
      <select value={spec.type} onChange={set("type")} aria-label={T("spec.type")} className={input}>
        <option value="">{T("spec.type")}</option>
        {TYPES.map((t) => <option key={t} value={t}>{T("spec.t." + t)}</option>)}
      </select>
      <select value={spec.finish} onChange={set("finish")} aria-label={T("spec.finish")} className={input}>
        {FINISH.map((f) => <option key={f} value={f}>{T("spec.f." + f)}</option>)}
      </select>
    </div>
  );
}
