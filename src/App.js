import React, { lazy, Suspense } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";
import RequireRole from "./components/RequireRole";
import { ToastProvider } from "./components/Toast";
import Login from "./views/Auth/Login";

const Dashboard = lazy(() => import("./views/Dashboard"));
const Preview1 = lazy(() => import("./views/Preview1"));
const AddRooms = lazy(() => import("./views/AddRooms"));
const ViewRooms = lazy(() => import("./views/ViewRooms"));
const RoomManagement = lazy(() => import("./views/ManageRooms"));
const AddClass = lazy(() => import("./views/AddClass"));
const ViewClass = lazy(() => import("./views/ViewClass"));
const ManageClass = lazy(() => import("./views/ManageClass"));
const Register = lazy(() => import("./views/Auth/Register"));
const RegisterInstitution = lazy(() => import("./views/Auth/RegisterInstitution"));
const VerifyEmail = lazy(() => import("./views/Auth/VerifyEmail"));
const ForgotPassword = lazy(() => import("./views/Auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./views/Auth/ResetPassword"));
const AddModule = lazy(() => import("./views/AddModule"));
const ViewModule = lazy(() => import("./views/ViewModule"));
const ManageModule = lazy(() => import("./views/ManageModule"));
const AddSubject = lazy(() => import("./views/AddSubject"));
const ViewSubjects = lazy(() => import("./views/ViewSubjects"));
const ManageSubjects = lazy(() => import("./views/ManageSubjects"));
const ViewStaff = lazy(() => import("./views/ViewStaff"));
const ManageStaff = lazy(() => import("./views/ManageStaff"));
const AddStaff = lazy(() => import("./views/AddStaff"));
const AddProgram = lazy(() => import("./views/AddProgram"));
const ViewProgram = lazy(() => import("./views/ViewProgram"));
const ManageProgram = lazy(() => import("./views/ManageProgram"));
const AddDepartment = lazy(() => import("./views/AddDepartment"));
const ManageDepartments = lazy(() => import("./views/ManageDepartment"));
const ViewDepartments = lazy(() => import("./views/ViewDepartment"));
const ViewAllocations = lazy(() => import("./views/ViewAllocations"));
const ModuleAllocations = lazy(() => import("./views/ModuleAllocations"));
const TimetableGenerator = lazy(() => import("./views/Timetable"));
const SettingsPage = lazy(() => import("./views/Settings"));
const MySchedule = lazy(() => import("./views/MySchedule"));
const AddMembers = lazy(() => import("./views/AddMembers"));
const ViewMembers = lazy(() => import("./views/ViewMembers"));
const ManageMembers = lazy(() => import("./views/ManageMembers"));
const SuperAdminConsole = lazy(() => import("./views/SuperAdminConsole"));
const AnalyticsDashboard = lazy(() => import("./views/AnalyticsDashboard"));

function RouteLoading() {
  return (
    <main className="min-h-[50vh] p-6" role="status" aria-label="Loading page">
      <div className="mb-6 h-8 w-56 animate-pulse rounded bg-slate-200" />
      <div className="h-40 animate-pulse rounded-lg border bg-slate-100" />
      <span className="sr-only">Loading page…</span>
    </main>
  );
}

const AdminOnly = ({ children }) => (
  <RequireRole allow={["administrator", "super_admin"]}>{children}</RequireRole>
);
const SuperAdminOnly = ({ children }) => (
  <RequireRole allow={["super_admin"]}>{children}</RequireRole>
);

function AppShell() {
  return (
    <RequireAuth>
      <Layout>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/my-schedule" element={<MySchedule />} />
          <Route path="/members/add" element={<AdminOnly><AddMembers /></AdminOnly>} />
          <Route path="/members/view" element={<AdminOnly><ViewMembers /></AdminOnly>} />
          <Route path="/members/manage" element={<AdminOnly><ManageMembers /></AdminOnly>} />
          <Route path="/analytics" element={<AdminOnly><AnalyticsDashboard /></AdminOnly>} />
          <Route path="/superadmin/institutions" element={<SuperAdminOnly><SuperAdminConsole /></SuperAdminOnly>} />
          <Route path="/superadmin/users" element={<SuperAdminOnly><SuperAdminConsole /></SuperAdminOnly>} />
          <Route path="/superadmin/stats" element={<SuperAdminOnly><SuperAdminConsole /></SuperAdminOnly>} />
          <Route path="/superadmin/generation-settings" element={<SuperAdminOnly><SuperAdminConsole /></SuperAdminOnly>} />
          <Route path="/superadmin/audit" element={<SuperAdminOnly><SuperAdminConsole /></SuperAdminOnly>} />

          <Route path="/preview" element={<AdminOnly><Preview1 /></AdminOnly>} />
          <Route path="/course-preview" element={<AdminOnly><Preview1 initialMode="course" /></AdminOnly>} />
          <Route path="/my-timetable" element={<Preview1 />} />
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

          <Route path="/subjects/add" element={<AdminOnly><AddSubject /></AdminOnly>} />
          <Route path="/subjects/view" element={<AdminOnly><ViewSubjects /></AdminOnly>} />
          <Route path="/subjects/manage" element={<AdminOnly><ManageSubjects /></AdminOnly>} />

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
      </Layout>
    </RequireAuth>
  );
}

function App() {
  return (
    <ToastProvider>
      <Router>
        <Suspense fallback={<RouteLoading />}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register-institution" element={<RegisterInstitution />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/*" element={<AppShell />} />
          </Routes>
        </Suspense>
      </Router>
    </ToastProvider>
  );
}

export default App;
