import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import TimetableGrid from "../components/TimetableGrid";
import timetableService, { buildIcalContent } from "../services/timetableService";
import { extractApiError } from "../lib/apiError";

export default function PublicTimetable() {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    let active = true;
    setLoading(true);
    timetableService
      .getPublicTimetable(token)
      .then((res) => {
        if (active) setData(res);
      })
      .catch((err) => {
        if (active) setError(extractApiError(err));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [token]);

  const entries = data?.timetables || [];
  const title = data?.class_name || data?.title || "Published Class Timetable";

  const handleDownloadIcal = () => {
    if (typeof URL === "undefined" || !URL.createObjectURL) return;
    const content = buildIcalContent(entries, title);
    const url = URL.createObjectURL(
      new Blob([content], { type: "text/calendar;charset=utf-8" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "class-timetable.ics";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
            SACAS Public Schedule
          </p>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        </div>
        <div className="flex gap-2 print:hidden">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => window.print?.()}
          >
            Print / Save PDF
          </Button>
          {entries.length > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDownloadIcal}
            >
              Export iCal (.ics)
            </Button>
          )}
        </div>
      </header>

      <Card className="p-6 space-y-4">
        {loading ? (
          <p role="status" className="py-8 text-center text-slate-500">
            Loading published timetable…
          </p>
        ) : error ? (
          <div role="alert" className="text-sm text-red-700">
            {error}
          </div>
        ) : entries.length === 0 ? (
          <p className="py-8 text-center text-slate-500 text-sm">
            No published sessions found for this link.
          </p>
        ) : (
          <TimetableGrid
            entries={entries}
            label={title}
            showLegend
          />
        )}
      </Card>
    </div>
  );
}
