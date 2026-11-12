import { currencySymbol, intlLocale, useI18n, E } from "../i18n";
import { cashStore, cashTotals, invoicesStore } from "../data/stores";
import { useState } from "react";
import ProgressBar from "./ProgressBar";
import ReceivablesPanel from "./ReceivablesPanel";
import {
  TrendingUp,
  Wallet,
  AlertCircle,
  Banknote,
  Clock,
  CheckCircle2,
  XCircle,
  Building2,
  ArrowUpRight,
  ShieldAlert,
  ChevronLeft,
  Check,
  X,
  FileText,
  DollarSign,
  Package,
  Sparkles,
  Calendar,
  ClipboardCheck,
  Camera,
  Users,
} from "lucide-react";
import {
  PROJECTS as SEED_PROJECTS,
  personById,
  initialsOf,
  formatDateAr,
  formatCompact,
  formatNumber,
  toAr,
  getTotals,
  getClientPayments,
  clientProject,
} from "../data/seed";

// Team members per project and project cards (single source: src/data/seed.js)
const TEAM_MEMBERS = Object.fromEntries(
  SEED_PROJECTS.map((p) => [
    p.id,
    p.teamIds.map((id) => {
      const person = personById(id);
      return {
        initials: initialsOf(person.name),
        name: person.name,
        role: person.title,
        bg: person.color,
      };
    }),
  ])
);

const INITIAL_PROJECTS = SEED_PROJECTS.map((p) => ({
  id: p.id,
  name: p.name,
  category: p.category,
  client: p.client,
  phase: p.phaseTitle,
  phaseDetail: p.phaseDetail,
  progress: p.progress,
  status: p.status,
  dueDate: formatDateAr(p.deadline),
  contractValue: `${formatCompact(p.contractValue)} ${currencySymbol()}`,
}));

const BASE_TOTALS = getTotals();

// month = 1-12; the label is rendered per locale (Intl) so it follows the UI language.
const MONTHLY_FINANCIALS = [
  { m: 6, revenue: 580, expenses: 380 },
  { m: 7, revenue: 720, expenses: 490 },
  { m: 8, revenue: 890, expenses: 540 },
  { m: 9, revenue: 950, expenses: 620 },
  { m: 10, revenue: 1120, expenses: 710 },
  { m: 11, revenue: 1160, expenses: 680 },
].map((x) => ({
  ...x,
  get month() {
    return new Intl.DateTimeFormat(intlLocale(), { month: "long", timeZone: "UTC" }).format(Date.UTC(2026, x.m - 1, 1));
  },
}));

const rich = (str) =>
  str.split(/<\/?b>/).map((part, i) =>
    i % 2 ? <strong key={i} className="text-[#1A2236]">{part}</strong> : part
  );

function AdminDashboard({ actionItems = [], setActionItems, setSelectedItem }) {
  const { t } = useI18n();
  const [cashRows] = cashStore.use();
  const [invoiceRows] = invoicesStore.use();
  const clientPaid = getClientPayments(invoiceRows).paid;
  const collectedTotal = BASE_TOTALS.collectedTotal - clientProject().collected + clientPaid;
  const cash = cashTotals(cashRows);
  const TOTALS = {
    ...BASE_TOTALS,
    collectedTotal,
    collectedPct: Math.round((collectedTotal / BASE_TOTALS.contractTotal) * 100),
    cashGiven: cash.given,
    cashSpent: cash.spent,
    cashRemaining: cash.remaining,
    cashUsedPct: cash.usedPct,
    cashEngineerCount: cash.count,
  };
  const [timeframe, setTimeframe] = useState("6M");
  const [activeHoverBar, setActiveHoverBar] = useState(null);

  // Handle Approve / Reject / Undo on the shared state
  const handleAction = (id, newStatus) => {
    if (setActionItems) {
      setActionItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
    }
  };

  // Filter action items targeted to Admin
  const adminActionItems = actionItems.filter(
    (item) => !item.targetRole || item.targetRole === "Admin"
  );
  const pendingCount = adminActionItems.filter((a) => a.status === "pending").length;

  const todayArabic = new Intl.DateTimeFormat(intlLocale(), {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  const maxVal = Math.max(
    ...MONTHLY_FINANCIALS.map((m) => Math.max(m.revenue, m.expenses))
  );

  // Helper function to resolve icon and styling based on item type
  const getItemVisuals = (item) => {
    if (item.type === "report") {
      return {
        icon: ClipboardCheck,
        iconBg: "bg-[#E9E3D5] text-[#535E78] border border-[#DAD3C2]",
      };
    }
    if (item.type === "expense") {
      return {
        icon: DollarSign,
        iconBg: "bg-amber-50 text-amber-800 border border-amber-200",
      };
    }
    if (item.type === "material") {
      return {
        icon: Package,
        iconBg: "bg-[#E9E3D5] text-[#1A2236] border border-[#DAD3C2]",
      };
    }
    return {
      icon: FileText,
      iconBg: "bg-[#E9E3D5] text-[#1A2236] border border-[#DAD3C2]",
    };
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-7 max-w-7xl mx-auto w-full max-w-full overflow-x-hidden">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-[#DAD3C2]">
        <div>

          <h1 className="text-2xl md:text-3xl font-bold text-[#1A2236] text-balance">
            {t("adm.title")}
          </h1>

          <p className="text-xs md:text-sm text-[#535E78] mt-1 flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 font-semibold text-[#535E78]">
              <Calendar className="w-3.5 h-3.5 text-[#535E78]" />
              {todayArabic}
            </span>
            <span className="text-[#65708A]">•</span>
            <span className="text-[#535E78]">
              {rich(t("adm.sub", { n: toAr(TOTALS.projectCount) }))}
            </span>
          </p>
        </div>
      </div>

      {/* 2. Advanced KPI Cards (The Grid of 4) */}
      <div className="grid stat-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: الإيرادات المتوقعة */}
        <div className="bg-white border border-[#DAD3C2] rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[#535E78] text-sm font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#24304D]" />
                {t("adm.k1")}
              </span>
              <span className="inline-flex items-center gap-0.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#2F7A5F]/10 text-[#2F7A5F]">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +{toAr(14.2)}{t("sym.pct")}
              </span>
            </div>

            <div className="mt-4">
              <span className="text-3xl font-bold tracking-tight text-[#1A2236] font-ibm">
                {formatCompact(TOTALS.contractTotal)} <span className="text-base font-medium text-[#535E78]">{currencySymbol()}</span>
              </span>
            </div>
            <p className="text-xs text-[#535E78] mt-1">
              {t("adm.k1d", { n: toAr(TOTALS.projectCount) })}
            </p>
          </div>

          {/* Sparkline */}
          <div className="mt-5 pt-3 border-t border-[#E9E3D5]">
            <div className="flex items-center justify-between text-xs text-[#535E78] mb-1">
              <span>{t("adm.trend")}</span>
              <span className="text-[#2F7A5F] font-bold">+{formatCompact(670000)} {currencySymbol()}</span>
            </div>
            <div className="h-10 w-full relative">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 30">
                <defs>
                  <linearGradient id="revGradAr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#24304D" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#24304D" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M0,26 Q20,24 35,18 T70,12 T100,4 L100,30 L0,30 Z" fill="url(#revGradAr)" />
                <path d="M0,26 Q20,24 35,18 T70,12 T100,4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="100" cy="4" r="2.5" fill="currentColor" />
              </svg>
            </div>
          </div>
        </div>

        {/* KPI 2: إجمالي المحصل */}
        <div className="bg-white border border-[#DAD3C2] rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[#535E78] text-sm font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#24304D]" />
                {t("adm.k2")}
              </span>
              <span className="inline-flex items-center gap-0.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#2F7A5F]/10 text-[#2F7A5F]">
                {toAr(TOTALS.collectedPct)}{t("sym.pct")}
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-[#1A2236] font-ibm">
                {formatCompact(TOTALS.collectedTotal)} <span className="text-base font-medium text-[#535E78]">{currencySymbol()}</span>
              </span>
            </div>
            <p className="text-xs text-[#535E78] mt-1">
              {t("adm.k2d")}
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-[#E9E3D5]">
            <div className="flex items-center justify-between text-xs text-[#535E78] mb-1">
              <span>{t("adm.velocity")}</span>
              <span className="text-[#1A2236] font-bold">{formatCompact(420000)} {currencySymbol()}/{t("unit.month")}</span>
            </div>
            <div className="h-10 w-full relative">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 30">
                <defs>
                  <linearGradient id="collGradAr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#24304D" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#24304D" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M0,28 Q25,26 45,19 T80,10 T100,6 L100,30 L0,30 Z" fill="url(#collGradAr)" />
                <path d="M0,28 Q25,26 45,19 T80,10 T100,6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="100" cy="6" r="2.5" fill="currentColor" />
              </svg>
            </div>
          </div>
        </div>

        {/* KPI 3: مستحقات متأخرة */}
        <div className="bg-white border border-[#DAD3C2] rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[#535E78] text-sm font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A93226]" />
                {t("adm.k3")}
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#A93226]/10 text-[#A93226]">
                {t("adm.urgent")}
              </span>
            </div>

            <div className="mt-4">
              <span className="text-3xl font-bold tracking-tight text-[#A93226] font-ibm">
                {formatCompact(TOTALS.overdueTotal)} <span className="text-base font-medium text-[#535E78]">{currencySymbol()}</span>
              </span>
            </div>
            <p className="text-xs text-[#535E78] mt-1">
              {t("adm.k3d", { n: toAr(TOTALS.overdueCount) })}
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-[#E9E3D5] space-y-2">
            <div className="flex items-center justify-between text-xs text-[#535E78] font-medium">
              <span className="truncate">{t("adm.claim", { name: TOTALS.topOverdue.projectName })}</span>
              <span className="shrink-0 text-xs font-bold text-[#A93226]">{formatCompact(TOTALS.topOverdue.amount)} {currencySymbol()} ({toAr(TOTALS.topOverdue.pctOfOverdue)}{t("sym.pct")})</span>
            </div>
            <ProgressBar value={TOTALS.topOverdue.pctOfOverdue} customFillClass="bg-[#A93226]" />
            <p className="text-xs text-[#535E78] font-medium">
              {t("adm.avgDelay", { n: toAr(TOTALS.overdueAvgDays) })}
            </p>
          </div>
        </div>

        {/* KPI 4: عهد مهندسين نشطة */}
        <div className="bg-white border border-[#DAD3C2] rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[#535E78] text-sm font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#24304D]" />
                {t("adm.k4")}
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#65708A]/15 text-[#B45309]">
                {t("adm.onSite", { p: toAr(TOTALS.cashUsedPct) })}
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-[#1A2236] font-ibm">
                {formatNumber(TOTALS.cashRemaining)} <span className="text-base font-medium text-[#535E78]">{currencySymbol()}</span>
              </span>
            </div>
            <p className="text-xs text-[#535E78] mt-1">
              {t("adm.k4d", { n: toAr(TOTALS.cashEngineerCount) })}
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-[#E9E3D5] space-y-2.5">
            <div className="flex items-center justify-between text-xs text-[#535E78] font-medium">
              <span>{t("adm.ceiling")}</span>
              <span className="text-xs font-bold text-[#1A2236] font-mono">{toAr(TOTALS.cashUsedPct)}{t("sym.pct")}</span>
            </div>
            <ProgressBar value={TOTALS.cashUsedPct} customFillClass="bg-[#24304D]" />
            <div className="flex items-center justify-between text-xs text-[#535E78] font-medium">
              <span>{t("adm.given", { amt: `${formatNumber(TOTALS.cashGiven)} ${currencySymbol()}` })}</span>
              <span className="text-[#2F7A5F] font-bold">{t("adm.liquidity")}</span>
            </div>
          </div>
        </div>
      </div>

      <ReceivablesPanel />

      {/* 3. Financial Chart (التقرير المالي والتدفقات النقدية) */}
      <div className="bg-white rounded-xl border border-[#DAD3C2] shadow-sm p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-[#E9E3D5]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#1A2236]">
                {t("adm.cfTitle")}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#B5452B]/15 text-[#24304D] border border-[#B5452B]/30">
                {t("adm.margin", { p: toAr(39.4) })}
              </span>
            </div>
            <p className="text-xs text-[#535E78] mt-0.5">
              {t("adm.cfSub")}
            </p>
          </div>

          {/* Controls & Legend */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-4 text-xs font-medium text-[#535E78]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#24304D]" />
                {t("adm.inflows")}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#DAD3C2]" />
                {t("adm.siteExp")}
              </span>
            </div>

            <div className="inline-flex rounded-lg border border-[#DAD3C2] p-0.5 bg-[#F3EFE6] text-xs font-bold">
              <button
                onClick={() => setTimeframe("6M")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  timeframe === "6M"
                    ? "bg-[#24304D] text-white shadow-xs"
                    : "text-[#535E78] hover:text-[#1A2236]"
                }`}
              >
                {t("adm.last6")}
              </button>
              <button
                onClick={() => setTimeframe("YTD")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  timeframe === "YTD"
                    ? "bg-[#24304D] text-white shadow-xs"
                    : "text-[#535E78] hover:text-[#1A2236]"
                }`}
              >
                {t("adm.fullYear")}
              </button>
            </div>
          </div>
        </div>

        {/* Dual-bar Chart */}
        <div className="mt-6 pt-2">
          <div className="h-6 mb-2 flex items-center justify-start text-xs font-semibold">
            {activeHoverBar ? (
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#E9E3D5] border border-[#DAD3C2] text-[#1A2236] animate-in fade-in">
                <span>{activeHoverBar.month} {toAr(2026)}:</span>
                <span className="text-[#1A2236] font-bold">
                  {t("adm.revenue", { amt: `${formatCompact(activeHoverBar.revenue * 1000)} ${currencySymbol()}` })}
                </span>
                <span className="text-[#535E78]">|</span>
                <span className="text-[#535E78]">
                  {t("adm.expense", { amt: `${formatCompact(activeHoverBar.expenses * 1000)} ${currencySymbol()}` })}
                </span>
                <span className="text-[#24304D]">
                  {t("adm.net", { p: toAr(Math.round(((activeHoverBar.revenue - activeHoverBar.expenses) / activeHoverBar.revenue) * 100)) })}
                </span>
              </span>
            ) : (
              <span className="text-[#535E78] text-xs font-medium">
                {t("adm.hover")}
              </span>
            )}
          </div>

          <div className="grid grid-cols-6 gap-2 sm:gap-6 items-end h-52 border-b border-dashed border-[#DAD3C2] pb-3">
            {MONTHLY_FINANCIALS.map((item, idx) => {
              const revPercent = Math.round((item.revenue / maxVal) * 100);
              const expPercent = Math.round((item.expenses / maxVal) * 100);

              return (
                <div
                  key={item.month}
                  onMouseEnter={() => setActiveHoverBar(item)}
                  onMouseLeave={() => setActiveHoverBar(null)}
                  className="flex flex-col items-center h-full justify-end group cursor-pointer"
                >
                  <div className="w-full flex items-end justify-center gap-1.5 sm:gap-2.5 h-full">
                    {/* Revenue Bar (Sage Green) */}
                    <div
                      className="w-1/2 max-w-[28px] rounded-t-md bg-[#24304D] group-hover:bg-[#1A2236] transition-colors duration-200 bar-grow"
                      style={{ height: `${revPercent}%`, animationDelay: `${idx * 60}ms` }}
                    />
                    {/* Expense Bar */}
                    <div
                      className="w-1/2 max-w-[28px] rounded-t-md bg-[#DAD3C2] group-hover:bg-[#DAD3C2] transition-colors duration-200 bar-grow"
                      style={{ height: `${expPercent}%`, animationDelay: `${idx * 60 + 40}ms` }}
                    />
                  </div>
                  <span className="mt-3 text-xs font-bold text-[#1A2236] group-hover:text-[#1A2236] transition-colors">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Bottom Summary Bar */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-xs text-[#535E78] pt-1">
            <div className="flex items-center gap-6">
              <div>
                <span className="text-[#535E78] block text-[11px] font-semibold">{t("adm.rev6")}</span>
                <span className="font-extrabold text-[#1A2236] text-sm">{formatNumber(MONTHLY_FINANCIALS.reduce((a, x) => a + x.revenue, 0) * 1000)} {currencySymbol()}</span>
              </div>
              <div className="h-6 w-px bg-[#DAD3C2]" />
              <div>
                <span className="text-[#535E78] block text-[11px] font-semibold">{t("adm.cost6")}</span>
                <span className="font-extrabold text-[#1A2236] text-sm">{formatNumber(MONTHLY_FINANCIALS.reduce((a, x) => a + x.expenses, 0) * 1000)} {currencySymbol()}</span>
              </div>
              <div className="h-6 w-px bg-[#DAD3C2]" />
              <div>
                <span className="text-[#535E78] block text-[11px] font-semibold">{t("adm.profit6")}</span>
                <span className="font-extrabold text-[#24304D] text-sm">+{formatNumber(MONTHLY_FINANCIALS.reduce((a, x) => a + x.revenue, 0) * 1000 - MONTHLY_FINANCIALS.reduce((a, x) => a + x.expenses, 0) * 1000)} {currencySymbol()}</span>
              </div>
            </div>

            <span className="text-[11px] text-[#535E78] font-medium">
              {t("adm.einv")}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Split Layout (Projects Health vs Action Center) */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column: حالة المشاريع (Projects Health) */}
        <div className="bg-white rounded-xl border border-[#DAD3C2] shadow-[0_8px_30px_rgba(45,36,34,0.04)] overflow-hidden flex flex-col justify-between flex-1">
          <div>
            <div className="p-5 border-b border-[#E9E3D5] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-[#1A2236] flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#1A2236]" />
                    {t("adm.projTitle")}
                  </h2>
                </div>
                <p className="text-xs text-[#535E78] mt-0.5">
                  {t("adm.projSub")}
                </p>
              </div>

              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#E9E3D5] text-[#1A2236] border border-[#DAD3C2]">
                {t("adm.sitesActive", { n: toAr(INITIAL_PROJECTS.length) })}
              </span>
            </div>

            <div className="divide-y divide-[#E9E3D5]">
              {INITIAL_PROJECTS.map((project) => {
                const isOnTrack = project.status === "جاري العمل";
                const team = TEAM_MEMBERS[project.id] || [];

                return (
                  <div
                    key={project.id}
                    className="p-5 hover:bg-[#F3EFE6]/70 transition-all duration-200 group"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-bold text-[#1A2236] group-hover:text-[#1A2236] transition-colors">
                            {project.name}
                          </h3>
                          <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#E9E3D5] text-[#1A2236] font-semibold border border-[#DAD3C2]">
                            {E(project.category)}
                          </span>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                              isOnTrack
                                ? "bg-[#B5452B]/15 text-[#24304D] border-[#B5452B]/30"
                                : "bg-rose-50 text-rose-700 border-rose-200"
                            }`}
                          >
                            {isOnTrack ? (
                              <CheckCircle2 className="w-3 h-3 me-1 text-[#B5452B]" />
                            ) : (
                              <ShieldAlert className="w-3 h-3 me-1 text-rose-600" />
                            )}
                            {E(project.status)}
                          </span>
                        </div>

                        <p className="text-xs text-[#535E78] mt-1">
                          {t("adm.client")} <span className="text-[#1A2236] font-bold">{project.client}</span> • {t("adm.contract")} <span className="text-[#1A2236] font-extrabold">{project.contractValue}</span>
                        </p>
                      </div>

                      {/* Overlapping Team Avatars */}
                      <div className="flex items-center shrink-0">
                        <div className="flex items-center -space-x-2 space-x-reverse overflow-hidden">
                          {team.map((member, i) => (
                            <div
                              key={i}
                              title={`${member.name} (${member.role})`}
                              className={`w-7 h-7 rounded-full ${member.bg} text-white font-extrabold text-[10px] flex items-center justify-center border-2 border-white shadow-xs cursor-pointer hover:scale-110 hover:z-10 transition-transform`}
                            >
                              {member.initials}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar with Sage Green Fill */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-1.5 font-semibold">
                        <span className="text-[#535E78]">
                          {t("adm.phase")} <span className="text-[#1A2236] font-bold">{E(project.phase)}</span>
                        </span>
                        <span className="text-xs font-bold text-[#1A2236] tracking-wide font-mono">
                          {t("adm.complete", { p: toAr(project.progress) })}
                        </span>
                      </div>

                      <ProgressBar
                        value={project.progress}
                        isWarning={!isOnTrack}
                      />
                    </div>

                    <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#535E78]">
                      <span className="truncate max-w-[260px] text-[#535E78]">
                        {project.phaseDetail}
                      </span>
                      <span className="shrink-0 font-bold text-[#535E78]">
                        {t("adm.due", { d: project.dueDate })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-4 bg-[#F3EFE6]/70 border-t border-[#E9E3D5] flex items-center justify-between text-xs">
            <span className="text-[#535E78] font-medium">
              {t("adm.codeOk")}
            </span>
            <button className="font-bold text-[#1A2236] hover:text-amber-800 inline-flex items-center gap-1 transition-colors">
              {t("adm.register")}
              <ChevronLeft className="ltr:-scale-x-100 w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Action Center (المهام والاعتمادات العاجلة) - Clickable Items & Modal */}
        <div className="bg-white rounded-xl border border-[#DAD3C2] shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-[#E9E3D5] flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#1A2236] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-[#1A2236]" />
                  {t("adm.tasksTitle")}
                </h2>
                <p className="text-xs text-[#535E78] mt-0.5">
                  {t("adm.tasksSub")}
                </p>
              </div>

              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                  pendingCount > 0
                    ? "bg-[#E9E3D5] text-[#1A2236] border-[#DAD3C2]"
                    : "bg-[#E9E3D5] text-[#535E78] border-[#DAD3C2]"
                }`}
              >
                {t("adm.pending", { n: toAr(pendingCount) })}
              </span>
            </div>

            {/* Dynamic Map over actionItems Prop with Clickable Rows */}
            <div className="p-4 space-y-3.5 max-h-[580px] overflow-y-auto">
              {adminActionItems.length === 0 ? (
                <div className="text-center py-12 text-[#535E78]">
                  <ClipboardCheck className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-bold">{t("adm.noTasks")}</p>
                </div>
              ) : (
                adminActionItems.map((item) => {
                  const visuals = getItemVisuals(item);
                  const ItemIcon = visuals.icon;
                  const isPending = item.status === "pending";
                  const isJustNow =
                    item.timestamp === "الآن" || item.time === "الآن";

                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className={`rounded-xl p-4 border transition-all duration-200 relative cursor-pointer hover:bg-[#F3EFE6] ${
                        isJustNow && isPending
                          ? "bg-[#F3EFE6] border-[#C6BEAA] ring-1 ring-[#24304D]/10 shadow-xs"
                          : isPending
                          ? "bg-white border-[#DAD3C2] hover:border-[#B5452B] hover:shadow-xs hover:-translate-y-0.5"
                          : "bg-[#F3EFE6]/60 border-[#DAD3C2] opacity-90"
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${visuals.iconBg}`}
                        >
                          <ItemIcon className="w-4 h-4" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-bold text-[#535E78] uppercase tracking-wider">
                                {item.category || t("adm.notice")} • {item.project || t("adm.theSite")}
                              </span>

                              {/* Subtle badge if timestamp is "الآن" */}
                              {isJustNow && isPending && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#B5452B]/15 text-[#24304D] border border-[#B5452B]/30">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#24304D]" />
                                  {t("adm.newNow")}
                                </span>
                              )}
                            </div>

                            <span className="text-[11px] font-bold text-[#535E78] shrink-0">
                              {item.timestamp || item.time}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-2 mt-1">
                            <h4 className="text-sm font-bold text-[#1A2236] leading-snug">
                              {item.title}
                            </h4>
                            {item.amount && (
                              <span className="text-xs font-bold text-[#1A2236] shrink-0 bg-[#E9E3D5] px-2.5 py-0.5 rounded-lg border border-[#DAD3C2] font-mono">
                                {item.amount}
                              </span>
                            )}
                          </div>

                          {item.subtitle && (
                            <p className="text-xs text-[#535E78] mt-1 leading-relaxed">
                              {item.subtitle}
                            </p>
                          )}

                          <div className="mt-2 text-[11px] text-[#535E78] font-medium">
                            {t("adm.source")}{" "}
                            <span className="text-[#1A2236] font-bold">
                              {item.user || item.submitter}
                            </span>
                            <span className="text-[#1A2236] ms-2 font-bold hover:underline">
                              {t("adm.clickDetails")}
                            </span>
                          </div>

                          {/* Interactive Action Buttons */}
                          <div className="mt-3.5 pt-3 border-t border-[#E9E3D5] flex items-center justify-between">
                            {isPending ? (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAction(item.id, "approved");
                                  }}
                                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium text-white bg-[#24304D] hover:bg-[#1A2236] hover:bg-[#1A2236] transition-colors shadow-sm cursor-pointer"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  {t("adm.approve")}
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAction(item.id, "rejected");
                                  }}
                                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-[#535E78] bg-white border border-[#DAD3C2] hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 active:scale-95 transition-all"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  {t("adm.reject")}
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between w-full">
                                <span
                                  className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${
                                    item.status === "approved"
                                      ? "text-[#24304D] bg-[#B5452B]/15 border border-[#B5452B]/30"
                                      : "text-rose-800 bg-rose-50 border border-rose-200"
                                  }`}
                                >
                                  {item.status === "approved" ? (
                                    <>
                                      <CheckCircle2 className="w-3.5 h-3.5 text-[#B5452B]" />
                                      {t("adm.approvedMsg")}
                                    </>
                                  ) : (
                                    <>
                                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                                      {t("adm.rejectedMsg")}
                                    </>
                                  )}
                                </span>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAction(item.id, "pending");
                                  }}
                                  className="text-[11px] font-bold text-[#535E78] hover:text-[#535E78] underline"
                                >
                                  {t("adm.undo")}
                                </button>
                              </div>
                            )}

                            {isPending && (
                              <span className="text-[11px] text-[#535E78] hidden sm:inline font-medium">
                                {t("adm.partner")}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="p-4 bg-[#F3EFE6]/70 border-t border-[#E9E3D5] flex items-center justify-between text-xs text-[#535E78] font-medium">
            <span>{t("adm.audit")}</span>
            <span className="font-bold text-[#535E78]">{t("adm.updated")}</span>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AdminDashboard;
