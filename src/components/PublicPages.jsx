import { useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import { CURRENCIES, formatMoney } from "../lib/currency";

// DRAFT pricing (indicative, to be validated with first customers before launch).
const PRICES = {
  EGP: [0, 1200, 3200],
  TRY: [0, 1200, 3200],
  SAR: [0, 109, 299],
  AED: [0, 109, 299],
  KWD: [0, 9, 24],
  JOD: [0, 20, 56],
  USD: [0, 29, 79],
};

const PLANS = [
  {
    name: "مجاني",
    tagline: "للتجربة ومكاتب المشروع الواحد",
    features: ["مشروع واحد نشط", "مستخدمان", "بوابة العميل الأساسية", "تقارير الموقع اليومية"],
  },
  {
    name: "احترافي",
    tagline: "للمكاتب الصغيرة والمتوسطة",
    highlight: true,
    features: ["حتى ١٠ مشاريع", "حتى ١٠ مستخدمين", "العهد النقدية والمقايسات الذكية", "الدفعات والمستخلصات", "دعم عبر واتساب"],
  },
  {
    name: "المكتب",
    tagline: "للشركات متعددة المواقع",
    features: ["مشاريع غير محدودة", "حتى ٣٠ مستخدماً", "هوية مكتبك في بوابة العميل", "صلاحيات متقدمة", "دعم أولوية"],
  },
];


export function PricingSection({ onStart }) {
  const [cur, setCur] = useState("EGP");
  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto w-full">
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-black text-[#1E2429] mb-3">أسعار واضحة تناسب حجم مكتبك</h2>
        <p className="text-[#5A646E] mb-6">ابدأ مجاناً، وترقّى عندما يكبر عدد مشاريعك. الأسعار شهرية.</p>
        <div role="group" aria-label="العملة" className="inline-flex flex-wrap justify-center gap-1 p-1 rounded-xl bg-white border border-[#DDE1E5]">
          {Object.keys(PRICES).map((k) => (
            <button
              key={k}
              onClick={() => setCur(k)}
              aria-pressed={cur === k}
              className={`px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                cur === k ? "bg-[#2B3138] text-white" : "text-[#5A646E] hover:bg-[#ECEEF0]"
              }`}
            >
              {CURRENCIES[k].name}
            </button>
          ))}
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-5">
        {PLANS.map((p, i) => (
          <div
            key={p.name}
            className={`rounded-2xl p-6 bg-white flex flex-col border ${
              p.highlight ? "border-[#D9480F] shadow-lg ring-1 ring-[#D9480F]/30" : "border-[#DDE1E5]"
            }`}
          >
            {p.highlight && <span className="self-start mb-3 text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#D9480F] text-white">الأكثر طلباً</span>}
            <h3 className="text-xl font-black text-[#1E2429]">{p.name}</h3>
            <p className="text-xs text-[#5A646E] mb-4">{p.tagline}</p>
            <p className="mb-5">
              {PRICES[cur][i] === 0 ? (
                <span className="text-4xl font-black text-[#1E2429]">مجاناً</span>
              ) : (
                <>
                  <span className="text-4xl font-black text-[#1E2429]">{formatMoney(PRICES[cur][i], cur, "ar-EG", { compact: true })}</span>{" "}
                  <span className="text-sm font-bold text-[#5A646E]">/ شهرياً</span>
                </>
              )}
            </p>
            <ul className="space-y-2.5 mb-6 flex-1">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-[#1E2429]">
                  <Check className="w-4 h-4 mt-0.5 text-[#D9480F] shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <button
              onClick={onStart}
              className={`w-full py-3 rounded-xl font-bold text-sm cursor-pointer transition-colors ${
                p.highlight ? "bg-[#D9480F] text-white hover:bg-[#B93C0B]" : "bg-[#2B3138] text-white hover:bg-[#1E2429]"
              }`}
            >
              {i === 0 ? "ابدأ مجاناً" : "جرّب النظام"}
            </button>
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-[#5A646E] mt-6">الأسعار استرشادية وقد تتغير قبل الإطلاق التجاري. الضريبة المحلية (VAT) غير مشمولة.</p>
    </section>
  );
}

const LEGAL = {
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
};

export function LegalPage({ kind, onBack }) {
  const doc = LEGAL[kind];
  return (
    <main className="min-h-screen bg-[#F3F4F6] py-12 px-4 sm:px-6" dir="rtl">
      <article className="max-w-3xl mx-auto bg-white border border-[#DDE1E5] rounded-2xl p-6 sm:p-10">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold text-[#5A646E] hover:text-[#2B3138] mb-6 cursor-pointer">
          <ArrowRight className="w-4 h-4 ltr:-scale-x-100 rtl:scale-x-100" /> العودة للصفحة الرئيسية
        </button>
        <h1 className="text-3xl font-black text-[#1E2429] mb-2">{doc.title}</h1>
        <p className="text-xs text-[#5A646E] mb-8">آخر تحديث: نوفمبر ٢٠٢٦ — مسودة تُراجع قانونياً قبل الإطلاق</p>
        <div className="space-y-6">
          {doc.sections.map(([h, t], i) => (
            <section key={h}>
              <h2 className="text-lg font-black text-[#1E2429] mb-1">{`${(i + 1).toLocaleString("ar-EG")}. ${h}`}</h2>
              <p className="text-sm leading-7 text-[#5A646E]">{t}</p>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
