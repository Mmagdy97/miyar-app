import { useState } from "react";
import { localize } from "../data/dataI18n";
import { Check, ArrowRight } from "lucide-react";
import { CURRENCIES, formatMoney } from "../lib/currency";
import { useI18n, intlLocale } from "../i18n";

import { PRICES, PLANS, planPrice } from "../lib/pricing";

export function PricingSection({ onStart }) {
  const { t, currency } = useI18n();
  const [cur, setCur] = useState(PRICES[currency] ? currency : "EGP");
  const [yearly, setYearly] = useState(false);
  const pill = (on) => `px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-colors ${on ? "bg-[#24304D] text-white" : "text-[#535E78] hover:bg-[#E9E3D5]"}`;
  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto w-full">
      <div className="text-start max-w-2xl mb-10">
        <h2 className="text-3xl sm:text-4xl font-black text-[#1A2236] mb-3">{t("pricing.title")}</h2>
        <p className="text-[#535E78] mb-6">{t("pricing.sub")}</p>
        <div className="flex flex-wrap gap-3">
          <div role="group" aria-label={t("settings.currency")} className="inline-flex flex-wrap gap-1 p-1 rounded-xl bg-white border border-[#DAD3C2]">
            {Object.keys(PRICES).map((k) => (
              <button key={k} onClick={() => setCur(k)} aria-pressed={cur === k} className={pill(cur === k)}>
                {CURRENCIES[k].name}
              </button>
            ))}
          </div>
          <div role="group" aria-label={t("pricing.billing")} className="inline-flex gap-1 p-1 rounded-xl bg-white border border-[#DAD3C2]">
            <button onClick={() => setYearly(false)} aria-pressed={!yearly} className={pill(!yearly)}>{t("pricing.monthly")}</button>
            <button onClick={() => setYearly(true)} aria-pressed={yearly} className={pill(yearly)}>
              {t("pricing.yearly")} <span className={yearly ? "text-[#FDBA74]" : "text-[#B5452B]"}>· {t("pricing.save")}</span>
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
              className={`rounded-2xl p-6 bg-white flex flex-col border ${
                p.highlight ? "border-[#B5452B] shadow-lg ring-1 ring-[#B5452B]/30" : "border-[#DAD3C2]"
              }`}
            >
              {p.highlight && <span className="self-start mb-3 text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#B5452B] text-white">{t("pricing.popular")}</span>}
              <h3 className="text-xl font-black text-[#1A2236]">{t(`plan.${p.key}`)}</h3>
              <p className="text-xs text-[#535E78] mb-4">{t(`plan.${p.key}.tag`)}</p>
              <p className="mb-5">
                {p.custom ? (
                  <span className="text-3xl font-black text-[#1A2236]">{t("pricing.custom")}</span>
                ) : price === 0 ? (
                  <span className="text-4xl font-black text-[#1A2236]">{t("pricing.free")}</span>
                ) : (
                  <>
                    <span className="text-3xl font-black text-[#1A2236] tabular-nums">{formatMoney(price, cur, intlLocale(), { compact: true })}</span>{" "}
                    <span className="text-sm font-bold text-[#535E78]">{yearly ? t("pricing.perYear") : t("pricing.perMonth")}</span>
                  </>
                )}
              </p>
              <ul className="space-y-2.5 mb-6 flex-1">
                {Array.from({ length: p.n }, (_, k) => t(`plan.${p.key}.f${k + 1}`)).map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[#1A2236]">
                    <Check className="w-4 h-4 mt-0.5 text-[#B5452B] shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={onStart}
                className={`w-full py-3 rounded-xl font-bold text-sm cursor-pointer transition-colors ${
                  p.highlight ? "bg-[#B5452B] text-white hover:bg-[#9A3822]" : "bg-[#24304D] text-white hover:bg-[#1A2236]"
                }`}
              >
                {i === 0 ? t("pricing.startFree") : p.custom ? t("pricing.contact") : t("pricing.try")}
              </button>
            </div>
          );
        })}
      </div>
      <div className="mt-6 rounded-2xl border border-[#B5452B]/30 bg-[#B5452B]/5 p-4 text-center">
        <p className="text-sm font-bold text-[#1A2236]">{t("pricing.founding")}</p>
        <p className="text-xs text-[#535E78] mt-1">{t("pricing.trial")}</p>
      </div>
      <p className="text-center text-xs text-[#535E78] mt-4">{t("pricing.note")}</p>
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
    <main className="min-h-screen bg-[#F3EFE6] py-12 px-4 sm:px-6">
      <article className="max-w-3xl mx-auto bg-white border border-[#DAD3C2] rounded-2xl p-6 sm:p-10">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold text-[#535E78] hover:text-[#24304D] mb-6 cursor-pointer">
          <ArrowRight className="w-4 h-4 ltr:-scale-x-100 rtl:scale-x-100" /> العودة للصفحة الرئيسية
        </button>
        <h1 className="text-3xl font-black text-[#1A2236] mb-2">{doc.title}</h1>
        <p className="text-xs text-[#535E78] mb-8">آخر تحديث: نوفمبر ٢٠٢٦ — مسودة تُراجع قانونياً قبل الإطلاق</p>
        <div className="space-y-6">
          {doc.sections.map(([h, t], i) => (
            <section key={h}>
              <h2 className="text-lg font-black text-[#1A2236] mb-1">{`${(i + 1).toLocaleString("ar-EG")}. ${h}`}</h2>
              <p className="text-sm leading-7 text-[#535E78]">{t}</p>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
