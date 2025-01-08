import React, { useState } from 'react';
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
      
      <div className="upload-section">
        <h2>Bulk Upload Rooms</h2>
        <p>Upload multiple rooms using a CSV file</p>
        <div className="csv-upload">
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
          <a href="#" className="template-link">Download CSV Template</a>
        </div>
      </div>

      <div className="separator">
        <span>Or add room manually</span>
      </div>

      <form className="add-room-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Room Name
            <input
              type="text"
              name="room_name"
              value={roomData.room_name}
              onChange={handleChange}
              placeholder="Enter room name"
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            Room Type
            <select
              name="room_type"
              value={roomData.room_type}
              onChange={handleChange}
            >
              <option value="">Select room type</option>
              <option value="lecture">Lecture Hall</option>
              <option value="lab">Laboratory</option>
              <option value="conference">Conference Room</option>
              <option value="other">Other</option>
            </select>
          </label>
        </div>

        <div className="form-group">
          <label>
            Room Description
            <textarea
              name="room_description"
              value={roomData.room_description}
              onChange={handleChange}
              placeholder="Enter room description"
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            Capacity
            <input
              type="number"
              name="capacity"
              value={roomData.capacity}
              onChange={handleChange}
              placeholder="Enter room capacity"
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            Building Name
            <input
              type="text"
              name="building_name"
              value={roomData.building_name}
              onChange={handleChange}
              placeholder="Enter building name"
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            Room Number
            <input
              type="text"
              name="room_no"
              value={roomData.room_no}
              onChange={handleChange}
              placeholder="Enter room number"
            />
          </label>
        </div>

        <button type="submit" className="submit-button">
          Add Room
        </button>
      </form>
    </div>
  );
};

export default AddRooms;
