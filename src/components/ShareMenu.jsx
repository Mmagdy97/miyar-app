import { useState } from "react";
import { createPortal } from "react-dom";
import { MessageCircle, Link2, Share2, X, Check } from "lucide-react";
import { tr_ as T, E, getCurrency } from "../i18n";
import { pct } from "../data/dataI18n";
import { officeStore } from "../data/office";
import { PHASES, projectById } from "../data/seed";
import { buildShareUrl, whatsappLink, copyText } from "../lib/share";

/** Builds the read-only snapshot + the WhatsApp message for a project. */
export function projectShare(project, { kind = "project", timeline = [], withPayments = false } = {}) {
  const office = officeStore.get();
  const seed = withPayments ? projectById(project.id) : null;
  const snap = {
    office: office.name,
    phone: office.phone,
    name: project.name,
    client: project.client,
    location: project.location,
    phase: E(project.phase),
    status: E(project.status),
    progress: project.progress,
    deadline: project.deadline,
    updated: new Date().toISOString().slice(0, 10),
    phases: PHASES.map((p) => E(p)),
    timeline,
    currency: getCurrency(),
    contract: seed?.contractValue,
    collected: seed?.collected,
  };
  const url = buildShareUrl(snap);
  const text = T(`share.msg.${kind}`, { 0: project.client || "", 1: project.name, 2: pct(project.progress), 3: E(project.phase), 4: url });
  return { snap, url, text };
}

/** Small popover: send on WhatsApp or copy the no-login client link. */
export default function ShareMenu({ project, className = "" }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [withPayments, setWithPayments] = useState(false);
  const share = open ? projectShare(project, { withPayments }) : null;

  const copy = async () => {
    if (await copyText(share.url)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`relative no-print ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E3E0D9] bg-white hover:bg-[#F6F5F1] text-xs font-bold text-[#16181C] cursor-pointer"
      >
        <Share2 className="w-3.5 h-3.5" />
        {T("share.btn")}
      </button>
      {open && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-3"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-label={T("share.title")}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-[#E3E0D9] bg-white p-4 space-y-2.5 shadow-xl"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-black">{T("share.title")}</p>
                <p className="text-[11px] text-[#5D6168]">{T("share.noLogin")}</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="×" className="p-1 rounded-md hover:bg-[#EEECE6] cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <a
              href={whatsappLink(share.text)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-emerald-600 text-white text-xs font-bold px-3 py-2.5"
            >
              <MessageCircle className="w-4 h-4" />
              {T("share.whatsapp")}
            </a>
            <button
              type="button"
              onClick={copy}
              className="w-full flex items-center gap-2 rounded-xl border border-[#E3E0D9] text-xs font-bold px-3 py-2.5 hover:bg-[#F6F5F1] cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-700" /> : <Link2 className="w-4 h-4" />}
              {copied ? T("share.copied") : T("share.copy")}
            </button>
            <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
              <input type="checkbox" checked={withPayments} onChange={(e) => setWithPayments(e.target.checked)} />
              {T("share.payments")}
            </label>
            <p className="text-[10px] leading-relaxed text-[#5D6168]">{T("share.snapshot")}</p>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
