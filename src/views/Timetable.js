import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import PageHeader from "../components/PageHeader";
import GenerationSettingsPanel from "../components/GenerationSettingsPanel";
import classService from "../services/classService";
import timetableService from "../services/timetableService";
import { extractApiError, extractSolverDetails } from "../lib/apiError";
import { getCachedLookup } from "../lib/lookupCache";

/**
 * Timetable generate, conflict validation, and publish/approve lifecycle controls.
 */
export default function TimetableGenerator() {
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [softNotes, setSoftNotes] = useState([]);
  const [unsat, setUnsat] = useState([]);
  const [conflicts, setConflicts] = useState(null);
  const [lifecycleStatus, setLifecycleStatus] = useState("draft");
  const [lifecycleMessage, setLifecycleMessage] = useState("");

  useEffect(() => {
    getCachedLookup("classes:100", () => classService.list({ limit: 100 }))
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
    setLifecycleMessage("");
    try {
      const data = preview
        ? await timetableService.previewGenerate(Number(classId))
        : await timetableService.generate(Number(classId));
      setResult(data);
      setSoftNotes(data.violated_soft_constraints || []);
      if (!preview) {
        setLifecycleStatus("draft");
      }
    } catch (e) {
      const details = extractSolverDetails(e);
      setUnsat(details.unsat_reasons || []);
      setSoftNotes(details.violated_soft_constraints || []);
      setError(extractApiError(e));
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async () => {
    setLoading(true);
    setError("");
    try {
      const params = classId ? { class_id: Number(classId) } : {};
      const res = (await timetableService.validateTimetable?.(params)) || {
        violations: [],
      };
      setConflicts(res.violations || res.conflicts || []);
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleLifecycle = async (action) => {
    if (!classId) {
      setError("Select a class first.");
      return;
    }
    setLoading(true);
    setError("");
    setLifecycleMessage("");
    try {
      if (action === "approve") {
        await timetableService.approveClassTimetable?.(Number(classId));
        setLifecycleStatus("approved");
        setLifecycleMessage("Class timetable marked as approved.");
      } else if (action === "publish") {
        await timetableService.publishClassTimetable?.(Number(classId));
        setLifecycleStatus("published");
        setLifecycleMessage("Class timetable published for students & staff.");
      } else if (action === "unpublish") {
        await timetableService.unpublishClassTimetable?.(Number(classId));
        setLifecycleStatus("draft");
        setLifecycleMessage("Class timetable reverted to draft.");
      }
    } catch (err) {
      setError(extractApiError(err));
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

      <GenerationSettingsPanel />

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

        {lifecycleMessage && (
          <div
            role="status"
            className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md text-sm"
          >
            {lifecycleMessage}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex-1 min-w-[240px]">
            <Label htmlFor="class_id">Class</Label>
            <select
              id="class_id"
              className="w-full border rounded-md h-10 px-2 bg-white mt-1"
              value={classId}
              onChange={(e) => {
                setClassId(e.target.value);
                setConflicts(null);
                setLifecycleMessage("");
              }}
            >
              <option value="">Select class</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (id {c.id})
                </option>
              ))}
            </select>
          </div>
          {classId && (
            <div className="pt-5">
              <span className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium capitalize bg-slate-100 text-slate-800">
                Status: {lifecycleStatus}
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            disabled={loading}
            onClick={() => runGenerate(true)}
          >
            {loading ? "Working…" : "Preview (dry-run)"}
          </Button>
          <Button disabled={loading} onClick={() => runGenerate(false)}>
            {loading ? "Working…" : "Generate & commit"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={handleValidate}
          >
            Validate conflicts
          </Button>
          {classId && (
            <>
              <Button
                type="button"
                variant="outline"
                disabled={loading}
                onClick={() => handleLifecycle("approve")}
              >
                Approve
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={loading}
                onClick={() => handleLifecycle("publish")}
              >
                Publish
              </Button>
              <Button
                type="button"
                variant="ghost"
                disabled={loading}
                onClick={() => handleLifecycle("unpublish")}
              >
                Unpublish
              </Button>
            </>
          )}
        </div>

        {conflicts !== null && (
          <div
            role="region"
            aria-label="Conflicts panel"
            className="rounded-lg border p-4 space-y-2 bg-slate-50 text-sm"
          >
            <h3 className="font-semibold text-slate-900">
              Validation report ({conflicts.length} conflict
              {conflicts.length === 1 ? "" : "s"})
            </h3>
            {conflicts.length === 0 ? (
              <p className="text-emerald-700">
                No room, lecturer, capacity, or lab conflicts detected.
              </p>
            ) : (
              <ul className="list-disc pl-5 space-y-1 text-red-700">
                {conflicts.map((v, idx) => (
                  <li key={idx}>
                    <strong>{v.type || "conflict"}:</strong> {v.message}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {result && (
          <div className="border rounded-lg p-4 space-y-2 bg-slate-50">
            <p className="font-medium text-slate-900">
              {result.message} — {result.count ?? result.timetables?.length ?? 0}{" "}
              slots
              {result.engine ? ` via ${result.engine}` : ""}
              {result.status ? ` (${result.status})` : ""}
            </p>
            {softNotes.length > 0 && (
              <div>
                <p className="text-sm font-medium text-amber-700">
                  Soft constraint notes:
                </p>
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
                  {t.day} {t.start_time}-{t.end_time} · staff {t.staff_id} · room{" "}
                  {t.room_id} · module {t.module_id ?? "—"} subject{" "}
                  {t.subject_id ?? "—"}
                </li>
              ))}
            </ul>
            {classId && (
              <Button asChild variant="link" className="px-0 h-auto">
                <Link to={`/preview?classId=${encodeURIComponent(classId)}`}>
                  View weekly grid
                </Link>
              </Button>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
