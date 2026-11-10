import { ENGINEER_CASH, personById, projectById, initialsOf } from "./seed";

// Initial Engineers Petty Cash State (single source: src/data/seed.js)
export const INITIAL_ENGINEERS_CASH = ENGINEER_CASH.map((c) => {
  const person = personById(c.engineerId);
  return {
    id: c.id,
    name: person.displayName,
    site: projectById(c.projectId).name,
    totalGiven: c.totalGiven,
    spent: c.spent,
    avatar: initialsOf(person.name),
    color: person.color,
  };
});

// Initial Pending Expenses State
export const INITIAL_PENDING_EXPENSES = [
  {
    id: 101,
    engId: 1,
    engName: "م. أحمد الشناوي (موقع زايد)",
    description: "تشوين أسمنت ورمل سريع لعزل البدروم",
    amount: 1500,
    date: "اليوم، ١١:٣٠ ص",
    category: "تشوين ونولون",
    receiptNumber: "REC-9821",
    invoiceImg:
      "https://images.unsplash.com/photo-1554415707-9e4c018a482a?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 102,
    engId: 2,
    engName: "م. كريم مصطفى (فيلا الياسمين)",
    description: "شراء وصلات سباكة نحاس إضافية وغراء عزل",
    amount: 2850,
    date: "اليوم، ٠٩:٤٥ ص",
    category: "خامات سباكة",
    receiptNumber: "REC-9822",
    invoiceImg:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 103,
    engId: 3,
    engName: "م. عمر عادل (نيو جيزة)",
    description: "يومية عمالة طارئة لتنزيل ألواح الجبسوم بورد",
    amount: 1200,
    date: "أمس، ٠٥:١٥ م",
    category: "مصاريف عمالة",
    receiptNumber: "REC-9823",
    invoiceImg:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 104,
    engId: 2,
    engName: "م. كريم مصطفى (فيلا الياسمين)",
    description: "إكراميات ونولون نقل عينات رخام من شق التعبان",
    amount: 650,
    date: "أمس، ٠٢:٠٠ م",
    category: "نقل ونثريات",
    receiptNumber: "REC-9824",
    invoiceImg:
      "https://images.unsplash.com/photo-1580048915913-4f8f5cb481c4?auto=format&fit=crop&w=700&q=80",
  },
];

