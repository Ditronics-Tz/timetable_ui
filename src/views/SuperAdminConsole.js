import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import GenerationSettingsPanel from "../components/GenerationSettingsPanel";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { sampleInstitutions, sampleMembers } from "../mocks/uiShellFixtures";
import superadminService from "../services/superadminService";
import { startSupportSession } from "../lib/auth";
import { extractApiError } from "../lib/apiError";

const sections = [
  ["institutions", "Institutions", "Review registration and institution status."],
  ["users", "Users", "Search platform users and review roles."],
  ["stats", "Platform statistics", "Monitor institutions, members, and schedules."],
  ["generation-settings", "Generation settings", "Review shared timetable engine defaults."],
  ["audit", "Audit log", "Inspect recent platform activity."],
];

const ROLES = [
  "super_admin",
  "administrator",
  "academic_coordinator",
  "exam_coordinator",
  "lecturer",
  "user",
];

export default function SuperAdminConsole() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const active = pathname.split("/").filter(Boolean).at(-1) || "institutions";

  const [institutions, setInstitutions] = useState(() =>
    sampleInstitutions.map((item, idx) => ({
      id: item.id || idx + 1,
      plan: item.plan || "pro",
      ...item,
    }))
  );
  const [instSearch, setInstSearch] = useState("");
  const [instStatusFilter, setInstStatusFilter] = useState("all");

  const [users, setUsers] = useState(() =>
    sampleMembers.map((m) => ({ ...m }))
  );
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [newUser, setNewUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "administrator",
    password: "",
  });
  const [showCreateUser, setShowCreateUser] = useState(false);

  const [stats, setStats] = useState({
    cards: [
      ["Institutions", "12"],
      ["Active members", "486"],
      ["Schedules generated", "94"],
      ["Success rate", "91%"],
    ],
    institutions_by_status: { active: 9, pending: 2, suspended: 1 },
    users_by_role: {
      administrator: 14,
      academic_coordinator: 28,
      exam_coordinator: 19,
      lecturer: 425,
    },
    engine_split: { solver: 78, greedy: 16 },
  });

  const [auditLogs, setAuditLogs] = useState([]);
  const [auditSearch, setAuditSearch] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    setError("");
    if (active === "institutions") {
      superadminService
        .listInstitutions()
        .then((list) => {
          if (mounted && Array.isArray(list)) setInstitutions(list);
        })
        .catch((err) => {
          if (mounted) setError(extractApiError(err));
        });
    } else if (active === "users") {
      superadminService
        .listUsers()
        .then((list) => {
          if (mounted && Array.isArray(list)) setUsers(list);
        })
        .catch((err) => {
          if (mounted) setError(extractApiError(err));
        });
    } else if (active === "stats") {
      superadminService
        .getPlatformAnalytics()
        .then((data) => {
          if (mounted && data) setStats((prev) => ({ ...prev, ...data }));
        })
        .catch(() => {});
    } else if (active === "audit") {
      superadminService
        .listAuditLogs()
        .then((logs) => {
          if (mounted && Array.isArray(logs)) setAuditLogs(logs);
        })
        .catch(() => {});
    }
    return () => {
      mounted = false;
    };
  }, [active]);

  const filteredInstitutions = useMemo(() => {
    return institutions.filter((item) => {
      const matchesSearch = `${item.name || ""} ${item.region || ""}`
        .toLowerCase()
        .includes(instSearch.toLowerCase());
      const matchesStatus =
        instStatusFilter === "all" || item.status === instStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [institutions, instSearch, instStatusFilter]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const displayName =
        u.name || `${u.first_name || ""} ${u.last_name || ""}`.trim();
      const matchesSearch = `${displayName} ${u.email || ""} ${u.role || ""}`
        .toLowerCase()
        .includes(userSearch.toLowerCase());
      const matchesRole =
        userRoleFilter === "all" || u.role === userRoleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, userSearch, userRoleFilter]);

  const filteredAudit = useMemo(() => {
    return auditLogs.filter((entry) =>
      `${entry.action || ""} ${entry.actor_email || ""} ${entry.institution_name || ""} ${entry.detail || ""}`
        .toLowerCase()
        .includes(auditSearch.toLowerCase())
    );
  }, [auditLogs, auditSearch]);

  const handleInstitutionStatus = async (inst, nextStatus) => {
    setError("");
    setStatusMessage("");
    try {
      await superadminService.updateInstitutionStatus(
        inst.id || inst.name,
        nextStatus
      );
      setInstitutions((prev) =>
        prev.map((item) =>
          (item.id && item.id === inst.id) || item.name === inst.name
            ? { ...item, status: nextStatus }
            : item
        )
      );
      setStatusMessage(`${inst.name} status updated to ${nextStatus}.`);
    } catch (err) {
      setError(extractApiError(err));
    }
  };

  const handleInstitutionPlan = async (inst, nextPlan) => {
    setError("");
    try {
      await superadminService.updateInstitutionPlan(
        inst.id || inst.name,
        nextPlan
      );
      setInstitutions((prev) =>
        prev.map((item) =>
          (item.id && item.id === inst.id) || item.name === inst.name
            ? { ...item, plan: nextPlan }
            : item
        )
      );
      setStatusMessage(`${inst.name} plan set to ${nextPlan}.`);
    } catch (err) {
      setError(extractApiError(err));
    }
  };

  const handleImpersonate = async (inst) => {
    try {
      const res = await superadminService.impersonateInstitution(inst);
      startSupportSession({
        token: res?.token,
        institution: res?.institution || {
          id: inst.id || 1,
          name: inst.name,
          region: inst.region,
          status: inst.status,
        },
        user: res?.user,
        permissions: res?.permissions,
      });
      navigate("/dashboard");
    } catch (err) {
      setError(extractApiError(err));
    }
  };

  const handleCreateUser = async (event) => {
    event.preventDefault();
    setError("");
    setStatusMessage("");
    try {
      const created = await superadminService.createUser(newUser);
      setUsers((prev) => [
        ...prev,
        {
          id: created?.id || Date.now(),
          name:
            created?.name ||
            `${newUser.first_name} ${newUser.last_name}`.trim(),
          email: newUser.email,
          role: newUser.role,
          status: "active",
        },
      ]);
      setNewUser({
        first_name: "",
        last_name: "",
        email: "",
        role: "administrator",
        password: "",
      });
      setShowCreateUser(false);
      setStatusMessage(`Created platform user ${newUser.email}.`);
    } catch (err) {
      setError(extractApiError(err));
    }
  };

  const handleUserRoleChange = async (member, nextRole) => {
    try {
      await superadminService.updateUserRole(member.id, nextRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === member.id ? { ...u, role: nextRole } : u))
      );
      setStatusMessage(`Updated role for ${member.email} to ${nextRole}.`);
    } catch (err) {
      setError(extractApiError(err));
    }
  };

  const handleUserStatusToggle = async (member) => {
    const currentStatus =
      member.status || (member.is_active === false ? "suspended" : "active");
    const nextStatus = currentStatus === "suspended" ? "active" : "suspended";
    try {
      await superadminService.updateUserStatus(member.id, nextStatus);
      setUsers((prev) =>
        prev.map((u) => (u.id === member.id ? { ...u, status: nextStatus } : u))
      );
      setStatusMessage(`Set ${member.email} to ${nextStatus}.`);
    } catch (err) {
      setError(extractApiError(err));
    }
  };

  const handleResetPassword = async (member) => {
    try {
      await superadminService.resetUserPassword(member.id, "TempPass123!");
      setStatusMessage(`Password reset triggered for ${member.email}.`);
    } catch (err) {
      setError(extractApiError(err));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={
          sections.find(([key]) => key === active)?.[1] || "Institutions"
        }
        subtitle={sections.find(([key]) => key === active)?.[2]}
        crumbs={[
          { label: "Super admin", to: "/superadmin/institutions" },
          {
            label:
              sections.find(([key]) => key === active)?.[1] || "Institutions",
          },
        ]}
      />

      {error && (
        <div
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}
      {statusMessage && (
        <div
          role="status"
          className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800"
        >
          {statusMessage}
        </div>
      )}

      <nav aria-label="Super admin pages" className="flex flex-wrap gap-2">
        {sections.map(([key, label]) => (
          <Link
            key={key}
            to={`/superadmin/${key}`}
            aria-current={active === key ? "page" : undefined}
            className={`rounded-md border px-3 py-2 text-sm ${
              active === key
                ? "border-blue-700 bg-blue-50 text-blue-800"
                : "bg-white text-slate-700"
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>

      {active === "institutions" && (
        <Card className="overflow-x-auto p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-semibold">Recent institutions</h2>
            <div className="flex flex-wrap gap-2">
              <Input
                aria-label="Search institutions"
                placeholder="Search institution or region"
                value={instSearch}
                onChange={(e) => setInstSearch(e.target.value)}
                className="w-56"
              />
              <select
                aria-label="Filter institution status"
                className="h-10 rounded-md border px-3 text-sm bg-white"
                value={instStatusFilter}
                onChange={(e) => setInstStatusFilter(e.target.value)}
              >
                <option value="all">All statuses</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="px-3 py-2">Institution</th>
                <th className="px-3 py-2">Region</th>
                <th className="px-3 py-2">Plan</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInstitutions.map((item) => (
                <tr className="border-b" key={item.id || item.name}>
                  <td className="px-3 py-3 font-medium">{item.name}</td>
                  <td className="px-3 py-3">{item.region}</td>
                  <td className="px-3 py-3">
                    <select
                      aria-label={`Plan for ${item.name}`}
                      className="h-8 rounded border px-2 text-xs bg-white"
                      value={item.plan || "pro"}
                      onChange={(e) =>
                        handleInstitutionPlan(item, e.target.value)
                      }
                    >
                      <option value="free">Free</option>
                      <option value="pro">Pro</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </td>
                  <td className="px-3 py-3 capitalize">{item.status}</td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-2">
                      {item.status === "pending" && (
                        <Button
                          size="sm"
                          onClick={() =>
                            handleInstitutionStatus(item, "active")
                          }
                        >
                          Approve
                        </Button>
                      )}
                      {item.status === "active" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleInstitutionStatus(item, "suspended")
                          }
                        >
                          Suspend
                        </Button>
                      )}
                      {item.status === "suspended" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleInstitutionStatus(item, "active")
                          }
                        >
                          Reactivate
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleImpersonate(item)}
                      >
                        View as Institution
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {active === "users" && (
        <Card className="overflow-x-auto p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-semibold">Sample platform users</h2>
            <div className="flex flex-wrap gap-2">
              <Input
                aria-label="Search platform users"
                placeholder="Search name, email, or role"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-56"
              />
              <select
                aria-label="Filter user role"
                className="h-10 rounded-md border px-3 text-sm bg-white"
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
              >
                <option value="all">All roles</option>
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateUser((v) => !v)}
              >
                {showCreateUser ? "Cancel" : "Create user"}
              </Button>
            </div>
          </div>

          {showCreateUser && (
            <form
              onSubmit={handleCreateUser}
              className="grid gap-3 rounded-md border bg-slate-50 p-4 sm:grid-cols-2"
            >
              <div>
                <Label htmlFor="sa-user-first">First name *</Label>
                <Input
                  id="sa-user-first"
                  required
                  value={newUser.first_name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, first_name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="sa-user-last">Last name *</Label>
                <Input
                  id="sa-user-last"
                  required
                  value={newUser.last_name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, last_name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="sa-user-email">Email *</Label>
                <Input
                  id="sa-user-email"
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="sa-user-role">Role</Label>
                <select
                  id="sa-user-role"
                  className="h-10 w-full rounded-md border px-3 bg-white"
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="sa-user-password">Initial password *</Label>
                <Input
                  id="sa-user-password"
                  type="password"
                  required
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" size="sm">
                  Save new user
                </Button>
              </div>
            </form>
          )}

          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Role</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((member) => {
                const displayName =
                  member.name ||
                  `${member.first_name || ""} ${member.last_name || ""}`.trim() ||
                  member.email;
                const status =
                  member.status ||
                  (member.is_active === false ? "suspended" : "active");
                return (
                  <tr className="border-b" key={member.id || member.email}>
                    <td className="px-3 py-3">{displayName}</td>
                    <td className="px-3 py-3">{member.email}</td>
                    <td className="px-3 py-3">
                      <select
                        aria-label={`Platform role for ${displayName}`}
                        className="h-8 rounded border px-2 text-xs bg-white"
                        value={member.role}
                        onChange={(e) =>
                          handleUserRoleChange(member, e.target.value)
                        }
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-3 capitalize">{status}</td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUserStatusToggle(member)}
                        >
                          {status === "suspended" ? "Activate" : "Suspend"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResetPassword(member)}
                        >
                          Reset password
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

      {active === "stats" && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {(stats.cards || [
              ["Institutions", "12"],
              ["Active members", "486"],
              ["Schedules generated", "94"],
              ["Success rate", "91%"],
            ]).map(([label, value]) => (
              <Card key={label} className="space-y-2 p-5">
                <p className="text-sm text-slate-600">{label}</p>
                <p className="text-3xl font-semibold">{value}</p>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="p-5 space-y-2">
              <h3 className="font-semibold text-sm text-slate-800">
                Institutions by status
              </h3>
              <ul className="space-y-1 text-sm text-slate-600">
                {Object.entries(stats.institutions_by_status || {}).map(
                  ([k, v]) => (
                    <li key={k} className="flex justify-between capitalize">
                      <span>{k}</span>
                      <strong>{v}</strong>
                    </li>
                  )
                )}
              </ul>
            </Card>
            <Card className="p-5 space-y-2">
              <h3 className="font-semibold text-sm text-slate-800">
                Users by role
              </h3>
              <ul className="space-y-1 text-sm text-slate-600">
                {Object.entries(stats.users_by_role || {}).map(([k, v]) => (
                  <li key={k} className="flex justify-between capitalize">
                    <span>{k.replaceAll("_", " ")}</span>
                    <strong>{v}</strong>
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="p-5 space-y-2">
              <h3 className="font-semibold text-sm text-slate-800">
                Solver engine split
              </h3>
              <ul className="space-y-1 text-sm text-slate-600">
                {Object.entries(stats.engine_split || {}).map(([k, v]) => (
                  <li key={k} className="flex justify-between capitalize">
                    <span>{k}</span>
                    <strong>{v} runs</strong>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      )}

      {active === "generation-settings" && <GenerationSettingsPanel />}

      {active === "audit" && (
        <Card className="p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-semibold">Recent activity preview</h2>
            <Input
              aria-label="Search audit log"
              placeholder="Filter by action, actor, or institution"
              value={auditSearch}
              onChange={(e) => setAuditSearch(e.target.value)}
              className="w-64"
            />
          </div>
          {filteredAudit.length === 0 ? (
            <ul className="space-y-3 text-sm">
              <li className="border-b pb-3">
                Institution registration submitted · today
              </li>
              <li className="border-b pb-3">
                Member invitation prepared · yesterday
              </li>
              <li>Generation settings viewed · this week</li>
            </ul>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="px-3 py-2">Time</th>
                    <th className="px-3 py-2">Actor</th>
                    <th className="px-3 py-2">Action</th>
                    <th className="px-3 py-2">Institution</th>
                    <th className="px-3 py-2">Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAudit.map((entry) => (
                    <tr key={entry.id} className="border-b">
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-slate-500">
                        {entry.created_at}
                      </td>
                      <td className="px-3 py-2">{entry.actor_email}</td>
                      <td className="px-3 py-2 font-mono text-xs">
                        {entry.action}
                      </td>
                      <td className="px-3 py-2">{entry.institution_name}</td>
                      <td className="px-3 py-2">{entry.detail || entry.target}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
