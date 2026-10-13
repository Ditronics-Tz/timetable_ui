import { Link, useLocation } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { Card } from "../components/ui/card";
import { sampleInstitutions, sampleMembers } from "../mocks/uiShellFixtures";

const sections = [
  ["institutions", "Institutions", "Review registration and institution status."],
  ["users", "Users", "Search platform users and review roles."],
  ["stats", "Platform statistics", "Monitor institutions, members, and schedules."],
  ["generation-settings", "Generation settings", "Review shared timetable engine defaults."],
  ["audit", "Audit log", "Inspect recent platform activity."],
];

export default function SuperAdminConsole() {
  const { pathname } = useLocation();
  const active = pathname.split("/").filter(Boolean).at(-1) || "institutions";

  return (
    <div className="space-y-6">
      <PageHeader title={sections.find(([key]) => key === active)?.[1] || "Institutions"} subtitle={sections.find(([key]) => key === active)?.[2]} crumbs={[{ label: "Super admin", to: "/superadmin/institutions" }, { label: sections.find(([key]) => key === active)?.[1] || "Institutions" }]} />
      <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">Demo preview: data and controls below are fixtures only.</p>
      <nav aria-label="Super admin pages" className="flex flex-wrap gap-2">{sections.map(([key, label]) => <Link key={key} to={`/superadmin/${key}`} aria-current={active === key ? "page" : undefined} className={`rounded-md border px-3 py-2 text-sm ${active === key ? "border-blue-700 bg-blue-50 text-blue-800" : "bg-white text-slate-700"}`}>{label}</Link>)}</nav>
      {active === "institutions" && <Card className="overflow-x-auto p-5"><h2 className="mb-4 font-semibold">Recent institutions</h2><table className="min-w-full text-left text-sm"><thead><tr className="border-b"><th className="px-3 py-2">Institution</th><th className="px-3 py-2">Region</th><th className="px-3 py-2">Status</th></tr></thead><tbody>{sampleInstitutions.map((item) => <tr className="border-b" key={item.name}><td className="px-3 py-3">{item.name}</td><td className="px-3 py-3">{item.region}</td><td className="px-3 py-3 capitalize">{item.status}</td></tr>)}</tbody></table></Card>}
      {active === "users" && <Card className="overflow-x-auto p-5"><h2 className="mb-4 font-semibold">Sample platform users</h2><table className="min-w-full text-left text-sm"><thead><tr className="border-b"><th className="px-3 py-2">Name</th><th className="px-3 py-2">Email</th><th className="px-3 py-2">Role</th></tr></thead><tbody>{sampleMembers.map((member) => <tr className="border-b" key={member.id}><td className="px-3 py-3">{member.name}</td><td className="px-3 py-3">{member.email}</td><td className="px-3 py-3">{member.role}</td></tr>)}</tbody></table></Card>}
      {active === "stats" && <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[["Institutions", "12"], ["Active members", "486"], ["Schedules generated", "94"], ["Success rate", "91%"]].map(([label, value]) => <Card key={label} className="space-y-2 p-5"><p className="text-sm text-slate-600">{label}</p><p className="text-3xl font-semibold">{value}</p></Card>)}</div>}
      {active === "generation-settings" && <Card className="space-y-3 p-5"><h2 className="font-semibold">Platform defaults preview</h2><p>Engine: automatic with fallback</p><p>Time budget: 30 seconds</p><p>Soft constraint weights: balanced defaults</p><p className="text-sm text-slate-600">Live settings controls will be connected after the platform settings API contract is confirmed.</p></Card>}
      {active === "audit" && <Card className="p-5"><h2 className="mb-4 font-semibold">Recent activity preview</h2><ul className="space-y-3 text-sm"><li className="border-b pb-3">Institution registration submitted · today</li><li className="border-b pb-3">Member invitation prepared · yesterday</li><li>Generation settings viewed · this week</li></ul></Card>}
    </div>
  );
}
