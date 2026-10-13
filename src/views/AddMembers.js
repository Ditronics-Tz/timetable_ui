import { useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { createMember } from "../mocks/uiShellFixtures";

export default function AddMembers() {
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", role: "lecturer" });
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setStatus("");
    try {
      await createMember({ name: `${form.first_name} ${form.last_name}`.trim(), email: form.email, role: form.role });
      setStatus(`Demo invitation prepared for ${form.email}. No email was sent.`);
      setForm({ first_name: "", last_name: "", email: "", role: "lecturer" });
    } catch (error) {
      setStatus(error?.message || "The sample invite could not be created.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Invite a member" subtitle="Add a person to this institution." crumbs={[{ label: "Members", to: "/members/view" }, { label: "Invite" }]} actions={<Button asChild variant="outline"><Link to="/members/view">View members</Link></Button>} />
      <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">Demo preview: invitations are stored in memory and no email is sent.</p>
      <Card className="max-w-2xl space-y-4 p-6">
        {status && <p role="status" className="text-sm text-slate-700">{status}</p>}
        <form className="space-y-4" onSubmit={submit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label htmlFor="member-first">First name *</Label><Input id="member-first" required value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} /></div>
            <div><Label htmlFor="member-last">Last name *</Label><Input id="member-last" required value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} /></div>
          </div>
          <div><Label htmlFor="member-email">Email address *</Label><Input id="member-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div><Label htmlFor="member-role">Role *</Label><select id="member-role" className="h-10 w-full rounded-md border px-3" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}><option value="lecturer">Lecturer</option><option value="academic_coordinator">Academic coordinator</option><option value="exam_coordinator">Exam coordinator</option><option value="administrator">Administrator</option></select></div>
          <Button type="submit" disabled={busy}>{busy ? "Preparing…" : "Prepare invitation"}</Button>
        </form>
      </Card>
    </div>
  );
}
