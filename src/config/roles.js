import {
  History,
  LayoutDashboard,
  Receipt,
  Palette,
  Armchair,
  FilePenLine,
  Truck,
  UsersRound,
  FolderKanban,
  DollarSign,
  ClipboardCheck,
  Users,
  ListTodo,
  FileText,
  AlertTriangle,
  PackageSearch,
  Settings,
  Briefcase,
  Eye,
  CreditCard,
  CalendarDays,
  ShoppingCart,
  ShieldCheck,
  MessageCircleQuestion,
} from "lucide-react";

/**
 * Role-based sidebar configuration for Arabic RTL.
 * Each item has id, name, label, icon.
 * The primary dashboard tab across all roles has name: "لوحة التحكم".
 */
export const ROLE_CONFIG = {
  Admin: [
    { id: "Dashboard", name: "لوحة التحكم", label: "لوحة التحكم", icon: LayoutDashboard },
    { id: "Projects", name: "المشاريع الجارية", label: "المشاريع الجارية", icon: FolderKanban },
    { id: "Financials & Petty Cash", name: "الحسابات والعهد", label: "الحسابات والعهد", icon: DollarSign },
    { id: "BOQ & Approvals", name: "المقايسات والاعتمادات", label: "المقايسات والاعتمادات", icon: ClipboardCheck },
    { id: "Purchase Invoices", name: "فواتير الشراء", label: "فواتير الشراء", icon: ShoppingCart },
    { id: "Certificates", name: "المستخلصات والمحتجزات", label: "المستخلصات والمحتجزات", icon: Receipt },
    { id: "Moodboard", name: "الموودبورد", label: "الموودبورد", icon: Palette },
    { id: "Selections", name: "الاختيارات وFF&E", label: "الاختيارات وFF&E", icon: Armchair },
    { id: "Change Orders", name: "أوامر التغيير", label: "أوامر التغيير", icon: FilePenLine },
    { id: "Procurement", name: "الباطن والمشتريات", label: "الباطن والمشتريات", icon: Truck },
    { id: "Attendance", name: "الحضور والعمالة", label: "الحضور والعمالة", icon: UsersRound },
    { id: "Drawings & Docs", name: "المخططات والمستندات", label: "المخططات والمستندات", icon: FileText },
    { id: "RFI", name: "الاستفسارات الفنية", label: "الاستفسارات الفنية (RFI)", icon: MessageCircleQuestion },
    { id: "Warranty", name: "الضمان والصيانة", label: "الضمان والصيانة", icon: ShieldCheck },
    { id: "Team", name: "فريق العمل", label: "فريق العمل", icon: Users },
    { id: "Audit Log", name: "سجل المراجعة", label: "سجل المراجعة", icon: History },
  ],
  "Site Engineer": [
    { id: "Dashboard", name: "لوحة التحكم", label: "لوحة التحكم الميدانية", icon: LayoutDashboard },
    { id: "My Tasks", name: "مهامي الميدانية", label: "مهامي الميدانية", icon: ListTodo },
    { id: "Daily Reports", name: "التقارير اليومية", label: "التقارير اليومية", icon: FileText },
    { id: "Snag List", name: "قائمة الملاحظات", label: "قائمة الملاحظات (Snag List)", icon: AlertTriangle },
    { id: "Drawings & Docs", name: "المخططات والمستندات", label: "المخططات والمستندات", icon: FileText },
    { id: "RFI", name: "الاستفسارات الفنية", label: "الاستفسارات الفنية (RFI)", icon: MessageCircleQuestion },
    { id: "Material Requests", name: "طلبات تشوين المواد", label: "طلبات تشوين المواد", icon: PackageSearch },
    { id: "Attendance", name: "الحضور والعمالة", label: "الحضور والعمالة", icon: UsersRound },
  ],
  "Technical Office": [
    { id: "Dashboard", name: "لوحة التحكم", label: "لوحة التحكم الهندسية", icon: LayoutDashboard },
    { id: "BOQ Management", name: "إدارة المقايسات", label: "إدارة المقايسات (BOQ)", icon: ClipboardCheck },
    { id: "RFI", name: "الاستفسارات الفنية", label: "الاستفسارات الفنية (RFI)", icon: MessageCircleQuestion },
    { id: "Drawings & Docs", name: "المخططات والمستندات", label: "المخططات والمستندات", icon: FileText },
    { id: "Moodboard", name: "الموودبورد", label: "الموودبورد", icon: Palette },
    { id: "Selections", name: "الاختيارات وFF&E", label: "الاختيارات وFF&E", icon: Armchair },
    { id: "Change Orders", name: "أوامر التغيير", label: "أوامر التغيير", icon: FilePenLine },
    { id: "Project Tracking", name: "متابعة التنفيذ", label: "متابعة التنفيذ", icon: FolderKanban },
    { id: "Settings", name: "الإعدادات والنماذج", label: "الإعدادات والنماذج", icon: Settings },
  ],
  Accountant: [
    { id: "Dashboard", name: "لوحة التحكم", label: "لوحة التحكم", icon: LayoutDashboard },
    { id: "Financials & Petty Cash", name: "الحسابات والعهد", label: "الحسابات والعهد", icon: DollarSign },
    { id: "Purchase Invoices", name: "فواتير الشراء", label: "فواتير الشراء", icon: ShoppingCart },
    { id: "Certificates", name: "المستخلصات والمحتجزات", label: "المستخلصات والمحتجزات", icon: Receipt },
    { id: "Procurement", name: "الباطن والمشتريات", label: "الباطن والمشتريات", icon: Truck },
  ],
  Secretary: [
    { id: "Dashboard", name: "لوحة التحكم", label: "لوحة التحكم", icon: LayoutDashboard },
    { id: "Projects", name: "المشاريع الجارية", label: "المشاريع الجارية", icon: FolderKanban },
    { id: "Attendance", name: "الحضور والعمالة", label: "الحضور والعمالة", icon: UsersRound },
    { id: "Team", name: "فريق العمل", label: "فريق العمل", icon: Users },
  ],
  Client: [
    { id: "Dashboard", name: "لوحة التحكم", label: "بوابة العميل", icon: LayoutDashboard },
    { id: "My Projects", name: "مشاريعي", label: "مشاريعي", icon: Briefcase },
    { id: "Progress Overview", name: "نسب الإنجاز", label: "نسب الإنجاز", icon: Eye },
    { id: "Invoices & Payments", name: "الفواتير والدفعات", label: "الفواتير والدفعات", icon: CreditCard },
    { id: "Purchase Invoices", name: "فواتير الشراء", label: "فواتير الشراء", icon: ShoppingCart },
    { id: "Moodboard", name: "الموودبورد", label: "الموودبورد", icon: Palette },
    { id: "Selections", name: "اختياراتي", label: "اختياراتي", icon: Armchair },
    { id: "Change Orders", name: "أوامر التغيير", label: "أوامر التغيير", icon: FilePenLine },
    { id: "Warranty", name: "الضمان والصيانة", label: "الضمان والصيانة", icon: ShieldCheck },
    { id: "Schedule", name: "الجدول الزمني", label: "الجدول الزمني", icon: CalendarDays },
  ],
};

export const ROLE_TITLES = {
  Admin: "مدير تنفيذي (Admin)",
  "Site Engineer": "مهندس موقع (Site Engineer)",
  "Technical Office": "المكتب الفني (Technical Office)",
  Client: "العميل (Client)",
  Accountant: "محاسب (Accountant)",
  Secretary: "سكرتارية (Secretary)",
};

// Demo role switcher.
export const ROLES = ["Admin", "Site Engineer", "Technical Office", "Accountant", "Secretary", "Client"];

/** Localized display helpers (tab routing still uses the stable Arabic `name`). */
import { tr_ } from "../i18n";
export const navLabel = (role, item) => tr_(`nav.${role}.${item.id}`);
export const roleTitle = (role) => tr_(`role.${role}`);
export const roleShort = (role) => tr_(`role.short.${role}`);
