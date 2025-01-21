import React, { useState } from 'react';
import { Card } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
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
      console.log("CSV file selected:", file);
    } else {
      alert("Please upload a valid CSV file");
    }
  };

  const handleDownloadTemplate = (e) => {
    e.preventDefault();
    // Add your download template logic here
    console.log("Downloading template...");
  };

  return (
    <div className="add-room-container">
      <Card className="add-room-card">
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
          <button onClick={handleDownloadTemplate} className="template-link">
            Download CSV Template
          </button>
        </div>

        <div className="separator">
          <span>OR ADD SINGLE ROOM</span>
        </div>

        <form className="add-room-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <Label>Room Name</Label>
            <Input
              type="text"
              name="room_name"
              value={roomData.room_name}
              onChange={handleChange}
              placeholder="Enter room name"
            />
          </div>

          <div className="form-group">
            <Label>Room Type</Label>
            <Select
              name="room_type"
              value={roomData.room_type}
              onValueChange={(value) => handleChange({ target: { name: 'room_type', value }})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select room type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lecture">Lecture Hall</SelectItem>
                <SelectItem value="lab">Laboratory</SelectItem>
                <SelectItem value="conference">Conference Room</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="form-group">
            <Label>Room Description</Label>
            <Input
              type="text"
              name="room_description"
              value={roomData.room_description}
              onChange={handleChange}
              placeholder="Enter room description"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <Label>
                <Users size={16} className="input-icon" />
                Capacity
              </Label>
              <Input
                type="number"
                name="capacity"
                value={roomData.capacity}
                onChange={handleChange}
                placeholder="0"
              />
            </div>

            <div className="form-group">
              <Label>
                <Building size={16} className="input-icon" />
                Building Name
              </Label>
              <Input
                type="text"
                name="building_name"
                value={roomData.building_name}
                onChange={handleChange}
                placeholder="Enter building name"
              />
            </div>
          </div>

          <div className="form-group">
            <Label>
              <Hash size={16} className="input-icon" />
              Room Number
            </Label>
            <Input
              type="text"
              name="room_no"
              value={roomData.room_no}
              onChange={handleChange}
              placeholder="Enter room number"
            />
          </div>

          <Button type="submit" className="submit-button">
            Add Room
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AddRooms;
