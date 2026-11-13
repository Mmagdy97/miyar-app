import { useState } from "react";
import { localize } from "../data/dataI18n";
import { Check, ArrowRight } from "lucide-react";
import { formatMoney } from "../lib/currency";
import { useI18n, intlLocale } from "../i18n";

import { PRICES, PLANS, planPrice } from "../lib/pricing";

export function PricingSection({ onStart }) {
  const { t, currency } = useI18n();
  const [cur, setCur] = useState(PRICES[currency] ? currency : "EGP");
  const [yearly, setYearly] = useState(false);
  const pill = (on) => `px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-colors ${on ? "bg-[#17614F] text-white" : "text-[#555B53] hover:bg-[#F0EADD]"}`;
  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto w-full">
      <div className="text-start max-w-2xl mb-10">
        <h2 className="font-display text-3xl sm:text-[2.4rem] font-semibold text-[#1F2421] mb-3">{t("pricing.title")}</h2>
        <p className="text-[#555B53] mb-6">{t("pricing.sub")}</p>
        <div className="flex flex-wrap gap-3">
          <div role="group" aria-label={t("settings.currency")} className="inline-flex flex-wrap gap-1 p-1 rounded-xl bg-white border border-[#E6DFD0]">
            {Object.keys(PRICES).map((k) => (
              <button key={k} onClick={() => setCur(k)} aria-pressed={cur === k} className={pill(cur === k)}>
                <span className="sm:hidden">{k}</span><span className="hidden sm:inline">{(() => { try { return new Intl.DisplayNames(intlLocale(), { type: "currency" }).of(k); } catch { return k; } })()}</span>
              </button>
            ))}
          </div>
          <div role="group" aria-label={t("pricing.billing")} className="inline-flex gap-1 p-1 rounded-xl bg-white border border-[#E6DFD0]">
            <button onClick={() => setYearly(false)} aria-pressed={!yearly} className={pill(!yearly)}>{t("pricing.monthly")}</button>
            <button onClick={() => setYearly(true)} aria-pressed={yearly} className={pill(yearly)}>
              {t("pricing.yearly")} <span className={yearly ? "text-[#FDBA74]" : "text-[#17614F]"}>· {t("pricing.save")}</span>
            </button>
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
        {PLANS.map((p, i) => {
          const price = planPrice(cur, i, yearly);
          return (
            <div
              key={p.key}
              className={`relative rounded-2xl p-6 flex flex-col border ${
                p.highlight ? "bg-white border-[var(--brass)] ring-1 ring-[var(--brass)] shadow-[var(--shadow-2)] xl:-translate-y-2" : "bg-white border-[#E6DFD0]"
              }`}
            >
              {p.highlight && <span className="absolute -top-3 start-6 text-[11px] font-bold px-2.5 py-1 rounded-md bg-[var(--brass)] text-[#1F2421]">{t("pricing.popular")}</span>}
              <h3 className={`font-display text-xl font-semibold text-[#1F2421]`}>{t(`plan.${p.key}`)}</h3>
              <p className={`text-xs mb-4 text-[#555B53]`}>{t(`plan.${p.key}.tag`)}</p>
              <p className="mb-5">
                {p.custom ? (
                  <span className={`font-display text-3xl font-semibold text-[#1F2421]`}>{t("pricing.custom")}</span>
                ) : (
                  <>
                    <span className={`font-display text-3xl font-semibold tabular-nums text-[#1F2421]`}>{formatMoney(price, cur, intlLocale(), { compact: true })}</span>{" "}
                    <span className={`text-sm font-semibold text-[#555B53]`}>{yearly ? t("pricing.perYear") : t("pricing.perMonth")}</span>
                  </>
                )}
              </p>
              <ul className="space-y-2.5 mb-6 flex-1">
                {Array.from({ length: p.n }, (_, k) => t(`plan.${p.key}.f${k + 1}`)).map((f) => (
                  <li key={f} className={`flex items-start gap-2 text-sm text-[#1F2421]`}>
                    <Check className={`w-4 h-4 mt-0.5 shrink-0 text-[#17614F]`} /> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={onStart}
                className={`w-full py-3 rounded-xl font-semibold text-sm cursor-pointer transition-colors ${
                  "bg-[#17614F] text-white hover:bg-[#104A3C]"
                }`}
              >
                {i === 0 ? t("pricing.startFree") : p.custom ? t("pricing.contact") : t("pricing.try")}
              </button>
            </div>
          );
        })}
      </div>
      <div className="mt-6 rounded-2xl border border-[#17614F]/30 bg-[#17614F]/5 p-4 text-center">
        <p className="text-sm font-bold text-[#1F2421]">{t("pricing.founding")}</p>
        <p className="text-xs text-[#555B53] mt-1">{t("pricing.trial")}</p>
      </div>
      <p className="text-center text-xs text-[#555B53] mt-4">{t("pricing.note")}</p>
    </section>
  );
}

const LEGAL = localize({
  privacy: {
    title: "سياسة الخصوصية",
    sections: [
      ["البيانات التي نجمعها", "بيانات الحساب (الاسم والبريد الإلكتروني والدور الوظيفي)، وبيانات المشاريع التي يدخلها مكتبك (عملاء، مقايسات، مصروفات، صور وملفات)، وبيانات استخدام تقنية لتحسين الخدمة."],
      ["كيف نستخدمها", "لتشغيل المنصة وعرض بيانات كل مكتب لأعضائه فقط، ولتقديم الدعم، ولتحسين الأداء. لا نبيع بياناتك لأي طرف ثالث."],
      ["فصل بيانات المكاتب", "بيانات كل مكتب معزولة عن غيره، ولا يطلع عليها إلا المستخدمون الذين يضيفهم مدير المكتب، وفق صلاحيات أدوارهم."],
      ["الاحتفاظ والحذف", "نحتفظ بالبيانات طوال فترة الاشتراك. يمكنك طلب تصدير بياناتك أو حذفها نهائياً في أي وقت."],
      ["مزودو الخدمة", "نستعين بمزودي استضافة وقواعد بيانات ومعالجة مدفوعات يلتزمون بمعايير حماية مناسبة. قد تُعالج البيانات خارج بلدك."],
      ["حقوقك", "لك حق الاطلاع على بياناتك وتصحيحها وتصديرها وحذفها، وفق قوانين حماية البيانات المطبقة في بلدك (مثل نظام حماية البيانات الشخصية في السعودية وقانون KVKK في تركيا وقانون حماية البيانات الشخصية في مصر)."],
      ["التواصل", "لأي طلب يخص خصوصيتك: [أضف بريد الدعم هنا]."],
    ],
  },
  terms: {
    title: "شروط الاستخدام",
    sections: [
      ["قبول الشروط", "باستخدامك منصة معيار فإنك توافق على هذه الشروط. إن كنت تستخدمها نيابة عن مكتب أو شركة فأنت تقرّ بأنك مخوّل بذلك."],
      ["الحساب والمسؤولية", "أنت مسؤول عن سرية بيانات الدخول وعن كل نشاط يتم من حسابك، وعن صحة البيانات التي يدخلها فريقك."],
      ["الاستخدام المقبول", "يُمنع استخدام المنصة لأي نشاط مخالف للقانون، أو محاولة اختراقها أو تعطيلها، أو رفع محتوى ينتهك حقوق الآخرين."],
      ["الاشتراكات والدفع", "تُحدَّد الأسعار والحدود في صفحة الأسعار، وتُجدَّد الاشتراكات المدفوعة تلقائياً حتى الإلغاء. يمكن الإلغاء في أي وقت ويسري عند نهاية الفترة المدفوعة."],
      ["ملكية البيانات", "بياناتك ومشاريعك ملك لك. نمنحك ترخيصاً محدوداً لاستخدام المنصة، ونحتفظ بحقوق الملكية الفكرية للبرنامج."],
      ["إخلاء المسؤولية", "تُقدَّم المنصة كما هي. الحسابات والمقايسات والمستخلصات الناتجة عنها أدوات مساعدة، والمراجعة المهنية والمالية النهائية مسؤولية المكتب."],
      ["التعديل والقانون الواجب", "قد نحدّث هذه الشروط مع إشعارك بالتغييرات الجوهرية. يُحدَّد القانون الواجب التطبيق والجهة القضائية وفق بلد تسجيل الشركة المشغّلة: [يُستكمل قبل الإطلاق]."],
    ],
  },
});

export function LegalPage({ kind, onBack }) {
  const doc = LEGAL[kind];
  return (
    <main className="min-h-screen bg-[#F7F3EA] py-12 px-4 sm:px-6">
      <article className="max-w-3xl mx-auto bg-white border border-[#E6DFD0] rounded-2xl p-6 sm:p-10">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold text-[#555B53] hover:text-[#1F2421] mb-6 cursor-pointer">
          <ArrowRight className="w-4 h-4 ltr:-scale-x-100 rtl:scale-x-100" /> العودة للصفحة الرئيسية
        </button>
        <h1 className="text-3xl font-semibold text-[#1F2421] mb-2">{doc.title}</h1>
        <p className="text-xs text-[#555B53] mb-8">آخر تحديث: نوفمبر ٢٠٢٦ — مسودة تُراجع قانونياً قبل الإطلاق</p>
        <div className="space-y-6">
          {doc.sections.map(([h, t], i) => (
            <section key={h}>
              <h2 className="text-lg font-semibold text-[#1F2421] mb-1">{`${(i + 1).toLocaleString("ar-EG")}. ${h}`}</h2>
              <p className="text-sm leading-7 text-[#555B53]">{t}</p>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
