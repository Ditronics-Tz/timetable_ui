import React, { useState } from 'react';
import '../styles/Navbar.css';
import userGearIcon from '../assets/user-gear.png';
import dashboardIcon from '../assets/dashboard.png';
import timetableIcon from '../assets/timetable.png';
import departmentIcon from '../assets/department.png';
import coursesIcon from '../assets/courses.png';
import roomsIcon from '../assets/rooms.png';
import modulesIcon from '../assets/modules.png';
import allocationIcon from '../assets/allocation.png';
import staffIcon from '../assets/staff.png';
import settingsIcon from '../assets/settings.png';
import previewIcon from '../assets/preview.png';
import moduleAllocationIcon from '../assets/allocation.png';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, // For dashboard icon
  Building2, // For rooms
  Calendar, // For schedule
  Settings, // For settings
  LogOut, // For logout
  GraduationCap, // Add this import for classes icon
  Folders
} from 'lucide-react';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const activePage = location.pathname.substring(1);

  // Add state for expanded menus
  const [isRoomsExpanded, setIsRoomsExpanded] = useState(false);
  const [isModulesExpanded, setIsModulesExpanded] = useState(false);
  const [isCoursesExpanded, setIsCoursesExpanded] = useState(false);
  const [isDepartmentsExpanded, setIsDepartmentsExpanded] = useState(false);
  const [isStaffExpanded, setIsStaffExpanded] = useState(false);
  const [isModuleAllocationExpanded, setIsModuleAllocationExpanded] = useState(false);
  const [isClassesExpanded, setIsClassesExpanded] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="sidebar">
      <div className="logo-section">
        <div className="logo-circle">
          <img src={userGearIcon} alt="Admin" className="admin-icon" />
        </div>
        <h2>ADMIN</h2>
      </div>
      
      <nav className="nav-menu">
        <button 
          onClick={() => handleNavigation('/dashboard')} 
          className={`nav-item ${activePage === 'dashboard' ? 'active' : ''}`}
        >
          <LayoutDashboard className="nav-icon" size={20} />
          <span>Dashboard</span>
        </button>
        
        <a 
          href="/timetable" 
          className={`nav-item ${activePage === 'timetable' ? 'active' : ''}`}
        >
          <img src={timetableIcon} alt="Timetable" className="nav-icon" />
          <span>Timetable</span>
        </a>
        
        <Link 
          to="/preview" 
          className={`nav-item ${activePage === 'preview' ? 'active' : ''}`}
          onClick={() => handleNavigation('/preview')}
        >
          <img src={previewIcon} alt="Preview" className="nav-icon" />
          <span>Preview</span>
        </Link>
        
        <div className={`nav-item-dropdown ${isRoomsExpanded ? 'expanded' : ''}`}>
          <div 
            className={`nav-item ${activePage.startsWith('rooms') ? 'active' : ''}`}
            onClick={() => setIsRoomsExpanded(!isRoomsExpanded)}
          >
            <img src={roomsIcon} alt="Rooms" className="nav-icon" />
            <span>Rooms</span>
            <span className={`dropdown-arrow ${isRoomsExpanded ? 'expanded' : ''}`}>▼</span>
          </div>
          
          <div className="dropdown-menu">
            <Link 
              to="/rooms/add" 
              className={`dropdown-item ${activePage === 'rooms/add' ? 'active' : ''}`}
              onClick={() => handleNavigation('/rooms/add')}
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
            <img src={modulesIcon} alt="Modules" className="nav-icon" />
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
            <img src={coursesIcon} alt="Courses" className="nav-icon" />
            <span>Courses</span>
            <span className={`dropdown-arrow ${isCoursesExpanded ? 'expanded' : ''}`}>▼</span>
          </div>
          
          <div className="dropdown-menu">
            <a 
              href="/courses/add" 
              className={`dropdown-item ${activePage === 'courses/add' ? 'active' : ''}`}
            >
              Add Course
            </a>
            <a 
              href="/courses/view" 
              className={`dropdown-item ${activePage === 'courses/view' ? 'active' : ''}`}
            >
              View Courses
            </a>
            <a 
              href="/courses/manage" 
              className={`dropdown-item ${activePage === 'courses/manage' ? 'active' : ''}`}
            >
              Manage Courses
            </a>
          </div>
        </div>

        <div className={`nav-item-dropdown ${isDepartmentsExpanded ? 'expanded' : ''}`}>
          <div 
            className={`nav-item ${activePage.startsWith('departments') ? 'active' : ''}`}
            onClick={() => setIsDepartmentsExpanded(!isDepartmentsExpanded)}
          >
            <img src={departmentIcon} alt="Departments" className="nav-icon" />
            <span>Departments</span>
            <span className={`dropdown-arrow ${isDepartmentsExpanded ? 'expanded' : ''}`}>▼</span>
          </div>
          
          <div className="dropdown-menu">
            <a 
              href="/departments/add" 
              className={`dropdown-item ${activePage === 'departments/add' ? 'active' : ''}`}
            >
              Add Department
            </a>
            <a 
              href="/departments/view" 
              className={`dropdown-item ${activePage === 'departments/view' ? 'active' : ''}`}
            >
              View Departments
            </a>
            <a 
              href="/departments/manage" 
              className={`dropdown-item ${activePage === 'departments/manage' ? 'active' : ''}`}
            >
              Manage Departments
            </a>
          </div>
        </div>

        <div className={`nav-item-dropdown ${isStaffExpanded ? 'expanded' : ''}`}>
          <div 
            className={`nav-item ${activePage.startsWith('staff') ? 'active' : ''}`}
            onClick={() => setIsStaffExpanded(!isStaffExpanded)}
          >
            <img src={staffIcon} alt="Staff" className="nav-icon" />
            <span>Staff</span>
            <span className={`dropdown-arrow ${isStaffExpanded ? 'expanded' : ''}`}>▼</span>
          </div>
          
          <div className="dropdown-menu">
            <a 
              href="/staff/add" 
              className={`dropdown-item ${activePage === 'staff/add' ? 'active' : ''}`}
            >
              Add Staff
            </a>
            <a 
              href="/staff/view" 
              className={`dropdown-item ${activePage === 'staff/view' ? 'active' : ''}`}
            >
              View Staff
            </a>
            <a 
              href="/staff/manage" 
              className={`dropdown-item ${activePage === 'staff/manage' ? 'active' : ''}`}
            >
              Manage Staff
            </a>
          </div>
        </div>

        <div className={`nav-item-dropdown ${isModuleAllocationExpanded ? 'expanded' : ''}`}>
          <div 
            className={`nav-item ${activePage.startsWith('module-allocation') ? 'active' : ''}`}
            onClick={() => setIsModuleAllocationExpanded(!isModuleAllocationExpanded)}
          >
            <img src={moduleAllocationIcon} alt="Module Allocation" className="nav-icon" />
            <span>Module Allocation</span>
            <span className={`dropdown-arrow ${isModuleAllocationExpanded ? 'expanded' : ''}`}>▼</span>
          </div>
          
          <div className="dropdown-menu">
            <Link 
              to="/module-allocation/add" 
              className={`dropdown-item ${activePage === 'module-allocation/add' ? 'active' : ''}`}
            >
              Add Module Allocation
            </Link>
            <Link 
              to="/module-allocation/view" 
              className={`dropdown-item ${activePage === 'module-allocation/view' ? 'active' : ''}`}
            >
              View Module Allocations
            </Link>
            <Link 
              to="/module-allocation/manage" 
              className={`dropdown-item ${activePage === 'module-allocation/manage' ? 'active' : ''}`}
            >
              Manage Module Allocations
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;