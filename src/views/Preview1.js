import React from 'react';
import '../styles/Preview1.css';
import Navbar from '../components/Navbar';

function Preview1() {
  return (
    <div className="app-container">
      <Navbar />
      <div className="preview-container">
        <div className="header">
          <h1>SACAS TIMETABLE GENERATOR</h1>
          <button className="generate-btn">Generate Timetable</button>
        </div>

        <div className="stats-container">
          <div className="stat-box">
            <h3>DEPARTMENTS</h3>
            <div className="stat-number">8</div>
          </div>
          <div className="stat-box">
            <h3>FACULTIES</h3>
            <div className="stat-number">4</div>
          </div>
          <div className="stat-box">
            <h3>PROGRAMS</h3>
            <div className="stat-number">3</div>
          </div>
        </div>

        <div className="control-panel">
          <h2>TIMETABLE GENERATOR CONTROL</h2>
          <div className="controls">
            <div className="control-group">
              <label>Academic Year</label>
              <select defaultValue="2023/2024">
                <option value="2023/2024">2023/2024</option>
              </select>
            </div>
            <div className="control-group">
              <label>Semester</label>
              <select defaultValue="01">
                <option value="01">01</option>
              </select>
            </div>
            <div className="control-group">
              <label>Timetable Type</label>
              <select defaultValue="regular">
                <option value="regular">Regular Class</option>
              </select>
            </div>
          </div>
        </div>

        <div className="timetable-section">
          <h2>TIMETABLE PREVIEW</h2>
          <div className="timetable">
            <table>
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
                {/* Add time slots from 07:00 to 21:00 */}
                {/* This is a sample row */}
                <tr>
                  <td>07:00 - 08:00</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                {/* Add more rows as needed */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Preview1; 