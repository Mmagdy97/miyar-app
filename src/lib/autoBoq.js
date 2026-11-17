// Auto-BOQ: quantities from project data. Rules of thumb (editable afterwards); item names match src/data/boqLibrary.js.
const r1 = (n) => Math.round(n * 10) / 10;
const up = (n) => Math.ceil(n - 1e-9);

/** spec: { area, rooms, baths, height, type, finish } -> [{ cat, name, unit, quantity }] (quantity > 0 only). */
export function generateBoq(spec) {
  const A = Number(spec?.area) || 0;
  if (A <= 0) return [];
  const rooms = Math.max(0, Number(spec.rooms) || 0);
  const baths = Math.max(0, Number(spec.baths) || 0);
  const h = Number(spec.height) || 2.8;
  const type = spec.type || "apartment";
  const finish = spec.finish || "mid";
  const home = type === "apartment" || type === "villa";
  const kitchen = home ? 1 : 0;
  const walls = A * 0.9 * h;                 // net wall area (m²)
  const bathWalls = baths * 19;              // 4 m² bath, tiled to 2.4 m
  const kitchenWalls = kitchen * 8;
  const floor = finish === "lux" ? "أرضيات رخام / جرانيت" : finish === "mid" ? "أرضيات سيراميك / بورسلين" : "أرضيات سيراميك / بورسلين";
  const dry = finish === "eco" ? 0 : A * 0.6;

  const L = [
    ["أعمال البياض", "بياض حوائط (طرطشة + بطانة + وجه)", "م²", walls],
    ["أعمال البياض", "بياض أسقف", "م²", A],
    ["أعمال البياض", "معجون وتجهيز دهانات", "م²", walls + A],
    ["الدهانات", "دهان بلاستيك حوائط (3 أوجه)", "م²", walls - bathWalls - kitchenWalls],
    ["الدهانات", "دهان أسقف", "م²", A - dry],
    ["الأرضيات والتكسيات", floor, "م²", A],
    ["الأرضيات والتكسيات", "تكسية حوائط حمامات", "م²", bathWalls],
    ["الأرضيات والتكسيات", "تكسية حوائط مطبخ", "م²", kitchenWalls],
    ["الأرضيات والتكسيات", "وزرات", "م.ط", A * 0.9],
    ["العزل", "عزل مائي للحمامات والمطابخ", "م²", baths * 10 + kitchen * 4],
    ["العزل", "اختبار غمر للعزل", "مقطوعية", baths + kitchen > 0 ? 1 : 0],
    ["السباكة", "نقاط تغذية مياه", "نقطة", baths * 4 + kitchen * 3],
    ["السباكة", "نقاط صرف", "نقطة", baths * 3 + kitchen * 2],
    ["السباكة", "تركيب أطقم حمام", "طقم", baths],
    ["السباكة", "تركيب أحواض وخلاطات مطبخ", "عدد", kitchen],
    ["الكهرباء", "نقاط إنارة", "نقطة", A / 4],
    ["الكهرباء", "نقاط بريزة / أفياش", "نقطة", rooms * 4 + (home ? 8 : A / 8)],
    ["الكهرباء", "نقاط تكييف", "نقطة", rooms + 1],
    ["الكهرباء", "لوحة توزيع رئيسية / فرعية", "عدد", 1],
    ["الكهرباء", "نقاط تليفون وداتا وتلفزيون", "نقطة", rooms + 1],
    ["الأسقف والديكورات الجبسية", "أسقف جبس بورد مسطحة", "م²", dry],
    ["النجارة والأبواب", "أبواب داخلية خشب", "عدد", rooms + baths],
    ["النجارة والأبواب", "باب مدخل مصفح", "عدد", 1],
    ["النجارة والأبواب", "مطبخ (وحدات سفلية وعلوية)", "م.ط", kitchen * 5],
    ["الألوميتال والزجاج", "شبابيك ألوميتال", "م²", A * 0.12],
    ["التكييف", "توريد وتركيب تكييف سبلت", "عدد", rooms + 1],
    ["التنظيف والتسليم", "تنظيف نهائي", "م²", A],
    ["التنظيف والتسليم", "معاينة وقوائم ملاحظات التسليم", "مقطوعية", 1],
  ];
  return L.map(([cat, name, unit, q]) => ({ cat, name, unit, quantity: unit === "م²" || unit === "م.ط" ? r1(q) : up(q) })).filter((x) => x.quantity > 0);
}
