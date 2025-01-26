import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import Register from './views/Auth/Register';
import AddModule from './views/AddModule';
import ViewModule from './views/ViewModule';
import ManageModule from './views/ManageModule';
import ViewStaff from "./views/ViewStaff"
import ManageStaff from "./views/ManageStaff"
import AddStaff from "./views/AddStaff"
import AddProgram from './views/AddProgram';
import ViewProgram from './views/ViewProgram';
import ManageProgram from './views/ManageProgram';
import AddDepartment from './views/AddDepartment'
import ManageDepartments from './views/ManageDepartment'
import ViewDepartments from './views/ViewDepartment'
import ViewAllocations from "./views/ViewAllocations"
import ModuleAllocations from "./views/ModuleAllocations" 
import TimetableGenerator from "./views/Timetable"

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

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
                <Route path="/modules/add" element={<AddModule />} />
                <Route path="/modules/view" element={<ViewModule />} />
                <Route path="/modules/manage" element={<ManageModule />} />
                <Route path="/staff/view" element={<ViewStaff />} />
                <Route path="/staff/manage" element={<ManageStaff />} />
                <Route path="/staff/add" element={<AddStaff />} />
                <Route path="/programs/add" element={<AddProgram />} />
                <Route path="/programs/view" element={<ViewProgram />} />
                <Route path="/programs/manage" element={<ManageProgram />} />
                <Route path="/departments/add" element={<AddDepartment />} />
                <Route path="/departments/manage" element={<ManageDepartments />} />
                <Route path="/departments/view" element={<ViewDepartments />} />
                <Route path="/allocations/view" element={<ViewAllocations />} />
                <Route path="/allocations/module" element={<ModuleAllocations />} />
                <Route path="/timetable" element={<TimetableGenerator />} />
              </Routes>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
