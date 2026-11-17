import { useRef, useState } from "react";
import { DatabaseBackup, Download, Upload } from "lucide-react";
import { useI18n, intlLocale } from "../i18n";
import { collectBackup, validateBackup, restoreBackup } from "../lib/backup";
import { askConfirm } from "../lib/confirm";

/** Download / restore all office data kept on this device. */
export default function DataBackup() {
  const { t } = useI18n();
  const [msg, setMsg] = useState("");
  const fileRef = useRef(null);

  const download = () => {
    const b = collectBackup(localStorage);
    const url = URL.createObjectURL(new Blob([JSON.stringify(b)], { type: "application/json" }));
    const a = document.createElement("a"); a.href = url; a.download = `miyar-backup-${b.at.slice(0, 10)}.json`; a.click(); URL.revokeObjectURL(url);
  };

  const restore = async (file) => {
    if (fileRef.current) fileRef.current.value = "";
    if (!file) return;
    let obj;
    try { obj = JSON.parse(await file.text()); } catch { setMsg(t("bk.bad")); return; }
    const v = validateBackup(obj);
    if (!v.ok) { setMsg(t("bk.bad")); return; }
    const d = v.at ? new Date(v.at).toLocaleString(intlLocale()) : "—";
    if (!(await askConfirm(t("bk.confirm", { d, n: v.keys.length }), { danger: false, yes: "OK" }))) return;
    restoreBackup(localStorage, obj);
    setMsg(t("bk.done"));
    setTimeout(() => window.location.reload(), 600);
  };

  return (
    <section aria-labelledby="bk-title" className="bg-white rounded-[24px] border border-[#E0D6C2] p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-4">
      <span className="w-11 h-11 shrink-0 rounded-2xl bg-[#EFE7D6] text-[#1E223D] flex items-center justify-center"><DatabaseBackup className="w-5 h-5" aria-hidden="true" /></span>
      <div className="flex-1 min-w-0">
        <h2 id="bk-title" className="font-semibold text-[#1E223D]">{t("bk.title")}</h2>
        <p className="text-sm text-[#4F5470] mt-0.5">{t("bk.sub")}</p>
        {msg && <p role="status" className="text-sm font-semibold text-[#1E223D] mt-1">{msg}</p>}
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={download} className="btn-press inline-flex items-center gap-2 h-11 px-5 rounded-full lp-pill-dark text-sm font-semibold"><Download className="w-4 h-4" aria-hidden="true" />{t("bk.down")}</button>
        <label className="inline-flex items-center gap-2 h-11 px-5 rounded-full border border-[#E0D6C2] text-sm font-semibold text-[#1E223D] cursor-pointer hover:bg-[#F6F1E7]">
          <Upload className="w-4 h-4" aria-hidden="true" />{t("bk.up")}
          <input ref={fileRef} type="file" accept="application/json,.json" className="sr-only" onChange={(e) => restore(e.target.files?.[0])} />
        </label>
      </div>
    </section>
  );
}
