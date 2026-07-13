import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import PageHeader from "../components/PageHeader";
import dashboardService from "../services/dashboardService";
import { extractApiError } from "../lib/apiError";
import { getCurrentUser, isAdmin } from "../lib/auth";
import {
  Building2,
  GraduationCap,
  BookOpen,
  Users,
  DoorOpen,
  Calendar,
  UserCog,
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
  const admin = isAdmin();
  const [counts, setCounts] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!admin) return;
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
  }, [admin]);

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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome${user?.first_name ? `, ${user.first_name}` : ""}${
          user?.role ? ` · ${user.role}` : ""
        }`}
        crumbs={[{ label: "Home", to: "/dashboard" }, { label: "Dashboard" }]}
      />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {admin ? (
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
            </div>
          </Card>
        </>
      ) : (
        <Card className="p-6 border shadow-sm space-y-3">
          <h2 className="font-semibold text-slate-900">Your account</h2>
          <p className="text-sm text-slate-600">
            You are signed in as a regular user. Timetable administration requires the{" "}
            <code className="text-xs bg-slate-100 px-1 rounded">administrator</code> or{" "}
            <code className="text-xs bg-slate-100 px-1 rounded">super_admin</code> role.
          </p>
          <Button asChild variant="outline">
            <Link to="/settings">Open settings</Link>
          </Button>
        </Card>
      )}
    </div>
  );
}
