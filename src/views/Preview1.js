import React, { useState, useEffect } from 'react';
import '../styles/Preview1.css';
import searchIcon from '../assets/search.png';
import downloadIcon from '../assets/download.png';

function Preview1() {
  // State for statistics
  const [stats, setStats] = useState({
    departments: 0,
    faculties: 0,
    programs: 0
  });

  // State for dropdown values
  const [academicYears, setAcademicYears] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [timetableTypes, setTimetableTypes] = useState([]);

  // Selected values state
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedType, setSelectedType] = useState('');

  // Add departments to state
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');

  // Fetch statistics data
  useEffect(() => {
    // Replace with your actual API call
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  // Fetch dropdown options
  useEffect(() => {
    // Replace with your actual API calls
    const fetchDropdownData = async () => {
      try {
        const [yearsRes, semestersRes, typesRes, departmentsRes] = await Promise.all([
          fetch('/api/academic-years'),
          fetch('/api/semesters'),
          fetch('/api/timetable-types'),
          fetch('/api/departments')
        ]);

        const years = await yearsRes.json();
        const semesters = await semestersRes.json();
        const types = await typesRes.json();
        const departments = await departmentsRes.json();

        setAcademicYears(years);
        setSemesters(semesters);
        setTimetableTypes(types);
        setDepartments(departments);
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      }
    };

    fetchDropdownData();
  }, []);

  const handleDownload = () => {
    // Implement download functionality here
    console.log('Downloading timetable...');
  };

  return (
    <div className="app-container">
      <div className="preview-container">
        <div className="header">
          <h1>SACAS TIMETABLE GENERATOR</h1>
        </div>

        <div className="stats-container">
          <div className="stat-box">
            <h3>DEPARTMENTS</h3>
            <div className="stat-number">{stats.departments}</div>
          </div>
          <div className="stat-box">
            <h3>FACULTIES</h3>
            <div className="stat-number">{stats.faculties}</div>
          </div>
          <div className="stat-box">
            <h3>PROGRAMS</h3>
            <div className="stat-number">{stats.programs}</div>
          </div>
        </div>

        <div className="control-panel">
          <h2>TIMETABLE GENERATOR PREVIEW</h2>
          <div className="controls">
            <div className="control-group">
              <label>Academic Year</label>
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option value="">Select Year</option>
                {academicYears.map(year => (
                  <option key={year.id} value={year.value}>
                    {year.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="control-group">
              <label>Semester</label>
              <select 
                value={selectedSemester} 
                onChange={(e) => setSelectedSemester(e.target.value)}
              >
                <option value="">Select Semester</option>
                {semesters.map(semester => (
                  <option key={semester.id} value={semester.value}>
                    {semester.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="control-group">
              <label>Department</label>
              <select 
                value={selectedDepartment} 
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.value}>
                    {dept.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="control-group">
              <label>Timetable Type</label>
              <select 
                value={selectedType} 
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">Select Type</option>
                {timetableTypes.map(type => (
                  <option key={type.id} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="search-button-container">
              <button className="search-button" onClick={() => {/* Add your search logic here */}}>
                <img src={searchIcon} alt="" />
                Search Timetable
              </button>
            </div>
          </div>
        </div>

        <div className="timetable-preview">
          <div className="timetable-header">
            <h2>TIMETABLE PREVIEW</h2>
            <button className="download-btn" onClick={handleDownload}>
              <img src={downloadIcon} alt="" />
              Download Timetable
            </button>
          </div>
          <div className="timetable-days">
            <span>Time</span>
            <span>Monday</span>
            <span>Tuesday</span>
            <span>Wednesday</span>
            <span>Thursday</span>
            <span>Friday</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Preview1; 