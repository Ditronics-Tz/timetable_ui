import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import institutionService from "../services/institutionService";
import { extractApiError } from "../lib/apiError";

export default function ViewMembers() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    institutionService
      .listMembers()
      .then((data) => {
        if (active) setMembers(Array.isArray(data) ? data : []);
      })
      .catch((reason) => {
        if (active)
          setError(
            extractApiError(reason) ||
              reason?.message ||
              "Members could not be loaded."
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    return members.filter((member) => {
      const displayName =
        member.name ||
        `${member.first_name || ""} ${member.last_name || ""}`.trim();
      const matchesSearch =
        `${displayName} ${member.email || ""} ${member.role || ""}`
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchesRole =
        roleFilter === "all" || member.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [members, search, roleFilter]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Institution members"
        subtitle="View people and invitations for this institution."
        crumbs={[{ label: "Members" }, { label: "View" }]}
        actions={
          <>
            <Button asChild variant="outline">
              <Link to="/members/manage">Manage members</Link>
            </Button>
            <Button asChild>
              <Link to="/members/add">Invite member</Link>
            </Button>
          </>
        }
      />
      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
      <Card className="space-y-4 p-5">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[220px]">
            <Input
              aria-label="Search members"
              placeholder="Search name, email, or role"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <select
            aria-label="Filter by role"
            className="h-10 rounded-md border px-3 text-sm bg-white"
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
          >
            <option value="all">All roles</option>
            <option value="administrator">Administrator</option>
            <option value="academic_coordinator">Academic coordinator</option>
            <option value="exam_coordinator">Exam coordinator</option>
            <option value="lecturer">Lecturer</option>
            <option value="user">User</option>
          </select>
        </div>
        {loading ? (
          <p role="status">Loading members…</p>
        ) : filtered.length === 0 ? (
          <p className="py-8 text-center text-slate-600">
            No members match your search.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b bg-slate-50">
                <tr>
                  <th className="px-3 py-3">Name</th>
                  <th className="px-3 py-3">Email</th>
                  <th className="px-3 py-3">Role</th>
                  <th className="px-3 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((member) => {
                  const displayName =
                    member.name ||
                    `${member.first_name || ""} ${member.last_name || ""}`.trim() ||
                    member.email;
                  return (
                    <tr className="border-b" key={member.id || member.email}>
                      <td className="px-3 py-3">{displayName}</td>
                      <td className="px-3 py-3">{member.email}</td>
                      <td className="px-3 py-3 capitalize">
                        {String(member.role || "lecturer").replaceAll("_", " ")}
                      </td>
                      <td className="px-3 py-3 capitalize">
                        {member.status ||
                          (member.is_active === false ? "suspended" : "active")}
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
