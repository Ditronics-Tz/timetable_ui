import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import PageHeader from "../components/PageHeader";
import TimetableGrid from "../components/TimetableGrid";
import classService from "../services/classService";
import courseService from "../services/courseService";
import staffService from "../services/staffService";
import roomService from "../services/roomService";
import timetableService, { buildIcalContent } from "../services/timetableService";
import { extractApiError } from "../lib/apiError";
import { getCachedLookup } from "../lib/lookupCache";

function downloadBlob(filename, content, mimeType) {
  if (typeof URL === "undefined" || !URL.createObjectURL) return;
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function entriesToCsv(entries = []) {
  const header = "Day,Start Time,End Time,Module/Subject,Lecturer,Room,Class";
  const rows = entries.map((e) => {
    const mod = e.module?.name || e.subject?.name || e.module_id || e.subject_id || "";
    const staff = e.staff?.name || e.staff_id || "";
    const room = e.room?.name || e.room_id || "";
    const cls = e.class?.name || e.class_id || "";
    return [
      e.day || "",
      e.start_time || "",
      e.end_time || "",
      `"${String(mod).replaceAll('"', '""')}"`,
      `"${String(staff).replaceAll('"', '""')}"`,
      `"${String(room).replaceAll('"', '""')}"`,
      `"${String(cls).replaceAll('"', '""')}"`,
    ].join(",");
  });
  return [header, ...rows].join("\n");
}

export default function Preview1({ initialMode = "class" }) {
  const [searchParams] = useSearchParams();
  const requestedClassId = searchParams.get("classId");
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [mode, setMode] = useState(initialMode); // class | staff | course | room | my
  const [classId, setClassId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [staffId, setStaffId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState("");
  const [courseError, setCourseError] = useState("");
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [classesLoaded, setClassesLoaded] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    Promise.all([
      getCachedLookup("classes:100", () => classService.list({ limit: 100 })),
      getCachedLookup("staff:100", () => staffService.list({ limit: 100 })),
    ])
      .then(([c, s]) => {
        setClasses(c.classes || []);
        setStaffList(s.staff || []);
      })
      .catch((e) => setError(extractApiError(e)))
      .finally(() => setClassesLoaded(true));
  }, []);

  const loadCourses = useCallback(async () => {
    setCoursesLoading(true);
    setCourseError("");
    try {
      const courseData = await courseService.list({ limit: 100 });
      setCourses(courseData?.courses || []);
    } catch (e) {
      setCourseError(extractApiError(e));
    } finally {
      setCoursesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  useEffect(() => {
    if (mode !== "room" || rooms.length > 0) return;
    roomService
      .list?.({ limit: 100 })
      ?.then((data) => setRooms(data?.rooms || []))
      .catch(() => {});
  }, [mode, rooms.length]);

  const load = useCallback(
    async ({
      mode: selectedMode,
      classId: selectedClassId,
      staffId: selectedStaffId,
      courseId: selectedCourseId,
      roomId: selectedRoomId,
    } = {}) => {
      const activeMode = selectedMode ?? mode;
      const activeClassId = selectedClassId ?? classId;
      const activeStaffId = selectedStaffId ?? staffId;
      const activeCourseId = selectedCourseId ?? courseId;
      const activeRoomId = selectedRoomId ?? roomId;

      setLoading(true);
      setError("");
      setShareUrl("");

      try {
        let data;

        if (activeMode === "class") {
          data = await timetableService.getByClass(Number(activeClassId));
        } else if (activeMode === "staff") {
          data = await timetableService.getByStaff(Number(activeStaffId));
        } else if (activeMode === "course") {
          data = await timetableService.getByCourse(Number(activeCourseId));
        } else if (activeMode === "room") {
          data = await timetableService.getByRoom(Number(activeRoomId));
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
    },
    [classId, courseId, mode, roomId, staffId]
  );

  useEffect(() => {
    if (!classesLoaded || !requestedClassId) return;

    const matchingClass = classes.find(
      (item) => String(item.id) === requestedClassId
    );
    if (!matchingClass) return;

    const matchedClassId = String(matchingClass.id);
    setMode("class");
    setClassId(matchedClassId);
    load({ mode: "class", classId: matchedClassId });
  }, [classes, classesLoaded, load, requestedClassId]);

  const entriesByClass = useMemo(() => {
    const groups = new Map();
    for (const entry of entries) {
      const id = String(entry.class_id);
      if (!groups.has(id)) groups.set(id, []);
      groups.get(id).push(entry);
    }
    return Array.from(groups, ([id, classEntries]) => ({
      id,
      entries: classEntries,
    }));
  }, [entries]);

  const loadDisabled =
    loading ||
    (mode === "class"
      ? !classId
      : mode === "staff"
        ? !staffId
        : mode === "course"
          ? !courseId || coursesLoading || !!courseError
          : mode === "room"
            ? !roomId
            : false);

  const handleShareLink = async () => {
    if (!classId) return;
    try {
      const res = await timetableService.createShareLink?.(Number(classId));
      const token = res?.token || `class-${classId}`;
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      setShareUrl(`${origin}/public/timetable/${token}`);
    } catch {
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      setShareUrl(`${origin}/public/timetable/class-${classId}`);
    }
  };

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
        <div className="flex flex-wrap gap-3 items-end print:hidden">
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
                setShareUrl("");
              }}
            >
              <option value="class">Class</option>
              <option value="staff">Staff</option>
              <option value="course">Course</option>
              <option value="room">Room</option>
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
                disabled={
                  coursesLoading || !!courseError || courses.length === 0
                }
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
                <p className="mt-1 text-sm text-gray-500">
                  No courses available.
                </p>
              )}
            </div>
          ) : mode === "room" ? (
            <div>
              <Label htmlFor="preview_room_id">Room</Label>
              <select
                id="preview_room_id"
                className="border rounded h-10 px-2 block min-w-[200px]"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
              >
                <option value="">Select</option>
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          <Button onClick={() => load()} disabled={loadDisabled}>
            {loading ? "Loading..." : "Load schedule"}
          </Button>

          {entries.length > 0 && (
            <div className="flex flex-wrap gap-2 ml-auto">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => window.print?.()}
              >
                Print / PDF
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  downloadBlob(
                    "timetable.csv",
                    entriesToCsv(entries),
                    "text/csv;charset=utf-8"
                  )
                }
              >
                Export CSV
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  downloadBlob(
                    "timetable.ics",
                    buildIcalContent(entries),
                    "text/calendar;charset=utf-8"
                  )
                }
              >
                Export iCal
              </Button>
              {mode === "class" && classId && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleShareLink}
                >
                  Share public link
                </Button>
              )}
            </div>
          )}
        </div>

        {shareUrl && (
          <div
            role="status"
            className="rounded-md border border-blue-200 bg-blue-50 p-3 text-xs text-blue-900 flex flex-wrap items-center justify-between gap-2 print:hidden"
          >
            <span>
              Public student link: <a href={shareUrl} className="underline font-mono">{shareUrl}</a>
            </span>
          </div>
        )}

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
                  <h2 className="text-lg font-semibold">
                    {className || `Class ${id}`}
                  </h2>
                  <TimetableGrid
                    entries={classEntries}
                    label={`Timetable for ${className || `class ${id}`}`}
                    showLegend
                  />
                </section>
              );
            })}
          </div>
        ) : (
          <TimetableGrid
            entries={entries}
            label="Timetable schedule"
            showLegend={entries.length > 0}
          />
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
