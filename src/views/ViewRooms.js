import React, { useState } from 'react';
import '../styles/ViewRoom.css';
import Navbar from '../components/Navbar';

const ViewRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All Types');

  const stats = {
    totalRooms: 0,
    availableNow: 0,
    totalCapacity: 0,
    maintenance: 0
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="view-rooms-container">
        <h1>View Rooms</h1>
        <p className="subtitle">Manage and organize your educational spaces</p>

        <div className="search-section">
          <div className="search-input">
            <input
              type="text"
              placeholder="Search rooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="type-select"
          >
            <option>All Types</option>
            <option>Laboratory</option>
            <option>Computer Lab</option>
            <option>Lecture Hall</option>
          </select>
        </div>

        <div className="room-directory">
          <h2>Room Directory</h2>
          <table>
            <thead>
              <tr>
                <th>Room Name</th>
                <th>Room Type</th>
                <th>Capacity</th>
                <th>Building</th>
                <th>Room No.</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map(room => (
                <tr key={room.id}>
                  <td>{room.room_name}</td>
                  <td><span className="room-type-badge">{room.room_type}</span></td>
                  <td><span className="capacity-badge">{room.capacity}</span></td>
                  <td>{room.building_name}</td>
                  <td>{room.room_no}</td>
                  <td>{room.room_description}</td>
                  <td className="actions">
                    <button className="edit-button">Edit</button>
                    <button className="delete-button">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Rooms</h3>
            <p>{stats.totalRooms}</p>
          </div>
          <div className="stat-card">
            <h3>Available Now</h3>
            <p>{stats.availableNow}</p>
          </div>
          <div className="stat-card">
            <h3>Total Capacity</h3>
            <p>{stats.totalCapacity}</p>
          </div>
          <div className="stat-card">
            <h3>Maintenance</h3>
            <p>{stats.maintenance}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewRooms;
