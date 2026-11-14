import { useRef, useState } from "react";
import { X, FileSpreadsheet, Upload, LayoutTemplate, Download, Save, Trash2, AlertTriangle } from "lucide-react";
import { useI18n } from "../i18n";
import { mapRows, parseCsv, toCsv, TEMPLATE_HEADER } from "../lib/boqImport";
import { BUILTIN_TEMPLATES, boqTemplatesStore } from "../data/boqTemplates";

const download = (name, text) => {
  const url = URL.createObjectURL(new Blob([text], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a"); a.href = url; a.download = name; a.click(); URL.revokeObjectURL(url);
};

function TabBtn({ id, icon: Icon, tab, onPick, children }) {
  return (
    <button type="button" role="tab" aria-selected={tab === id} onClick={() => onPick(id)}
      className={`shrink-0 inline-flex items-center gap-1.5 px-4 h-10 rounded-full text-sm font-semibold ${tab === id ? "lp-pill-dark" : "text-[#56635B]"}`}>
      <Icon className="w-4 h-4" aria-hidden="true" />{children}
    </button>
  );
}

/** Bring BOQ lines in from Excel/CSV or a template, and save the current BOQ as a reusable template. */
export default function BoqImport({ items, onApply, onClose }) {
  const { t } = useI18n();
  const [tab, setTab] = useState("file");
  const [preview, setPreview] = useState(null); // { source, items, errors, missing }
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = boqTemplatesStore.use();
  const [tplName, setTplName] = useState("");
  const fileRef = useRef(null);

  const readFile = async (file) => {
    if (!file) return;
    setBusy(true);
    try {
      let result;
      if (/\.xlsx$/i.test(file.name)) {
        const { default: readXlsx } = await import("read-excel-file/browser");
        const sheets = await readXlsx(file);
        // Use the first sheet that has a recognisable BOQ table.
        const parsed = sheets.map((sh) => mapRows(sh.data));
        result = parsed.find((r) => r.items.length) || parsed[0] || { items: [], errors: [], missing: [] };
      } else result = mapRows(parseCsv(await file.text()));
      setPreview({ source: file.name, ...result });
    } catch {
      setPreview({ source: file.name, items: [], errors: [], missing: [], failed: true });
    } finally { setBusy(false); if (fileRef.current) fileRef.current.value = ""; }
  };

  const pickPreset = (name, list) => setPreview({ source: name, items: list.map((x, i) => ({ ...x, id: Date.now() + i })), errors: [], missing: [] });
  const apply = (mode) => { onApply(preview.items, mode); onClose(); };
  const saveTpl = () => {
    const name = tplName.trim(); if (!name || !items.length) return;
    setSaved((s) => [{ id: Date.now(), name, at: new Date().toISOString(), items: items.map(({ id: _id, ...x }) => x) }, ...s]);
    setTplName("");
  };
  const total = (list) => list.reduce((s, i) => s + i.quantity * i.unitCost * (1 + i.margin / 100), 0);


  return (
    <div className="fixed inset-0 z-[80] bg-[#1F2A26]/45 backdrop-blur-xs flex items-end sm:items-center justify-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="bi-title">
      <div className="bg-white w-full sm:max-w-2xl rounded-t-[28px] sm:rounded-[28px] max-h-[92dvh] overflow-y-auto p-5 sm:p-7 text-start">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="bi-title" className="font-display text-xl font-semibold text-[#1F2A26]">{t("bi.title")}</h2>
            <p className="text-sm text-[#56635B] mt-1">{t("bi.sub")}</p>
          </div>
          <button type="button" onClick={onClose} aria-label={t("settings.close")} className="p-2 -m-1 rounded-full hover:bg-[#F2F5F1]"><X className="w-5 h-5" /></button>
        </div>

        <div role="tablist" className="mt-4 flex gap-1 p-1 rounded-full bg-[#F2F5F1] overflow-x-auto scrollbar-none">
          <TabBtn tab={tab} onPick={(v) => { setTab(v); setPreview(null); }} id="file" icon={Upload}>{t("bi.t.file")}</TabBtn>
          <TabBtn tab={tab} onPick={(v) => { setTab(v); setPreview(null); }} id="tpl" icon={LayoutTemplate}>{t("bi.t.tpl")}</TabBtn>
          <TabBtn tab={tab} onPick={(v) => { setTab(v); setPreview(null); }} id="save" icon={Save}>{t("bi.t.save")}</TabBtn>
        </div>

        {!preview && tab === "file" && (
          <div className="mt-5 space-y-3">
            <label className={`block rounded-[22px] border-2 border-dashed border-[#C9D3CA] p-6 text-center cursor-pointer hover:border-[#5F6C61] ${busy ? "opacity-60" : ""}`}>
              <FileSpreadsheet className="w-8 h-8 mx-auto text-[#5F6C61]" aria-hidden="true" />
              <span className="block mt-2 font-semibold text-[#1F2A26]">{busy ? t("bi.reading") : t("bi.pick")}</span>
              <span className="block mt-1 text-xs text-[#56635B]">{t("bi.formats")}</span>
              <input ref={fileRef} type="file" accept=".xlsx,.csv,text/csv" className="sr-only" onChange={(e) => readFile(e.target.files?.[0])} />
            </label>
            <div className="rounded-2xl bg-[#F2F5F1] p-3.5 text-xs text-[#56635B]">
              <p className="font-semibold text-[#1F2A26] mb-1">{t("bi.cols")}</p>
              <p>{TEMPLATE_HEADER.join(" · ")}</p>
              <button type="button" onClick={() => download("miyar-boq-template.csv", toCsv([]))} className="mt-2 inline-flex items-center gap-1.5 font-semibold text-[#3E5A48] underline-offset-2 hover:underline"><Download className="w-3.5 h-3.5" aria-hidden="true" />{t("bi.blank")}</button>
            </div>
          </div>
        )}

        {!preview && tab === "tpl" && (
          <ul className="mt-5 space-y-2">
            {[...saved.map((s) => ({ ...s, own: true })), ...BUILTIN_TEMPLATES.map((b) => ({ ...b, name: t("bi.b." + b.key) }))].map((tp) => (
              <li key={tp.id} className="flex items-center gap-2">
                <button type="button" onClick={() => pickPreset(tp.name, tp.items)} className="flex-1 min-w-0 text-start rounded-2xl border border-[#DCE4DC] hover:border-[#A3AE9F] p-3.5 flex items-center gap-3">
                  <LayoutTemplate className="w-5 h-5 shrink-0 text-[#5F6C61]" aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block font-semibold text-[#1F2A26] truncate">{tp.name}</span>
                    <span className="block text-xs text-[#56635B]">{t("bi.lines", { n: tp.items.length })} · {tp.own ? t("bi.mine") : t("bi.builtin")}</span>
                  </span>
                </button>
                {tp.own && <button type="button" onClick={() => setSaved((s) => s.filter((x) => x.id !== tp.id))} aria-label={t("bi.del")} className="p-2.5 rounded-full text-[#9A2E20] hover:bg-[#FBE4DF]"><Trash2 className="w-4 h-4" /></button>}
              </li>
            ))}
          </ul>
        )}

        {!preview && tab === "save" && (
          <div className="mt-5 space-y-3">
            <p className="text-sm text-[#56635B]">{t("bi.saveHint", { n: items.length })}</p>
            <div className="flex gap-2">
              <input value={tplName} onChange={(e) => setTplName(e.target.value)} maxLength={60} placeholder={t("bi.tplName")} aria-label={t("bi.tplName")} className="flex-1 min-w-0 h-11 px-4 rounded-full border border-[#DCE4DC] text-sm" />
              <button type="button" onClick={saveTpl} disabled={!tplName.trim() || !items.length} className="btn-press h-11 px-5 rounded-full lp-pill-dark text-sm font-semibold disabled:opacity-50">{t("bi.saveBtn")}</button>
            </div>
            <button type="button" onClick={() => download("miyar-boq.csv", toCsv(items))} disabled={!items.length} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#3E5A48] disabled:opacity-50"><Download className="w-4 h-4" aria-hidden="true" />{t("bi.exportCur")}</button>
          </div>
        )}

        {preview && (
          <div className="mt-5 space-y-3">
            <div className="rounded-2xl bg-[#F2F5F1] p-3.5">
              <p className="text-xs text-[#56635B] truncate">{preview.source}</p>
              <p className="font-semibold text-[#1F2A26] mt-0.5">{t("bi.found", { n: preview.items.length })}</p>
              {preview.items.length > 0 && <p className="text-xs text-[#56635B] mt-0.5">{t("bi.value", { v: Math.round(total(preview.items)).toLocaleString("en-US") })}</p>}
            </div>
            {(preview.failed || preview.missing?.length > 0 || preview.errors.length > 0) && (
              <div className="rounded-2xl bg-[#FBEFD9] text-[#7A4B0C] p-3.5 text-xs space-y-1">
                <p className="flex items-center gap-1.5 font-semibold"><AlertTriangle className="w-4 h-4" aria-hidden="true" />{preview.failed ? t("bi.failed") : preview.items.length ? t("bi.skipped", { n: preview.errors.length }) : t("bi.noHeader")}</p>
                {preview.errors.slice(0, 5).map((e) => <p key={e.row}>{t("bi.row", { n: e.row })}: {e.name}</p>)}
              </div>
            )}
            {preview.items.length > 0 && (
              <ul className="max-h-56 overflow-y-auto divide-y divide-[#E6ECE6] rounded-2xl border border-[#DCE4DC]">
                {preview.items.slice(0, 50).map((i) => (
                  <li key={i.id} className="px-3.5 py-2.5 text-sm flex justify-between gap-3">
                    <span className="min-w-0"><span className="block truncate text-[#1F2A26]">{i.name}</span><span className="text-[11px] text-[#6E7B72]">{i.category}</span></span>
                    <span className="shrink-0 text-xs text-[#56635B] tabular-nums" dir="ltr">{i.quantity} {i.unit} × {i.unitCost.toLocaleString("en-US")}</span>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex flex-wrap gap-2 pt-1">
              <button type="button" disabled={!preview.items.length} onClick={() => apply("append")} className="btn-press h-11 px-5 rounded-full lp-pill-dark text-sm font-semibold disabled:opacity-50">{t("bi.append")}</button>
              <button type="button" disabled={!preview.items.length} onClick={() => apply("replace")} className="h-11 px-5 rounded-full border border-[#DCE4DC] text-sm font-semibold text-[#9A2E20] disabled:opacity-50">{t("bi.replace")}</button>
              <button type="button" onClick={() => setPreview(null)} className="h-11 px-4 rounded-full text-sm font-semibold text-[#56635B]">{t("bi.back")}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
