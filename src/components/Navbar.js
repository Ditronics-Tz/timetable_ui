import React, { useState } from "react";
import "../styles/Navbar.css";
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
} from "lucide-react";
import { getCurrentUser, isAdmin } from "../lib/auth";
import authService from "../services/Authservice";

function NavDropdown({ label, icon: Icon, base, expanded, setExpanded, activePage, items }) {
  return (
    <div className={`nav-item-dropdown ${expanded ? "expanded" : ""}`}>
      <div
        className={`nav-item ${activePage.startsWith(base) ? "active" : ""}`}
        onClick={() => setExpanded(!expanded)}
      >
        <Icon className="nav-icon" size={20} />
        <span>{label}</span>
        <span className={`dropdown-arrow ${expanded ? "expanded" : ""}`}>▼</span>
      </div>
      <div className="dropdown-menu">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`dropdown-item ${activePage === item.to.replace(/^\//, "") ? "active" : ""}`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const activePage = location.pathname.substring(1);
  const user = getCurrentUser();
  const admin = isAdmin();

  const [isRoomsExpanded, setIsRoomsExpanded] = useState(false);
  const [isModulesExpanded, setIsModulesExpanded] = useState(false);
  const [isDepartmentsExpanded, setIsDepartmentsExpanded] = useState(false);
  const [isStaffExpanded, setIsStaffExpanded] = useState(false);
  const [isModuleAllocationExpanded, setIsModuleAllocationExpanded] = useState(false);
  const [isClassesExpanded, setIsClassesExpanded] = useState(false);
  const [isProgramsExpanded, setIsProgramsExpanded] = useState(false);

  const handleLogout = async () => {
    await authService.logout();
    navigate("/login");
  };

  const displayName =
    user?.first_name || user?.email
      ? `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || user.email
      : "User";

  return (
    <div className="sidebar">
      <div className="logo-section">
        <div className="logo-circle">
          <UserCog size={24} className="admin-icon" />
        </div>
        <h2>{admin ? "ADMIN" : "USER"}</h2>
        <p className="text-xs text-gray-400 px-2 truncate" title={displayName}>
          {displayName}
        </p>
      </div>

      <nav className="nav-menu">
        <Link
          to="/dashboard"
          className={`nav-item ${activePage === "dashboard" ? "active" : ""}`}
        >
          <LayoutDashboard className="nav-icon" size={20} />
          <span>Dashboard</span>
        </Link>

        {admin && (
          <>
            <Link
              to="/timetable"
              className={`nav-item ${activePage === "timetable" ? "active" : ""}`}
            >
              <Calendar className="nav-icon" size={20} />
              <span>Timetable</span>
            </Link>

            <Link
              to="/preview"
              className={`nav-item ${activePage === "preview" ? "active" : ""}`}
            >
              <FileSpreadsheet className="nav-icon" size={20} />
              <span>Preview</span>
            </Link>

            <NavDropdown
              label="Rooms"
              icon={Building2}
              base="rooms"
              expanded={isRoomsExpanded}
              setExpanded={setIsRoomsExpanded}
              activePage={activePage}
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
              items={[
                { to: "/allocations/module", label: "Module Allocation" },
                { to: "/allocations/view", label: "View Allocations" },
              ]}
            />
          </>
        )}

        <Link
          to="/settings"
          className={`nav-item ${activePage === "settings" ? "active" : ""}`}
        >
          <Settings className="nav-icon" size={20} />
          <span>Settings</span>
        </Link>

        <button type="button" className="nav-item logout-btn" onClick={handleLogout}>
          <LogOut className="nav-icon" size={20} />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
}

export default Navbar;
