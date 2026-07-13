import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Calendar,
  Settings,
  Users,
  BookOpen,
  Building,
  FileSpreadsheet,
  UserCog,
  LogOut,
  PanelLeftClose,
  PanelLeft,
  Menu,
  X,
} from "lucide-react";
import { getCurrentUser, isAdmin } from "../lib/auth";
import authService from "../services/Authservice";

function NavDropdown({ label, icon: Icon, base, expanded, setExpanded, activePage, items, collapsed }) {
  const open = expanded && !collapsed;
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
  mobileOpen = false,
  onCloseMobile,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const activePage = location.pathname.replace(/^\//, "");
  const user = getCurrentUser();
  const admin = isAdmin();

  const [isRoomsExpanded, setIsRoomsExpanded] = useState(false);
  const [isModulesExpanded, setIsModulesExpanded] = useState(false);
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

  return (
    <aside className="app-sidebar" aria-label="Main navigation">
      <div className="sidebar-brand">
        <UserCog size={22} className="text-white shrink-0" aria-hidden />
        <div className="brand-text min-w-0">
          <h2>{admin ? "ADMIN" : "USER"}</h2>
          <div className="brand-meta" title={displayName}>
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
          <span className="label">Dashboard</span>
        </Link>

        {admin && (
          <>
            <Link
              to="/timetable"
              className={`sidebar-item ${activePage === "timetable" ? "is-active" : ""}`}
            >
              <Calendar size={20} aria-hidden />
              <span className="label">Timetable</span>
            </Link>

            <Link
              to="/preview"
              className={`sidebar-item ${activePage === "preview" ? "is-active" : ""}`}
            >
              <FileSpreadsheet size={20} aria-hidden />
              <span className="label">Preview</span>
            </Link>

            <NavDropdown
              label="Rooms"
              icon={Building2}
              base="rooms"
              expanded={isRoomsExpanded}
              setExpanded={setIsRoomsExpanded}
              activePage={activePage}
              collapsed={collapsed}
              items={[
                { to: "/rooms/add", label: "Add Rooms" },
                { to: "/rooms/view", label: "View Rooms" },
                { to: "/rooms/manage", label: "Manage Rooms" },
              ]}
            />

            <NavDropdown
              label="Classes"
              icon={Users}
              base="classes"
              expanded={isClassesExpanded}
              setExpanded={setIsClassesExpanded}
              activePage={activePage}
              collapsed={collapsed}
              items={[
                { to: "/classes/add", label: "Add Class" },
                { to: "/classes/view", label: "View Classes" },
                { to: "/classes/manage", label: "Manage Classes" },
              ]}
            />

            <NavDropdown
              label="Modules"
              icon={BookOpen}
              base="modules"
              expanded={isModulesExpanded}
              setExpanded={setIsModulesExpanded}
              activePage={activePage}
              collapsed={collapsed}
              items={[
                { to: "/modules/add", label: "Add Module" },
                { to: "/modules/view", label: "View Modules" },
                { to: "/modules/manage", label: "Manage Modules" },
              ]}
            />

            <NavDropdown
              label="Staff"
              icon={Users}
              base="staff"
              expanded={isStaffExpanded}
              setExpanded={setIsStaffExpanded}
              activePage={activePage}
              collapsed={collapsed}
              items={[
                { to: "/staff/add", label: "Add Staff" },
                { to: "/staff/view", label: "View Staff" },
                { to: "/staff/manage", label: "Manage Staff" },
              ]}
            />

            <NavDropdown
              label="Programs"
              icon={Building}
              base="programs"
              expanded={isProgramsExpanded}
              setExpanded={setIsProgramsExpanded}
              activePage={activePage}
              collapsed={collapsed}
              items={[
                { to: "/programs/add", label: "Add Program" },
                { to: "/programs/view", label: "View Programs" },
                { to: "/programs/manage", label: "Manage Programs" },
              ]}
            />

            <NavDropdown
              label="Departments"
              icon={Building2}
              base="departments"
              expanded={isDepartmentsExpanded}
              setExpanded={setIsDepartmentsExpanded}
              activePage={activePage}
              collapsed={collapsed}
              items={[
                { to: "/departments/add", label: "Add Department" },
                { to: "/departments/view", label: "View Departments" },
                { to: "/departments/manage", label: "Manage Departments" },
              ]}
            />

            <NavDropdown
              label="Allocations"
              icon={BookOpen}
              base="allocations"
              expanded={isModuleAllocationExpanded}
              setExpanded={setIsModuleAllocationExpanded}
              activePage={activePage}
              collapsed={collapsed}
              items={[
                { to: "/allocations/module", label: "Module Allocation" },
                { to: "/allocations/view", label: "View Allocations" },
              ]}
            />
          </>
        )}

        <Link
          to="/settings"
          className={`sidebar-item ${activePage === "settings" ? "is-active" : ""}`}
        >
          <Settings size={20} aria-hidden />
          <span className="label">Settings</span>
        </Link>
      </nav>

      <div className="sidebar-footer">
        <button
          type="button"
          className="sidebar-item sidebar-collapse-btn"
          onClick={onToggleCollapse}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeft size={20} /> : <PanelLeftClose size={20} />}
          <span className="label">{collapsed ? "Expand" : "Collapse"}</span>
        </button>
        <button type="button" className="sidebar-item" onClick={handleLogout}>
          <LogOut size={20} aria-hidden />
          <span className="label">Logout</span>
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
