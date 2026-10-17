import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import PageHeader from "../components/PageHeader";
import dashboardService from "../services/dashboardService";
import { extractApiError } from "../lib/apiError";
import {
  can,
  canAny,
  getCurrentUser,
  getInstitution,
  getRole,
  isAdmin,
  isSupportSession,
} from "../lib/auth";
import {
  Building2,
  GraduationCap,
  BookOpen,
  Users,
  DoorOpen,
  Calendar,
  UserCog,
  CheckCircle2,
  Circle,
} from "lucide-react";

const ICONS = {
  Departments: Building2,
  Programs: GraduationCap,
  Modules: BookOpen,
  Classes: Users,
  Rooms: DoorOpen,
  Staff: UserCog,
  "Timetable slots": Calendar,
};

export default function Dashboard() {
  const user = getCurrentUser();
  const role = getRole();
  const admin = isAdmin();
  const supportSession = isSupportSession();
  const institution = getInstitution();
  const [counts, setCounts] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const canViewAdminDashboard =
    admin ||
    canAny(
      "institution:manage",
      "timetable:generate",
      "exams:write",
      "analytics:institution"
    );

  useEffect(() => {
    if (!canViewAdminDashboard) return;
    setLoading(true);
    Promise.all([
      dashboardService.adminDashboard(),
      dashboardService.userStats().catch(() => null),
    ])
      .then(([dash, stats]) => {
        setCounts(dash.counts || null);
        setUserStats(stats);
      })
      .catch((e) => setError(extractApiError(e)))
      .finally(() => setLoading(false));
  }, [canViewAdminDashboard]);

  const countCards = counts
    ? [
        { label: "Departments", value: counts.faculties, to: "/departments/view" },
        { label: "Programs", value: counts.courses, to: "/programs/view" },
        { label: "Modules", value: counts.modules, to: "/modules/view" },
        { label: "Classes", value: counts.classes, to: "/classes/view" },
        { label: "Rooms", value: counts.rooms, to: "/rooms/view" },
        { label: "Staff", value: counts.staff, to: "/staff/view" },
        { label: "Timetable slots", value: counts.timetables, to: "/preview" },
      ]
    : [];

  const onboardingSteps = [
    {
      step: 1,
      title: "Add Departments (Faculties)",
      done: (counts?.faculties ?? 0) > 0,
      count: counts?.faculties ?? 0,
      to: "/departments/add",
      cta: "Add / Import CSV",
    },
    {
      step: 2,
      title: "Add Programs (Courses)",
      done: (counts?.courses ?? 0) > 0,
      count: counts?.courses ?? 0,
      to: "/programs/add",
      cta: "Add / Import CSV",
    },
    {
      step: 3,
      title: "Add Subjects & Modules",
      done: (counts?.modules ?? 0) + (counts?.subjects ?? 0) > 0,
      count: (counts?.modules ?? 0) + (counts?.subjects ?? 0),
      to: "/modules/add",
      cta: "Add / Import CSV",
    },
    {
      step: 4,
      title: "Add Rooms & Labs",
      done: (counts?.rooms ?? 0) > 0,
      count: counts?.rooms ?? 0,
      to: "/rooms/add",
      cta: "Add / Import CSV",
    },
    {
      step: 5,
      title: "Add Staff (Lecturers)",
      done: (counts?.staff ?? 0) > 0,
      count: counts?.staff ?? 0,
      to: "/staff/add",
      cta: "Add / Import CSV",
    },
    {
      step: 6,
      title: "Add Student Classes",
      done: (counts?.classes ?? 0) > 0,
      count: counts?.classes ?? 0,
      to: "/classes/add",
      cta: "Add / Import CSV",
    },
    {
      step: 7,
      title: "Generate Timetable",
      done: (counts?.timetables ?? 0) > 0,
      count: counts?.timetables ?? 0,
      to: "/timetable",
      cta: "Open Generator",
    },
  ];

  const completedSteps = onboardingSteps.filter((s) => s.done).length;
  const progressPercent = Math.round(
    (completedSteps / onboardingSteps.length) * 100
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome${user?.first_name ? `, ${user.first_name}` : ""}${
          user?.role ? ` · ${user.role}` : ""
        }${institution?.name ? ` · ${institution.name}` : ""}`}
        crumbs={[{ label: "Home", to: "/dashboard" }, { label: "Dashboard" }]}
      />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {role === "super_admin" && !supportSession && (
        <Card className="p-5 border shadow-sm space-y-3 bg-blue-50/50">
          <h2 className="text-sm font-semibold text-slate-900">
            SACAS Platform Administration
          </h2>
          <p className="text-sm text-slate-600">
            Manage registered institutions, platform users, solver defaults, and
            audit activity from the Super Admin Console.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm">
              <Link to="/superadmin/institutions">Manage Institutions</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/superadmin/users">Manage Platform Users</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/superadmin/stats">Platform Analytics</Link>
            </Button>
          </div>
        </Card>
      )}

      {canViewAdminDashboard ? (
        <>
          {loading && <p className="text-sm text-slate-500">Loading counts…</p>}

          <div className="stat-grid">
            {countCards.map((c) => {
              const Icon = ICONS[c.label] || Building2;
              return (
                <Link key={c.label} to={c.to} className="stat-card">
                  <div className="flex items-start justify-between gap-2">
                    <p className="stat-card-label">{c.label}</p>
                    <Icon size={18} className="text-slate-400 shrink-0" aria-hidden />
                  </div>
                  <p className="stat-card-value">{c.value ?? 0}</p>
                </Link>
              );
            })}
          </div>

          {role !== "super_admin" && (
            <Card className="p-5 border shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Institution Setup Progress
                  </h2>
                  <p className="text-xs text-slate-600">
                    Import data in order (or add records manually) to generate
                    your timetable.
                  </p>
                </div>
                <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                  {completedSteps} of {onboardingSteps.length} completed ({progressPercent}%)
                </span>
              </div>
              <div
                className="h-2 w-full overflow-hidden rounded bg-slate-100"
                aria-label="Institution setup progress"
              >
                <div
                  className="h-full bg-emerald-600 transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <ul className="grid gap-2 sm:grid-cols-2">
                {onboardingSteps.map((item) => (
                  <li
                    key={item.step}
                    className="flex items-center justify-between gap-2 rounded-md border p-2.5 text-sm"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {item.done ? (
                        <CheckCircle2
                          size={18}
                          className="text-emerald-600 shrink-0"
                          aria-hidden
                        />
                      ) : (
                        <Circle
                          size={18}
                          className="text-slate-400 shrink-0"
                          aria-hidden
                        />
                      )}
                      <span className="truncate font-medium text-slate-800">
                        {item.step}. {item.title}
                      </span>
                      <span className="text-xs text-slate-500">
                        ({item.count})
                      </span>
                    </div>
                    <Link
                      to={item.to}
                      className="text-xs font-medium text-blue-700 hover:underline shrink-0"
                    >
                      {item.cta}
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {userStats && (
            <Card className="p-5 border shadow-sm">
              <h2 className="text-sm font-semibold text-slate-800 mb-2">User stats</h2>
              <p className="text-sm text-slate-600">
                Total users: <strong>{userStats.total_users}</strong>
                {" · "}
                Active: <strong>{userStats.active_users}</strong>
                {" · "}
                Admins: <strong>{userStats.admin_users}</strong>
              </p>
            </Card>
          )}

          <Card className="p-5 border shadow-sm space-y-3">
            <h2 className="text-sm font-semibold text-slate-800">Quick actions</h2>
            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm">
                <Link to="/timetable">Generate timetable</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/exams">Manage exams</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/allocations/module">Allocate staff</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/staff/add">Create staff</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/departments/add">Add department</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/preview">Preview schedule</Link>
              </Button>
              {can("institution:manage") && (
                <Button asChild variant="outline" size="sm">
                  <Link to="/institution/settings">Institution settings</Link>
                </Button>
              )}
            </div>
          </Card>
        </>
      ) : (
        <Card className="p-6 border shadow-sm space-y-3">
          <h2 className="font-semibold text-slate-900">Your account</h2>
          <p className="text-sm text-slate-600">
            You are signed in as a lecturer / regular user. View your assigned
            teaching schedule and exam invigilation duties below, or manage your
            account settings. Timetable administration requires the{" "}
            <code className="text-xs bg-slate-100 px-1 rounded">administrator</code> or{" "}
            <code className="text-xs bg-slate-100 px-1 rounded">super_admin</code> role.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link to="/my-schedule">My Schedule</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/my-exams">My Exams</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/settings">Open settings</Link>
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
