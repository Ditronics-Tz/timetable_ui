import React, { useState } from 'react';
import { Upload, Users, Building, Hash } from 'lucide-react';
import '../styles/AddRoom.css';

const AddRooms = () => {
  const [roomData, setRoomData] = useState({
    room_name: '',
    room_description: '',
    room_type: '',
    capacity: '',
    building_name: '',
    room_no: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(roomData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoomData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "text/csv") {
      // Handle CSV file upload
      console.log("CSV file selected:", file);
    } else {
      alert("Please upload a valid CSV file");
    }
  };

  return (
    <div className="add-room-container">
      <h1>Add New Room</h1>
      <p>Enter the room details below or use bulk upload.</p>
      
      <div className="upload-section">
        <Upload className="upload-icon" size={24} />
        <input
          type="file"
          accept=".csv"
          id="csvFile"
          onChange={handleFileUpload}
          className="file-input"
        />
        <label htmlFor="csvFile" className="file-label">
          Choose CSV File
        </label>
        <p>Upload multiple rooms using a CSV file</p>
        <a href="#" className="template-link">Download CSV Template</a>
      </div>

      <div className="separator">
        <span>OR ADD SINGLE ROOM</span>
      </div>

      <form className="add-room-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Room Name</label>
          <input
            type="text"
            name="room_name"
            value={roomData.room_name}
            onChange={handleChange}
            placeholder="Enter room name"
          />
        </div>

        <div className="form-group">
          <label>Room Type</label>
          <select
            name="room_type"
            value={roomData.room_type}
            onChange={handleChange}
          >
            <option value="">Lecture Hall</option>
            <option value="lecture">Lecture Hall</option>
            <option value="lab">Laboratory</option>
            <option value="conference">Conference Room</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Room Description</label>
          <textarea
            name="room_description"
            value={roomData.room_description}
            onChange={handleChange}
            placeholder="Enter room description"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>
              <Users size={16} className="input-icon" />
              Capacity
            </label>
            <input
              type="number"
              name="capacity"
              value={roomData.capacity}
              onChange={handleChange}
              placeholder="0"
            />
          </div>

          <div className="form-group">
            <label>
              <Building size={16} className="input-icon" />
              Building Name
            </label>
            <input
              type="text"
              name="building_name"
              value={roomData.building_name}
              onChange={handleChange}
              placeholder="Enter building name"
            />
          </div>
        </div>

        <div className="form-group">
          <label>
            <Hash size={16} className="input-icon" />
            Room Number
          </label>
          <input
            type="text"
            name="room_no"
            value={roomData.room_no}
            onChange={handleChange}
            placeholder="Enter room number"
          />
        </div>

        <button type="submit" className="submit-button">
          Add Room
        </button>
      </form>
    </div>
  );
};

export default AddRooms;
