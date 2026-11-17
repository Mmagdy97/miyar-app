import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { tr_ as T } from "../i18n";
import { useLibrary } from "../data/library";
import { pricesRepo } from "../data/prices";
import { FINISH } from "./SpecFields";

const input = "h-9 px-2 rounded-lg border border-[#E0D6C2] text-xs font-bold text-[#1E223D] bg-white w-24 tabular-nums";

/** Office price list per library item and finish level (feeds BOQ unit costs). */
export default function PriceList() {
  const prices = pricesRepo.use();
  const groups = useLibrary();
  const [open, setOpen] = useState(false);
  return (
    <section className="bg-white rounded-2xl border border-[#E0D6C2]">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="w-full flex items-center justify-between gap-2 p-4 text-sm font-semibold text-[#1E223D] cursor-pointer">
        {T("prices.title")}<ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-4">
          <p className="text-[11px] text-[#666B86]">{T("prices.hint")}</p>
          {groups.map((g) => (
            <div key={g.cat} className="space-y-1.5">
              <h3 className="text-xs font-bold text-[#4F5470]">{g.cat}</h3>
              {g.items.map(({ name, unit }) => (
                <div key={name} className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="flex-1 min-w-44 font-semibold text-[#1E223D]">{name} <span className="text-[#666B86] font-normal">({unit})</span></span>
                  {FINISH.map((lv) => (
                    <input key={lv + (prices[name]?.[lv] ?? "")} type="number" min={0} step="any" defaultValue={prices[name]?.[lv] ?? ""} placeholder={T("spec.f." + lv)} aria-label={name + " " + T("spec.f." + lv)} onBlur={(e) => { if (String(e.target.value) !== String(prices[name]?.[lv] ?? "")) pricesRepo.set(name, unit, lv, e.target.value); }} className={input} />
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
