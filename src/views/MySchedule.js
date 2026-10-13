import { useCallback, useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import TimetableGrid from "../components/TimetableGrid";
import timetableService from "../services/timetableService";
import { extractApiError } from "../lib/apiError";

export default function MySchedule() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [missingStaffProfile, setMissingStaffProfile] = useState(false);

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

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Schedule"
        subtitle="Your allocated teaching sessions for the week."
        crumbs={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "My Schedule" },
        ]}
      />

      <section className="rounded-lg border bg-white p-6 shadow-sm space-y-4" aria-label="My weekly schedule">
        {loading ? (
          <p role="status" className="py-8 text-center text-gray-500">Loading your schedule…</p>
        ) : missingStaffProfile ? (
          <div role="status" className="rounded-md bg-amber-50 p-4 text-amber-900">
            Your account isn&apos;t linked to a staff profile — contact an administrator to be added.
          </div>
        ) : error ? (
          <div role="alert" className="space-y-3 text-red-700">
            <p>{error}</p>
            <button type="button" className="underline" onClick={loadSchedule}>Try again</button>
          </div>
        ) : entries.length === 0 ? (
          <p role="status" className="py-8 text-center text-gray-500">No sessions are scheduled for this week.</p>
        ) : (
          <TimetableGrid entries={entries} label="My weekly schedule" />
        )}
      </section>
    </div>
  );
}
