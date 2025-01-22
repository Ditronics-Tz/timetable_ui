import React, { useState } from 'react';
import '../styles/Navbar.css';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard,
  Building2,
  Calendar,
  Settings,
  GraduationCap,
  Users,
  BookOpen,
  Building,
  ScrollText,
  UserCog,
  FolderKanban,
  School,
  FileSpreadsheet,
  ChevronDown
} from 'lucide-react';

const coursesIcon = GraduationCap;

function Navbar() {
  const location = useLocation();
  const activePage = location.pathname.substring(1);

  const [isRoomsExpanded, setIsRoomsExpanded] = useState(false);
  const [isModulesExpanded, setIsModulesExpanded] = useState(false);
  const [isCoursesExpanded, setIsCoursesExpanded] = useState(false);
  const [isDepartmentsExpanded, setIsDepartmentsExpanded] = useState(false);
  const [isStaffExpanded, setIsStaffExpanded] = useState(false);
  const [isModuleAllocationExpanded, setIsModuleAllocationExpanded] = useState(false);
  const [isClassesExpanded, setIsClassesExpanded] = useState(false);

  return (
    <div className="sidebar">
      <div className="logo-section">
        <div className="logo-circle">
          <UserCog size={24} className="admin-icon" />
        </div>
        <h2>ADMIN</h2>
      </div>
      
      <nav className="nav-menu">
        <Link 
          to="/dashboard" 
          className={`nav-item ${activePage === 'dashboard' ? 'active' : ''}`}
        >
          <LayoutDashboard className="nav-icon" size={20} />
          <span>Dashboard</span>
        </Link>
        
        <Link 
          to="/timetable" 
          className={`nav-item ${activePage === 'timetable' ? 'active' : ''}`}
        >
          <Calendar className="nav-icon" size={20} />
          <span>Timetable</span>
        </Link>
        
        <Link 
          to="/preview" 
          className={`nav-item ${activePage === 'preview' ? 'active' : ''}`}
        >
          <FileSpreadsheet className="nav-icon" size={20} />
          <span>Preview</span>
        </Link>
        
        <div className={`nav-item-dropdown ${isRoomsExpanded ? 'expanded' : ''}`}>
          <div 
            className={`nav-item ${activePage.startsWith('rooms') ? 'active' : ''}`}
            onClick={() => setIsRoomsExpanded(!isRoomsExpanded)}
          >
            <Building2 className="nav-icon" size={20} />
            <span>Rooms</span>
            <span className={`dropdown-arrow ${isRoomsExpanded ? 'expanded' : ''}`}>▼</span>
          </div>
          
          <div className="dropdown-menu">
            <Link 
              to="/rooms/add" 
              className={`dropdown-item ${activePage === 'rooms/add' ? 'active' : ''}`}
            >
              Add Rooms
            </Link>
            <Link 
              to="/rooms/view" 
              className={`dropdown-item ${activePage === 'rooms/view' ? 'active' : ''}`}
            >
              View Rooms
            </Link>
            <Link 
              to="/rooms/manage" 
              className={`dropdown-item ${activePage === 'rooms/manage' ? 'active' : ''}`}
            >
              Manage Rooms
            </Link>
          </div>
        </div>

        <div className={`nav-item-dropdown ${isModulesExpanded ? 'expanded' : ''}`}>
          <div 
            className={`nav-item ${activePage.startsWith('modules') ? 'active' : ''}`}
            onClick={() => setIsModulesExpanded(!isModulesExpanded)}
          >
            <BookOpen className="nav-icon" size={20} />
            <span>Modules</span>
            <span className={`dropdown-arrow ${isModulesExpanded ? 'expanded' : ''}`}>▼</span>
          </div>
          
          <div className="dropdown-menu">
            <Link 
              to="/modules/add" 
              className={`dropdown-item ${activePage === 'modules/add' ? 'active' : ''}`}
            >
              Add Module
            </Link>
            <Link 
              to="/modules/view" 
              className={`dropdown-item ${activePage === 'modules/view' ? 'active' : ''}`}
            >
              View Modules
            </Link>
            <Link 
              to="/modules/manage" 
              className={`dropdown-item ${activePage === 'modules/manage' ? 'active' : ''}`}
            >
              Manage Modules
            </Link>
          </div>
        </div>

        <div className={`nav-item-dropdown ${isCoursesExpanded ? 'expanded' : ''}`}>
          <div 
            className={`nav-item ${activePage.startsWith('courses') ? 'active' : ''}`}
            onClick={() => setIsCoursesExpanded(!isCoursesExpanded)}
          >
            <School className="nav-icon" size={20} />
            <span>Courses</span>
            <span className={`dropdown-arrow ${isCoursesExpanded ? 'expanded' : ''}`}>▼</span>
          </div>
          
          <div className="dropdown-menu">
            <Link 
              to="/courses/add" 
              className={`dropdown-item ${activePage === 'courses/add' ? 'active' : ''}`}
            >
              Add Course
            </Link>
            <Link 
              to="/courses/view" 
              className={`dropdown-item ${activePage === 'courses/view' ? 'active' : ''}`}
            >
              View Courses
            </Link>
            <Link 
              to="/courses/manage" 
              className={`dropdown-item ${activePage === 'courses/manage' ? 'active' : ''}`}
            >
              Manage Courses
            </Link>
          </div>
        </div>

        <div className={`nav-item-dropdown ${isDepartmentsExpanded ? 'expanded' : ''}`}>
          <div 
            className={`nav-item ${activePage.startsWith('departments') ? 'active' : ''}`}
            onClick={() => setIsDepartmentsExpanded(!isDepartmentsExpanded)}
          >
            <Building className="nav-icon" size={20} />
            <span>Departments</span>
            <span className={`dropdown-arrow ${isDepartmentsExpanded ? 'expanded' : ''}`}>▼</span>
          </div>
          
          <div className="dropdown-menu">
            <Link 
              to="/departments/add" 
              className={`dropdown-item ${activePage === 'departments/add' ? 'active' : ''}`}
            >
              Add Department
            </Link>
            <Link 
              to="/departments/view" 
              className={`dropdown-item ${activePage === 'departments/view' ? 'active' : ''}`}
            >
              View Departments
            </Link>
            <Link 
              to="/departments/manage" 
              className={`dropdown-item ${activePage === 'departments/manage' ? 'active' : ''}`}
            >
              Manage Departments
            </Link>
          </div>
        </div>

        <div className={`nav-item-dropdown ${isStaffExpanded ? 'expanded' : ''}`}>
          <div 
            className={`nav-item ${activePage.startsWith('staff') ? 'active' : ''}`}
            onClick={() => setIsStaffExpanded(!isStaffExpanded)}
          >
            <Users className="nav-icon" size={20} />
            <span>Staff</span>
            <span className={`dropdown-arrow ${isStaffExpanded ? 'expanded' : ''}`}>▼</span>
          </div>
          
          <div className="dropdown-menu">
            <Link 
              to="/staff/add" 
              className={`dropdown-item ${activePage === 'staff/add' ? 'active' : ''}`}
            >
              Add Staff
            </Link>
            <Link 
              to="/staff/view" 
              className={`dropdown-item ${activePage === 'staff/view' ? 'active' : ''}`}
            >
              View Staff
            </Link>
            <Link 
              to="/staff/manage" 
              className={`dropdown-item ${activePage === 'staff/manage' ? 'active' : ''}`}
            >
              Manage Staff
            </Link>
          </div>
        </div>

        <div className={`nav-item-dropdown ${isModuleAllocationExpanded ? 'expanded' : ''}`}>
          <div 
            className={`nav-item ${activePage.startsWith('module-allocation') ? 'active' : ''}`}
            onClick={() => setIsModuleAllocationExpanded(!isModuleAllocationExpanded)}
          >
            <FolderKanban className="nav-icon" size={20} />
            <span>Module Allocation</span>
            <span className={`dropdown-arrow ${isModuleAllocationExpanded ? 'expanded' : ''}`}>▼</span>
          </div>
          
          <div className="dropdown-menu">
            <Link 
              to="/module-allocation/add" 
              className={`dropdown-item ${activePage === 'module-allocation/add' ? 'active' : ''}`}
            >
              Add Allocation
            </Link>
            <Link 
              to="/module-allocation/view" 
              className={`dropdown-item ${activePage === 'module-allocation/view' ? 'active' : ''}`}
            >
              View Allocations
            </Link>
            <Link 
              to="/module-allocation/manage" 
              className={`dropdown-item ${activePage === 'module-allocation/manage' ? 'active' : ''}`}
            >
              Manage Allocations
            </Link>
          </div>
        </div>

        <div className={`nav-item-dropdown ${isClassesExpanded ? 'expanded' : ''}`}>
          <div 
            className={`nav-item ${activePage.startsWith('classes') ? 'active' : ''}`}
            onClick={() => setIsClassesExpanded(!isClassesExpanded)}
          >
            <GraduationCap className="nav-icon" size={20} />
            <span>Classes</span>
            <span className={`dropdown-arrow ${isClassesExpanded ? 'expanded' : ''}`}>▼</span>
          </div>
          
          <div className="dropdown-menu">
            <Link 
              to="/classes/add" 
              className={`dropdown-item ${activePage === 'classes/add' ? 'active' : ''}`}
            >
              Add Class
            </Link>
            <Link 
              to="/classes/view" 
              className={`dropdown-item ${activePage === 'classes/view' ? 'active' : ''}`}
            >
              View Classes
            </Link>
            <Link 
              to="/classes/manage" 
              className={`dropdown-item ${activePage === 'classes/manage' ? 'active' : ''}`}
            >
              Manage Classes
            </Link>
          </div>
        </div>

      </nav>

      <div className="settings-section">
        <Link to="/settings" className="nav-item">
          <Settings className="nav-icon" size={20} />
          <span>Settings</span>
        </Link>
      </div>

    </div>
  );
}

export default Navbar;