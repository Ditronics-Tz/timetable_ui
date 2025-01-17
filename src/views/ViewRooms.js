import React, { useState } from 'react';
import {
  Search, // For search input
  Filter, // For filter dropdown
  Building2, // For total rooms
  CheckCircle2, // For available rooms
  Users, // For total capacity
  Wrench, // For maintenance
  PencilLine, // For edit button
  Trash2, // For delete button
  Plus // For add button
} from 'lucide-react';
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
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search rooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="filter-wrapper">
            <Filter className="filter-icon" size={20} />
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
                    <button className="edit-button">
                      <PencilLine size={16} />
                      Edit
                    </button>
                    <button className="delete-button">
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <Building2 className="stat-icon" size={24} />
            <div className="stat-content">
              <h3>Total Rooms</h3>
              <p>{stats.totalRooms}</p>
            </div>
          </div>
          <div className="stat-card">
            <CheckCircle2 className="stat-icon" size={24} />
            <div className="stat-content">
              <h3>Available Now</h3>
              <p>{stats.availableNow}</p>
            </div>
          </div>
          <div className="stat-card">
            <Users className="stat-icon" size={24} />
            <div className="stat-content">
              <h3>Total Capacity</h3>
              <p>{stats.totalCapacity}</p>
            </div>
          </div>
          <div className="stat-card">
            <Wrench className="stat-icon" size={24} />
            <div className="stat-content">
              <h3>Maintenance</h3>
              <p>{stats.maintenance}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewRooms;
