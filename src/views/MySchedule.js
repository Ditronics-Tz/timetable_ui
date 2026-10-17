import { useCallback, useEffect, useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import TimetableGrid from "../components/TimetableGrid";
import { Button } from "../components/ui/button";
import timetableService, { buildIcalContent } from "../services/timetableService";
import { extractApiError } from "../lib/apiError";

const DAY_NAMES = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export default function MySchedule() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [missingStaffProfile, setMissingStaffProfile] = useState(false);
  const [viewMode, setViewMode] = useState("week"); // week | today

  const loadSchedule = useCallback(async () => {
    setLoading(true);
    setError("");
    setMissingStaffProfile(false);
    try {
      const result = await timetableService.getMyTimetable();
      setEntries(result.timetables || []);
    } catch (err) {
      const message = extractApiError(err);
      if (
        err?.response?.status === 404 ||
        message.toLowerCase().includes("no staff profile")
      ) {
        setMissingStaffProfile(true);
      } else {
        setError(message);
      }
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSchedule();
  }, [loadSchedule]);

  const todayName = useMemo(() => {
    const dayIndex = new Date().getDay();
    return DAY_NAMES[dayIndex] || "monday";
  }, []);

  const todayEntries = useMemo(() => {
    return entries.filter(
      (e) => String(e.day || "").toLowerCase() === todayName
    );
  }, [entries, todayName]);

  const handleExportIcal = () => {
    if (typeof URL === "undefined" || !URL.createObjectURL) return;
    const content = buildIcalContent(entries, "My SACAS Schedule");
    const url = URL.createObjectURL(
      new Blob([content], { type: "text/calendar;charset=utf-8" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "my-schedule.ics";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Schedule"
        subtitle="Your allocated teaching sessions for the week."
        crumbs={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "My Schedule" },
        ]}
        actions={
          entries.length > 0 ? (
            <div className="flex flex-wrap gap-2 print:hidden">
              <Button
                type="button"
                size="sm"
                variant={viewMode === "week" ? "default" : "outline"}
                onClick={() => setViewMode("week")}
              >
                Week view
              </Button>
              <Button
                type="button"
                size="sm"
                variant={viewMode === "today" ? "default" : "outline"}
                onClick={() => setViewMode("today")}
              >
                Today view
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleExportIcal}
              >
                Export iCal
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => window.print?.()}
              >
                Print
              </Button>
            </div>
          ) : null
        }
      />

      <section
        className="rounded-lg border bg-white p-6 shadow-sm space-y-4"
        aria-label="My weekly schedule"
      >
        {loading ? (
          <p role="status" className="py-8 text-center text-gray-500">
            Loading your schedule…
          </p>
        ) : missingStaffProfile ? (
          <div role="status" className="rounded-md bg-amber-50 p-4 text-amber-900">
            Your account isn&apos;t linked to a staff profile — contact an
            administrator to be added.
          </div>
        ) : error ? (
          <div role="alert" className="space-y-3 text-red-700">
            <p>{error}</p>
            <button type="button" className="underline" onClick={loadSchedule}>
              Try again
            </button>
          </div>
        ) : entries.length === 0 ? (
          <p role="status" className="py-8 text-center text-gray-500">
            No sessions are scheduled for this week.
          </p>
        ) : viewMode === "today" ? (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold capitalize text-slate-800">
              Sessions for today ({todayName})
            </h2>
            {todayEntries.length === 0 ? (
              <p className="text-sm text-slate-500">
                No teaching sessions scheduled for {todayName}.
              </p>
            ) : (
              <ul className="divide-y rounded border">
                {todayEntries.map((item, idx) => (
                  <li
                    key={item.id || idx}
                    className="flex items-center justify-between p-3 text-sm"
                  >
                    <div>
                      <p className="font-medium text-slate-900">
                        {item.module?.name ||
                          item.subject?.name ||
                          `Module ${item.module_id || item.subject_id}`}
                      </p>
                      <p className="text-xs text-slate-500">
                        Room: {item.room?.name || item.room_id || "—"} · Class:{" "}
                        {item.class?.name || item.class_id || "—"}
                      </p>
                    </div>
                    <span className="font-mono text-xs text-slate-700">
                      {item.start_time}
                      {item.end_time ? ` - ${item.end_time}` : ""}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <TimetableGrid
            entries={entries}
            label="My weekly schedule"
            showLegend
          />
        )}
      </section>
    </div>
  );
}
