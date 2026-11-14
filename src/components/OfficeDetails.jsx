import { Building2 } from "lucide-react";
import { tr_ as T, getCurrency } from "../i18n";
import { officeStore, defaultVat } from "../data/office";
import { fileToDataUrl } from "../lib/image";

const field = "w-full rounded-xl border border-[#DCE4DC] bg-white px-3 py-2 text-sm";

/** Collapsible office profile: used on printed quotes, share links and accountant exports. */
export default function OfficeDetails({ className = "" }) {
  const [o, setO] = officeStore.use();
  const set = (k) => (e) => setO((p) => ({ ...p, [k]: e.target.value }));
  const vat = o.vatRate ?? defaultVat(getCurrency());
  return (
    <details className={`no-print rounded-2xl border border-[#DCE4DC] bg-white ${className}`}>
      <summary className="flex items-center gap-2 px-4 py-3 text-sm font-bold cursor-pointer list-none">
        <Building2 className="w-4 h-4 text-[#56635B]" />
        {T("office.title")}
      </summary>
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 px-4 pb-4">
        <label className="text-xs font-bold text-[#56635B] space-y-1">
          {T("office.name")}
          <input value={o.name} onChange={set("name")} className={field} maxLength={80} />
        </label>
        <label className="text-xs font-bold text-[#56635B] space-y-1">
          {T("office.tax")}
          <input value={o.taxId} onChange={set("taxId")} className={field} maxLength={30} inputMode="numeric" dir="ltr" />
        </label>
        <label className="text-xs font-bold text-[#56635B] space-y-1">
          {T("office.phone")}
          <input value={o.phone} onChange={set("phone")} className={field} maxLength={30} inputMode="tel" dir="ltr" />
        </label>
        <label className="text-xs font-bold text-[#56635B] space-y-1">
          {T("office.vat")}
          <input
            type="number" min="0" max="30" step="0.5" value={vat} dir="ltr"
            onChange={(e) => setO((p) => ({ ...p, vatRate: Math.min(30, Math.max(0, Number(e.target.value) || 0)) }))}
            className={field}
          />
        </label>
        <label className="text-xs font-bold text-[#56635B] space-y-1">
          {T("office.days")}
          <input
            type="number" min="1" max="365" value={o.quoteDays} dir="ltr"
            onChange={(e) => setO((p) => ({ ...p, quoteDays: Math.min(365, Math.max(1, Number(e.target.value) || 14)) }))}
            className={field}
          />
        </label>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 px-4 pb-4 border-t border-[#E6ECE6] pt-4">
        <div className="text-xs font-bold text-[#56635B] space-y-1">
          <span className="block">{T("office.logo")}</span>
          <div className="flex items-center gap-2">
            <span className="w-12 h-12 rounded-xl border border-[#DCE4DC] bg-[#F2F5F1] flex items-center justify-center overflow-hidden shrink-0">
              {o.logo ? <img src={o.logo} alt={T("office.logo")} className="w-full h-full object-contain" /> : <Building2 className="w-5 h-5 text-[#A3AE9F]" aria-hidden="true" />}
            </span>
            <label className="cursor-pointer rounded-full border border-[#DCE4DC] px-3 py-2 hover:bg-[#F2F5F1]">
              {o.logo ? T("office.logoChange") : T("office.logoUp")}
              <input type="file" accept="image/*" className="sr-only" onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; try { const url = await fileToDataUrl(f, 320, 0.85); setO((p) => ({ ...p, logo: url })); } catch { /* not an image */ } }} />
            </label>
            {o.logo && <button type="button" onClick={() => setO((p) => ({ ...p, logo: "" }))} className="text-[#9A2E20] px-1">{T("office.logoDel")}</button>}
          </div>
        </div>
        <label className="text-xs font-bold text-[#56635B] space-y-1">
          {T("office.color")}
          <span className="flex items-center gap-2">
            <input type="color" value={o.color || "#3E5A48"} onChange={set("color")} className="w-11 h-10 rounded-lg border border-[#DCE4DC] bg-white p-1 cursor-pointer" />
            <span className="text-[#6E7B72] font-normal" dir="ltr">{o.color || "#3E5A48"}</span>
          </span>
        </label>
        <label className="text-xs font-bold text-[#56635B] space-y-1">
          {T("office.address")}
          <input value={o.address || ""} onChange={set("address")} className={field} maxLength={120} />
        </label>
        <label className="text-xs font-bold text-[#56635B] space-y-1">
          {T("office.email")}
          <input type="email" value={o.email || ""} onChange={set("email")} className={field} maxLength={80} dir="ltr" />
        </label>
      </div>
    </details>
  );
}
