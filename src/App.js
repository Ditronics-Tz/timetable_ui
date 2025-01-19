import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './views/Dashboard';
import Navbar from './components/Navbar';
import Preview1 from './views/Preview1';
import AddRooms from './views/AddRooms';
import ViewRooms from './views/ViewRooms';
import RoomManagement from './views/ManageRooms';
import AddClass from './views/AddClass';
import ViewClass from './views/ViewClass';
import ManageClass from './views/ManageClass';
import Login from './views/Auth/Login';

function App() {
  return (
    <Router>
      <Routes>
        {/* Login route as the default landing page */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Main app routes */}
        <Route path="/*" element={
          <div className="app">
            <Navbar />
            <div className="main-content">
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/preview" element={<Preview1 />} />
                <Route path="/rooms/add" element={<AddRooms />} />
                <Route path="/rooms/view" element={<ViewRooms />} />
                <Route path="/rooms/manage" element={<RoomManagement />} />
                <Route path="/classes/add" element={<AddClass />} />
                <Route path="/classes/view" element={<ViewClass />} />
                <Route path="/classes/manage" element={<ManageClass />} />
                <Route path="/manage-classes" element={<ManageClass />} />
              </Routes>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
