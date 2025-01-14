import React, { useState, useEffect } from 'react';
import '../styles/Preview1.css';
import searchIcon from '../assets/search.png';
import downloadIcon from '../assets/download.png';
import { StatsCard } from '../components/stats-card';

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
  
  // Selected values
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedType, setSelectedType] = useState('');
  
  // Department state
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');

  useEffect(() => {
    fetchDropdownData();
  }, []);

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
          <StatsCard title="DEPARTMENTS" count={stats.departments} />
          <StatsCard title="FACULTIES" count={stats.faculties} />
          <StatsCard title="PROGRAMS" count={stats.programs} />
        </div>

        <div className="generator-section">
          <h1 className="section-title">TIMETABLE GENERATOR PREVIEW</h1>
          
          <div className="form-row">
            <div className="form-group">
              <label>Academic Year</label>
              <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                <option value="">Select Year</option>
                {academicYears.map(year => (
                  <option key={year.id} value={year.value}>{year.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Semester</label>
              <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)}>
                <option value="">Select Semester</option>
                {semesters.map(semester => (
                  <option key={semester.id} value={semester.value}>{semester.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Department</label>
              <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.value}>{dept.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Timetable Type</label>
              <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                <option value="">Select Type</option>
                {timetableTypes.map(type => (
                  <option key={type.id} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            
            <div className="search-group">
              <input type="text" placeholder="Search Timetable" />
              <button className="search-button">
                <img src={searchIcon} alt="Search" />
              </button>
            </div>
          </div>
        </div>

        <div className="preview-section">
          <div className="preview-header">
            <h2>TIMETABLE PREVIEW</h2>
            <button className="download-button">
              Download Timetable ↓
            </button>
          </div>
          
          <table className="timetable">
            <thead>
              <tr>
                <th>Time</th>
                <th>Monday</th>
                <th>Tuesday</th>
                <th>Wednesday</th>
                <th>Thursday</th>
                <th>Friday</th>
              </tr>
            </thead>
            <tbody>
              {/* Table content */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Preview1; 