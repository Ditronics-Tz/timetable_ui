import React from 'react';
import '../styles/Navbar.css';

function Navbar() {
  return (
    <div className="sidebar">
      <div className="logo-section">
        <div className="logo-circle">
          <img src="/admin-icon.png" alt="Admin" />
        </div>
        <h2>ADMIN</h2>
      </div>
      
      <nav className="nav-menu">
        <a href="#" className="nav-item">
          <i className="icon-dashboard"></i>
          <span>Dashboard</span>
        </a>
        <a href="#" className="nav-item active">
          <i className="icon-timetable"></i>
          <span>Timetable</span>
        </a>
        <a href="#" className="nav-item">
          <i className="icon-department"></i>
          <span>Department</span>
        </a>
        <a href="#" className="nav-item">
          <i className="icon-courses"></i>
          <span>Courses</span>
        </a>
        <a href="#" className="nav-item">
          <i className="icon-rooms"></i>
          <span>Rooms</span>
        </a>
        <a href="#" className="nav-item">
          <i className="icon-modules"></i>
          <span>Modules</span>
        </a>
        <a href="#" className="nav-item">
          <i className="icon-allocation"></i>
          <span>Module Allocation</span>
        </a>
        <a href="#" className="nav-item">
          <i className="icon-staff"></i>
          <span>Staff</span>
        </a>
      </nav>

      <div className="settings-section">
        <a href="#" className="nav-item">
          <i className="icon-settings"></i>
          <span>Settings</span>
        </a>
      </div>
    </div>
  );
}

export default Navbar; 