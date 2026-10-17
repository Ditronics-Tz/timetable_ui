import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Calendar,
  GraduationCap,
  CalendarDays,
  Settings,
  Users,
  BookOpen,
  BookMarked,
  Building,
  FileSpreadsheet,
  UserCog,
  LogOut,
  PanelLeftClose,
  PanelLeft,
  Menu,
  X,
  ClipboardCheck,
  ShieldCheck,
  Activity,
  Sliders,
  FileText,
  Globe,
} from "lucide-react";
import {
  can,
  canAny,
  getCurrentUser,
  getInstitution,
  getRole,
  isAdmin,
  isSupportSession,
} from "../lib/auth";
import { useI18n } from "../lib/i18n";
import authService from "../services/Authservice";

function NavDropdown({
  label,
  icon: Icon,
  base,
  expanded,
  setExpanded,
  activePage,
  items,
  collapsed,
}) {
  const open = expanded && !collapsed;
  if (!items || items.length === 0) return null;
  return (
    <div>
      <button
        type="button"
        className={`sidebar-item ${activePage.startsWith(base) ? "is-active" : ""}`}
        onClick={() => setExpanded(!expanded)}
        aria-expanded={open}
      >
        <Icon size={20} aria-hidden />
        <span className="label">{label}</span>
        <span className={`chevron ${open ? "open" : ""}`} aria-hidden>
          ▼
        </span>
      </button>
      <div className={`dropdown-panel ${open ? "open" : ""}`}>
        {items.map((item) => {
          const path = item.to.replace(/^\//, "");
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`dropdown-link ${activePage === path ? "is-active" : ""}`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Sidebar navigation. Lives inside the grid shell column (not position:fixed alone).
 */
export default function Navbar({
  collapsed = false,
  onToggleCollapse,
  onCloseMobile,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { lang, setLang, t } = useI18n();
  const activePage = location.pathname.replace(/^\//, "");
  const user = getCurrentUser();
  const role = getRole();
  const admin = isAdmin();
  const supportSession = isSupportSession();
  const superAdminPlatformOnly = role === "super_admin" && !supportSession;
  const institution = getInstitution();

  const [isRoomsExpanded, setIsRoomsExpanded] = useState(false);
  const [isModulesExpanded, setIsModulesExpanded] = useState(false);
  const [isSubjectsExpanded, setIsSubjectsExpanded] = useState(false);
  const [isDepartmentsExpanded, setIsDepartmentsExpanded] = useState(false);
  const [isStaffExpanded, setIsStaffExpanded] = useState(false);
  const [isModuleAllocationExpanded, setIsModuleAllocationExpanded] = useState(false);
  const [isClassesExpanded, setIsClassesExpanded] = useState(false);
  const [isProgramsExpanded, setIsProgramsExpanded] = useState(false);

  // Close mobile drawer after navigation
  useEffect(() => {
    onCloseMobile?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleLogout = async () => {
    await authService.logout();
    navigate("/login");
  };

  const displayName =
    user?.first_name || user?.email
      ? `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || user.email
      : "User";

  const orgTitle = superAdminPlatformOnly
    ? "SACAS Platform"
    : institution?.name || (admin ? "ADMIN" : "USER");

  const showWorkspace = !superAdminPlatformOnly;

  return (
    <aside className="app-sidebar" aria-label="Main navigation">
      <div className="sidebar-brand">
        {institution?.logo_url ? (
          <img
            src={institution.logo_url}
            alt={orgTitle}
            className="h-7 w-7 rounded object-cover shrink-0 bg-white/10"
          />
        ) : (
          <UserCog size={22} className="text-white shrink-0" aria-hidden />
        )}
        <div className="brand-text min-w-0">
          <h2 className="truncate" title={orgTitle}>
            {orgTitle}
          </h2>
          <div className="brand-meta truncate" title={`${displayName} (${role || "user"})`}>
            {displayName}
          </div>
        </div>
        <button
          type="button"
          className="ml-auto md:hidden text-white p-1 rounded hover:bg-white/10"
          onClick={onCloseMobile}
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="sidebar-nav">
        <Link
          to="/dashboard"
          className={`sidebar-item ${activePage === "dashboard" ? "is-active" : ""}`}
        >
          <LayoutDashboard size={20} aria-hidden />
          <span className="label">{t("nav.dashboard", "Dashboard")}</span>
        </Link>

        {superAdminPlatformOnly && (
          <>
            <Link
              to="/superadmin/institutions"
              className={`sidebar-item ${activePage === "superadmin/institutions" ? "is-active" : ""}`}
            >
              <Building2 size={20} aria-hidden />
              <span className="label">{t("nav.institutions", "Institutions")}</span>
            </Link>
            <Link
              to="/superadmin/users"
              className={`sidebar-item ${activePage === "superadmin/users" ? "is-active" : ""}`}
            >
              <Users size={20} aria-hidden />
              <span className="label">{t("nav.platformUsers", "Platform Users")}</span>
            </Link>
            <Link
              to="/superadmin/stats"
              className={`sidebar-item ${activePage === "superadmin/stats" ? "is-active" : ""}`}
            >
              <Activity size={20} aria-hidden />
              <span className="label">{t("nav.platformStats", "Platform Stats")}</span>
            </Link>
            <Link
              to="/superadmin/generation-settings"
              className={`sidebar-item ${activePage === "superadmin/generation-settings" ? "is-active" : ""}`}
            >
              <Sliders size={20} aria-hidden />
              <span className="label">{t("nav.generationSettings", "Generation Settings")}</span>
            </Link>
            <Link
              to="/superadmin/audit"
              className={`sidebar-item ${activePage === "superadmin/audit" ? "is-active" : ""}`}
            >
              <FileText size={20} aria-hidden />
              <span className="label">{t("nav.auditLog", "Audit Log")}</span>
            </Link>
          </>
        )}

        {showWorkspace && (
          <>
            {can("timetable:generate") && (
              <Link
                to="/timetable"
                className={`sidebar-item ${activePage === "timetable" ? "is-active" : ""}`}
              >
                <Calendar size={20} aria-hidden />
                <span className="label">{t("nav.timetable", "Timetable")}</span>
              </Link>
            )}

            {can("timetable:read") && (
              <Link
                to="/preview"
                className={`sidebar-item ${activePage === "preview" ? "is-active" : ""}`}
              >
                <FileSpreadsheet size={20} aria-hidden />
                <span className="label">{t("nav.preview", "Preview")}</span>
              </Link>
            )}

            {canAny("timetable:generate", "courses:read") && (
              <Link
                to="/course-preview"
                className={`sidebar-item ${activePage === "course-preview" ? "is-active" : ""}`}
              >
                <GraduationCap size={20} aria-hidden />
                <span className="label">{t("nav.coursePreview", "Course timetable")}</span>
              </Link>
            )}

            {canAny("exams:write", "exams:generate", "exams:approve", "exams:publish") && (
              <Link
                to="/exams"
                className={`sidebar-item ${activePage.startsWith("exams") ? "is-active" : ""}`}
              >
                <ClipboardCheck size={20} aria-hidden />
                <span className="label">{t("nav.exams", "Exams")}</span>
              </Link>
            )}

            {canAny("rooms:write", "rooms:read") && (
              <NavDropdown
                label={t("nav.rooms", "Rooms")}
                icon={Building2}
                base="rooms"
                expanded={isRoomsExpanded}
                setExpanded={setIsRoomsExpanded}
                activePage={activePage}
                collapsed={collapsed}
                items={[
                  ...(can("rooms:write") ? [{ to: "/rooms/add", label: "Add Rooms" }] : []),
                  { to: "/rooms/view", label: "View Rooms" },
                  ...(can("rooms:write") ? [{ to: "/rooms/manage", label: "Manage Rooms" }] : []),
                ]}
              />
            )}

            {canAny("classes:write", "classes:read") && (
              <NavDropdown
                label={t("nav.classes", "Classes")}
                icon={Users}
                base="classes"
                expanded={isClassesExpanded}
                setExpanded={setIsClassesExpanded}
                activePage={activePage}
                collapsed={collapsed}
                items={[
                  ...(can("classes:write") ? [{ to: "/classes/add", label: "Add Class" }] : []),
                  { to: "/classes/view", label: "View Classes" },
                  ...(can("classes:write") ? [{ to: "/classes/manage", label: "Manage Classes" }] : []),
                ]}
              />
            )}

            {canAny("modules:write", "modules:read") && (
              <NavDropdown
                label={t("nav.modules", "Modules")}
                icon={BookOpen}
                base="modules"
                expanded={isModulesExpanded}
                setExpanded={setIsModulesExpanded}
                activePage={activePage}
                collapsed={collapsed}
                items={[
                  ...(can("modules:write") ? [{ to: "/modules/add", label: "Add Module" }] : []),
                  { to: "/modules/view", label: "View Modules" },
                  ...(can("modules:write") ? [{ to: "/modules/manage", label: "Manage Modules" }] : []),
                ]}
              />
            )}

            {canAny("subjects:write", "subjects:read") && (
              <NavDropdown
                label={t("nav.subjects", "Subjects")}
                icon={BookMarked}
                base="subjects"
                expanded={isSubjectsExpanded}
                setExpanded={setIsSubjectsExpanded}
                activePage={activePage}
                collapsed={collapsed}
                items={[
                  ...(can("subjects:write") ? [{ to: "/subjects/add", label: "Add Subject" }] : []),
                  { to: "/subjects/view", label: "View Subjects" },
                  ...(can("subjects:write") ? [{ to: "/subjects/manage", label: "Manage Subjects" }] : []),
                ]}
              />
            )}

            {canAny("staff:write", "staff:read") && (
              <NavDropdown
                label={t("nav.staff", "Staff")}
                icon={Users}
                base="staff"
                expanded={isStaffExpanded}
                setExpanded={setIsStaffExpanded}
                activePage={activePage}
                collapsed={collapsed}
                items={[
                  ...(can("staff:write") ? [{ to: "/staff/add", label: "Add Staff" }] : []),
                  { to: "/staff/view", label: "View Staff" },
                  ...(can("staff:write") ? [{ to: "/staff/manage", label: "Manage Staff" }] : []),
                ]}
              />
            )}

            {canAny("courses:write", "courses:read") && (
              <NavDropdown
                label={t("nav.programs", "Programs")}
                icon={Building}
                base="programs"
                expanded={isProgramsExpanded}
                setExpanded={setIsProgramsExpanded}
                activePage={activePage}
                collapsed={collapsed}
                items={[
                  ...(can("courses:write") ? [{ to: "/programs/add", label: "Add Program" }] : []),
                  { to: "/programs/view", label: "View Programs" },
                  ...(can("courses:write") ? [{ to: "/programs/manage", label: "Manage Programs" }] : []),
                ]}
              />
            )}

            {canAny("faculties:write", "faculties:read") && (
              <NavDropdown
                label={t("nav.departments", "Departments")}
                icon={Building2}
                base="departments"
                expanded={isDepartmentsExpanded}
                setExpanded={setIsDepartmentsExpanded}
                activePage={activePage}
                collapsed={collapsed}
                items={[
                  ...(can("faculties:write") ? [{ to: "/departments/add", label: "Add Department" }] : []),
                  { to: "/departments/view", label: "View Departments" },
                  ...(can("faculties:write") ? [{ to: "/departments/manage", label: "Manage Departments" }] : []),
                ]}
              />
            )}

            {canAny("allocations:write", "allocations:read") && (
              <NavDropdown
                label={t("nav.allocations", "Allocations")}
                icon={BookOpen}
                base="allocations"
                expanded={isModuleAllocationExpanded}
                setExpanded={setIsModuleAllocationExpanded}
                activePage={activePage}
                collapsed={collapsed}
                items={[
                  ...(can("allocations:write")
                    ? [{ to: "/allocations/module", label: "Module Allocation" }]
                    : []),
                  { to: "/allocations/view", label: "View Allocations" },
                ]}
              />
            )}

            {can("members:manage") && (
              <Link
                to="/members/view"
                className={`sidebar-item ${activePage.startsWith("members") ? "is-active" : ""}`}
              >
                <Users size={20} aria-hidden />
                <span className="label">{t("nav.members", "Members")}</span>
              </Link>
            )}

            {can("analytics:institution") && (
              <Link
                to="/analytics"
                className={`sidebar-item ${activePage === "analytics" ? "is-active" : ""}`}
              >
                <FileSpreadsheet size={20} aria-hidden />
                <span className="label">{t("nav.analytics", "Analytics")}</span>
              </Link>
            )}

            {can("institution:manage") && (
              <Link
                to="/institution/settings"
                className={`sidebar-item ${activePage === "institution/settings" ? "is-active" : ""}`}
              >
                <ShieldCheck size={20} aria-hidden />
                <span className="label">
                  {t("nav.institutionSettings", "Institution Settings")}
                </span>
              </Link>
            )}
          </>
        )}

        <Link
          to="/my-schedule"
          className={`sidebar-item ${activePage === "my-schedule" ? "is-active" : ""}`}
        >
          <CalendarDays size={20} aria-hidden />
          <span className="label">My Schedule</span>
        </Link>

        {showWorkspace && can("exams:read_own") && (
          <Link
            to="/my-exams"
            className={`sidebar-item ${activePage === "my-exams" ? "is-active" : ""}`}
          >
            <ClipboardCheck size={20} aria-hidden />
            <span className="label">{t("nav.myExams", "My Exams")}</span>
          </Link>
        )}

        <Link
          to="/settings"
          className={`sidebar-item ${activePage === "settings" ? "is-active" : ""}`}
        >
          <Settings size={20} aria-hidden />
          <span className="label">{t("nav.settings", "Settings")}</span>
        </Link>
      </nav>

      <div className="sidebar-footer">
        <div
          className="flex items-center gap-1 px-3 py-1.5 text-xs text-slate-300"
          role="group"
          aria-label="Language switcher"
        >
          <Globe size={14} aria-hidden />
          {!collapsed && (
            <>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-1.5 py-0.5 rounded ${
                  lang === "en" ? "bg-white/20 text-white font-semibold" : "hover:text-white"
                }`}
                aria-pressed={lang === "en"}
              >
                EN
              </button>
              <span>|</span>
              <button
                type="button"
                onClick={() => setLang("sw")}
                className={`px-1.5 py-0.5 rounded ${
                  lang === "sw" ? "bg-white/20 text-white font-semibold" : "hover:text-white"
                }`}
                aria-pressed={lang === "sw"}
              >
                SW
              </button>
            </>
          )}
        </div>
        <button
          type="button"
          className="sidebar-item sidebar-collapse-btn"
          onClick={onToggleCollapse}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeft size={20} /> : <PanelLeftClose size={20} />}
          <span className="label">
            {collapsed ? t("nav.expand", "Expand") : t("nav.collapse", "Collapse")}
          </span>
        </button>
        <button type="button" className="sidebar-item" onClick={handleLogout}>
          <LogOut size={20} aria-hidden />
          <span className="label">{t("nav.logout", "Logout")}</span>
        </button>
      </div>
    </aside>
  );
}

export function MobileMenuButton({ onClick }) {
  return (
    <button
      type="button"
      className="p-2 rounded-md border border-slate-200 bg-white hover:bg-slate-50"
      onClick={onClick}
      aria-label="Open menu"
    >
      <Menu size={20} />
    </button>
  );
}
