import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { loadMembers } from "../mocks/uiShellFixtures";

export default function ViewMembers() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    loadMembers().then((data) => { if (active) setMembers(data); }).catch((reason) => { if (active) setError(reason?.message || "Members could not be loaded."); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => members.filter((member) => `${member.name} ${member.email} ${member.role}`.toLowerCase().includes(search.toLowerCase())), [members, search]);

  return (
    <div className="space-y-6">
      <PageHeader title="Institution members" subtitle="View people and invitations for this institution." crumbs={[{ label: "Members" }, { label: "View" }]} actions={<><Button asChild variant="outline"><Link to="/members/manage">Manage members</Link></Button><Button asChild><Link to="/members/add">Invite member</Link></Button></>} />
      <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">Sample members for layout preview; not live institution data.</p>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <Card className="space-y-4 p-5">
        <Input aria-label="Search members" placeholder="Search name, email, or role" value={search} onChange={(event) => setSearch(event.target.value)} />
        {loading ? <p role="status">Loading members…</p> : filtered.length === 0 ? <p className="py-8 text-center text-slate-600">No members match your search.</p> : (
          <div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="border-b bg-slate-50"><tr><th className="px-3 py-3">Name</th><th className="px-3 py-3">Email</th><th className="px-3 py-3">Role</th><th className="px-3 py-3">Status</th></tr></thead><tbody>{filtered.map((member) => <tr className="border-b" key={member.id}><td className="px-3 py-3">{member.name}</td><td className="px-3 py-3">{member.email}</td><td className="px-3 py-3 capitalize">{member.role.replaceAll("_", " ")}</td><td className="px-3 py-3 capitalize">{member.status}</td></tr>)}</tbody></table></div>
        )}
      </Card>
    </div>
  );
}
