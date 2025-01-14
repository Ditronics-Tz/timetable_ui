import React, { useState } from 'react';
import '../styles/ViewRoom.css';
import searchIcon from '../assets/search.png';
import Navbar from '../components/Navbar';

const ViewRooms = () => {
  // Sample data - replace with actual API call
  const [rooms] = useState([
    {
      id: 1,
      room_name: 'Lab 101',
      room_type: 'Laboratory',
      capacity: 30,
      building_name: 'Engineering Block',
      room_no: '101',
      room_description: 'Computer Laboratory'
    },
    // Add more sample rooms as needed
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.room_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         room.building_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === '' || room.room_type === filterType;
    return matchesSearch && matchesType;
  });

  const handleDelete = (id) => {
    // Handle delete logic
    console.log('Delete room:', id);
  };

  const handleEdit = (id) => {
    // Handle edit logic
    console.log('Edit room:', id);
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="view-rooms-container">
        <div className="header-section">
          <h1>View Rooms</h1>
          <div className="controls">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search rooms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="search-button">
                <img src={searchIcon} alt="Search" />
              </button>
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="">All Types</option>
              <option value="Lecture Hall">Lecture Hall</option>
              <option value="Laboratory">Laboratory</option>
              <option value="Conference Room">Conference Room</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="rooms-table">
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
              {filteredRooms.map(room => (
                <tr key={room.id}>
                  <td>{room.room_name}</td>
                  <td>{room.room_type}</td>
                  <td>{room.capacity}</td>
                  <td>{room.building_name}</td>
                  <td>{room.room_no}</td>
                  <td>{room.room_description}</td>
                  <td className="actions">
                    <button 
                      className="edit-button"
                      onClick={() => handleEdit(room.id)}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-button"
                      onClick={() => handleDelete(room.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewRooms;
