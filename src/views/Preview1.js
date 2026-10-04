import { useCallback, useEffect, useMemo, useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import classService from "../services/classService";
import courseService from "../services/courseService";
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

function TimetableGrid({ entries, label }) {
  const grid = useMemo(() => {
    const map = {};
    for (const entry of entries) {
      map[`${entry.day}|${entry.start_time}`] = entry;
    }
    return map;
  }, [entries]);

  return (
    <table
      aria-label={label}
      className="w-full border-collapse text-xs md:text-sm"
    >
      <thead>
        <tr>
          <th className="border p-2 bg-gray-100">Time</th>
          {DAYS.map((day) => (
            <th key={day} className="border p-2 bg-gray-100 capitalize">
              {day}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {SLOTS.map((slot) => (
          <tr key={slot}>
            <td className="border p-2 font-medium whitespace-nowrap">{slot}</td>
            {DAYS.map((day) => {
              const entry = grid[`${day}|${slot}`];
              return (
                <td
                  key={day}
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
  );
}

export default function Preview1({ initialMode = "class" }) {
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [mode, setMode] = useState(initialMode); // class | staff | course | my
  const [classId, setClassId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [staffId, setStaffId] = useState("");
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState("");
  const [courseError, setCourseError] = useState("");
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      classService.list({ limit: 100 }),
      staffService.list({ limit: 100 }),
    ])
      .then(([c, s]) => {
        setClasses(c.classes || []);
        setStaffList(s.staff || []);
      })
      .catch((e) => setError(extractApiError(e)));
  }, []);

  const loadCourses = useCallback(async () => {
    setCoursesLoading(true);
    setCourseError("");
    try {
      const courseData = await courseService.list({ limit: 100 });
      setCourses(courseData.courses || []);
    } catch (e) {
      setCourseError(extractApiError(e));
    } finally {
      setCoursesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      let data;

      if (mode === "class") {
        data = await timetableService.getByClass(Number(classId));
      } else if (mode === "staff") {
        data = await timetableService.getByStaff(Number(staffId));
      } else if (mode === "course") {
        data = await timetableService.getByCourse(Number(courseId));
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
  };

  const entriesByClass = useMemo(() => {
    const groups = new Map();
    for (const entry of entries) {
      const id = String(entry.class_id);
      if (!groups.has(id)) groups.set(id, []);
      groups.get(id).push(entry);
    }
    return Array.from(groups, ([id, classEntries]) => ({ id, entries: classEntries }));
  }, [entries]);

  const loadDisabled =
    loading ||
    (mode === "class"
      ? !classId
      : mode === "staff"
        ? !staffId
        : mode === "course"
          ? !courseId || coursesLoading || !!courseError
          : false);

  return (
    <div className="p-6">
      <Card className="p-6 space-y-4 overflow-auto">
        <h1 className="text-2xl font-bold">Timetable preview</h1>

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
              <option value="course">Course</option>
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
          ) : mode === "course" ? (
            <div>
              <Label htmlFor="preview_course_id">Course</Label>
              <select
                id="preview_course_id"
                className="border rounded h-10 px-2 block min-w-[200px]"
                disabled={coursesLoading || !!courseError || courses.length === 0}
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
              >
                <option value="">Select</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
              {coursesLoading && (
                <p className="mt-1 text-sm text-gray-500">Loading courses…</p>
              )}
              {!coursesLoading && !courseError && courses.length === 0 && (
                <p className="mt-1 text-sm text-gray-500">No courses available.</p>
              )}
            </div>
          ) : null}

          <Button onClick={load} disabled={loadDisabled}>
            {loading ? "Loading..." : "Load schedule"}
          </Button>
        </div>

        {(error || (mode === "course" && courseError)) && (
          <div role="alert" className="text-red-600 text-sm">
            {error || courseError}
            {mode === "course" && courseError && (
              <button
                type="button"
                className="ml-2 underline"
                onClick={loadCourses}
              >
                Retry
              </button>
            )}
          </div>
        )}

        {mode === "course" && entries.length > 0 ? (
          <div className="space-y-6">
            {entriesByClass.map(({ id, entries: classEntries }) => {
              const className =
                classEntries[0]?.class?.name ||
                classes.find((item) => String(item.id) === id)?.name;
              return (
                <section key={id} className="space-y-2">
                  <h2 className="text-lg font-semibold">{className || `Class ${id}`}</h2>
                  <TimetableGrid
                    entries={classEntries}
                    label={`Timetable for ${className || `class ${id}`}`}
                  />
                </section>
              );
            })}
          </div>
        ) : (
          <TimetableGrid entries={entries} label="Timetable schedule" />
        )}

        {!loading && entries.length === 0 && (
          <p className="text-gray-500 text-sm">
            No timetable entries for this selection.
          </p>
        )}
      </Card>
    </div>
  );
}
