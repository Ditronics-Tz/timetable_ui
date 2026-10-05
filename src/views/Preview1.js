import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import PageHeader from "../components/PageHeader";
import classService from "../services/classService";
import staffService from "../services/staffService";
import timetableService from "../services/timetableService";
import { extractApiError } from "../lib/apiError";

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday"];
const SLOTS = ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];

function cellLabel(entry) {
  if (!entry) return "";
  const subject =
    entry.module?.name ||
    entry.subject?.name ||
    `M${entry.module_id || entry.subject_id}`;
  const staff = entry.staff?.name || `S${entry.staff_id}`;
  const room = entry.room?.name || `R${entry.room_id}`;
  return `${subject}\n${staff}\n${room}`;
}

export default function Preview1() {
  const [searchParams] = useSearchParams();
  const requestedClassId = searchParams.get("classId");
  const [classes, setClasses] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [mode, setMode] = useState("class"); // class | staff | my
  const [classId, setClassId] = useState("");
  const [staffId, setStaffId] = useState("");
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [classesLoaded, setClassesLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      classService.list({ limit: 100 }),
      staffService.list({ limit: 100 }),
    ])
      .then(([c, s]) => {
        setClasses(c.classes || []);
        setStaffList(s.staff || []);
      })
      .catch((e) => setError(extractApiError(e)))
      .finally(() => setClassesLoaded(true));
  }, []);

  const loadSchedule = useCallback(async (selectionMode, selectionId) => {
    setLoading(true);
    setError("");

    try {
      let data;

      if (selectionMode === "class") {
        data = await timetableService.getByClass(Number(selectionId));
      } else if (selectionMode === "staff") {
        data = await timetableService.getByStaff(Number(selectionId));
      } else {
        data = await timetableService.getMyTimetable();
      }

      setEntries(data.timetables || []);
    } catch (e) {
      setError(extractApiError(e));
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!classesLoaded || !requestedClassId) return;

    const matchingClass = classes.find(
      (item) => String(item.id) === requestedClassId
    );
    if (!matchingClass) return;

    setMode("class");
    setClassId(String(matchingClass.id));
    loadSchedule("class", matchingClass.id);
  }, [classes, classesLoaded, loadSchedule, requestedClassId]);

  const load = () =>
    loadSchedule(mode, mode === "class" ? classId : staffId);

  const grid = useMemo(() => {
    const map = {};

    for (const e of entries) {
      const key = `${e.day}|${e.start_time}`;
      map[key] = e;
    }

    return map;
  }, [entries]);

  const loadDisabled =
    loading ||
    (mode === "class" ? !classId : mode === "staff" ? !staffId : false);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Timetable preview"
        crumbs={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Timetable", to: "/timetable" },
          { label: "Preview" },
        ]}
      />
      <Card className="p-6 space-y-4 overflow-auto">

        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <Label htmlFor="preview_mode">View by</Label>

            <select
              id="preview_mode"
              className="border rounded h-10 px-2 block"
              value={mode}
              onChange={(e) => {
                setMode(e.target.value);
                setEntries([]);
                setError("");
              }}
            >
              <option value="class">Class</option>
              <option value="staff">Staff</option>
              <option value="my">My Timetable</option>
            </select>
          </div>

          {mode === "class" ? (
            <div>
              <Label htmlFor="preview_class_id">Class</Label>

              <select
                id="preview_class_id"
                className="border rounded h-10 px-2 block min-w-[200px]"
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
              >
                <option value="">Select</option>

                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          ) : mode === "staff" ? (
            <div>
              <Label htmlFor="preview_staff_id">Staff</Label>

              <select
                id="preview_staff_id"
                className="border rounded h-10 px-2 block min-w-[200px]"
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
              >
                <option value="">Select</option>

                {staffList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          <Button onClick={load} disabled={loadDisabled}>
            {loading ? "Loading..." : "Load schedule"}
          </Button>
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <table className="w-full border-collapse text-xs md:text-sm">
          <thead>
            <tr>
              <th className="border p-2 bg-gray-100">Time</th>

              {DAYS.map((d) => (
                <th
                  key={d}
                  className="border p-2 bg-gray-100 capitalize"
                >
                  {d}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {SLOTS.map((slot) => (
              <tr key={slot}>
                <td className="border p-2 font-medium whitespace-nowrap">
                  {slot}
                </td>

                {DAYS.map((d) => {
                  const entry = grid[`${d}|${slot}`];

                  return (
                    <td
                      key={d}
                      className={`border p-2 align-top whitespace-pre-line ${
                        entry ? "bg-blue-50" : ""
                      }`}
                    >
                      {cellLabel(entry)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {!loading && entries.length === 0 && (
          <p className="text-gray-500 text-sm">
            No timetable entries for this selection.
          </p>
        )}
      </Card>
    </div>
  );
}
