import { useState, useMemo } from "react";
import {
  Users,
  UserPlus,
  Shield,
  Briefcase,
  Trash2,
  Edit3,
  CheckCircle2,
  X,
  Search,
  Filter,
  Sparkles,
  Phone,
  Mail,
  Building2,
  Power,
  RotateCcw,
  Check,
  ChevronRight,
  Sliders,
} from "lucide-react";
import { PEOPLE, projectsCountFor } from "../data/seed";

// Smart default permissions generator based on role
const getDefaultPermissions = (role) => {
  switch (role) {
    case "مدير":
      return {
        viewFinances: true,
        editBOQ: true,
        approveReports: true,
        pettyCash: true,
      };
    case "مهندس موقع":
      return {
        viewFinances: false, // OFF for Site Engineer
        editBOQ: false,
        approveReports: true,
        pettyCash: true, // ON for Site Engineer
      };
    case "مكتب فني":
      return {
        viewFinances: true,
        editBOQ: true,
        approveReports: true,
        pettyCash: false,
      };
    default:
      return {
        viewFinances: false,
        editBOQ: false,
        approveReports: false,
        pettyCash: false,
      };
  }
};

// Team members (single source: src/data/seed.js)
const INITIAL_TEAM_MEMBERS = PEOPLE.map((p, i) => ({
  id: i + 1,
  name: p.displayName,
  role: p.role,
  email: p.email,
  phone: p.phone,
  projectsCount: projectsCountFor(p.id),
  status: p.status,
  avatar: p.name[0],
  color: p.color,
  permissions: getDefaultPermissions(p.role),
}));

const ROLE_BADGES = {
  مدير: {
    label: "مدير تنفيذي",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold",
    dotClass: "bg-emerald-600",
  },
  "مهندس موقع": {
    label: "مهندس موقع",
    badgeClass: "bg-[#EFEEE8] text-[#202923] border-[#E5E6DF]",
    dotClass: "bg-[#5D8C70]",
  },
  "مكتب فني": {
    label: "مكتب فني",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
    dotClass: "bg-amber-700",
  },
};

const AVATAR_COLORS = [
  "bg-[#183C35]",
  "bg-[#202923]",
  "bg-[#5D8C70]",
  "bg-[#C5A36B]",
  "bg-[#5D8C70]",
];

function TeamManagement() {
  const [teamMembers, setTeamMembers] = useState(INITIAL_TEAM_MEMBERS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Requirement 1: Edit Functionality State
  const [editingMember, setEditingMember] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("الكل");
  const [toastMessage, setToastMessage] = useState(null);

  // Form State
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("مهندس موقع");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newProjectsCount, setNewProjectsCount] = useState(1);

  // Requirement 2: Permissions Assignment Matrix State
  const [permissions, setPermissions] = useState(getDefaultPermissions("مهندس موقع"));

  // Stats calculation
  const stats = useMemo(() => {
    const total = teamMembers.length;
    const siteEng = teamMembers.filter((m) => m.role === "مهندس موقع").length;
    const techOffice = teamMembers.filter((m) => m.role === "مكتب فني").length;
    const managers = teamMembers.filter((m) => m.role === "مدير").length;
    return { total, siteEng, techOffice, managers };
  }, [teamMembers]);

  // Filtered Team Members
  const filteredMembers = useMemo(() => {
    return teamMembers.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.email && m.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        m.role.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === "الكل" || m.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [teamMembers, searchQuery, roleFilter]);

  // Extract avatar initial cleanly (skipping prefixes like م. or د.)
  const getInitial = (name) => {
    if (!name) return "م";
    const cleaned = name.replace(/^(م\.|مهندس\/|د\.|أستاذ\/)\s*/, "").trim();
    return cleaned.charAt(0) || name.charAt(0);
  };

  // Open modal in "Add" mode
  const handleOpenAddModal = () => {
    setEditingMember(null);
    setNewName("");
    setNewRole("مهندس موقع");
    setNewEmail("");
    setNewPhone("");
    setNewProjectsCount(1);
    setPermissions(getDefaultPermissions("مهندس موقع"));
    setIsAddModalOpen(true);
  };

  // Open modal in "Edit" mode
  const handleOpenEditModal = (member) => {
    setEditingMember(member);
    setNewName(member.name);
    setNewRole(member.role);
    setNewEmail(member.email || "");
    setNewPhone(member.phone || "");
    setNewProjectsCount(member.projectsCount || 1);
    setPermissions(member.permissions || getDefaultPermissions(member.role));
    setIsAddModalOpen(true);
  };

  // Handle Role Change with Smart Defaults (Requirement 2)
  const handleRoleChange = (role) => {
    setNewRole(role);
    setPermissions(getDefaultPermissions(role));
  };

  // Toggle individual permission switch
  const handleTogglePermission = (key) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Close modal and reset states
  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingMember(null);
  };

  // Form Submit: Add or Edit (Requirement 1)
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    if (editingMember) {
      // Edit existing member
      setTeamMembers((prev) =>
        prev.map((m) =>
          m.id === editingMember.id
            ? {
                ...m,
                name: newName.trim(),
                role: newRole,
                email:
                  newEmail.trim() ||
                  m.email ||
                  `${newName.trim().toLowerCase().replace(/\s+/g, ".")}@miyar.eg`,
                phone: newPhone.trim() || m.phone,
                projectsCount: parseInt(newProjectsCount, 10) || 1,
                avatar: getInitial(newName.trim()),
                permissions: permissions,
              }
            : m
        )
      );
      setToastMessage(`تم تحديث بيانات "${newName.trim()}" والصلاحيات بنجاح`);
    } else {
      // Add new member
      const initial = getInitial(newName.trim());
      const randomColor =
        AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];

      const newMember = {
        id: Date.now(),
        name: newName.trim(),
        role: newRole,
        email:
          newEmail.trim() ||
          `${newName.trim().toLowerCase().replace(/\s+/g, ".")}@miyar.eg`,
        phone: newPhone.trim() || "+20 100 000 0000",
        projectsCount: parseInt(newProjectsCount, 10) || 1,
        status: "نشط",
        avatar: initial,
        color: randomColor,
        permissions: permissions,
      };

      setTeamMembers((prev) => [newMember, ...prev]);
      setToastMessage(`تمت إضافة "${newMember.name}" بنجاح إلى فريق العمل`);
    }

    handleCloseModal();
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Delete Member
  const handleDeleteMember = (id, name) => {
    setTeamMembers((prev) => prev.filter((m) => m.id !== id));
    if (editingMember && editingMember.id === id) {
      handleCloseModal();
    }
    setToastMessage(`تم حذف "${name}" من فريق العمل`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Toggle Member Status (نشط / غير نشط)
  const handleToggleStatus = (id) => {
    setTeamMembers((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const newStatus = m.status === "نشط" ? "غير نشط" : "نشط";
          return { ...m, status: newStatus };
        }
        return m;
      })
    );
  };

  // Reset to default sample team
  const handleResetTeam = () => {
    setTeamMembers(INITIAL_TEAM_MEMBERS);
    setToastMessage("تمت استعادة القائمة الافتراضية لفريق العمل");
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent pb-24 font-ibm w-full max-w-full overflow-x-hidden" dir="rtl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 left-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#183C35] text-white rounded-xl shadow-xl border border-white/10 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-xs font-bold leading-relaxed">{toastMessage}</p>
        </div>
      )}

      {/* Header & Quick Action */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap mb-1">
            <h1 className="text-2xl md:text-3xl font-black text-[#202923] tracking-tight flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#EFEEE8] border border-[#E5E6DF] flex items-center justify-center text-[#202923]">
                <Users className="w-5 h-5" />
              </div>
              <span>إدارة فريق العمل والصلاحيات</span>
            </h1>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EFEEE8] text-[#202923] border border-[#E5E6DF]/80">
              {teamMembers.length} أعضاء مسجلين
            </span>
          </div>
          <p className="text-xs md:text-sm text-[#526257]">
            إدارة الكوادر الهندسية والإدارية، تعيين الصلاحيات التفصيلية، ومتابعة توزيع المهندسين على المشاريع.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleResetTeam}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-[#526257] bg-white border border-[#E5E6DF] hover:bg-[#F5F3ED] transition-colors shadow-2xs cursor-pointer"
            title="استعادة البيانات الأصلية"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة ضبط</span>
          </button>

          {/* Primary Button "+ إضافة عضو جديد" */}
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold text-white bg-[#183C35] hover:bg-[#202923] transition-colors shadow-sm cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ إضافة عضو جديد</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        <div className="bg-white rounded-lg p-5 border border-[#E5E6DF] shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <span className="text-[11px] font-bold text-[#526257] block mb-1">إجمالي أعضاء الفريق</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl md:text-2xl font-black text-[#202923]">{stats.total}</span>
            <span className="text-[11px] font-bold text-[#526257] bg-[#EFEEE8] border border-[#E5E6DF] px-2 py-0.5 rounded-md">
              عضو فعال
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-[#E5E6DF] shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <span className="text-[11px] font-bold text-[#526257] block mb-1">مهندسو المواقع (Site)</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl md:text-2xl font-black text-emerald-600">{stats.siteEng}</span>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
              ميداني
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-[#E5E6DF] shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <span className="text-[11px] font-bold text-[#526257] block mb-1">المكتب الفني (Tech Office)</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl md:text-2xl font-black text-amber-800">{stats.techOffice}</span>
            <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
              دراسات ومخططات
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-[#E5E6DF] shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <span className="text-[11px] font-bold text-[#526257] block mb-1">الإدارة العامة (Admin)</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl md:text-2xl font-black text-[#202923]">{stats.managers}</span>
            <span className="text-[11px] font-bold text-[#202923] bg-[#EFEEE8] border border-[#E5E6DF] px-2 py-0.5 rounded-md">
              إشراف واعتمادات
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-lg border border-[#E5E6DF] p-3.5 mb-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#526257] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="بحث بالاسم أو الصلاحية أو البريد الإلكتروني..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-2 rounded-lg border border-[#E5E6DF] bg-[#F5F3ED] text-xs md:text-sm font-semibold text-[#202923] placeholder-[#526257]/50 focus:outline-none focus:ring-1 focus:ring-[#183C35] focus:border-[#183C35] transition-all"
          />
        </div>

        {/* Role Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {["الكل", "مدير", "مهندس موقع", "مكتب فني"].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                roleFilter === role
                  ? "bg-[#183C35] text-white shadow-sm"
                  : "bg-[#EFEEE8] text-[#526257] hover:bg-[#E5E6DF]"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Main Team Table in a Glassmorphic Card */}
      <div className="bg-white rounded-lg border border-[#E5E6DF] shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-[#F5F3ED] text-[#526257] text-xs font-bold border-b border-[#E5E6DF]">
                <th className="py-4 px-5 min-w-[240px]">الاسم وبيانات الاتصال</th>
                <th className="py-4 px-4 w-40 text-center">الصلاحية والنطاق</th>
                <th className="py-4 px-4 w-36 text-center">المشاريع الحالية</th>
                <th className="py-4 px-4 w-32 text-center">الحالة</th>
                <th className="py-4 px-5 w-32 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFEEE8] text-xs md:text-sm">
              {filteredMembers.map((member) => {
                const roleConfig = ROLE_BADGES[member.role] || {
                  label: member.role,
                  badgeClass: "bg-[#EFEEE8] text-[#526257] border-[#E5E6DF]",
                  dotClass: "bg-[#526257]",
                };

                const isStatusActive = member.status === "نشط";
                const isStatusLeave = member.status === "في إجازة";

                return (
                  <tr
                    key={member.id}
                    className="hover:bg-[#F5F3ED] transition-colors duration-150 group"
                  >
                    {/* Name & Contact (Clickable for editing) */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleOpenEditModal(member)}
                          className={`w-10 h-10 rounded-2xl ${member.color} text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-xs hover:ring-2 hover:ring-[#183C35]/30 transition-all cursor-pointer`}
                          title="تعديل بيانات العضو"
                        >
                          {member.avatar}
                        </button>
                        <div>
                          {/* Clickable Employee Name (Requirement 1) */}
                          <button
                            onClick={() => handleOpenEditModal(member)}
                            className="text-right group-hover:text-amber-800 transition-colors cursor-pointer block"
                            title="انقر لتعديل بيانات العضو والصلاحيات"
                          >
                            <h4 className="font-extrabold text-[#202923] group-hover:text-amber-800 transition-colors leading-snug flex items-center gap-1.5">
                              <span>{member.name}</span>
                              <Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-100 text-amber-700 transition-opacity" />
                            </h4>
                          </button>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#526257]">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3 text-[#526257]" />
                              <span>{member.email}</span>
                            </span>
                            {member.phone && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1 font-mono">
                                  <Phone className="w-3 h-3 text-[#526257]" />
                                  <span>{member.phone}</span>
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role Badge */}
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${roleConfig.badgeClass}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${roleConfig.dotClass}`} />
                        <span>{roleConfig.label}</span>
                      </span>
                    </td>

                    {/* Active Projects Count */}
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#EFEEE8] text-[#202923] font-extrabold text-xs">
                        <Building2 className="w-3.5 h-3.5 text-[#526257]" />
                        <span>{member.projectsCount} مشاريع</span>
                      </span>
                    </td>

                    {/* Status Badge with quick click-to-toggle */}
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(member.id)}
                        title="انقر لتغيير الحالة"
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                          isStatusActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            : isStatusLeave
                            ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                            : "bg-[#EFEEE8] text-[#526257] border-[#E5E6DF] hover:bg-[#E5E6DF]"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isStatusActive
                              ? "bg-emerald-500 animate-pulse"
                              : isStatusLeave
                              ? "bg-amber-500"
                              : "bg-[#526257]"
                          }`}
                        />
                        <span>{member.status}</span>
                      </button>
                    </td>

                    {/* Actions: Edit, Toggle, Delete */}
                    <td className="py-4 px-5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Edit Action Icon */}
                        <button
                          onClick={() => handleOpenEditModal(member)}
                          className="p-1.5 rounded-lg text-[#526257] hover:text-[#202923] hover:bg-[#EFEEE8] transition-colors cursor-pointer"
                          title="تعديل بيانات العضو"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {/* Power Toggle Action Icon */}
                        <button
                          onClick={() => handleToggleStatus(member.id)}
                          className="p-1.5 rounded-lg text-[#526257] hover:text-[#202923] hover:bg-[#EFEEE8] transition-colors cursor-pointer"
                          title="تبديل حالة النشاط"
                        >
                          <Power className="w-4 h-4" />
                        </button>

                        {/* Delete Action Icon */}
                        <button
                          onClick={() => handleDeleteMember(member.id, member.name)}
                          className="p-1.5 rounded-lg text-[#526257] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="حذف العضو"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-[#526257]">
                    <Users className="w-8 h-8 mx-auto mb-2 text-[#C5A36B]" />
                    <p className="font-bold text-[#526257]">لم يتم العثور على أي أعضاء مطابقة للبحث</p>
                    <p className="text-xs text-[#526257] mt-1">
                      جرّب تعديل كلمة البحث أو الضغط على "+ إضافة عضو جديد"
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 bg-[#F5F3ED] border-t border-[#E5E6DF]/60 flex items-center justify-between text-xs text-[#526257]">
          <span>
            عرض <strong className="text-[#202923]">{filteredMembers.length}</strong> من أصل{" "}
            <strong className="text-[#202923]">{teamMembers.length}</strong> عضو
          </span>
          <span className="text-[11px] text-[#526257]">
            * اضغط على اسم الموظف أو أيقونة التعديل لضبط الصلاحيات المخصصة له.
          </span>
        </div>
      </div>

      {/* Add / Edit Glassmorphic Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#202923]/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-2xl border border-[#E5E6DF] max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 text-right animate-in zoom-in-95 duration-200">
            {/* Dynamic Modal Header (Requirement 1) */}
            <div className="flex items-center justify-between pb-4 border-b border-[#EFEEE8]">
              <h3 className="text-lg font-black text-[#202923] flex items-center gap-2">
                {editingMember ? (
                  <>
                    <Edit3 className="w-5 h-5 text-[#202923]" />
                    <span>تعديل بيانات {editingMember.name}</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 text-[#202923]" />
                    <span>إضافة عضو جديد لفريق العمل</span>
                  </>
                )}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-1.5 rounded-lg text-[#526257] hover:text-[#202923] hover:bg-[#EFEEE8] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4 mt-4">
              {/* Field 1: Name */}
              <div>
                <label className="block text-xs font-bold text-[#526257] mb-1.5">
                  اسم الموظف / المهندس <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: م. مصطفى إبراهيم"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E6DF] text-xs md:text-sm font-semibold text-[#202923] placeholder-[#526257]/50 focus:outline-none focus:ring-1 focus:ring-[#183C35] focus:border-[#183C35] transition-all"
                />
              </div>

              {/* Field 2: Role Select with Smart Defaults */}
              <div>
                <label className="block text-xs font-bold text-[#526257] mb-1.5">
                  الصلاحية ونطاق الدور <span className="text-rose-500">*</span>
                </label>
                <select
                  value={newRole}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E6DF] text-xs md:text-sm font-bold text-[#202923] bg-white focus:outline-none focus:ring-1 focus:ring-[#183C35] focus:border-[#183C35] transition-all cursor-pointer"
                >
                  <option value="مهندس موقع">مهندس موقع (Site Engineer)</option>
                  <option value="مكتب فني">مكتب فني (Technical Office)</option>
                  <option value="مدير">مدير تنفيذي (Admin)</option>
                </select>
                <p className="text-[11px] text-[#526257] mt-1">
                  تغيير الدور يضبط الصلاحيات أدناه تلقائياً بناءً على إعدادات الأمان الافتراضية.
                </p>
              </div>

              {/* Requirement 2: Permissions Assignment Matrix (توزيع الصلاحيات التفصيلية) */}
              <div className="bg-[#F5F3ED] rounded-lg border border-[#E5E6DF] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-[#202923]" />
                    <span className="text-xs font-bold text-[#202923]">
                      الصلاحيات التفصيلية (Detailed Permissions)
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#EFEEE8] text-[#202923] border border-[#E5E6DF]">
                    مصفوفة الوصول
                  </span>
                </div>

                <div className="space-y-2 pt-1">
                  {/* Permission A: View Costs & Profits */}
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-[#E5E6DF] shadow-2xs">
                    <div>
                      <p className="text-xs font-bold text-[#202923]">
                        الاطلاع على التكاليف والأرباح
                      </p>
                      <p className="text-[10px] text-[#526257]">
                        رؤية هوامش الربح الإجمالية وأسعار التكلفة بالمقايسات
                      </p>
                    </div>
                    {/* iOS-Style Toggle Switch (Dir LTR ensures flawless switch sliding) */}
                    <button
                      type="button"
                      dir="ltr"
                      role="switch"
                      aria-checked={permissions.viewFinances}
                      onClick={() => handleTogglePermission("viewFinances")}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        permissions.viewFinances ? "bg-[#183C35]" : "bg-[#E5E6DF]"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                          permissions.viewFinances ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Permission B: Edit BOQs */}
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-[#E5E6DF] shadow-2xs">
                    <div>
                      <p className="text-xs font-bold text-[#202923]">
                        تعديل وإضافة المقايسات
                      </p>
                      <p className="text-[10px] text-[#526257]">
                        إنشاء بنود تسعير جديدة وتعديل بنود المقايسات التقديرية
                      </p>
                    </div>
                    <button
                      type="button"
                      dir="ltr"
                      role="switch"
                      aria-checked={permissions.editBOQ}
                      onClick={() => handleTogglePermission("editBOQ")}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        permissions.editBOQ ? "bg-[#183C35]" : "bg-[#E5E6DF]"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                          permissions.editBOQ ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Permission C: Approve Site Reports */}
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-[#E5E6DF] shadow-2xs">
                    <div>
                      <p className="text-xs font-bold text-[#202923]">
                        اعتماد تقارير الموقع
                      </p>
                      <p className="text-[10px] text-[#526257]">
                        الموافقة الرسمية على يوميات التنفيذ وتوثيق مراحل العمل
                      </p>
                    </div>
                    <button
                      type="button"
                      dir="ltr"
                      role="switch"
                      aria-checked={permissions.approveReports}
                      onClick={() => handleTogglePermission("approveReports")}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        permissions.approveReports ? "bg-[#183C35]" : "bg-[#E5E6DF]"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                          permissions.approveReports ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Permission D: Request Petty Cash */}
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-[#E5E6DF] shadow-2xs">
                    <div>
                      <p className="text-xs font-bold text-[#202923]">
                        طلب وتسوية عهدة مالية
                      </p>
                      <p className="text-[10px] text-[#526257]">
                        صرف النثريات الطارئة ورفع إيصالات المصروفات النقدية
                      </p>
                    </div>
                    <button
                      type="button"
                      dir="ltr"
                      role="switch"
                      aria-checked={permissions.pettyCash}
                      onClick={() => handleTogglePermission("pettyCash")}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        permissions.pettyCash ? "bg-[#183C35]" : "bg-[#E5E6DF]"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                          permissions.pettyCash ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Field 3: Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#526257] mb-1.5">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    placeholder="name@miyar.eg"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-[#E5E6DF] text-xs font-semibold text-[#202923] focus:outline-none focus:ring-1 focus:ring-[#183C35] focus:border-[#183C35] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#526257] mb-1.5">
                    رقم الجوال
                  </label>
                  <input
                    type="text"
                    placeholder="+20 100 123 4567"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-[#E5E6DF] text-xs font-semibold text-[#202923] focus:outline-none focus:ring-1 focus:ring-[#183C35] focus:border-[#183C35] transition-all"
                  />
                </div>
              </div>

              {/* Field 4: Projects Count */}
              <div>
                <label className="block text-xs font-bold text-[#526257] mb-1.5">
                  عدد المشاريع المسندة
                </label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={newProjectsCount}
                  onChange={(e) => setNewProjectsCount(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-[#E5E6DF] text-xs md:text-sm font-bold text-[#202923] focus:outline-none focus:ring-1 focus:ring-[#183C35] focus:border-[#183C35] transition-all"
                />
              </div>

              {/* Modal Footer: Action Buttons (Requirement 3: Delete User button ONLY when in Edit mode) */}
              <div className="flex items-center justify-between pt-4 border-t border-[#EFEEE8]">
                {/* Delete User Button at bottom left (in RTL, left is visually start/end opposite side) */}
                {editingMember ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteMember(editingMember.id, editingMember.name)}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>حذف المستخدم</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2.5 rounded-lg text-xs font-bold text-[#526257] hover:bg-[#EFEEE8] transition-colors cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#183C35] hover:bg-[#202923] text-white hover:bg-[#202923] transition-colors font-bold text-xs md:text-sm shadow-sm transition-colors cursor-pointer"
                  >
                    {editingMember ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>حفظ التعديلات</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>حفظ وإضافة</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default TeamManagement;
