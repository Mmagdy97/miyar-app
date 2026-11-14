import { useState } from "react";
import EmptyState from "./EmptyState";
import { useProjectList } from "../data/projects";
import { Armchair, Check, X, Download, Plus, ImagePlus, MessageCircle, Clock, Ruler, ChevronDown, Trash2, Printer, Truck } from "lucide-react";
import Photo from "./Photo";
import { fileToDataUrl } from "../lib/image";
import { tr_ as T, E, money, intlLocale } from "../i18n";
import { CLIENT_PROJECT_ID } from "../data/seed";
import { selectionsStore } from "../data/stores";
import { selectionTotals, groupByRoom, groupBySupplier, linePrice, lineCost, supplierWa, etaOf, isLate, today, STEPS, stepIndex } from "../lib/selections";
import { printPO, poNumber } from "../lib/po";
import { toCsv, download } from "../lib/accountant";
import { selectionsRepo } from "../data/selections";
import { projectsStore } from "../data/projects";

const input = "px-3 py-2 rounded-lg border border-[#DCE4DC] text-xs font-bold text-[#1F2A26] bg-white min-w-0";
const badge = { proposed: "bg-amber-50 text-amber-800 border-amber-200", approved: "bg-emerald-50 text-emerald-700 border-emerald-200", rejected: "bg-rose-50 text-rose-700 border-rose-200", ordered: "bg-sky-50 text-sky-700 border-sky-200", delivered: "bg-teal-50 text-teal-800 border-teal-200", installed: "bg-emerald-100 text-emerald-800 border-emerald-300" };
const empty = { room: "", name: "", supplier: "", qty: "1", cost: "", price: "", image: "", phone: "", dims: "", material: "", code: "", leadDays: "", color: "#C8A27A" };

/** Photo tile; without a photo it shows the finish colour as a swatch. */
function Thumb({ i, size = "w-full md:w-28 h-44 md:h-28", onZoom }) {
  const swatch = (
    <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${i.color || "#D9D4CB"}, color-mix(in srgb, ${i.color || "#D9D4CB"} 55%, white))` }}>
      <Armchair className="w-8 h-8 text-white/80" aria-hidden="true" />
    </div>
  );
  return (
    <button type="button" disabled={!i.image} onClick={onZoom} aria-label={T("sel.zoom")} className={`${size} shrink-0 overflow-hidden rounded-xl border border-[#DCE4DC] bg-[#E8EFE9] ${i.image ? "cursor-zoom-in" : "cursor-default"}`}>
      {i.image ? <Photo src={i.image} alt={i.name} className="w-full h-full object-cover" fallbackClass="" /> : swatch}
    </button>
  );
}

/** Client selections & FF&E schedule. Admin proposes items per room; the client approves or rejects. */
function SelectionsInner({ role = "Admin", restricted = false, projects, data }) {
  const isClient = role === "Client";
  const items = data.items;
  const [projectId, setProjectId] = useState(isClient ? (projects.find((p) => p.id === CLIENT_PROJECT_ID)?.id ?? projects[0].id) : projects[0].id);
  const [f, setF] = useState(empty);
  const [more, setMore] = useState(false);
  const [zoom, setZoom] = useState(null);
  const [imgErr, setImgErr] = useState(false);
  const pick = async (e) => {
    const file = e.target.files?.[0]; e.target.value = "";
    if (!file) return;
    try { setImgErr(false); setF((x) => ({ ...x, image: "" })); const u = await fileToDataUrl(file); setF((x) => ({ ...x, image: u })); } catch { setImgErr(true); }
  };
  const project = (projects.find((p) => p.id === Number(projectId)) || projects[0]);
  const mine = items.filter((i) => i.projectId === project.id);
  const t = selectionTotals(mine);
  const groups = groupByRoom(mine);

  const add = (e) => {
    e.preventDefault();
    if (!f.name.trim() || !Number(f.price)) return;
    data.add({ projectId: project.id, room: f.room.trim(), name: f.name.trim(), supplier: f.supplier.trim(), phone: f.phone.trim(), dims: f.dims.trim(), material: f.material.trim(), code: f.code.trim(), leadDays: Number(f.leadDays) || 0, color: f.color, image: f.image.trim(), qty: Number(f.qty) || 1, cost: Number(f.cost) || 0, price: Number(f.price) });
    setF(empty); setMore(false);
  };
  const remove = (id) => data.remove(id);
  const setStatus = (id, status) => data.setStatus(id, status);
  const orderAll = (list) => data.orderAll(list.filter((i) => i.status === "approved").map((i) => i.id));
  const pos = groupBySupplier(mine, ["approved", "ordered"]);
  const poWa = (po) => supplierWa(po.phone, T("sel.poMsg", { no: poNumber(project, po.supplier, today()), project: E(project.name), n: po.list.length, total: money(po.total) }));
  const exportCsv = () =>
    download(`ffe-${project.code}.csv`, toCsv([T("sel.room"), T("sel.item"), T("sel.supplier"), T("sel.phone"), T("sel.dims"), T("sel.material"), T("sel.code"), T("sel.lead"), T("sel.qty"), T("sel.price"), T("sel.total"), T("sel.status")], mine.map((i) => [i.room, i.name, i.supplier, i.phone || "", i.dims || "", i.material || "", i.code || "", i.leadDays || "", i.qty, i.price, linePrice(i), T("sel.s." + i.status)])), "text/csv");

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent pb-24 font-ibm w-full max-w-full overflow-x-hidden">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-[#1F2A26] flex items-center gap-2.5"><Armchair className="w-7 h-7" /><span>{T(isClient ? "sel.title.client" : "sel.title")}</span></h1>
            <p className="text-xs md:text-sm text-[#56635B] mt-1">{T(isClient ? "sel.sub.client" : "sel.sub")}</p>
          </div>
          {!isClient && <button type="button" onClick={exportCsv} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-[#1F2A26] bg-white border border-[#DCE4DC] hover:bg-[#F2F5F1] cursor-pointer w-fit"><Download className="w-4 h-4" />{T("sel.export")}</button>}
        </div>

        {!isClient && (
          <select value={projectId} onChange={(e) => setProjectId(e.target.value)} className={input + " max-w-md w-full"}>
            {projects.map((p) => <option key={p.id} value={p.id}>{E(p.name)}</option>)}
          </select>
        )}

        <div className="grid stat-grid grid-cols-2 md:grid-cols-4 gap-3">
          {[["sel.k.approved", t.price], ["sel.k.pending", t.pending], ...(isClient || restricted ? [] : [["sel.k.cost", t.cost], ["sel.k.margin", t.margin]])].map(([k, v]) => (
            <div key={k} className="bg-white rounded-lg p-4 border border-[#DCE4DC] text-center">
              <span className="text-[11px] font-bold text-[#56635B] block mb-1">{T(k)}</span>
              <span className="text-lg md:text-xl font-semibold text-[#1F2A26]">{money(v, { compact: true })}</span>
              {k === "sel.k.margin" && <span className="block text-[10px] font-bold text-[#56635B]">{t.marginPct}%</span>}
            </div>
          ))}
        </div>

        {!isClient && (
          <form onSubmit={add} className="bg-white rounded-2xl border border-[#DCE4DC] p-4 space-y-3">
            <div className="flex flex-wrap gap-2 items-end">
              <input placeholder={T("sel.room")} value={f.room} onChange={(e) => setF({ ...f, room: e.target.value })} className={input + " w-32"} />
              <input required placeholder={T("sel.item")} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className={input + " flex-1 min-w-36"} />
              <input placeholder={T("sel.supplier")} value={f.supplier} onChange={(e) => setF({ ...f, supplier: e.target.value })} className={input + " w-40"} />
              <input type="number" min={1} placeholder={T("sel.qty")} value={f.qty} onChange={(e) => setF({ ...f, qty: e.target.value })} className={input + " w-20"} />
              {!restricted && <input type="number" min={0} placeholder={T("sel.cost")} value={f.cost} onChange={(e) => setF({ ...f, cost: e.target.value })} className={input + " w-28"} />}
              <input required type="number" min={1} placeholder={T("sel.price")} value={f.price} onChange={(e) => setF({ ...f, price: e.target.value })} className={input + " w-28"} />
            </div>
            <button type="button" onClick={() => setMore((v) => !v)} aria-expanded={more} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5F6C61] cursor-pointer">
              <ChevronDown className={`w-4 h-4 transition-transform ${more ? "rotate-180" : ""}`} aria-hidden="true" />{T("sel.details")}
            </button>
            {more && (
              <div className="grid md:grid-cols-[11rem_1fr] gap-4 animate-in">
                <div>
                  <p className="text-[11px] font-bold text-[#56635B] mb-1.5">{T("sel.photo")}</p>
                  <div className="h-36 rounded-xl overflow-hidden border border-dashed border-[#C6D0C6] bg-[#F2F5F1]">
                    {f.image ? <Photo src={f.image} alt="" className="w-full h-full object-cover" /> : <label className="h-full flex flex-col items-center justify-center gap-1.5 text-xs font-semibold text-[#56635B] cursor-pointer"><ImagePlus className="w-6 h-6" aria-hidden="true" />{T("sel.photo.add")}<input type="file" accept="image/*" onChange={pick} className="sr-only" /></label>}
                  </div>
                  {f.image
                    ? <button type="button" onClick={() => setF({ ...f, image: "" })} className="mt-1.5 text-[11px] font-semibold text-rose-700 cursor-pointer">{T("sel.photo.remove")}</button>
                    : <input placeholder={T("sel.photo.url")} value={f.image} onChange={(e) => setF({ ...f, image: e.target.value })} className={input + " mt-1.5 w-full"} />}
                  {imgErr && <p className="mt-1 text-[11px] text-rose-700">{T("sel.uploadFail")}</p>}
                </div>
                <div className="grid sm:grid-cols-2 gap-2 content-start">
                  <input placeholder={T("sel.phone")} inputMode="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} className={input} />
                  <input placeholder={T("sel.lead")} type="number" min={0} value={f.leadDays} onChange={(e) => setF({ ...f, leadDays: e.target.value })} className={input} />
                  <input placeholder={T("sel.dims")} value={f.dims} onChange={(e) => setF({ ...f, dims: e.target.value })} className={input} />
                  <input placeholder={T("sel.code")} value={f.code} onChange={(e) => setF({ ...f, code: e.target.value })} className={input} />
                  <input placeholder={T("sel.material")} value={f.material} onChange={(e) => setF({ ...f, material: e.target.value })} className={input + " sm:col-span-2"} />
                  <label className="flex items-center gap-2 text-[11px] font-bold text-[#56635B]">{T("sel.color")}<input type="color" value={f.color} onChange={(e) => setF({ ...f, color: e.target.value })} className="h-8 w-10 rounded-md border border-[#DCE4DC] bg-white p-0.5" /></label>
                </div>
              </div>
            )}
            <button type="submit" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#5F6C61] hover:bg-[#4B574D] cursor-pointer"><Plus className="w-4 h-4" />{T("sel.add")}</button>
          </form>
        )}

        {!isClient && pos.length > 0 && (
          <section className="space-y-2">
            <div><h2 className="text-sm font-semibold text-[#1F2A26]">{T("sel.orders")}</h2><p className="text-[11px] text-[#56635B]">{T("sel.ordersSub")}</p></div>
            <div className="grid md:grid-cols-2 gap-3">
              {pos.map((po) => (
                <div key={po.supplier} className="bg-white rounded-2xl border border-[#DCE4DC] p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-[#1F2A26]">{po.supplier || T("sel.noSupplier")}</p>
                    {!restricted && <span className="text-sm font-semibold tabular-nums text-[#1F2A26] shrink-0">{money(po.total)}</span>}
                  </div>
                  <p className="text-[11px] text-[#56635B]">{po.list.map((i) => `${i.qty}× ${i.name}`).join(" · ")}</p>
                  <div className="flex flex-wrap gap-2">
                    {po.list.some((i) => i.status === "approved") && <button type="button" onClick={() => orderAll(po.list)} className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#5F6C61] hover:bg-[#4B574D] cursor-pointer">{T("sel.poAll")}</button>}
                    <button type="button" onClick={() => printPO(po, project, today())} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#1F2A26] bg-white border border-[#DCE4DC] hover:bg-[#F2F5F1] cursor-pointer"><Printer className="w-4 h-4" aria-hidden="true" />{T("sel.po")}</button>
                    {po.phone && <a href={poWa(po)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#5F6C61] bg-[#DAEBE3] hover:bg-[#CDE3D8]"><MessageCircle className="w-4 h-4" aria-hidden="true" />{T("sel.poWa")}</a>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {mine.length === 0 && <EmptyState title={T("sel.empty")} hint={T("sel.emptyHint")} />}
        {Object.entries(groups).map(([room, list]) => (
          <section key={room} className="space-y-2">
            <h2 className="text-sm font-semibold text-[#1F2A26]">{room || T("sel.general")}</h2>
            {list.map((i) => (
              <article key={i.id} className="bg-white rounded-2xl border border-[#DCE4DC] p-3 md:p-4 flex flex-col md:flex-row gap-3 md:gap-4">
                <Thumb i={i} onZoom={() => i.image && setZoom(i)} />
                <div className="flex-1 min-w-0 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-base font-semibold text-[#1F2A26] leading-snug">{i.name}</p>
                      {i.supplier && <p className="text-xs text-[#56635B] mt-0.5">{i.supplier}</p>}
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border w-fit shrink-0 ${badge[i.status]}`}>{T("sel.s." + i.status)}</span>
                  </div>
                  {(i.dims || i.material || i.code || i.leadDays > 0) && (
                    <ul className="flex flex-wrap gap-1.5 text-[11px] text-[#56635B]">
                      {i.dims && <li className="inline-flex items-center gap-1 rounded-md bg-[#F2F5F1] border border-[#DCE4DC] px-2 py-0.5"><Ruler className="w-3 h-3" aria-hidden="true" />{i.dims}</li>}
                      {i.material && <li className="inline-flex items-center gap-1.5 rounded-md bg-[#F2F5F1] border border-[#DCE4DC] px-2 py-0.5"><span className="w-2.5 h-2.5 rounded-full border border-black/10" style={{ background: i.color }} aria-hidden="true" />{i.material}</li>}
                      {i.code && <li className="rounded-md bg-[#F2F5F1] border border-[#DCE4DC] px-2 py-0.5 tabular-nums">{i.code}</li>}
                      {i.leadDays > 0 && <li className="inline-flex items-center gap-1 rounded-md bg-[#FDE8D3] border border-[#F3C3B2] text-[#9A4F35] px-2 py-0.5"><Clock className="w-3 h-3" aria-hidden="true" />{T("sel.leadTag", { d: i.leadDays })}</li>}
                    </ul>
                  )}
                  {stepIndex(i) >= 0 && (
                    <ol className="flex items-center gap-1 text-[10px] font-semibold text-[#6E7B72]" aria-label={T("sel.track")}>
                      {STEPS.map((k, n) => (
                        <li key={k} className={`flex items-center gap-1 ${n <= stepIndex(i) ? "text-[#5F6C61]" : ""}`}>
                          <span className={`w-2.5 h-2.5 rounded-full border ${n <= stepIndex(i) ? "bg-[#5F6C61] border-[#5F6C61]" : "border-[#C6D0C6] bg-white"}`} aria-hidden="true" />{T("sel.step." + k)}
                          {n < STEPS.length - 1 && <span className={`w-4 sm:w-6 h-px ${n < stepIndex(i) ? "bg-[#5F6C61]" : "bg-[#C6D0C6]"}`} aria-hidden="true" />}
                        </li>
                      ))}
                    </ol>
                  )}
                  {i.status === "ordered" && etaOf(i) && (
                    <p className={`inline-flex items-center gap-1.5 text-[11px] font-bold w-fit rounded-md px-2 py-0.5 border ${isLate(i) ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-sky-50 text-sky-700 border-sky-200"}`}>
                      <Truck className="w-3 h-3" aria-hidden="true" />{T("sel.eta", { d: new Date(etaOf(i)).toLocaleDateString(intlLocale(), { day: "numeric", month: "short" }) })}{isLate(i) && ` · ${T("sel.late", { n: Math.max(1, Math.round((new Date(today()) - new Date(etaOf(i))) / 86400000)) })}`}
                    </p>
                  )}
                  <p className="text-sm font-semibold text-[#1F2A26] tabular-nums">{i.qty} × {money(i.price)} = {money(linePrice(i))}{!isClient && !restricted && <span className="text-xs font-medium text-[#6E7B72]">{` · ${T("sel.cost")}: ${money(lineCost(i))}`}</span>}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-auto">
                    {isClient && i.status === "proposed" && (
                      <>
                        <button type="button" onClick={() => setStatus(i.id, "approved")} className="inline-flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 cursor-pointer"><Check className="w-4 h-4" />{T("sel.approve")}</button>
                        <button type="button" onClick={() => setStatus(i.id, "rejected")} className="inline-flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 cursor-pointer"><X className="w-4 h-4" />{T("sel.reject")}</button>
                      </>
                    )}
                    {!isClient && i.status === "approved" && <button type="button" onClick={() => setStatus(i.id, "ordered")} className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#5F6C61] hover:bg-[#4B574D] cursor-pointer">{T("sel.order")}</button>}
                    {!isClient && i.status === "ordered" && <button type="button" onClick={() => setStatus(i.id, "delivered")} className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#5F6C61] hover:bg-[#4B574D] cursor-pointer">{T("sel.deliver")}</button>}
                    {!isClient && i.status === "delivered" && <button type="button" onClick={() => setStatus(i.id, "installed")} className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#5F6C61] hover:bg-[#4B574D] cursor-pointer">{T("sel.install")}</button>}
                    {!isClient && i.status === "rejected" && <button type="button" onClick={() => setStatus(i.id, "proposed")} className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#1F2A26] bg-white border border-[#DCE4DC] cursor-pointer">{T("sel.repropose")}</button>}
                    {!isClient && i.phone && <a href={supplierWa(i.phone, T("sel.waMsg", { item: i.name, code: i.code || "-", project: E(project.name) }))} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#5F6C61] bg-[#DAEBE3] hover:bg-[#CDE3D8]"><MessageCircle className="w-4 h-4" aria-hidden="true" />{T("sel.waBtn")}</a>}
                    {!isClient && (i.status === "proposed" || i.status === "approved" || i.status === "rejected") && <button type="button" onClick={() => remove(i.id)} aria-label={T("sel.photo.remove")} className="ms-auto p-1.5 rounded-lg text-[#6E7B72] hover:text-rose-700 hover:bg-rose-50 cursor-pointer"><Trash2 className="w-4 h-4" /></button>}
                  </div>
                </div>
              </article>
            ))}
          </section>
        ))}
      </div>
      {zoom && (
        <div role="dialog" aria-modal="true" aria-label={zoom.name} onClick={() => setZoom(null)} className="fixed inset-0 z-50 bg-[#1F2A26]/80 flex flex-col items-center justify-center p-4 animate-in fade-in">
          <button type="button" onClick={() => setZoom(null)} aria-label={T("sel.close")} className="absolute top-4 end-4 p-2 rounded-full bg-white/90 text-[#1F2A26] cursor-pointer"><X className="w-5 h-5" /></button>
          <Photo src={zoom.image} alt={zoom.name} className="max-h-[78vh] max-w-full rounded-2xl object-contain" />
          <p className="mt-3 text-sm font-semibold text-white">{zoom.name}</p>
        </div>
      )}
    </main>
  );
}

function NoProjects() {
  return (
    <main className="flex-1 flex items-center justify-center p-8 font-ibm">
      <p className="text-sm text-[#56635B] bg-white rounded-xl border border-[#DCE4DC] p-8 text-center max-w-sm">{T("proj.none")}</p>
    </main>
  );
}

export default function Selections(props) {
  const projects = useProjectList();
  const [demo, setDemo] = selectionsStore.use();
  const liveItems = selectionsRepo.use();
  const data = projectsStore.isLive
    ? { items: liveItems, add: selectionsRepo.add, remove: selectionsRepo.remove, setStatus: selectionsRepo.setStatus, orderAll: selectionsRepo.orderAll }
    : {
        items: demo,
        add: (i) => setDemo((a) => [...a, { id: Date.now(), ...i, status: "proposed" }]),
        remove: (id) => setDemo((a) => a.filter((i) => i.id !== id)),
        setStatus: (id, status) => setDemo((a) => a.map((i) => (i.id === id ? { ...i, status, ...(status === "ordered" ? { orderedAt: today() } : status === "delivered" ? { deliveredAt: today() } : {}) } : i))),
        orderAll: (ids) => { const set = new Set(ids); setDemo((a) => a.map((i) => (set.has(i.id) ? { ...i, status: "ordered", orderedAt: today() } : i))); },
      };
  return projects.length ? <SelectionsInner {...props} projects={projects} data={data} /> : <NoProjects />;
}
