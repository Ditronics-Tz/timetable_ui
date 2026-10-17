import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import CsvImport from "../components/CsvImport";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import institutionService from "../services/institutionService";
import { extractApiError } from "../lib/apiError";

export default function AddMembers() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role: "lecturer",
  });
  const [invitations, setInvitations] = useState([]);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const loadInvites = async () => {
    try {
      const data = await institutionService.listInvitations();
      setInvitations(data?.invitations || []);
    } catch {
      // ignore in demo/offline
    }
  };

  useEffect(() => {
    loadInvites();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setStatus("");
    try {
      const result = await institutionService.createInvitation({
        first_name: form.first_name,
        last_name: form.last_name,
        name: `${form.first_name} ${form.last_name}`.trim(),
        email: form.email,
        phone: form.phone,
        role: form.role,
      });
      setStatus(
        result?.demo
          ? `Demo invitation prepared for ${form.email}. No email was sent.`
          : `Invitation sent to ${form.email} (${form.role}).`
      );
      setForm({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        role: "lecturer",
      });
      await loadInvites();
    } catch (error) {
      setStatus(
        extractApiError(error) ||
          error?.message ||
          "The invitation could not be created."
      );
    } finally {
      setBusy(false);
    }
  };

  const handleRevoke = async (id) => {
    try {
      await institutionService.revokeInvitation(id);
      await loadInvites();
    } catch (err) {
      setStatus(extractApiError(err));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invite a member"
        subtitle="Add a person to this institution or bulk import via CSV."
        crumbs={[
          { label: "Members", to: "/members/view" },
          { label: "Invite" },
        ]}
        actions={
          <Button asChild variant="outline">
            <Link to="/members/view">View members</Link>
          </Button>
        }
      />

      <CsvImport
        entity="members"
        columns={["first_name", "last_name", "email", "phone", "role"]}
        sampleRow={[
          "Asha",
          "Mwakalinga",
          "asha@sacas.ac.tz",
          "+255712000111",
          "lecturer",
        ]}
      />

      <Card className="max-w-2xl space-y-4 p-6">
        {status && (
          <p role="status" className="text-sm text-slate-700">
            {status}
          </p>
        )}
        <form className="space-y-4" onSubmit={submit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="member-first">First name *</Label>
              <Input
                id="member-first"
                required
                value={form.first_name}
                onChange={(e) =>
                  setForm({ ...form, first_name: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="member-last">Last name *</Label>
              <Input
                id="member-last"
                required
                value={form.last_name}
                onChange={(e) =>
                  setForm({ ...form, last_name: e.target.value })
                }
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="member-email">Email address *</Label>
              <Input
                id="member-email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="member-phone">Phone</Label>
              <Input
                id="member-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="member-role">Role *</Label>
            <select
              id="member-role"
              className="h-10 w-full rounded-md border px-3"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="lecturer">Lecturer</option>
              <option value="academic_coordinator">Academic coordinator</option>
              <option value="exam_coordinator">Exam coordinator</option>
              <option value="administrator">Administrator</option>
            </select>
          </div>
          <Button type="submit" disabled={busy}>
            {busy ? "Preparing…" : "Prepare invitation"}
          </Button>
        </form>
      </Card>

      {invitations.length > 0 && (
        <Card className="max-w-2xl space-y-3 p-6">
          <h2 className="font-semibold text-slate-900">Pending invitations</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b bg-slate-50">
                <tr>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Role</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invitations.map((inv) => (
                  <tr key={inv.id || inv.email} className="border-b">
                    <td className="px-3 py-2">{inv.email}</td>
                    <td className="px-3 py-2 capitalize">
                      {String(inv.role || "lecturer").replaceAll("_", " ")}
                    </td>
                    <td className="px-3 py-2 capitalize">
                      {inv.status || "pending"}
                    </td>
                    <td className="px-3 py-2">
                      {inv.id && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleRevoke(inv.id)}
                        >
                          Revoke
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
