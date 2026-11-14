import { Building2 } from "lucide-react";
import { tr_ as T, getCurrency } from "../i18n";
import { officeStore, defaultVat } from "../data/office";

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
    </details>
  );
}
