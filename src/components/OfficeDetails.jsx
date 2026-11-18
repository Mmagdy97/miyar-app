import { Building2, Lock, Check } from "lucide-react";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { projectsStore } from "../data/projects";
import { PALETTES, applyPalette, isValidColor } from "../palettes";
import { checkLimit, checkFeature } from "../lib/upgrade";
import { tr_ as T, getCurrency } from "../i18n";
import { officeStore, defaultVat } from "../data/office";
import { fileToDataUrl } from "../lib/image";
import { getActiveOrg, hasFeature, orgLimit } from "../lib/entitlements";

const field = "w-full rounded-xl border border-[#E4DDCE] bg-white px-3 py-2 text-sm";

/** Collapsible office profile: used on printed quotes, share links and accountant exports. */
function ThemePicker() {
  const org = getActiveOrg();
  const [cur, setCur] = useState(org?.palette || document.documentElement.getAttribute("data-palette") || "teal");
  const [custom, setCustom] = useState(org?.palette_color || "#1F6F8B");
  const [bad, setBad] = useState(false);
  const limit = orgLimit(org, "themes");
  const save = (id, color = "") => {
    setCur(id); applyPalette(id, color);
    if (org) { org.palette = id; org.palette_color = color || null; }
    if (projectsStore.isLive && supabase) supabase.rpc("set_org_palette", { p_palette: id, p_color: color || null });
  };
  const pick = async (id, i) => {
    if (i >= limit && !(await checkLimit("themes", 999))) return;
    save(id);
  };
  const pickCustom = async () => {
    if (!hasFeature(org, "custom_theme") || !org) { if (org && !(await checkFeature("custom_theme"))) return; }
    if (!isValidColor(custom)) return setBad(true);
    setBad(false); save("custom", custom);
  };
  const locked = (i) => org && i >= limit;
  return (
    <div className="px-4 pb-4 space-y-2 border-t border-[#ECE5D6] pt-3">
      <p className="text-xs font-bold text-[#4A5757]">{T("theme.title")}</p>
      <div className="flex flex-wrap gap-2">
        {PALETTES.map((p, i) => (
          <button key={p.id} type="button" onClick={() => pick(p.id, i)} aria-pressed={cur === p.id} title={T("pal." + p.id)} className={`relative inline-flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs font-bold cursor-pointer ${cur === p.id ? "border-[#2E6F73] bg-[#2E6F73]/10" : "border-[#E4DDCE] bg-white"}`}>
            <span className="w-4 h-4 rounded-full" style={{ background: p.color }} />{T("pal." + p.id)}
            {cur === p.id ? <Check className="w-3.5 h-3.5" aria-hidden="true" /> : locked(i) && <Lock className="w-3.5 h-3.5 text-[#64706F]" aria-hidden="true" />}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <input type="color" value={custom} onChange={(e) => setCustom(e.target.value)} aria-label={T("pal.custom")} className="h-8 w-12 rounded-lg border border-[#E4DDCE] cursor-pointer" />
        <button type="button" onClick={pickCustom} aria-pressed={cur === "custom"} className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-bold cursor-pointer ${cur === "custom" ? "border-[#2E6F73] bg-[#2E6F73]/10" : "border-[#E4DDCE] bg-white"}`}>
          {T("pal.custom")}{org && !hasFeature(org, "custom_theme") && <Lock className="w-3.5 h-3.5 text-[#64706F]" aria-hidden="true" />}
        </button>
        {bad && <span className="text-[11px] font-bold text-rose-700">{T("pal.bad")}</span>}
      </div>
    </div>
  );
}

export default function OfficeDetails({ className = "" }) {
  const [o, setO] = officeStore.use();
  const set = (k) => (e) => setO((p) => ({ ...p, [k]: e.target.value }));
  const vat = o.vatRate ?? defaultVat(getCurrency());
  return (
    <details className={`no-print rounded-2xl border border-[#E4DDCE] bg-white ${className}`}>
      <summary className="flex items-center gap-2 px-4 py-3 text-sm font-bold cursor-pointer list-none">
        <Building2 className="w-4 h-4 text-[#4A5757]" />
        {T("office.title")}
      </summary>
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 px-4 pb-4">
        <label className="text-xs font-bold text-[#4A5757] space-y-1">
          {T("office.name")}
          <input value={o.name} onChange={set("name")} className={field} maxLength={80} />
        </label>
        <label className="text-xs font-bold text-[#4A5757] space-y-1">
          {T("office.tax")}
          <input value={o.taxId} onChange={set("taxId")} className={field} maxLength={30} inputMode="numeric" dir="ltr" />
        </label>
        <label className="text-xs font-bold text-[#4A5757] space-y-1">
          {T("office.phone")}
          <input value={o.phone} onChange={set("phone")} className={field} maxLength={30} inputMode="tel" dir="ltr" />
        </label>
        <label className="text-xs font-bold text-[#4A5757] space-y-1">
          {T("office.vat")}
          <input
            type="number" min="0" max="30" step="0.5" value={vat} dir="ltr"
            onChange={(e) => setO((p) => ({ ...p, vatRate: Math.min(30, Math.max(0, Number(e.target.value) || 0)) }))}
            className={field}
          />
        </label>
        <label className="text-xs font-bold text-[#4A5757] space-y-1">
          {T("office.days")}
          <input
            type="number" min="1" max="365" value={o.quoteDays} dir="ltr"
            onChange={(e) => setO((p) => ({ ...p, quoteDays: Math.min(365, Math.max(1, Number(e.target.value) || 14)) }))}
            className={field}
          />
        </label>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 px-4 pb-4 border-t border-[#ECE5D6] pt-4">
        <div className="text-xs font-bold text-[#4A5757] space-y-1">
          <span className="block">{T("office.logo")}</span>
          <div className="flex items-center gap-2">
            <span className="w-12 h-12 rounded-xl border border-[#E4DDCE] bg-[#F6F3EC] flex items-center justify-center overflow-hidden shrink-0">
              {o.logo ? <img src={o.logo} alt={T("office.logo")} className="w-full h-full object-contain" /> : <Building2 className="w-5 h-5 text-[#9AA8A8]" aria-hidden="true" />}
            </span>
            <label className="cursor-pointer rounded-full border border-[#E4DDCE] px-3 py-2 hover:bg-[#F6F3EC]">
              {o.logo ? T("office.logoChange") : T("office.logoUp")}
              <input type="file" accept="image/*" className="sr-only" onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; try { const url = await fileToDataUrl(f, 320, 0.85); setO((p) => ({ ...p, logo: url })); } catch { /* not an image */ } }} />
            </label>
            {o.logo && <button type="button" onClick={() => setO((p) => ({ ...p, logo: "" }))} className="text-[#9A2E20] px-1">{T("office.logoDel")}</button>}
          </div>
        </div>
        <label className="text-xs font-bold text-[#4A5757] space-y-1">
          {T("office.color")}
          <span className="flex items-center gap-2">
            <input type="color" value={o.color || "#0F3D3E"} onChange={set("color")} className="w-11 h-10 rounded-lg border border-[#E4DDCE] bg-white p-1 cursor-pointer" />
            <span className="text-[#64706F] font-normal" dir="ltr">{o.color || "#0F3D3E"}</span>
          </span>
        </label>
        <label className="text-xs font-bold text-[#4A5757] space-y-1">
          {T("office.address")}
          <input value={o.address || ""} onChange={set("address")} className={field} maxLength={120} />
        </label>
        <label className="text-xs font-bold text-[#4A5757] space-y-1">
          {T("office.type")}
          <select value={o.type || "architectural"} onChange={set("type")} className={field}>
            <option value="architectural">{T("office.type.arch")}</option>
            <option value="structural" disabled={!hasFeature(getActiveOrg(), "structural")}>{T("office.type.struct")}</option>
            <option value="both" disabled={!hasFeature(getActiveOrg(), "structural")}>{T("office.type.both")}</option>
          </select>
          {!hasFeature(getActiveOrg(), "structural") && <span className="block font-normal text-[#64706F]">{T("office.type.note")}</span>}
        </label>
        <label className="text-xs font-bold text-[#4A5757] space-y-1">
          {T("office.email")}
          <input type="email" value={o.email || ""} onChange={set("email")} className={field} maxLength={80} dir="ltr" />
        </label>
      </div>
      <ThemePicker />
    </details>
  );
}
