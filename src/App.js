import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./views/Dashboard";
import Navbar from "./components/Navbar";
import RequireAuth from "./components/RequireAuth";
import RequireRole from "./components/RequireRole";
import Preview1 from "./views/Preview1";
import AddRooms from "./views/AddRooms";
import ViewRooms from "./views/ViewRooms";
import RoomManagement from "./views/ManageRooms";
import AddClass from "./views/AddClass";
import ViewClass from "./views/ViewClass";
import ManageClass from "./views/ManageClass";
import Login from "./views/Auth/Login";
import Register from "./views/Auth/Register";
import VerifyEmail from "./views/Auth/VerifyEmail";
import ForgotPassword from "./views/Auth/ForgotPassword";
import ResetPassword from "./views/Auth/ResetPassword";
import AddModule from "./views/AddModule";
import ViewModule from "./views/ViewModule";
import ManageModule from "./views/ManageModule";
import ViewStaff from "./views/ViewStaff";
import ManageStaff from "./views/ManageStaff";
import AddStaff from "./views/AddStaff";
import AddProgram from "./views/AddProgram";
import ViewProgram from "./views/ViewProgram";
import ManageProgram from "./views/ManageProgram";
import AddDepartment from "./views/AddDepartment";
import ManageDepartments from "./views/ManageDepartment";
import ViewDepartments from "./views/ViewDepartment";
import ViewAllocations from "./views/ViewAllocations";
import ModuleAllocations from "./views/ModuleAllocations";
import TimetableGenerator from "./views/Timetable";
import SettingsPage from "./views/Settings";

const AdminOnly = ({ children }) => (
  <RequireRole allow={["administrator", "super_admin"]}>{children}</RequireRole>
);

function AppShell() {
  return (
    <RequireAuth>
      <div className="app">
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<SettingsPage />} />

            <Route path="/preview" element={<AdminOnly><Preview1 /></AdminOnly>} />
            <Route path="/timetable" element={<AdminOnly><TimetableGenerator /></AdminOnly>} />

            <Route path="/rooms/add" element={<AdminOnly><AddRooms /></AdminOnly>} />
            <Route path="/rooms/view" element={<AdminOnly><ViewRooms /></AdminOnly>} />
            <Route path="/rooms/manage" element={<AdminOnly><RoomManagement /></AdminOnly>} />

            <Route path="/classes/add" element={<AdminOnly><AddClass /></AdminOnly>} />
            <Route path="/classes/view" element={<AdminOnly><ViewClass /></AdminOnly>} />
            <Route path="/classes/manage" element={<AdminOnly><ManageClass /></AdminOnly>} />
            <Route path="/manage-classes" element={<AdminOnly><ManageClass /></AdminOnly>} />

            <Route path="/modules/add" element={<AdminOnly><AddModule /></AdminOnly>} />
            <Route path="/modules/view" element={<AdminOnly><ViewModule /></AdminOnly>} />
            <Route path="/modules/manage" element={<AdminOnly><ManageModule /></AdminOnly>} />

            <Route path="/staff/view" element={<AdminOnly><ViewStaff /></AdminOnly>} />
            <Route path="/staff/manage" element={<AdminOnly><ManageStaff /></AdminOnly>} />
            <Route path="/staff/add" element={<AdminOnly><AddStaff /></AdminOnly>} />

            <Route path="/programs/add" element={<AdminOnly><AddProgram /></AdminOnly>} />
            <Route path="/programs/view" element={<AdminOnly><ViewProgram /></AdminOnly>} />
            <Route path="/programs/manage" element={<AdminOnly><ManageProgram /></AdminOnly>} />

            <Route path="/departments/add" element={<AdminOnly><AddDepartment /></AdminOnly>} />
            <Route path="/departments/manage" element={<AdminOnly><ManageDepartments /></AdminOnly>} />
            <Route path="/departments/view" element={<AdminOnly><ViewDepartments /></AdminOnly>} />

            <Route path="/allocations/view" element={<AdminOnly><ViewAllocations /></AdminOnly>} />
            <Route path="/allocations/module" element={<AdminOnly><ModuleAllocations /></AdminOnly>} />
          </Routes>
        </div>
      </div>
    </RequireAuth>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/*" element={<AppShell />} />
      </Routes>
    </Router>
  );
}

export default App;
