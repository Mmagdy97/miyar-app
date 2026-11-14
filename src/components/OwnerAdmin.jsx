import { useEffect, useMemo, useState, useCallback } from "react";
import { Building2, Users, FolderKanban, Clock, RefreshCw, LogOut, ArrowLeftRight, Check, Plus, Lock } from "lucide-react";
import { supabase } from "../lib/supabase";
import { FEATURES, PLAN_FEATURES } from "../lib/entitlements";

// Platform-owner dashboard (Arabic only, owner-facing). Data via admin_orgs / admin_set_org (security definer, owner only).
const PLANS = { free: "مجاني", pro: "احترافي", office: "المكتب", enterprise: "الشركات" };
const STATUS = { trial: "تجربة", active: "نشط", suspended: "موقوف" };
const TONE = { trial: "bg-amber-50 text-amber-800 border-amber-200", active: "bg-emerald-50 text-emerald-700 border-emerald-200", suspended: "bg-rose-50 text-rose-700 border-rose-200" };
const sel = "h-9 px-2 rounded-lg border border-[#DCE4DC] bg-white text-xs font-bold text-[#1F2A26] min-w-0";
const fmt = (d) => (d ? new Date(d).toLocaleDateString("ar-EG-u-nu-latn", { day: "numeric", month: "short", year: "numeric" }) : "—");
const daysLeft = (d) => Math.ceil((new Date(d) - new Date()) / 86400000);

/** Plan features are locked (come with the plan); the owner can grant any other feature on top. */
function Features({ plan, extra, onChange }) {
  const inPlan = new Set(PLAN_FEATURES[plan] || []);
  const toggle = (k) => onChange(extra.includes(k) ? extra.filter((x) => x !== k) : [...extra, k]);
  return (
    <fieldset>
      <legend className="text-[11px] font-bold text-[#56635B] mb-1.5">الصلاحيات (من الباقة + إضافية)</legend>
      <div className="flex flex-wrap gap-1.5">
        {Object.entries(FEATURES).map(([k, l]) => {
          const base = inPlan.has(k); const on = base || extra.includes(k);
          return (
            <button key={k} type="button" disabled={base} aria-pressed={on} onClick={() => toggle(k)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${base ? "bg-[#DAEBE3] text-[#5F6C61] border-[#BFD9CD] cursor-default" : on ? "bg-[var(--brass)] text-[#1F2A26] border-[var(--brass)] cursor-pointer" : "bg-white text-[#6E7B72] border-[#DCE4DC] cursor-pointer"}`}>
              {base ? <Lock className="w-3 h-3" aria-hidden="true" /> : on ? <Check className="w-3 h-3" aria-hidden="true" /> : null}{l}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function Row({ o, onSave }) {
  const [v, setV] = useState({ plan: o.plan, status: o.status, billing_months: o.billing_months, paid_until: o.paid_until || "", extra: o.extra_features || [] });
  const [busy, setBusy] = useState(false);
  const dirty = v.plan !== o.plan || v.status !== o.status || v.billing_months !== o.billing_months || (v.paid_until || "") !== (o.paid_until || "") || [...v.extra].sort().join() !== [...(o.extra_features || [])].sort().join();
  const save = async () => { setBusy(true); await onSave(o.id, v); setBusy(false); };
  return (
    <article className="bg-white rounded-2xl border border-[#DCE4DC] p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-base font-semibold text-[#1F2A26] truncate">{o.name}</p>
          <p className="text-[11px] text-[#6E7B72]">{o.country} · {o.currency} · انضم {fmt(o.created_at)}</p>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${TONE[o.status]}`}>{STATUS[o.status]}</span>
      </div>
      <p className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#56635B]">
        <span className="inline-flex items-center gap-1"><Users className="w-3.5 h-3.5" aria-hidden="true" />{o.members} عضو</span>
        {o.invited && <span className="inline-flex items-center gap-1 text-[#9A4F35]">بانتظار تسجيل: <bdi dir="ltr">{o.invited}</bdi></span>}
        <span className="inline-flex items-center gap-1"><FolderKanban className="w-3.5 h-3.5" aria-hidden="true" />{o.projects} مشروع</span>
        {o.status === "trial" && <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" aria-hidden="true" />{daysLeft(o.trial_ends_at) > 0 ? `باقي ${daysLeft(o.trial_ends_at)} يوم` : "انتهت التجربة"}</span>}
      </p>
      <Features plan={v.plan} extra={v.extra} onChange={(extra) => setV({ ...v, extra })} />
      <div className="flex flex-wrap items-center gap-2">
        <select aria-label="الباقة" value={v.plan} onChange={(e) => setV({ ...v, plan: e.target.value })} className={sel}>{Object.entries(PLANS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
        <select aria-label="الحالة" value={v.status} onChange={(e) => setV({ ...v, status: e.target.value })} className={sel}>{Object.entries(STATUS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
        <select aria-label="دورة الدفع" value={v.billing_months} onChange={(e) => setV({ ...v, billing_months: Number(e.target.value) })} className={sel}>{[1, 3, 6, 12].map((m) => <option key={m} value={m}>{m} شهر</option>)}</select>
        <label className="flex items-center gap-1.5 text-[11px] font-bold text-[#56635B]">مدفوع حتى<input type="date" value={v.paid_until} onChange={(e) => setV({ ...v, paid_until: e.target.value })} className={sel} /></label>
        <button type="button" disabled={!dirty || busy} onClick={save} className="ms-auto inline-flex items-center gap-1.5 px-3 h-9 rounded-lg text-xs font-bold text-white bg-[#5F6C61] hover:bg-[#4B574D] disabled:opacity-40 cursor-pointer"><Check className="w-4 h-4" aria-hidden="true" />حفظ</button>
      </div>
    </article>
  );
}

const blank = { name: "", country: "EG", currency: "EGP", plan: "pro", status: "active", billing_months: 12, paid_until: "", extra: [], email: "" };
const COUNTRY = { EGP: "EG", SAR: "SA", AED: "AE", KWD: "KW", JOD: "JO", TRY: "TR", USD: "US" };

function AddOffice({ onDone, onCancel, setErr }) {
  const [v, setV] = useState(blank);
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setErr("");
    const { error } = await supabase.rpc("admin_create_org", { p_name: v.name.trim(), p_country: COUNTRY[v.currency], p_currency: v.currency, p_plan: v.plan, p_status: v.status, p_billing_months: v.billing_months, p_paid_until: v.paid_until || null, p_extra: v.extra, p_admin_email: v.email.trim() || null });
    setBusy(false);
    if (error) setErr(error.message); else onDone();
  };
  return (
    <form onSubmit={submit} className="bg-white rounded-2xl border border-[var(--brass)] p-4 space-y-3">
      <p className="text-sm font-semibold">إضافة مكتب</p>
      <div className="grid sm:grid-cols-2 gap-2">
        <input required value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} placeholder="اسم المكتب" className="h-10 px-3 rounded-lg border border-[#DCE4DC] text-sm min-w-0" />
        <input type="email" dir="ltr" value={v.email} onChange={(e) => setV({ ...v, email: e.target.value })} placeholder="إيميل مدير المكتب (اختياري)" className="h-10 px-3 rounded-lg border border-[#DCE4DC] text-sm min-w-0" />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <select aria-label="العملة" value={v.currency} onChange={(e) => setV({ ...v, currency: e.target.value })} className={sel}>{Object.keys(COUNTRY).map((c) => <option key={c} value={c}>{c}</option>)}</select>
        <select aria-label="الباقة" value={v.plan} onChange={(e) => setV({ ...v, plan: e.target.value })} className={sel}>{Object.entries(PLANS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
        <select aria-label="الحالة" value={v.status} onChange={(e) => setV({ ...v, status: e.target.value })} className={sel}>{Object.entries(STATUS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
        <select aria-label="دورة الدفع" value={v.billing_months} onChange={(e) => setV({ ...v, billing_months: Number(e.target.value) })} className={sel}>{[1, 3, 6, 12].map((m) => <option key={m} value={m}>{m} شهر</option>)}</select>
        <label className="flex items-center gap-1.5 text-[11px] font-bold text-[#56635B]">مدفوع حتى<input type="date" value={v.paid_until} onChange={(e) => setV({ ...v, paid_until: e.target.value })} className={sel} /></label>
      </div>
      <Features plan={v.plan} extra={v.extra} onChange={(extra) => setV({ ...v, extra })} />
      <p className="text-[11px] text-[#6E7B72]">لو الإيميل مسجّل بالفعل (وبدون مكتب) بيتربط فورًا، وإلا بيتربط أول ما يسجّل حساب.</p>
      <div className="flex gap-2">
        <button type="submit" disabled={busy} className="inline-flex items-center gap-1.5 px-4 h-10 rounded-lg text-xs font-bold text-white bg-[#5F6C61] hover:bg-[#4B574D] disabled:opacity-50 cursor-pointer"><Plus className="w-4 h-4" aria-hidden="true" />إضافة</button>
        <button type="button" onClick={onCancel} className="px-4 h-10 rounded-lg text-xs font-bold bg-white border border-[#DCE4DC] cursor-pointer">إلغاء</button>
      </div>
    </form>
  );
}

export default function OwnerAdmin({ name, onOpenApp, onLogout }) {
  const [orgs, setOrgs] = useState(null);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");
  const [adding, setAdding] = useState(false);
  const load = useCallback(async () => {
    setErr("");
    const { data, error } = await supabase.rpc("admin_orgs");
    if (error) setErr(error.message); else setOrgs(data);
  }, []);
  useEffect(() => { load(); }, [load]);
  const save = async (id, v) => {
    const { error } = await supabase.rpc("admin_set_org", { p_org: id, p_plan: v.plan, p_status: v.status, p_billing_months: v.billing_months, p_paid_until: v.paid_until || null, p_extra: v.extra });
    if (error) setErr(error.message); else await load();
  };
  const list = useMemo(() => (orgs || []).filter((o) => o.name.toLowerCase().includes(q.trim().toLowerCase())), [orgs, q]);
  const stats = useMemo(() => {
    const a = orgs || [];
    const week = Date.now() - 7 * 86400000;
    return [
      ["كل المكاتب", a.length, Building2],
      ["نشطة (مدفوعة)", a.filter((o) => o.status === "active").length, Check],
      ["جديدة هذا الأسبوع", a.filter((o) => new Date(o.created_at) > week).length, Users],
      ["تجربة تنتهي خلال ٣ أيام", a.filter((o) => o.status === "trial" && daysLeft(o.trial_ends_at) <= 3).length, Clock],
    ];
  }, [orgs]);
  return (
    <div dir="rtl" className="min-h-screen bg-[#F2F5F1] text-[#1F2A26] font-ibm">
      <header className="sticky top-0 z-30 bg-[#F2F5F1]/90 glass border-b border-[#DCE4DC]">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-2">
          <h1 className="font-display text-lg font-semibold">لوحة مالك المنصة <span className="text-xs font-medium text-[#6E7B72]">· {name}</span></h1>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onOpenApp} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-bold bg-white border border-[#DCE4DC] cursor-pointer"><ArrowLeftRight className="w-4 h-4" aria-hidden="true" />دخول التطبيق</button>
            <button type="button" onClick={onLogout} aria-label="خروج" className="h-9 w-9 flex items-center justify-center rounded-lg bg-white border border-[#DCE4DC] cursor-pointer"><LogOut className="w-4 h-4" /></button>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto p-4 md:p-8 space-y-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map(([l, n, Ic]) => (
            <div key={l} className="bg-white rounded-xl border border-[#DCE4DC] p-4">
              <p className="text-[11px] font-bold text-[#56635B] flex items-center gap-1.5"><Ic className="w-3.5 h-3.5" aria-hidden="true" />{l}</p>
              <p className="mt-1 font-display text-2xl font-semibold tabular-nums">{orgs ? n : "…"}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث باسم المكتب" className="flex-1 h-10 px-3 rounded-lg border border-[#DCE4DC] bg-white text-sm" />
          <button type="button" onClick={() => setAdding((a) => !a)} className="inline-flex items-center gap-1.5 h-10 px-3 rounded-lg text-xs font-bold text-white bg-[#5F6C61] hover:bg-[#4B574D] cursor-pointer"><Plus className="w-4 h-4" aria-hidden="true" />إضافة مكتب</button>
          <button type="button" onClick={load} aria-label="تحديث" className="h-10 w-10 flex items-center justify-center rounded-lg bg-white border border-[#DCE4DC] cursor-pointer"><RefreshCw className="w-4 h-4" /></button>
        </div>
        {adding && <AddOffice setErr={setErr} onCancel={() => setAdding(false)} onDone={() => { setAdding(false); load(); }} />}
        {err && <p role="alert" className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-3">{err}{/not allowed|permission|function/i.test(err) ? " — تأكد إنك أضفت نفسك في platform_admins وإن schema-saas.sql اتشغّل." : ""}</p>}
        {orgs && list.length === 0 && <p className="text-xs text-[#56635B] bg-white rounded-lg border border-[#DCE4DC] p-6 text-center">لا توجد مكاتب بعد.</p>}
        <div className="grid gap-3">{list.map((o) => <Row key={o.id + o.plan + o.status + o.billing_months + (o.paid_until || "") + (o.extra_features || []).join()} o={o} onSave={save} />)}</div>
      </main>
    </div>
  );
}
