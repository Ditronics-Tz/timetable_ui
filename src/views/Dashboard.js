import { useEffect, useState } from "react";
import { Card } from "../components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import dashboardService from "../services/dashboardService";
import { extractApiError } from "../lib/apiError";
import { getCurrentUser, isAdmin } from "../lib/auth";
import "../styles/Dashboard.css";

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
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">
          Welcome{user?.first_name ? `, ${user.first_name}` : ""}
          {user?.role ? ` (${user.role})` : ""}
        </p>
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      {admin ? (
        <>
          {loading && <p className="text-gray-500">Loading counts...</p>}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {countCards.map((c) => (
              <Link key={c.label} to={c.to}>
                <Card className="p-4 hover:shadow-md transition">
                  <p className="text-sm text-gray-500">{c.label}</p>
                  <p className="text-3xl font-bold">{c.value ?? 0}</p>
                </Card>
              </Link>
            ))}
          </div>
          {userStats && (
            <Card className="p-4">
              <h2 className="font-semibold mb-2">User stats</h2>
              <p className="text-sm">
                Total users: {userStats.total_users} · Active: {userStats.active_users} ·
                Admins: {userStats.admin_users}
              </p>
            </Card>
          )}
          <Card className="p-4 space-y-2">
            <h2 className="font-semibold">Quick links</h2>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/timetable">Generate timetable</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/allocations/module">Allocate staff</Link>
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
        <Card className="p-6 space-y-3">
          <h2 className="font-semibold">Your account</h2>
          <p className="text-sm text-gray-600">
            You are signed in as a regular user. Timetable administration screens require
            the <code>administrator</code> or <code>super_admin</code> role.
          </p>
          <Button asChild variant="outline">
            <Link to="/settings">Open settings</Link>
          </Button>
        </Card>
      )}
    </div>
  );
}
