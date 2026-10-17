import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import { Card } from "../components/ui/card";
import { sampleAnalytics } from "../mocks/uiShellFixtures";
import analyticsService from "../services/analyticsService";
import { extractApiError } from "../lib/apiError";

export default function AnalyticsDashboard() {
  const [fromDate, setFromDate] = useState("2026-10-01");
  const [toDate, setToDate] = useState("2026-10-07");
  const [data, setData] = useState({
    cards: sampleAnalytics,
    room_utilization: [],
    staff_workload: [],
    heatmap: null,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    analyticsService
      .getOverview({ from: fromDate, to: toDate })
      .then((res) => {
        if (active && res) {
          setData((prev) => ({
            ...prev,
            ...res,
            cards: res.cards || sampleAnalytics,
          }));
        }
      })
      .catch((err) => {
        if (active) setError(extractApiError(err));
      });
    return () => {
      active = false;
    };
  }, [fromDate, toDate]);

  const handleExportCsv = () => {
    if (typeof URL === "undefined" || !URL.createObjectURL) return;
    const rows = [
      "Metric,Value,Detail",
      ...(data.cards || sampleAnalytics).map(
        (c) => `"${c.label}","${c.value}","${c.detail || ""}"`
      ),
    ];
    const url = URL.createObjectURL(
      new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `sacas-analytics-${fromDate}-to-${toDate}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const heatmap = data.heatmap;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        subtitle="Schedule coverage, room utilisation, and lecturer workload metrics."
        crumbs={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Analytics" },
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

      <Card className="flex flex-wrap items-end gap-4 p-5">
        <label className="space-y-1 text-sm font-medium">
          From
          <input
            aria-label="From date"
            type="date"
            className="block h-10 rounded-md border px-3"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </label>
        <label className="space-y-1 text-sm font-medium">
          To
          <input
            aria-label="To date"
            type="date"
            className="block h-10 rounded-md border px-3"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </label>
        <button
          type="button"
          onClick={handleExportCsv}
          className="h-10 rounded-md border px-4 text-sm hover:bg-slate-50"
        >
          Export CSV
        </button>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {(data.cards || sampleAnalytics).map(({ label, value, detail }) => (
          <Card key={label} className="space-y-2 p-5">
            <p className="text-sm font-medium text-slate-600">{label}</p>
            <p className="text-3xl font-semibold">{value}</p>
            <p className="text-xs text-slate-500">{detail}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5 space-y-3">
          <h2 className="font-semibold">Room utilisation</h2>
          {(data.room_utilization || []).length === 0 ? (
            <p className="text-sm text-slate-500">
              No room utilisation records for this period.
            </p>
          ) : (
            <ul className="space-y-3 text-sm">
              {data.room_utilization.map((room) => (
                <li key={room.name} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="font-medium">{room.name}</span>
                    <span className="text-slate-600">
                      {room.utilization_pct}% ({room.booked_hours}h)
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded bg-slate-100">
                    <div
                      className="h-full bg-blue-600"
                      style={{
                        width: `${Math.min(100, room.utilization_pct || 0)}%`,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-5 space-y-3">
          <h2 className="font-semibold">Lecturer load vs max hours</h2>
          {(data.staff_workload || []).length === 0 ? (
            <p className="text-sm text-slate-500">
              No lecturer workload records for this period.
            </p>
          ) : (
            <ul className="space-y-3 text-sm">
              {data.staff_workload.map((staff) => {
                const pct = staff.max_hours
                  ? Math.round((staff.scheduled_hours / staff.max_hours) * 100)
                  : 0;
                return (
                  <li key={staff.name} className="space-y-1">
                    <div className="flex justify-between">
                      <span className="font-medium">{staff.name}</span>
                      <span className="text-slate-600">
                        {staff.scheduled_hours}h / {staff.max_hours}h ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded bg-slate-100">
                      <div
                        className="h-full bg-emerald-600"
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>

      <Card className="p-5 space-y-3">
        <h2 className="font-semibold">Weekly coverage</h2>
        {heatmap?.days && heatmap?.slots ? (
          <div className="overflow-x-auto">
            <table
              aria-label="Weekly slot coverage heatmap"
              className="min-w-full text-left text-xs md:text-sm border-collapse"
            >
              <thead>
                <tr>
                  <th className="border p-2 bg-slate-50">Slot</th>
                  {heatmap.days.map((d) => (
                    <th key={d} className="border p-2 bg-slate-50 capitalize">
                      {d}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heatmap.slots.map((slot) => (
                  <tr key={slot}>
                    <td className="border p-2 font-medium">{slot}</td>
                    {heatmap.days.map((day) => {
                      const count = heatmap.counts?.[`${day}|${slot}`] ?? 0;
                      return (
                        <td
                          key={day}
                          className={`border p-2 text-center ${
                            count >= 6
                              ? "bg-blue-100 font-semibold text-blue-900"
                              : count > 0
                                ? "bg-blue-50 text-slate-800"
                                : "text-slate-400"
                          }`}
                        >
                          {count} sessions
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-4 grid h-40 place-items-center rounded-md border border-dashed text-sm text-slate-500">
            Charts appear here when analytics data is connected.
          </div>
        )}
      </Card>
    </div>
  );
}
