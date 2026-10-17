import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import institutionService from "../services/institutionService";
import { extractApiError } from "../lib/apiError";

const roles = [
  "lecturer",
  "academic_coordinator",
  "exam_coordinator",
  "administrator",
];

export default function ManageMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = async () => {
    setLoading(true);
    try {
      const list = await institutionService.listMembers();
      setMembers(Array.isArray(list) ? list : []);
      setError("");
    } catch (reason) {
      setError(
        extractApiError(reason) ||
          reason?.message ||
          "Members could not be loaded."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const changeMember = async (id, changes) => {
    try {
      await institutionService.updateMember(id, changes);
      await refresh();
    } catch (reason) {
      setError(
        extractApiError(reason) ||
          reason?.message ||
          "Member could not be updated."
      );
    }
  };

  const deactivate = async (member) => {
    try {
      await institutionService.deactivateMember(member.id);
      await refresh();
    } catch (reason) {
      setError(
        extractApiError(reason) ||
          reason?.message ||
          "Member could not be removed."
      );
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage members"
        subtitle="Change roles, resend invitations, or deactivate access."
        crumbs={[
          { label: "Members", to: "/members/view" },
          { label: "Manage" },
        ]}
        actions={
          <Button asChild variant="outline">
            <Link to="/members/view">View members</Link>
          </Button>
        }
      />
      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
      <Card className="space-y-4 p-5">
        {loading ? (
          <p role="status">Loading members…</p>
        ) : members.length === 0 ? (
          <p className="py-8 text-center text-slate-600">
            There are no sample members to manage.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b bg-slate-50">
                <tr>
                  <th className="px-3 py-3">Member</th>
                  <th className="px-3 py-3">Role</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => {
                  const displayName =
                    member.name ||
                    `${member.first_name || ""} ${member.last_name || ""}`.trim() ||
                    member.email;
                  const status =
                    member.status ||
                    (member.is_active === false ? "suspended" : "active");
                  return (
                    <tr className="border-b" key={member.id || member.email}>
                      <td className="px-3 py-3">
                        <span className="block font-medium">{displayName}</span>
                        <span className="text-slate-500">{member.email}</span>
                      </td>
                      <td className="px-3 py-3">
                        <select
                          aria-label={`Role for ${displayName}`}
                          className="h-9 rounded-md border px-2"
                          value={member.role}
                          onChange={(event) =>
                            changeMember(member.id, {
                              role: event.target.value,
                            })
                          }
                        >
                          {roles.map((role) => (
                            <option key={role} value={role}>
                              {role.replaceAll("_", " ")}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-3">
                        <select
                          aria-label={`Status for ${displayName}`}
                          className="h-9 rounded-md border px-2"
                          value={status}
                          onChange={(event) =>
                            changeMember(member.id, {
                              status: event.target.value,
                            })
                          }
                        >
                          <option value="active">Active</option>
                          <option value="invited">Invited</option>
                          <option value="suspended">Suspended</option>
                        </select>
                      </td>
                      <td className="px-3 py-3">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={status === "suspended"}
                          onClick={() => deactivate(member)}
                        >
                          {status === "suspended"
                            ? "Deactivated"
                            : "Deactivate"}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
