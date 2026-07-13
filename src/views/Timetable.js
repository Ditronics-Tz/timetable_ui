import { useEffect, useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import classService from "../services/classService";
import moduleService from "../services/moduleService";
import subjectService from "../services/subjectService";
import staffService from "../services/staffService";
import roomService from "../services/roomService";
import timetableService from "../services/timetableService";
import { extractApiError, extractSolverDetails } from "../lib/apiError";

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export default function TimetableGenerator() {
  const [classes, setClasses] = useState([]);
  const [modules, setModules] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [staff, setStaff] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [classId, setClassId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [softNotes, setSoftNotes] = useState([]);
  const [unsat, setUnsat] = useState([]);

  const [manual, setManual] = useState({
    class_id: "",
    module_id: "",
    subject_id: "",
    staff_id: "",
    room_id: "",
    day: "monday",
    start_time: "08:00",
    end_time: "09:00",
    use_subject: false,
  });
  const [manualMsg, setManualMsg] = useState("");
  const [manualErr, setManualErr] = useState("");

  useEffect(() => {
    Promise.all([
      classService.list({ limit: 100 }),
      moduleService.list({ limit: 100 }),
      subjectService.list({ limit: 100 }).catch(() => ({ subjects: [] })),
      staffService.list({ limit: 100 }),
      roomService.list({ limit: 100 }),
    ])
      .then(([c, m, sub, s, r]) => {
        setClasses(c.classes || []);
        setModules(m.modules || []);
        setSubjects(sub.subjects || []);
        setStaff(s.staff || []);
        setRooms(r.rooms || []);
      })
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

  const submitManual = async (e) => {
    e.preventDefault();
    setManualErr("");
    setManualMsg("");
    const moduleId = manual.use_subject ? null : Number(manual.module_id) || null;
    const subjectId = manual.use_subject ? Number(manual.subject_id) || null : null;
    if ((!moduleId && !subjectId) || (moduleId && subjectId)) {
      setManualErr("Provide exactly one of module or subject.");
      return;
    }
    try {
      await timetableService.create({
        class_id: Number(manual.class_id),
        module_id: moduleId || undefined,
        subject_id: subjectId || undefined,
        staff_id: Number(manual.staff_id),
        room_id: Number(manual.room_id),
        day: manual.day,
        start_time: manual.start_time,
        end_time: manual.end_time,
      });
      setManualMsg("Timetable entry created.");
    } catch (err) {
      setManualErr(extractApiError(err));
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Card className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">Timetable generator</h1>
        <p className="text-sm text-gray-500">
          Uses the constraint solver when available; falls back to the greedy engine.
        </p>
        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded text-sm space-y-1">
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
          <Label>Class</Label>
          <select
            className="w-full border rounded h-10 px-2"
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
            {loading ? "Working..." : "Preview (dry-run)"}
          </Button>
          <Button disabled={loading} onClick={() => runGenerate(false)}>
            {loading ? "Working..." : "Generate & commit"}
          </Button>
        </div>
        {result && (
          <div className="border rounded p-4 space-y-2 bg-gray-50">
            <p className="font-medium">
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
            <ul className="text-sm max-h-48 overflow-auto space-y-1">
              {(result.timetables || []).slice(0, 30).map((t, i) => (
                <li key={t.id || i}>
                  {t.day} {t.start_time}-{t.end_time} · staff {t.staff_id} · room {t.room_id} ·
                  module {t.module_id ?? "—"} subject {t.subject_id ?? "—"}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Manual entry</h2>
        {manualErr && <div className="text-red-600 text-sm">{manualErr}</div>}
        {manualMsg && <div className="text-green-700 text-sm">{manualMsg}</div>}
        <form onSubmit={submitManual} className="grid md:grid-cols-2 gap-3">
          <div>
            <Label>Class</Label>
            <select
              className="w-full border rounded h-10 px-2"
              required
              value={manual.class_id}
              onChange={(e) => setManual({ ...manual, class_id: e.target.value })}
            >
              <option value="">Select</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Use subject instead of module?</Label>
            <select
              className="w-full border rounded h-10 px-2"
              value={manual.use_subject ? "yes" : "no"}
              onChange={(e) =>
                setManual({ ...manual, use_subject: e.target.value === "yes" })
              }
            >
              <option value="no">Module</option>
              <option value="yes">Subject</option>
            </select>
          </div>
          {!manual.use_subject ? (
            <div>
              <Label>Module</Label>
              <select
                className="w-full border rounded h-10 px-2"
                value={manual.module_id}
                onChange={(e) => setManual({ ...manual, module_id: e.target.value })}
              >
                <option value="">Select</option>
                {modules.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <Label>Subject</Label>
              <select
                className="w-full border rounded h-10 px-2"
                value={manual.subject_id}
                onChange={(e) => setManual({ ...manual, subject_id: e.target.value })}
              >
                <option value="">Select</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <Label>Staff</Label>
            <select
              className="w-full border rounded h-10 px-2"
              required
              value={manual.staff_id}
              onChange={(e) => setManual({ ...manual, staff_id: e.target.value })}
            >
              <option value="">Select</option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Room</Label>
            <select
              className="w-full border rounded h-10 px-2"
              required
              value={manual.room_id}
              onChange={(e) => setManual({ ...manual, room_id: e.target.value })}
            >
              <option value="">Select</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Day</Label>
            <select
              className="w-full border rounded h-10 px-2"
              value={manual.day}
              onChange={(e) => setManual({ ...manual, day: e.target.value })}
            >
              {DAYS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Start</Label>
            <Input
              value={manual.start_time}
              onChange={(e) => setManual({ ...manual, start_time: e.target.value })}
            />
          </div>
          <div>
            <Label>End</Label>
            <Input
              value={manual.end_time}
              onChange={(e) => setManual({ ...manual, end_time: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <Button type="submit">Create entry</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
