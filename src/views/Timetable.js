import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import PageHeader from "../components/PageHeader";
import classService from "../services/classService";
import timetableService from "../services/timetableService";
import { extractApiError, extractSolverDetails } from "../lib/apiError";

/**
 * Timetable generate + preview only.
 * Manual slot entry removed from UI — API POST /timetable remains for future pinned entries.
 */
export default function TimetableGenerator() {
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [softNotes, setSoftNotes] = useState([]);
  const [unsat, setUnsat] = useState([]);

  useEffect(() => {
    classService
      .list({ limit: 100 })
      .then((c) => setClasses(c.classes || []))
      .catch((e) => setError(extractApiError(e)));
  }, []);

  const runGenerate = async (preview) => {
    if (!classId) {
      setError("Select a class first.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    setSoftNotes([]);
    setUnsat([]);
    try {
      const data = preview
        ? await timetableService.previewGenerate(Number(classId))
        : await timetableService.generate(Number(classId));
      setResult(data);
      setSoftNotes(data.violated_soft_constraints || []);
    } catch (e) {
      const details = extractSolverDetails(e);
      setUnsat(details.unsat_reasons || []);
      setSoftNotes(details.violated_soft_constraints || []);
      setError(extractApiError(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Timetable generator"
        subtitle="Preview a dry-run schedule, then commit. Full weekly grid is under Preview."
        crumbs={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Timetable" },
        ]}
        actions={
          <Button asChild variant="outline" size="sm">
            <Link to="/preview">Open preview</Link>
          </Button>
        }
      />

      <Card className="p-6 space-y-4 border shadow-sm max-w-3xl">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm space-y-1">
            <div>{error}</div>
            {unsat.length > 0 && (
              <ul className="list-disc pl-5">
                {unsat.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div>
          <Label htmlFor="class_id">Class</Label>
          <select
            id="class_id"
            className="w-full border rounded-md h-10 px-2 bg-white mt-1"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
          >
            <option value="">Select class</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} (id {c.id})
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" disabled={loading} onClick={() => runGenerate(true)}>
            {loading ? "Working…" : "Preview (dry-run)"}
          </Button>
          <Button disabled={loading} onClick={() => runGenerate(false)}>
            {loading ? "Working…" : "Generate & commit"}
          </Button>
        </div>

        {result && (
          <div className="border rounded-lg p-4 space-y-2 bg-slate-50">
            <p className="font-medium text-slate-900">
              {result.message} — {result.count ?? result.timetables?.length ?? 0} slots
              {result.engine ? ` via ${result.engine}` : ""}
              {result.status ? ` (${result.status})` : ""}
            </p>
            {softNotes.length > 0 && (
              <div>
                <p className="text-sm font-medium text-amber-700">Soft constraint notes:</p>
                <ul className="list-disc pl-5 text-sm text-amber-800">
                  {softNotes.map((n, i) => (
                    <li key={i}>{n}</li>
                  ))}
                </ul>
              </div>
            )}
            <ul className="text-sm max-h-48 overflow-auto space-y-1 text-slate-700">
              {(result.timetables || []).slice(0, 30).map((t, i) => (
                <li key={t.id || i}>
                  {t.day} {t.start_time}-{t.end_time} · staff {t.staff_id} · room {t.room_id} ·
                  module {t.module_id ?? "—"} subject {t.subject_id ?? "—"}
                </li>
              ))}
            </ul>
            {classId && (
              <Button asChild variant="link" className="px-0 h-auto">
                <Link to={`/preview`}>View weekly grid</Link>
              </Button>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
