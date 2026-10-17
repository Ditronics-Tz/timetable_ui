import React, { lazy, Suspense } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";
import RequirePermission from "./components/RequirePermission";
import ErrorBoundary from "./components/ErrorBoundary";
import { ToastProvider } from "./components/Toast";
import { I18nProvider } from "./lib/i18n";
import Login from "./views/Auth/Login";

const Dashboard = lazy(() => import("./views/Dashboard"));
const Preview1 = lazy(() => import("./views/Preview1"));
const PublicTimetable = lazy(() => import("./views/PublicTimetable"));
const AddRooms = lazy(() => import("./views/AddRooms"));
const ViewRooms = lazy(() => import("./views/ViewRooms"));
const RoomManagement = lazy(() => import("./views/ManageRooms"));
const AddClass = lazy(() => import("./views/AddClass"));
const ViewClass = lazy(() => import("./views/ViewClass"));
const ManageClass = lazy(() => import("./views/ManageClass"));
const Register = lazy(() => import("./views/Auth/Register"));
const RegisterInstitution = lazy(() => import("./views/Auth/RegisterInstitution"));
const AcceptInvitation = lazy(() => import("./views/Auth/AcceptInvitation"));
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
const InstitutionSettings = lazy(() => import("./views/InstitutionSettings"));
const MySchedule = lazy(() => import("./views/MySchedule"));
const Exams = lazy(() => import("./views/Exams"));
const MyExams = lazy(() => import("./views/MyExams"));
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

const WorkspacePerm = ({ permission, anyOf, children }) => (
  <RequirePermission
    permission={permission}
    anyOf={anyOf}
    workspace="institution"
  >
    {children}
  </RequirePermission>
);

const SuperAdminOnly = ({ children }) => (
  <RequirePermission permission="platform:manage" workspace="platform">
    {children}
  </RequirePermission>
);

function AppShell() {
  return (
    <RequireAuth>
      <Layout>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route
            path="/institution/settings"
            element={
              <WorkspacePerm permission="institution:manage">
                <InstitutionSettings />
              </WorkspacePerm>
            }
          />
          <Route path="/my-schedule" element={<MySchedule />} />
          <Route path="/my-exams" element={<MyExams />} />
          <Route
            path="/exams"
            element={
              <WorkspacePerm
                anyOf={[
                  "exams:write",
                  "exams:generate",
                  "exams:approve",
                  "exams:publish",
                  "exams:read",
                ]}
              >
                <Exams />
              </WorkspacePerm>
            }
          />
          <Route
            path="/members/add"
            element={
              <WorkspacePerm permission="members:manage">
                <AddMembers />
              </WorkspacePerm>
            }
          />
          <Route
            path="/members/view"
            element={
              <WorkspacePerm permission="members:manage">
                <ViewMembers />
              </WorkspacePerm>
            }
          />
          <Route
            path="/members/manage"
            element={
              <WorkspacePerm permission="members:manage">
                <ManageMembers />
              </WorkspacePerm>
            }
          />
          <Route
            path="/analytics"
            element={
              <WorkspacePerm permission="analytics:institution">
                <AnalyticsDashboard />
              </WorkspacePerm>
            }
          />
          <Route
            path="/superadmin/institutions"
            element={
              <SuperAdminOnly>
                <SuperAdminConsole />
              </SuperAdminOnly>
            }
          />
          <Route
            path="/superadmin/users"
            element={
              <SuperAdminOnly>
                <SuperAdminConsole />
              </SuperAdminOnly>
            }
          />
          <Route
            path="/superadmin/stats"
            element={
              <SuperAdminOnly>
                <SuperAdminConsole />
              </SuperAdminOnly>
            }
          />
          <Route
            path="/superadmin/generation-settings"
            element={
              <SuperAdminOnly>
                <SuperAdminConsole />
              </SuperAdminOnly>
            }
          />
          <Route
            path="/superadmin/audit"
            element={
              <SuperAdminOnly>
                <SuperAdminConsole />
              </SuperAdminOnly>
            }
          />

          <Route
            path="/preview"
            element={
              <WorkspacePerm
                anyOf={["timetable:generate", "rooms:read", "exams:read"]}
              >
                <Preview1 />
              </WorkspacePerm>
            }
          />
          <Route
            path="/course-preview"
            element={
              <WorkspacePerm anyOf={["timetable:generate", "courses:read"]}>
                <Preview1 initialMode="course" />
              </WorkspacePerm>
            }
          />
          <Route path="/my-timetable" element={<Preview1 />} />
          <Route
            path="/timetable"
            element={
              <WorkspacePerm permission="timetable:generate">
                <TimetableGenerator />
              </WorkspacePerm>
            }
          />

          <Route
            path="/rooms/add"
            element={
              <WorkspacePerm permission="rooms:write">
                <AddRooms />
              </WorkspacePerm>
            }
          />
          <Route
            path="/rooms/view"
            element={
              <WorkspacePerm anyOf={["rooms:read", "rooms:write"]}>
                <ViewRooms />
              </WorkspacePerm>
            }
          />
          <Route
            path="/rooms/manage"
            element={
              <WorkspacePerm permission="rooms:write">
                <RoomManagement />
              </WorkspacePerm>
            }
          />

          <Route
            path="/classes/add"
            element={
              <WorkspacePerm permission="classes:write">
                <AddClass />
              </WorkspacePerm>
            }
          />
          <Route
            path="/classes/view"
            element={
              <WorkspacePerm anyOf={["classes:read", "classes:write"]}>
                <ViewClass />
              </WorkspacePerm>
            }
          />
          <Route
            path="/classes/manage"
            element={
              <WorkspacePerm permission="classes:write">
                <ManageClass />
              </WorkspacePerm>
            }
          />
          <Route
            path="/manage-classes"
            element={
              <WorkspacePerm permission="classes:write">
                <ManageClass />
              </WorkspacePerm>
            }
          />

          <Route
            path="/modules/add"
            element={
              <WorkspacePerm permission="modules:write">
                <AddModule />
              </WorkspacePerm>
            }
          />
          <Route
            path="/modules/view"
            element={
              <WorkspacePerm anyOf={["modules:read", "modules:write"]}>
                <ViewModule />
              </WorkspacePerm>
            }
          />
          <Route
            path="/modules/manage"
            element={
              <WorkspacePerm permission="modules:write">
                <ManageModule />
              </WorkspacePerm>
            }
          />

          <Route
            path="/subjects/add"
            element={
              <WorkspacePerm permission="subjects:write">
                <AddSubject />
              </WorkspacePerm>
            }
          />
          <Route
            path="/subjects/view"
            element={
              <WorkspacePerm anyOf={["subjects:read", "subjects:write"]}>
                <ViewSubjects />
              </WorkspacePerm>
            }
          />
          <Route
            path="/subjects/manage"
            element={
              <WorkspacePerm permission="subjects:write">
                <ManageSubjects />
              </WorkspacePerm>
            }
          />

          <Route
            path="/staff/view"
            element={
              <WorkspacePerm anyOf={["staff:read", "staff:write"]}>
                <ViewStaff />
              </WorkspacePerm>
            }
          />
          <Route
            path="/staff/manage"
            element={
              <WorkspacePerm permission="staff:write">
                <ManageStaff />
              </WorkspacePerm>
            }
          />
          <Route
            path="/staff/add"
            element={
              <WorkspacePerm permission="staff:write">
                <AddStaff />
              </WorkspacePerm>
            }
          />

          <Route
            path="/programs/add"
            element={
              <WorkspacePerm permission="courses:write">
                <AddProgram />
              </WorkspacePerm>
            }
          />
          <Route
            path="/programs/view"
            element={
              <WorkspacePerm anyOf={["courses:read", "courses:write"]}>
                <ViewProgram />
              </WorkspacePerm>
            }
          />
          <Route
            path="/programs/manage"
            element={
              <WorkspacePerm permission="courses:write">
                <ManageProgram />
              </WorkspacePerm>
            }
          />

          <Route
            path="/departments/add"
            element={
              <WorkspacePerm permission="faculties:write">
                <AddDepartment />
              </WorkspacePerm>
            }
          />
          <Route
            path="/departments/manage"
            element={
              <WorkspacePerm permission="faculties:write">
                <ManageDepartments />
              </WorkspacePerm>
            }
          />
          <Route
            path="/departments/view"
            element={
              <WorkspacePerm anyOf={["faculties:read", "faculties:write"]}>
                <ViewDepartments />
              </WorkspacePerm>
            }
          />

          <Route
            path="/allocations/view"
            element={
              <WorkspacePerm anyOf={["allocations:read", "allocations:write"]}>
                <ViewAllocations />
              </WorkspacePerm>
            }
          />
          <Route
            path="/allocations/module"
            element={
              <WorkspacePerm permission="allocations:write">
                <ModuleAllocations />
              </WorkspacePerm>
            }
          />
        </Routes>
      </Layout>
    </RequireAuth>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <I18nProvider>
        <ToastProvider>
          <Router>
            <Suspense fallback={<RouteLoading />}>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/register-institution"
                  element={<RegisterInstitution />}
                />
                <Route
                  path="/accept-invitation"
                  element={<AcceptInvitation />}
                />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route
                  path="/public/timetable/:token"
                  element={<PublicTimetable />}
                />
                <Route path="/*" element={<AppShell />} />
              </Routes>
            </Suspense>
          </Router>
        </ToastProvider>
      </I18nProvider>
    </ErrorBoundary>
  );
}

export default App;
