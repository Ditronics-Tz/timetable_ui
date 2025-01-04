import React from 'react';
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

function Navbar() {
  const [activePage, setActivePage] = React.useState(() => {
    const path = window.location.pathname.slice(1);
    return path || 'dashboard';
  });

  const handleNavClick = (page) => {
    setActivePage(page);
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
        <a 
          href="/dashboard" 
          className={`nav-item ${activePage === 'dashboard' ? 'active' : ''}`}
        >
          <img src={dashboardIcon} alt="Dashboard" className="nav-icon" />
          <span>Dashboard</span>
        </a>
        
        <a 
          href="/timetable" 
          className={`nav-item ${activePage === 'timetable' ? 'active' : ''}`}
        >
          <img src={timetableIcon} alt="Timetable" className="nav-icon" />
          <span>Timetable</span>
        </a>
        
        <a 
          href="/preview" 
          className={`nav-item ${activePage === 'preview' ? 'active' : ''}`}
          onClick={() => handleNavClick('preview')}
        >
          <img src={previewIcon} alt="Preview" className="nav-icon" />
          <span>Preview</span>
        </a>
        
        <a href="#" className="nav-item">
          <img src={departmentIcon} alt="Department" className="nav-icon" />
          <span>Department</span>
        </a>
        <a href="#" className="nav-item">
          <img src={coursesIcon} alt="Courses" className="nav-icon" />
          <span>Courses</span>
        </a>
        <a href="#" className="nav-item">
          <img src={roomsIcon} alt="Rooms" className="nav-icon" />
          <span>Rooms</span>
        </a>
        <a href="#" className="nav-item">
          <img src={modulesIcon} alt="Modules" className="nav-icon" />
          <span>Modules</span>
        </a>
        <a href="#" className="nav-item">
          <img src={allocationIcon} alt="Module Allocation" className="nav-icon" />
          <span>Module Allocation</span>
        </a>
        <a href="#" className="nav-item">
          <img src={staffIcon} alt="Staff" className="nav-icon" />
          <span>Staff</span>
        </a>
      </nav>

      <div className="settings-section">
        <a href="#" className="nav-item">
          <img src={settingsIcon} alt="Settings" className="nav-icon" />
          <span>Settings</span>
        </a>
      </div>
    </div>
  );
}

export default Navbar; 