import PageHeader from "../components/PageHeader";
import { Card } from "../components/ui/card";
import { sampleAnalytics } from "../mocks/uiShellFixtures";

export default function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" subtitle="A preview of schedule coverage and resource use." crumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Analytics" }]} />
      <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">Sample metrics for layout preview; no live analytics API is connected.</p>
      <Card className="flex flex-wrap items-end gap-4 p-5">
        <label className="space-y-1 text-sm font-medium">From<input aria-label="From date" type="date" className="block h-10 rounded-md border px-3" defaultValue="2026-10-01" /></label>
        <label className="space-y-1 text-sm font-medium">To<input aria-label="To date" type="date" className="block h-10 rounded-md border px-3" defaultValue="2026-10-07" /></label>
        <button type="button" className="h-10 rounded-md border px-4 text-sm">Export CSV</button>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{sampleAnalytics.map(({ label, value, detail }) => <Card key={label} className="space-y-2 p-5"><p className="text-sm font-medium text-slate-600">{label}</p><p className="text-3xl font-semibold">{value}</p><p className="text-xs text-slate-500">{detail}</p></Card>)}</div>
      <Card className="p-5"><h2 className="font-semibold">Weekly coverage</h2><div className="mt-4 grid h-40 place-items-center rounded-md border border-dashed text-sm text-slate-500">Charts appear here when analytics data is connected.</div></Card>
    </div>
  );
}
