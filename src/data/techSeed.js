import { localize, D } from "./dataI18n";

export const TECH_DRAWINGS = localize([
  {
    id: "DWG-01",
    name: "لوحة توزيع الكهرباء والإنارة - الدور الأرضي",
    code: "E-02-GF",
    rev: "Rev. 02",
    discipline: D("كهرباء"),
    project: D("فيلا الياسمين - التجمع"),
    date: "اليوم، 09:30 ص",
    size: "4.2 ميجابايت",
    status: "approved", // approved | review | rejected
    statusLabel: "معتمدة للتنفيذ (AFC)",
  },
  {
    id: "DWG-02",
    name: "مخطط تمديدات الصرف والتغذية - البدروم",
    code: "P-01-BS",
    rev: "Rev. 01",
    discipline: "صحي ومياه",
    project: D("فيلا الياسمين - التجمع"),
    date: "أمس، 03:15 م",
    size: "3.8 ميجابايت",
    status: "approved",
    statusLabel: "معتمدة للتنفيذ (AFC)",
  },
  {
    id: "DWG-03",
    name: "مخطط الأسقف المعلقة وتوزيع الإضاءة المخفية",
    code: "A-04-1F",
    rev: "Rev. 03",
    discipline: "معماري وديكور",
    project: D("دوبلكس نيو جيزة"),
    date: "منذ يومين",
    size: "6.1 ميجابايت",
    status: "review",
    statusLabel: "بانتظار المراجعة",
  },
  {
    id: "DWG-04",
    name: "تفصيلة رخام الدرج والمصعد البانورامي",
    code: "D-08-ST",
    rev: "Rev. 01",
    discipline: "تفاصيل معمارية",
    project: "مقر إداري - الشيخ زايد",
    date: "04 نوفمبر 2026",
    size: "2.9 ميجابايت",
    status: "review",
    statusLabel: "بانتظار المراجعة",
  },
  {
    id: "DWG-05",
    name: "مسارات التكييف الكونسيلد المعدلة لتفادي الكمرات",
    code: "M-03-HVAC",
    rev: "Rev. 02",
    discipline: "تكييف وميكانيكا",
    project: D("فيلا الياسمين - التجمع"),
    date: "02 نوفمبر 2026",
    size: "5.4 ميجابايت",
    status: "rejected",
    statusLabel: "مرفوضة للتعديل",
  },
]);

// Mock Site Requests / RFIs
export const TECH_RFIS = localize([
  {
    id: "RFI-104",
    title: "تعارض مسار تكييف الكونسيلد مع كمرة خرسانية ساقطة",
    location: "فيلا الياسمين - جناح الماستر",
    submitter: "م. كريم مصطفى (مهندس الموقع)",
    priority: "urgent", // urgent | medium | normal
    priorityLabel: "عاجل جداً (أعمال معطلة)",
    details: "مسار دكت التكييف المعتمد بالمخطط يتعارض مع كمرة خرسانية عمق 60 سم، مما يمنع تمرير مجرى الهواء بالارتفاع المطلوب.",
    status: "pending", // pending | solved
    time: "منذ ساعتين",
  },
  {
    id: "RFI-103",
    title: "تحديد منسوب عتب فتحات الأبواب الداخلية بعد منسوب اللياسة",
    location: "مقر إداري - الشيخ زايد",
    submitter: "م. أحمد (الموقع)",
    priority: "medium",
    priorityLabel: "أولوية متوسطة",
    details: "يرجى تأكيد الارتفاع الصافي لفتحات الأبواب الخشبية بعد احتساب منسوب بلاط البورسلين لطلب الحلق الزفر.",
    status: "pending",
    time: "أمس، 05:00 م",
  },
  {
    id: "RFI-102",
    title: "تأكيد سمك عزل خزان المياه الأرضي وطبقات الحماية",
    location: "فيلا الياسمين - البدروم",
    submitter: "م. كريم مصطفى (مهندس الموقع)",
    priority: "normal",
    priorityLabel: "تم الحل والاعتماد",
    details: "تم اعتماد دهان وجهين بيتومين مطاطي مع تركيب ألواح حماية سمك 4 مم وفحص ضغط المياه لمدة 48 ساعة.",
    status: "solved",
    solution: "تم إرسال التفصيلة المعمارية رقم D-14 ومطابقتها مع مواصفات استشاري العزل.",
    time: "03 نوفمبر 2026",
  },
]);

