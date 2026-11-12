import { valueMoment } from "../lib/nudge";
import { currencySymbol, intlLocale, currencyName, E } from "../i18n";
import { localize, D, DF, pct } from "../data/dataI18n";
import { tr_ as T } from "../i18n";
import { boqStore } from "../data/stores";
import { officeStore, defaultVat } from "../data/office";
import OfficeDetails from "./OfficeDetails";
import QuoteSignature from "./QuoteSignature";
import { signaturesStore } from "../data/stores";
import { getCurrency } from "../i18n";
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
  FileCheck, Printer } from "lucide-react";

// Default interior design BOQ items

const CATEGORY_COLORS = localize({
  "أعمال الكهرباء": "bg-amber-50 text-amber-800 border-amber-200",
  "أعمال السباكة والصحي": "bg-[#EEF1F5] text-[#0F172A] border-[#E3E7EE]",
  "أعمال المحارة والتشطيبات": "bg-[#EEF1F5] text-[#475569] border-[#E3E7EE]",
  "الأسقف المعلقة والجبسوم بورد": "bg-[#EEF1F5] text-[#0F172A] border-[#CBD2DC] font-semibold",
  "الأرضيات والرخام": "bg-amber-50 text-amber-900 border-amber-200",
  "أخرى": "bg-[#EEF1F5] text-[#475569] border-[#E3E7EE]",
});

function SmartBOQ({ actionItems, setActionItems, setSelectedItem, restricted = false }) {
  const [boqItems, setBoqItems] = boqStore.use();
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
    boqStore.reset();
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
      note: newItemNote.trim() || D("بند مستحدث بمقايسة التشطيبات"),
    };

    setBoqItems((prev) => [...prev, newItem]);
    setShowAddItemModal(false);
    setNewItemName("");
    setNewItemNote("");
  };

  const [quoteClient, setQuoteClient] = useState("");
  const [office] = officeStore.use();
  const vatRate = office.vatRate ?? defaultVat(getCurrency());
  const [sigs] = signaturesStore.use();
  const quoteNo = `Q-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}`;

  // Export BOQ as CSV (UTF-8 BOM so Excel reads Arabic/Turkish correctly)
  const handleExportCsv = () => {
    const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const head = [T("sboq.csv.cat"), T("sboq.csv.item"), T("sboq.csv.unit"), T("sboq.csv.qty"), ...(restricted ? [] : [T("sboq.csv.cost"), T("sboq.csv.margin")]), T("sboq.csv.total")];
    const rows = boqItems.map((i) => {
      const total = i.quantity * i.unitCost * (1 + i.margin / 100);
      return [i.category, i.name, i.unit, i.quantity, ...(restricted ? [] : [i.unitCost, i.margin]), Math.round(total * 100) / 100];
    });
    const csv = "\ufeff" + [head, ...rows].map((r) => r.map(esc).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "miyar-boq.csv";
    a.click();
    URL.revokeObjectURL(url);
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
        subtitle: DF("إجمالي المقايسة: {0} {1} ({2} بند تشطيبات)", totalPrice.toLocaleString(intlLocale()), currencySymbol(), boqItems.length),
        user: "المكتب الفني / الإدارة المالية",
        project: D("فيلا الياسمين - التجمع"),
        category: "مقايسة تعاقدية",
        amount: `${totalPrice.toLocaleString(intlLocale())} ${currencySymbol()}`,
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
    <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent pb-36 font-ibm w-full max-w-full overflow-x-hidden">
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed bottom-28 end-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#0F172A] text-white rounded-xl shadow-xl border border-white/10 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="text-start">
            <p className="text-xs font-bold">{T("sboq.1")}</p>
            <p className="text-[11px] text-[#EEF1F5]">{T("sboq.2")}</p>
          </div>
        </div>
      )}

      {/* Top Header & Breadcrumb */}
      <div className="mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
            <h1 className="text-2xl md:text-3xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
              <FileSpreadsheet className="w-7 h-7 text-[#0F172A]" />
              <span>{T("sboq.3")}</span>
            </h1>
            <span className="no-print inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
              {T("sboq.4")}
            </span>
            <span className="no-print text-xs font-semibold px-2.5 py-1 rounded-full bg-[#EEF1F5] text-[#475569] border border-[#E3E7EE]">
              {T("sboq.5")}
            </span>
          </div>
          <p className="no-print text-xs md:text-sm text-[#475569]">
            {T(restricted ? "sboq.r6" : "sboq.6")}
          </p>
        </div>

        <div className="no-print w-full grid gap-3 md:grid-cols-[1fr_16rem] items-start">
          <OfficeDetails />
          <label className="text-xs font-bold text-[#475569] space-y-1">
            {T("quote.client")}
            <input
              value={quoteClient}
              onChange={(e) => setQuoteClient(e.target.value)}
              maxLength={80}
              className="w-full rounded-xl border border-[#E3E7EE] bg-white px-3 py-2 text-sm"
            />
          </label>
          {!restricted && <QuoteSignature quoteNo={quoteNo} total={Math.round(totalPrice * (1 + vatRate / 100))} defaultName={quoteClient} />}
        </div>

        {/* Printed quotation header (hidden on screen) */}
        <div className="print-only w-full border-b border-black pb-3 mb-2">
          <div className="flex justify-between items-start gap-4">
            <div>
              <p className="text-xl font-black">{office.name || T("brand")}</p>
              {office.taxId && <p className="text-xs">{T("office.tax")}: {office.taxId}</p>}
              {office.phone && <p className="text-xs" dir="ltr">{office.phone}</p>}
            </div>
            <div className="text-end text-xs space-y-0.5">
              <p className="text-lg font-black">{T("quote.title")}</p>
              <p>{T("quote.no")}: {quoteNo}</p>
              <p>{T("quote.date")}: {new Date().toLocaleDateString(intlLocale())}</p>
              <p>{T("quote.valid", { 0: office.quoteDays })}</p>
            </div>
          </div>
          {quoteClient && <p className="mt-2 text-sm font-bold">{T("quote.client")}: {quoteClient}</p>}
        </div>

        {/* Quick Top Actions */}
        <div className="no-print flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-[#475569] bg-white border border-[#E3E7EE] hover:bg-[#F4F6F9] transition-colors shadow-2xs cursor-pointer"
            title={T("sboq.7")}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{T("sboq.8")}</span>
          </button>
          <button
            onClick={() => setShowAddItemModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs md:text-sm font-bold text-white bg-[#0F172A] hover:bg-[#0F172A] transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{T("sboq.9")}</span>
          </button>
        </div>
      </div>

      {/* Mini KPI Highlights */}
      <div className="no-print grid stat-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        <div className="bg-white rounded-lg p-5 border border-[#E3E7EE] shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <span className="text-[11px] font-bold text-[#475569] block mb-1">{T("sboq.10")}</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl md:text-2xl font-black text-[#0F172A]">{boqItems.length}</span>
            <span className="text-[11px] font-bold text-[#475569] bg-[#EEF1F5] px-2 py-0.5 rounded-md border border-[#E3E7EE]">
              {T("sboq.11")}
            </span>
          </div>
        </div>

        {!restricted && (
          <>
        <div className="bg-white rounded-lg p-5 border border-[#E3E7EE] shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <span className="text-[11px] font-bold text-[#475569] block mb-1">{T("sboq.12")}</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl md:text-2xl font-black text-[#0F172A]">
              {Math.round(totalCost).toLocaleString(intlLocale())}
            </span>
            <span className="text-[11px] font-bold text-[#475569]">{currencySymbol()}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-[#E3E7EE] shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <span className="text-[11px] font-bold text-[#475569] block mb-1">{T("sboq.13")}</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl md:text-2xl font-black text-emerald-700">
              +{Math.round(totalProfit).toLocaleString(intlLocale())}
            </span>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
              {pct(averageMargin)}
            </span>
          </div>
        </div>

          </>
        )}

        {/* 4. Client Quotation Card - Sage Green Hero Card */}
        <div className="bg-[#0F172A] rounded-xl p-5 border border-[#1C2540] text-white shadow-sm">
          <span className="text-[11px] font-bold text-[#EEF1F5] block mb-1">{T("sboq.14")}</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl md:text-2xl font-black text-white">
              {Math.round(totalPrice).toLocaleString(intlLocale())}
            </span>
            <span className="text-[11px] font-bold text-[#EEF1F5]/80">{currencySymbol()}</span>
          </div>
        </div>
      </div>

      {/* Category Tabs Filter */}
      <div className="no-print flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer active:scale-95 ${
              filterCategory === cat
                ? "bg-[#0F172A] text-white shadow-sm"
                : "bg-white text-[#0F172A] border border-[#E3E7EE] hover:bg-[#F4F6F9]"
            }`}
          >
            {E(cat)} {cat === "الكل" ? `(${boqItems.length})` : ""}
          </button>
        ))}
      </div>

      {/* Main Glassmorphic Interactive Table Card */}
      <div className="no-print bg-white rounded-lg border border-[#E3E7EE] shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="p-4 md:p-5 border-b border-[#EEF1F5] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F4F6F9]">
          <div>
            <h2 className="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#0F172A]" />
              <span>{T("sboq.15")}</span>
            </h2>
            <p className="text-xs text-[#475569] mt-0.5">
              {T(restricted ? "sboq.r16" : "sboq.16")}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#475569]">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>{T("sboq.17")}</span>
          </div>
        </div>

        {/* The Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse">
            <thead>
              <tr className="bg-[#F4F6F9] text-[#475569] text-xs font-bold border-b border-[#E3E7EE]">
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-4 min-w-[240px]">{T("sboq.18")}</th>
                <th className="py-3.5 px-3 w-28 text-center">{T("sboq.19")}</th>
                <th className="py-3.5 px-3 w-32 text-center">{T("sboq.20")}</th>
                {!restricted && <th className="py-3.5 px-3 w-40 text-center">{T("sboq.21", { v0: currencySymbol() })}</th>}
                {!restricted && <th className="py-3.5 px-3 w-32 text-center">{T("sboq.22")}</th>}
                <th className="py-3.5 px-4 min-w-[150px] text-end">{T("sboq.23", { v0: currencySymbol() })}</th>
                <th className="py-3.5 px-3 w-14 text-center">{T("sboq.24")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF1F5] text-xs md:text-sm">
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
                    className="hover:bg-[#F4F6F9] transition-colors duration-100 group"
                  >
                    {/* Index */}
                    <td className="py-3.5 px-4 text-center text-xs font-bold text-[#475569]">
                      {index + 1}
                    </td>

                    {/* Item Name & Category */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${categoryClass}`}
                          >
                            {E(item.category)}
                          </span>
                        </div>
                        <span className="font-extrabold text-[#0F172A] leading-snug">
                          {item.name}
                        </span>
                        {item.note && (
                          <span className="text-[11px] text-[#475569] mt-0.5 leading-normal">
                            {item.note}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Unit */}
                    <td className="py-3.5 px-3 text-center">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-[#EEF1F5] text-[#0F172A] font-bold text-xs border border-[#E3E7EE]">
                        {E(item.unit)}
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
                          className="w-full text-center px-2 py-1.5 rounded-lg border border-[#E3E7EE] bg-white font-bold text-[#0F172A] text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-1 focus:ring-[#0F172A] focus:border-[#0F172A] transition-all shadow-2xs hover:border-[#0F766E]"
                        />
                      </div>
                    </td>

                    {!restricted && (
                      <>
                    {/* Editable Unit Cost */}
                    <td className="py-3.5 px-3 text-center">
                      <div className="relative inline-flex items-center w-full max-w-[130px]">
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={item.unitCost}
                          onChange={(e) => handleUpdateItem(item.id, "unitCost", e.target.value)}
                          className="w-full text-center pe-7 ps-2 py-1.5 rounded-lg border border-[#E3E7EE] bg-white font-bold text-[#0F172A] text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-1 focus:ring-[#0F172A] focus:border-[#0F172A] transition-all shadow-2xs hover:border-[#0F766E]"
                        />
                        <span className="absolute end-2.5 text-[10px] font-bold text-[#475569] pointer-events-none">
                          {currencySymbol()}
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
                          className="w-full text-center pe-6 ps-2 py-1.5 rounded-lg border border-[#E3E7EE] bg-white font-bold text-amber-800 text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-1 focus:ring-[#0F172A] focus:border-[#0F172A] transition-all shadow-2xs hover:border-[#0F766E]"
                        />
                        <span className="absolute end-2 text-[11px] font-extrabold text-amber-700 pointer-events-none">
                          %
                        </span>
                      </div>
                    </td>

                      </>
                    )}

                    {/* Auto-Calculated Total Price for Client */}
                    <td className="py-3.5 px-4 text-end">
                      <div className="flex flex-col items-end">
                        <span className="font-black text-[#0F172A] text-sm md:text-base tracking-tight">
                          {Math.round(rowTotal).toLocaleString(intlLocale())}{" "}
                          <span className="text-xs font-bold text-[#475569]">{currencySymbol()}</span>
                        </span>
                        {!restricted && (<span className="text-[10px] font-semibold text-emerald-700">
                          {T("sboq.25", { v0: Math.round(rowProfit).toLocaleString(intlLocale()), v1: currencySymbol() })}
                        </span>)}
                      </div>
                    </td>

                    {/* Delete Row Action */}
                    <td className="py-3.5 px-3 text-center">
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1.5 rounded-lg text-[#475569] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title={T("sboq.26")}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={restricted ? 6 : 8} className="py-12 text-center text-[#475569]">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-[#64748B]" />
                    <p className="font-bold text-[#475569]">{T("sboq.27")}</p>
                    <p className="text-xs text-[#475569] mt-1">
                      يمكنك اختيار تصنيف آخر أو الضغط على "{D("+ إضافة بند جديد")}"
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Bottom Meta Bar */}
        <div className="p-4 bg-[#F4F6F9] border-t border-[#E3E7EE] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#475569]">
          <div className="flex items-center gap-3">
            <span>
              {D("إجمالي البنود:")} <strong className="text-[#0F172A]">{boqItems.length}</strong>
            </span>
            {!restricted && (
              <>
            <span>
              {D("متوسط هامش الربح:")} <strong className="text-[#0F172A] font-bold">{pct(averageMargin)}</strong>
            </span>
              </>
            )}
          </div>
          <span className="text-[11px] text-[#475569]">
            {D("* السعر الإجمالي يشمل التوريد والتركيب والتشوين ومصاريف الإشراف الهندسي.")}
          </span>
        </div>
      </div>

      {/* Floating Summary & Action Sticky Dock */}
      <div className="fixed bottom-0 start-0 end-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#E3E7EE] shadow-lg px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Summary Figures */}
          <div className="flex items-center gap-5 sm:gap-8 flex-wrap">
            {!restricted && (
              <>
            {/* Total Cost */}
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-[#475569]">{T("sboq.28")}</span>
              <span className="text-sm md:text-base font-extrabold text-[#475569]">
                {Math.round(totalCost).toLocaleString(intlLocale())}{" "}
                <span className="text-xs font-normal text-[#475569]">{currencySymbol()}</span>
              </span>
            </div>

            {/* Total Expected Profit */}
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-[#475569] flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-600" />
                <span>{T("sboq.29")}</span>
              </span>
              <span className="text-sm md:text-base font-extrabold text-emerald-700">
                +{Math.round(totalProfit).toLocaleString(intlLocale())}{" "}
                <span className="text-xs font-normal text-[#475569]">{currencySymbol()}</span>
              </span>
            </div>

              </>
            )}

            {/* Divider */}
            <div className="hidden sm:block h-8 w-px bg-[#E3E7EE]" />

            {/* Final Quotation Price (Highlighted in large, bold font) */}
            <div className="flex flex-col">
              <span className="text-[11px] font-extrabold text-[#0F172A] uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-700" />
                <span>{T("sboq.30")}</span>
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl md:text-3xl font-black text-[#0F172A] tracking-tight">
                  {Math.round(totalPrice).toLocaleString(intlLocale())}
                </span>
                <span className="text-xs font-bold text-amber-800">{currencyName()}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleExportCsv}
              className="no-print hidden sm:inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-[#E3E7EE] bg-white hover:bg-[#F4F6F9] text-[#475569] text-xs md:text-sm font-bold shadow-2xs transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{T("boq.csv")}</span>
            </button>
            <button
              onClick={() => { valueMoment("quote"); window.print(); }}
              className="no-print hidden sm:inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-[#E3E7EE] bg-white hover:bg-[#F4F6F9] text-[#475569] text-xs md:text-sm font-bold shadow-2xs transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{T("boq.print")}</span>
            </button>
            {/* Save Draft */}
            <button
              onClick={handleSaveDraft}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[#E3E7EE] bg-white hover:bg-[#F4F6F9] text-[#475569] text-xs md:text-sm font-bold shadow-2xs transition-all cursor-pointer"
            >
              <Save className="w-4 h-4 text-[#475569]" />
              <span>{T("sboq.32")}</span>
            </button>

            {/* Send to Client for Approval */}
            <button
              onClick={handleSendToClient}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#0F172A] hover:bg-[#0F172A] text-white hover:bg-[#0F172A] transition-colors text-xs md:text-sm font-black shadow-sm transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{T("sboq.33")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add New Item Modal */}
      {showAddItemModal && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-2xl border border-[#E3E7EE] max-w-lg w-full p-6 md:p-8 text-start animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#EEF1F5]">
              <h3 className="text-lg font-black text-[#0F172A] flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#0F172A]" />
                <span>{T("sboq.34")}</span>
              </h3>
              <button
                onClick={() => setShowAddItemModal(false)}
                className="p-1 rounded-lg text-[#475569] hover:text-[#0F172A] hover:bg-[#EEF1F5]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddItemSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-[#475569] mb-1.5">
                  {T("sboq.35")}
                </label>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E3E7EE] text-xs font-bold text-[#0F172A] bg-white focus:outline-none focus:ring-1 focus:ring-1 focus:ring-[#0F172A] focus:border-[#0F172A]"
                >
                  <option value="أعمال الكهرباء">{T("sboq.36")}</option>
                  <option value="أعمال السباكة والصحي">{T("sboq.37")}</option>
                  <option value="أعمال المحارة والتشطيبات">{T("sboq.38")}</option>
                  <option value="الأسقف المعلقة والجبسوم بورد">{T("sboq.39")}</option>
                  <option value="الأرضيات والرخام">{T("sboq.40")}</option>
                  <option value="أعمال الدهانات الديكورية">{T("sboq.41")}</option>
                  <option value="أعمال النجارة والأبواب">{T("sboq.42")}</option>
                  <option value="أخرى">{T("sboq.43")}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#475569] mb-1.5">
                  {T("sboq.44")}
                </label>
                <input
                  type="text"
                  required
                  placeholder={T("sboq.45")}
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E3E7EE] text-xs md:text-sm font-semibold text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-1 focus:ring-[#0F172A] focus:border-[#0F172A]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#475569] mb-1.5">{T("sboq.19")}</label>
                  <select
                    value={newItemUnit}
                    onChange={(e) => setNewItemUnit(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg border border-[#E3E7EE] text-xs font-bold text-[#0F172A] bg-white focus:outline-none focus:ring-1 focus:ring-1 focus:ring-[#0F172A] focus:border-[#0F172A]"
                  >
                    <option value="متر مربع">{T("sboq.46")}</option>
                    <option value="متر طولي">{T("sboq.47")}</option>
                    <option value="مقطوعية">{T("sboq.48")}</option>
                    <option value="عدد / قطعة">{T("sboq.49")}</option>
                    <option value="نقطة">{T("sboq.50")}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#475569] mb-1.5">{T("sboq.51")}</label>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    required
                    value={newItemQty}
                    onChange={(e) => setNewItemQty(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg border border-[#E3E7EE] text-xs font-bold text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-1 focus:ring-[#0F172A] focus:border-[#0F172A]"
                  />
                </div>

                {!restricted && (
                <div>
                  <label className="block text-xs font-bold text-[#475569] mb-1.5">{T("sboq.52")}</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={newItemCost}
                    onChange={(e) => setNewItemCost(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg border border-[#E3E7EE] text-xs font-bold text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-1 focus:ring-[#0F172A] focus:border-[#0F172A]"
                  />
                </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#475569] mb-1.5">
                  {T("sboq.53")}
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
                  <span className="w-14 text-center px-2 py-1 bg-[#EEF1F5] text-[#0F172A] border border-[#E3E7EE] rounded-lg text-xs font-bold">
                    {pct(newItemMargin)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#475569] mb-1.5">
                  {T("sboq.54")}
                </label>
                <input
                  type="text"
                  placeholder={T("sboq.55")}
                  value={newItemNote}
                  onChange={(e) => setNewItemNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E3E7EE] text-xs text-[#475569] focus:outline-none focus:ring-1 focus:ring-1 focus:ring-[#0F172A] focus:border-[#0F172A]"
                />
              </div>

              {/* Preview calculation */}
              <div className="p-3 bg-[#F4F6F9] rounded-lg border border-[#E3E7EE] flex items-center justify-between text-xs">
                <span className="text-[#475569]">{T("sboq.56")}</span>
                <span className="font-bold text-[#0F172A] text-sm">
                  {Math.round(
                    (parseFloat(newItemQty) || 0) *
                      (parseFloat(newItemCost) || 0) *
                      (1 + (parseFloat(newItemMargin) || 0) / 100)
                  ).toLocaleString(intlLocale())}{" "}
                  {currencySymbol()}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#EEF1F5]">
                <button
                  type="button"
                  onClick={() => setShowAddItemModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-[#475569] hover:bg-[#EEF1F5] cursor-pointer"
                >
                  {T("sboq.57")}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#0F172A] hover:bg-[#0F172A] text-white hover:bg-[#0F172A] transition-colors text-xs font-bold shadow-sm cursor-pointer"
                >
                  {T("sboq.58")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Send Success Confirmation Modal */}
      {sendSuccessModal && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-2xl border border-[#E3E7EE] max-w-md w-full p-6 md:p-8 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-lg bg-[#EEF1F5] text-[#0F172A] border border-[#E3E7EE] flex items-center justify-center mx-auto mb-4">
              <FileCheck className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-black text-[#0F172A] mb-2">
              {T("sboq.59")}
            </h3>

            <p className="text-xs text-[#475569] leading-relaxed mb-5">
              تم إشعار العميل (أ. محمد) بمقايسة مشروع 
              <strong className="text-[#0F172A]">فيلا الياسمين</strong> بإجمالي{" "}
              <strong className="text-[#0F172A]">
                {Math.round(totalPrice).toLocaleString(intlLocale())} {currencySymbol()}
              </strong>
              ، مع إتاحة خيار الاعتماد الإلكتروني المباشر من حسابه.
            </p>

            <div className="bg-[#F4F6F9] rounded-lg p-3 border border-[#E3E7EE] text-xs text-[#475569] text-start space-y-1 mb-5">
              <div className="flex justify-between">
                <span className="text-[#475569]">{T("sboq.63")}</span>
                <span className="font-bold">{T("sboq.64", { v0: boqItems.length })}</span>
              </div>
              {!restricted && (
                <>
              <div className="flex justify-between">
                <span className="text-[#475569]">{T("sboq.65")}</span>
                <span className="font-bold">{Math.round(totalCost).toLocaleString(intlLocale())} {currencySymbol()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#475569]">{T("sboq.66")}</span>
                <span className="font-bold text-emerald-700">{pct(averageMargin)}</span>
              </div>
                </>
              )}
            </div>

            <button
              onClick={() => setSendSuccessModal(false)}
              className="w-full py-2.5 rounded-lg bg-[#0F172A] hover:bg-[#0F172A] text-white hover:bg-[#0F172A] transition-colors font-bold text-xs md:text-sm shadow-sm transition-colors cursor-pointer"
            >
              {T("sboq.67")}
            </button>
          </div>
        </div>
      )}

      {/* Client-facing printed table: selling prices only, never cost or margin */}
      <table className="print-only w-full text-start border-collapse text-sm">
        <thead>
          <tr className="border-b border-black text-xs">
            <th className="py-1.5 w-8">#</th>
            <th className="py-1.5 text-start">{T("sboq.18")}</th>
            <th className="py-1.5">{T("sboq.19")}</th>
            <th className="py-1.5">{T("sboq.20")}</th>
            <th className="py-1.5 text-end">{T("sboq.csv.total")}</th>
          </tr>
        </thead>
        <tbody>
          {boqItems.map((i, n) => {
            const unitPrice = (parseFloat(i.unitCost) || 0) * (1 + (parseFloat(i.margin) || 0) / 100);
            const rowTotal = unitPrice * (parseFloat(i.quantity) || 0);
            return (
              <tr key={i.id} className="border-b border-gray-300">
                <td className="py-1">{n + 1}</td>
                <td className="py-1">{E(i.name)}</td>
                <td className="py-1 text-center">{E(i.unit)}</td>
                <td className="py-1 text-center">{i.quantity}</td>
                <td className="py-1 text-end">{Math.round(rowTotal).toLocaleString(intlLocale())}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Printed totals + signature (hidden on screen) */}
      <div className="print-only mt-6 w-full">
        <div className="ms-auto w-72 text-sm space-y-1">
          <div className="flex justify-between"><span>{T("quote.subtotal")}</span><span>{Math.round(totalPrice).toLocaleString(intlLocale())} {currencySymbol()}</span></div>
          <div className="flex justify-between"><span>{T("quote.vat")} ({vatRate}%)</span><span>{Math.round(totalPrice * vatRate / 100).toLocaleString(intlLocale())} {currencySymbol()}</span></div>
          <div className="flex justify-between font-black border-t border-black pt-1"><span>{T("quote.grand")}</span><span>{Math.round(totalPrice * (1 + vatRate / 100)).toLocaleString(intlLocale())} {currencySymbol()}</span></div>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-10 text-xs">
          <div className="border-t border-black pt-1">{office.name || T("brand")}</div>
          <div className="border-t border-black pt-1">
            {sigs[quoteNo] && sigs[quoteNo].total === Math.round(totalPrice * (1 + vatRate / 100)) && (
              <div className="-mt-12 mb-1">
                <img src={sigs[quoteNo].img} alt="" className="h-10" />
                <p className="text-[10px]">{T("sign.done", { 0: sigs[quoteNo].name, 1: new Date(sigs[quoteNo].at).toLocaleDateString() })}</p>
              </div>
            )}
            {T("quote.sign")}
          </div>
        </div>
      </div>
    </main>
  );
}

export default SmartBOQ;
