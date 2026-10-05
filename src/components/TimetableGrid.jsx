import { useMemo } from "react";

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

export default function TimetableGrid({ entries, label = "Timetable schedule" }) {
  const grid = useMemo(() => {
    const cells = {};
    for (const entry of entries) {
      cells[`${entry.day}|${entry.start_time}`] = entry;
    }
    return cells;
  }, [entries]);

  return (
    <div className="overflow-x-auto">
      <table aria-label={label} className="w-full min-w-[640px] border-collapse text-xs md:text-sm">
        <thead>
          <tr>
            <th className="border p-2 bg-gray-100">Time</th>
            {DAYS.map((day) => (
              <th key={day} className="border p-2 bg-gray-100 capitalize">{day}</th>
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
                    className={`border p-2 align-top whitespace-pre-line ${entry ? "bg-blue-50" : ""}`}
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
  );
}
