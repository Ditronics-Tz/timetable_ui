import { useMemo } from "react";

export const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday"];
export const SLOTS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
];

const TYPE_STYLES = {
  core: "bg-blue-50 border-blue-200 text-blue-950",
  elective: "bg-emerald-50 border-emerald-200 text-emerald-950",
  general_subject: "bg-purple-50 border-purple-200 text-purple-950",
  lab: "bg-amber-50 border-amber-200 text-amber-950",
};

function cellColorClass(entry) {
  if (!entry) return "";
  if (entry.module?.requires_lab || entry.room?.lab) {
    return TYPE_STYLES.lab;
  }
  const type = entry.module?.type || (entry.subject_id ? "general_subject" : "core");
  return TYPE_STYLES[type] || TYPE_STYLES.core;
}

export function cellLabel(entry) {
  if (!entry) return "";
  const subject =
    entry.module?.name ||
    entry.subject?.name ||
    `M${entry.module_id || entry.subject_id}`;
  const staff = entry.staff?.name || `S${entry.staff_id}`;
  const room = entry.room?.name || `R${entry.room_id}`;
  return `${subject}\n${staff}\n${room}`;
}

export default function TimetableGrid({
  entries = [],
  label = "Timetable schedule",
  days,
  slots,
  showLegend = false,
}) {
  const effectiveDays = useMemo(() => {
    if (Array.isArray(days) && days.length > 0) return days;
    const hasSaturday = entries.some(
      (e) => String(e.day || "").toLowerCase() === "saturday"
    );
    return hasSaturday ? [...DAYS, "saturday"] : DAYS;
  }, [days, entries]);

  const effectiveSlots = useMemo(() => {
    if (Array.isArray(slots) && slots.length > 0) return slots;
    const set = new Set(SLOTS);
    for (const entry of entries) {
      if (entry.start_time) set.add(entry.start_time);
    }
    return Array.from(set).sort();
  }, [slots, entries]);

  const grid = useMemo(() => {
    const cells = {};
    for (const entry of entries) {
      const dayKey = String(entry.day || "").toLowerCase();
      cells[`${dayKey}|${entry.start_time}`] = entry;
    }
    return cells;
  }, [entries]);

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <table
          aria-label={label}
          className="w-full min-w-[640px] border-collapse text-xs md:text-sm"
        >
          <thead>
            <tr>
              <th className="border p-2 bg-gray-100">Time</th>
              {effectiveDays.map((day) => (
                <th key={day} className="border p-2 bg-gray-100 capitalize">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {effectiveSlots.map((slot) => (
              <tr key={slot}>
                <td className="border p-2 font-medium whitespace-nowrap">
                  {slot}
                </td>
                {effectiveDays.map((day) => {
                  const entry = grid[`${day}|${slot}`];
                  return (
                    <td
                      key={day}
                      className={`border p-2 align-top whitespace-pre-line ${cellColorClass(
                        entry
                      )}`}
                    >
                      {cellLabel(entry)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showLegend && (
        <div
          className="flex flex-wrap items-center gap-4 text-xs text-slate-600 print:hidden"
          aria-label="Timetable color legend"
        >
          <span className="font-medium text-slate-700">Legend:</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded border border-blue-300 bg-blue-100" />
            Core module
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded border border-emerald-300 bg-emerald-100" />
            Elective
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded border border-purple-300 bg-purple-100" />
            General subject
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded border border-amber-300 bg-amber-100" />
            Lab session
          </span>
        </div>
      )}
    </div>
  );
}
