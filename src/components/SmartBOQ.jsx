import { useState, useMemo } from "react";
import {
  FileSpreadsheet,
  Plus,
  Trash2,
  Send,
  Save,
  CheckCircle2,
  TrendingUp,
  Percent,
  Coins,
  Sparkles,
  Layers,
  ArrowUpRight,
  Download,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  X,
  FileCheck,
} from "lucide-react";

// Default interior design BOQ items
const INITIAL_BOQ_ITEMS = [
  {
    id: 1,
    category: "أعمال الكهرباء",
    name: "تأسيس وتوريد علب ماجيك ومواسير وخراطيم علاء الدين المعتمدة",
    unit: "مقطوعية",
    quantity: 1,
    unitCost: 15000,
    margin: 25,
    note: "شاملة اللوحات التوزيعية الفرعية وكابلات السويدي معتمدة",
  },
  {
    id: 2,
    category: "أعمال السباكة والصحي",
    name: "شبكة تغذية بولي بروبلين (BR) وصرف بي في سي الشريف ٤ بوصة",
    unit: "متر طولي",
    quantity: 85,
    unitCost: 320,
    margin: 22,
    note: "شاملة عزل أرضيات الحمامات كيميائياً واختبار الضغط بالبار",
  },
  {
    id: 3,
    category: "أعمال المحارة والتشطيبات",
    name: "بياض محارة تأكيس وتربيع وبؤج وأوتار للحوائط والأسقف",
    unit: "متر مربع",
    quantity: 380,
    unitCost: 95,
    margin: 20,
    note: "رمل حرش وأسمنت بورتلاندي مع شبك فايبر عند التقاء الخرسانة",
  },
  {
    id: 4,
    category: "الأسقف المعلقة والجبسوم بورد",
    name: "توريد وتركيب ألواح كناوف خضراء مقاومة للرطوبة مع بيت نور",
    unit: "متر مربع",
    quantity: 140,
    unitCost: 340,
    margin: 28,
    note: "شاملة قطاعات صاج معالجة ٠.٥ مم وممرات ليد بروفايل مدمجة",
  },
  {
    id: 5,
    category: "الأرضيات والرخام",
    name: "توريد وتركيب رخام تريستا بيج مصقول أرضيات الاستقبال والصالون",
    unit: "متر مربع",
    quantity: 65,
    unitCost: 720,
    margin: 30,
    note: "شاملة الجلي والمعالجة بالكريستال وتوريد الوزرات المطابقة",
  },
];

const CATEGORY_COLORS = {
  "أعمال الكهرباء": "bg-amber-50 text-amber-800 border-amber-200",
  "أعمال السباكة والصحي": "bg-[#EFEEE8] text-[#202923] border-[#E5E6DF]",
  "أعمال المحارة والتشطيبات": "bg-[#EFEEE8] text-[#526257] border-[#E5E6DF]",
  "الأسقف المعلقة والجبسوم بورد": "bg-[#EFEEE8] text-[#202923] border-[#D5D8D0] font-semibold",
  "الأرضيات والرخام": "bg-amber-50 text-amber-900 border-amber-200",
  "أخرى": "bg-[#EFEEE8] text-[#526257] border-[#E5E6DF]",
};

function SmartBOQ({ actionItems, setActionItems, setSelectedItem }) {
  const [boqItems, setBoqItems] = useState(INITIAL_BOQ_ITEMS);
  const [filterCategory, setFilterCategory] = useState("الكل");
  const [saveToast, setSaveToast] = useState(false);
  const [sendSuccessModal, setSendSuccessModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);

  // New item form state
  const [newItemCategory, setNewItemCategory] = useState("أعمال التشطيبات والديكور");
  const [newItemName, setNewItemName] = useState("");
  const [newItemUnit, setNewItemUnit] = useState("متر مربع");
  const [newItemQty, setNewItemQty] = useState(10);
  const [newItemCost, setNewItemCost] = useState(250);
  const [newItemMargin, setNewItemMargin] = useState(25);
  const [newItemNote, setNewItemNote] = useState("");

  // Update item field directly
  const handleUpdateItem = (id, field, value) => {
    const numVal = value === "" ? "" : Math.max(0, parseFloat(value) || 0);
    setBoqItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: numVal } : item))
    );
  };

  // Delete item
  const handleDeleteItem = (id) => {
    setBoqItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Reset to sample initial items
  const handleResetDefaults = () => {
    setBoqItems(INITIAL_BOQ_ITEMS);
  };

  // Add new item
  const handleAddItemSubmit = (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem = {
      id: Date.now(),
      category: newItemCategory,
      name: newItemName.trim(),
      unit: newItemUnit,
      quantity: parseFloat(newItemQty) || 1,
      unitCost: parseFloat(newItemCost) || 0,
      margin: parseFloat(newItemMargin) || 20,
      note: newItemNote.trim() || "بند مستحدث بمقايسة التشطيبات",
    };

    setBoqItems((prev) => [...prev, newItem]);
    setShowAddItemModal(false);
    setNewItemName("");
    setNewItemNote("");
  };

  // Handle Save Draft
  const handleSaveDraft = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3500);
  };

  // Handle Send to Client
  const handleSendToClient = () => {
    setSendSuccessModal(true);

    // Sync notification in actionItems for Client & Admin
    if (setActionItems) {
      const boqAction = {
        id: Date.now(),
        title: "اعتماد المقايسة التقديرية - فيلا الياسمين",
        subtitle: `إجمالي المقايسة: ${totalPrice.toLocaleString("ar-EG")} ج.م (${boqItems.length} بند تشطيبات)`,
        user: "المكتب الفني / الإدارة المالية",
        project: "فيلا الياسمين - التجمع",
        category: "مقايسة تعاقدية",
        amount: `${totalPrice.toLocaleString("ar-EG")} ج.م`,
        timestamp: "الآن",
        time: "الآن",
        targetRole: "Client",
        type: "vo",
        status: "pending",
      };
      setActionItems((prev) => [boqAction, ...prev]);
    }
  };

  // Filter items
  const filteredItems = useMemo(() => {
    if (filterCategory === "الكل") return boqItems;
    return boqItems.filter((i) => i.category === filterCategory);
  }, [boqItems, filterCategory]);

  // Overall Financial Calculations
  const { totalCost, totalProfit, totalPrice, averageMargin } = useMemo(() => {
    let costAcc = 0;
    let priceAcc = 0;

    boqItems.forEach((item) => {
      const q = parseFloat(item.quantity) || 0;
      const c = parseFloat(item.unitCost) || 0;
      const m = parseFloat(item.margin) || 0;

      const itemCost = q * c;
      const itemPrice = itemCost * (1 + m / 100);

      costAcc += itemCost;
      priceAcc += itemPrice;
    });

    const profitAcc = priceAcc - costAcc;
    const avgMargin = costAcc > 0 ? ((profitAcc / costAcc) * 100).toFixed(1) : "0";

    return {
      totalCost: costAcc,
      totalProfit: profitAcc,
      totalPrice: priceAcc,
      averageMargin: avgMargin,
    };
  }, [boqItems]);

  const categories = ["الكل", ...new Set(boqItems.map((i) => i.category))];

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent pb-36 font-ibm" dir="rtl">
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed bottom-28 left-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#183C35] text-white rounded-xl shadow-xl border border-white/10 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="text-right">
            <p className="text-xs font-bold">تم حفظ المسودة بنجاح</p>
            <p className="text-[11px] text-[#EFEEE8]">تم تحديث بيانات المقايسة التقديرية محلياً</p>
          </div>
        </div>
      )}

      {/* Top Header & Breadcrumb */}
      <div className="mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
            <h1 className="text-2xl md:text-3xl font-black text-[#202923] tracking-tight flex items-center gap-2">
              <FileSpreadsheet className="w-7 h-7 text-[#202923]" />
              <span>المقايسة التقديرية - فيلا الياسمين</span>
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
              قيد التسعير
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#EFEEE8] text-[#526257] border border-[#E5E6DF]">
              كود: BOQ-2026-YAS-03
            </span>
          </div>
          <p className="text-xs md:text-sm text-[#526257]">
            حساب تكاليف الخامات والعمالة وهوامش الربح وإعداد عرض السعر النهائي الموجه للعميل (أ. محمد).
          </p>
        </div>

        {/* Quick Top Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-[#526257] bg-white border border-[#E5E6DF] hover:bg-[#F5F3ED] transition-colors shadow-2xs cursor-pointer"
            title="استرجاع البنود الافتراضية"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>إعادة ضبط</span>
          </button>
          <button
            onClick={() => setShowAddItemModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs md:text-sm font-bold text-white bg-[#183C35] hover:bg-[#202923] transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ إضافة بند جديد</span>
          </button>
        </div>
      </div>

      {/* Mini KPI Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        <div className="bg-white rounded-lg p-5 border border-[#E5E6DF] shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <span className="text-[11px] font-bold text-[#526257] block mb-1">عدد البنود المدرجة</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl md:text-2xl font-black text-[#202923]">{boqItems.length}</span>
            <span className="text-[11px] font-bold text-[#526257] bg-[#EFEEE8] px-2 py-0.5 rounded-md border border-[#E5E6DF]">
              بند تنفيذي
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-[#E5E6DF] shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <span className="text-[11px] font-bold text-[#526257] block mb-1">إجمالي التكلفة المباشرة</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl md:text-2xl font-black text-[#202923]">
              {Math.round(totalCost).toLocaleString("ar-EG")}
            </span>
            <span className="text-[11px] font-bold text-[#526257]">ج.م</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-[#E5E6DF] shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <span className="text-[11px] font-bold text-[#526257] block mb-1">الربح الصافي المتوقع</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl md:text-2xl font-black text-emerald-700">
              +{Math.round(totalProfit).toLocaleString("ar-EG")}
            </span>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
              %{averageMargin}
            </span>
          </div>
        </div>

        {/* 4. Client Quotation Card - Sage Green Hero Card */}
        <div className="bg-[#183C35] rounded-xl p-5 border border-[#14322c] text-white shadow-sm">
          <span className="text-[11px] font-bold text-[#EFEEE8] block mb-1">عرض السعر للعميل</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl md:text-2xl font-black text-white">
              {Math.round(totalPrice).toLocaleString("ar-EG")}
            </span>
            <span className="text-[11px] font-bold text-[#EFEEE8]/80">ج.م</span>
          </div>
        </div>
      </div>

      {/* Category Tabs Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer active:scale-95 ${
              filterCategory === cat
                ? "bg-[#183C35] text-white shadow-sm"
                : "bg-white text-[#202923] border border-[#E5E6DF] hover:bg-[#F5F3ED]"
            }`}
          >
            {cat} {cat === "الكل" ? `(${boqItems.length})` : ""}
          </button>
        ))}
      </div>

      {/* Main Glassmorphic Interactive Table Card */}
      <div className="bg-white rounded-lg border border-[#E5E6DF] shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="p-4 md:p-5 border-b border-[#EFEEE8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F5F3ED]">
          <div>
            <h2 className="text-base font-extrabold text-[#202923] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#202923]" />
              <span>جدول حصر الكميات والتسعير التفاعلي (Interactive BOQ Table)</span>
            </h2>
            <p className="text-xs text-[#526257] mt-0.5">
              عدّل الكميات وأسعار التكلفة وهامش الربح في الحقول مباشرة؛ وسيتم حساب السعر الإجمالي تلقائياً.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#526257]">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>تحديث حسابي فوري (Live Reactive)</span>
          </div>
        </div>

        {/* The Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-[#F5F3ED] text-[#526257] text-xs font-bold border-b border-[#E5E6DF]">
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-4 min-w-[240px]">البند والمواصفة الفنية</th>
                <th className="py-3.5 px-3 w-28 text-center">الوحدة</th>
                <th className="py-3.5 px-3 w-32 text-center">الكمية (Qty)</th>
                <th className="py-3.5 px-3 w-40 text-center">سعر الوحدة - تكلفة (ج.م)</th>
                <th className="py-3.5 px-3 w-32 text-center">هامش الربح %</th>
                <th className="py-3.5 px-4 min-w-[150px] text-left">الإجمالي للعميل (ج.م)</th>
                <th className="py-3.5 px-3 w-14 text-center">حذف</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFEEE8] text-xs md:text-sm">
              {filteredItems.map((item, index) => {
                const qty = parseFloat(item.quantity) || 0;
                const cost = parseFloat(item.unitCost) || 0;
                const margin = parseFloat(item.margin) || 0;

                const rowCost = qty * cost;
                const rowTotal = rowCost * (1 + margin / 100);
                const rowProfit = rowTotal - rowCost;
                const categoryClass = CATEGORY_COLORS[item.category] || CATEGORY_COLORS["أخرى"];

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-[#F5F3ED] transition-colors duration-100 group"
                  >
                    {/* Index */}
                    <td className="py-3.5 px-4 text-center text-xs font-bold text-[#526257]">
                      {index + 1}
                    </td>

                    {/* Item Name & Category */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${categoryClass}`}
                          >
                            {item.category}
                          </span>
                        </div>
                        <span className="font-extrabold text-[#202923] leading-snug">
                          {item.name}
                        </span>
                        {item.note && (
                          <span className="text-[11px] text-[#526257] mt-0.5 leading-normal">
                            {item.note}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Unit */}
                    <td className="py-3.5 px-3 text-center">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-[#EFEEE8] text-[#202923] font-bold text-xs border border-[#E5E6DF]">
                        {item.unit}
                      </span>
                    </td>

                    {/* Editable Quantity */}
                    <td className="py-3.5 px-3 text-center">
                      <div className="relative inline-block w-full max-w-[100px]">
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={item.quantity}
                          onChange={(e) => handleUpdateItem(item.id, "quantity", e.target.value)}
                          className="w-full text-center px-2 py-1.5 rounded-lg border border-[#E5E6DF] bg-white font-bold text-[#202923] text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-1 focus:ring-[#183C35] focus:border-[#183C35] transition-all shadow-2xs hover:border-[#5D8C70]"
                        />
                      </div>
                    </td>

                    {/* Editable Unit Cost */}
                    <td className="py-3.5 px-3 text-center">
                      <div className="relative inline-flex items-center w-full max-w-[130px]">
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={item.unitCost}
                          onChange={(e) => handleUpdateItem(item.id, "unitCost", e.target.value)}
                          className="w-full text-center pl-7 pr-2 py-1.5 rounded-lg border border-[#E5E6DF] bg-white font-bold text-[#202923] text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-1 focus:ring-[#183C35] focus:border-[#183C35] transition-all shadow-2xs hover:border-[#5D8C70]"
                        />
                        <span className="absolute left-2.5 text-[10px] font-bold text-[#526257] pointer-events-none">
                          ج.م
                        </span>
                      </div>
                    </td>

                    {/* Editable Margin % */}
                    <td className="py-3.5 px-3 text-center">
                      <div className="relative inline-flex items-center w-full max-w-[90px]">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="1"
                          value={item.margin}
                          onChange={(e) => handleUpdateItem(item.id, "margin", e.target.value)}
                          className="w-full text-center pl-6 pr-2 py-1.5 rounded-lg border border-[#E5E6DF] bg-white font-bold text-amber-800 text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-1 focus:ring-[#183C35] focus:border-[#183C35] transition-all shadow-2xs hover:border-[#5D8C70]"
                        />
                        <span className="absolute left-2 text-[11px] font-extrabold text-amber-700 pointer-events-none">
                          %
                        </span>
                      </div>
                    </td>

                    {/* Auto-Calculated Total Price for Client */}
                    <td className="py-3.5 px-4 text-left">
                      <div className="flex flex-col items-end">
                        <span className="font-black text-[#202923] text-sm md:text-base tracking-tight">
                          {Math.round(rowTotal).toLocaleString("ar-EG")}{" "}
                          <span className="text-xs font-bold text-[#526257]">ج.م</span>
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-700">
                          ربح: +{Math.round(rowProfit).toLocaleString("ar-EG")} ج.م
                        </span>
                      </div>
                    </td>

                    {/* Delete Row Action */}
                    <td className="py-3.5 px-3 text-center">
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1.5 rounded-lg text-[#526257] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="حذف هذا البند"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-[#526257]">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-[#C5A36B]" />
                    <p className="font-bold text-[#526257]">لا توجد بنود تطابق هذا التصنيف</p>
                    <p className="text-xs text-[#526257] mt-1">
                      يمكنك اختيار تصنيف آخر أو الضغط على "+ إضافة بند جديد"
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Bottom Meta Bar */}
        <div className="p-4 bg-[#F5F3ED] border-t border-[#E5E6DF] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#526257]">
          <div className="flex items-center gap-3">
            <span>
              إجمالي البنود: <strong className="text-[#202923]">{boqItems.length}</strong>
            </span>
            <span>•</span>
            <span>
              متوسط هامش الربح: <strong className="text-[#202923] font-bold">%{averageMargin}</strong>
            </span>
          </div>
          <span className="text-[11px] text-[#526257]">
            * السعر الإجمالي يشمل التوريد والتركيب والتشوين ومصاريف الإشراف الهندسي.
          </span>
        </div>
      </div>

      {/* Floating Summary & Action Sticky Dock */}
      <div className="fixed bottom-0 right-0 left-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#E5E6DF] shadow-lg px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Summary Figures */}
          <div className="flex items-center gap-5 sm:gap-8 flex-wrap">
            {/* Total Cost */}
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-[#526257]">إجمالي التكلفة</span>
              <span className="text-sm md:text-base font-extrabold text-[#526257]">
                {Math.round(totalCost).toLocaleString("ar-EG")}{" "}
                <span className="text-xs font-normal text-[#526257]">ج.م</span>
              </span>
            </div>

            {/* Total Expected Profit */}
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-[#526257] flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-600" />
                <span>إجمالي الربح المتوقع</span>
              </span>
              <span className="text-sm md:text-base font-extrabold text-emerald-700">
                +{Math.round(totalProfit).toLocaleString("ar-EG")}{" "}
                <span className="text-xs font-normal text-[#526257]">ج.م</span>
              </span>
            </div>

            {/* Divider */}
            <div className="hidden sm:block h-8 w-px bg-[#E5E6DF]" />

            {/* Final Quotation Price (Highlighted in large, bold font) */}
            <div className="flex flex-col">
              <span className="text-[11px] font-extrabold text-[#202923] uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-700" />
                <span>إجمالي عرض السعر (Final Quotation)</span>
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl md:text-3xl font-black text-[#202923] tracking-tight">
                  {Math.round(totalPrice).toLocaleString("ar-EG")}
                </span>
                <span className="text-xs font-bold text-amber-800">جنيه مصري</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Save Draft */}
            <button
              onClick={handleSaveDraft}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[#E5E6DF] bg-white hover:bg-[#F5F3ED] text-[#526257] text-xs md:text-sm font-bold shadow-2xs transition-all cursor-pointer"
            >
              <Save className="w-4 h-4 text-[#526257]" />
              <span>حفظ كمسودة</span>
            </button>

            {/* Send to Client for Approval */}
            <button
              onClick={handleSendToClient}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#183C35] hover:bg-[#202923] text-white hover:bg-[#202923] transition-colors text-xs md:text-sm font-black shadow-sm transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>إرسال للعميل للاعتماد</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add New Item Modal */}
      {showAddItemModal && (
        <div className="fixed inset-0 z-50 bg-[#202923]/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-2xl border border-[#E5E6DF] max-w-lg w-full p-6 md:p-8 text-right animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#EFEEE8]">
              <h3 className="text-lg font-black text-[#202923] flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#202923]" />
                <span>إضافة بند جديد للمقايسة</span>
              </h3>
              <button
                onClick={() => setShowAddItemModal(false)}
                className="p-1 rounded-lg text-[#526257] hover:text-[#202923] hover:bg-[#EFEEE8]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddItemSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-[#526257] mb-1.5">
                  تصنيف البند
                </label>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E5E6DF] text-xs font-bold text-[#202923] bg-white focus:outline-none focus:ring-1 focus:ring-1 focus:ring-[#183C35] focus:border-[#183C35]"
                >
                  <option value="أعمال الكهرباء">أعمال الكهرباء</option>
                  <option value="أعمال السباكة والصحي">أعمال السباكة والصحي</option>
                  <option value="أعمال المحارة والتشطيبات">أعمال المحارة والتشطيبات</option>
                  <option value="الأسقف المعلقة والجبسوم بورد">الأسقف المعلقة والجبسوم بورد</option>
                  <option value="الأرضيات والرخام">الأرضيات والرخام</option>
                  <option value="أعمال الدهانات الديكورية">أعمال الدهانات الديكورية</option>
                  <option value="أعمال النجارة والأبواب">أعمال النجارة والأبواب</option>
                  <option value="أخرى">أخرى</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#526257] mb-1.5">
                  اسم البند وتفاصيل المواصفة
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: توريد وتركيب قواطع زجاجية سيكوريت ١٠ مم..."
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E5E6DF] text-xs md:text-sm font-semibold text-[#202923] focus:outline-none focus:ring-1 focus:ring-1 focus:ring-[#183C35] focus:border-[#183C35]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#526257] mb-1.5">الوحدة</label>
                  <select
                    value={newItemUnit}
                    onChange={(e) => setNewItemUnit(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg border border-[#E5E6DF] text-xs font-bold text-[#202923] bg-white focus:outline-none focus:ring-1 focus:ring-1 focus:ring-[#183C35] focus:border-[#183C35]"
                  >
                    <option value="متر مربع">متر مربع (م²)</option>
                    <option value="متر طولي">متر طولي (م.ط)</option>
                    <option value="مقطوعية">مقطوعية (جملة)</option>
                    <option value="عدد / قطعة">عدد / قطعة</option>
                    <option value="نقطة">نقطة</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#526257] mb-1.5">الكمية</label>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    required
                    value={newItemQty}
                    onChange={(e) => setNewItemQty(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg border border-[#E5E6DF] text-xs font-bold text-[#202923] focus:outline-none focus:ring-1 focus:ring-1 focus:ring-[#183C35] focus:border-[#183C35]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#526257] mb-1.5">سعر التكلفة</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={newItemCost}
                    onChange={(e) => setNewItemCost(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg border border-[#E5E6DF] text-xs font-bold text-[#202923] focus:outline-none focus:ring-1 focus:ring-1 focus:ring-[#183C35] focus:border-[#183C35]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#526257] mb-1.5">
                  هامش الربح المطلوب (%)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="60"
                    value={newItemMargin}
                    onChange={(e) => setNewItemMargin(e.target.value)}
                    className="flex-1 accent-zinc-900 cursor-pointer"
                  />
                  <span className="w-14 text-center px-2 py-1 bg-[#EFEEE8] text-[#202923] border border-[#E5E6DF] rounded-lg text-xs font-bold">
                    %{newItemMargin}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#526257] mb-1.5">
                  ملاحظات أو اشتراطات فنية (اختياري)
                </label>
                <input
                  type="text"
                  placeholder="مثال: الخامات مطابقة للاعتماد المعماري المرفق"
                  value={newItemNote}
                  onChange={(e) => setNewItemNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E5E6DF] text-xs text-[#526257] focus:outline-none focus:ring-1 focus:ring-1 focus:ring-[#183C35] focus:border-[#183C35]"
                />
              </div>

              {/* Preview calculation */}
              <div className="p-3 bg-[#F5F3ED] rounded-lg border border-[#E5E6DF] flex items-center justify-between text-xs">
                <span className="text-[#526257]">سعر البند الإجمالي المقترح للعميل:</span>
                <span className="font-bold text-[#202923] text-sm">
                  {Math.round(
                    (parseFloat(newItemQty) || 0) *
                      (parseFloat(newItemCost) || 0) *
                      (1 + (parseFloat(newItemMargin) || 0) / 100)
                  ).toLocaleString("ar-EG")}{" "}
                  ج.م
                </span>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#EFEEE8]">
                <button
                  type="button"
                  onClick={() => setShowAddItemModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-[#526257] hover:bg-[#EFEEE8] cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#183C35] hover:bg-[#202923] text-white hover:bg-[#202923] transition-colors text-xs font-bold shadow-sm cursor-pointer"
                >
                  إدراج البند في المقايسة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Send Success Confirmation Modal */}
      {sendSuccessModal && (
        <div className="fixed inset-0 z-50 bg-[#202923]/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-2xl border border-[#E5E6DF] max-w-md w-full p-6 md:p-8 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-lg bg-[#EFEEE8] text-[#202923] border border-[#E5E6DF] flex items-center justify-center mx-auto mb-4">
              <FileCheck className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-black text-[#202923] mb-2">
              تم إرسال المقايسة التقديرية للعميل بنجاح!
            </h3>

            <p className="text-xs text-[#526257] leading-relaxed mb-5">
              تم إشعار العميل (أ. محمد) بمقايسة مشروع{" "}
              <strong className="text-[#202923]">فيلا الياسمين</strong> بإجمالي{" "}
              <strong className="text-[#202923]">
                {Math.round(totalPrice).toLocaleString("ar-EG")} ج.م
              </strong>
              ، مع إتاحة خيار الاعتماد الإلكتروني المباشر من حسابه.
            </p>

            <div className="bg-[#F5F3ED] rounded-lg p-3 border border-[#E5E6DF] text-xs text-[#526257] text-right space-y-1 mb-5">
              <div className="flex justify-between">
                <span className="text-[#526257]">عدد البنود:</span>
                <span className="font-bold">{boqItems.length} بنود</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#526257]">إجمالي التكلفة:</span>
                <span className="font-bold">{Math.round(totalCost).toLocaleString("ar-EG")} ج.م</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#526257]">متوسط هامش الربح:</span>
                <span className="font-bold text-emerald-700">%{averageMargin}</span>
              </div>
            </div>

            <button
              onClick={() => setSendSuccessModal(false)}
              className="w-full py-2.5 rounded-lg bg-[#183C35] hover:bg-[#202923] text-white hover:bg-[#202923] transition-colors font-bold text-xs md:text-sm shadow-sm transition-colors cursor-pointer"
            >
              تم، العودة إلى جدول المقايسة
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default SmartBOQ;
