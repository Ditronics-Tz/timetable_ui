import api from "./api";

const base = "/protected/timetable";

export function buildIcalContent(entries = [], calendarName = "SACAS Timetable") {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//SACAS//Timetable//EN",
    `X-WR-CALNAME:${calendarName}`,
  ];
  entries.forEach((entry, index) => {
    const title =
      entry.module?.name ||
      entry.subject?.name ||
      `Module ${entry.module_id || entry.subject_id || index + 1}`;
    const room = entry.room?.name || `Room ${entry.room_id || ""}`;
    const staff = entry.staff?.name || `Staff ${entry.staff_id || ""}`;
    lines.push(
      "BEGIN:VEVENT",
      `UID:sacas-${entry.id || index + 1}@sacas.local`,
      `SUMMARY:${title} (${entry.day || ""} ${entry.start_time || ""})`,
      `LOCATION:${room}`,
      `DESCRIPTION:Lecturer: ${staff}\\nDay: ${entry.day || ""}\\nTime: ${entry.start_time || ""}-${entry.end_time || ""}`,
      "END:VEVENT"
    );
  });
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

export const timetableService = {
  generate(classId) {
    return api
      .post(`${base}/generate`, { class_id: classId })
      .then((r) => r.data);
  },

  previewGenerate(classId) {
    return api
      .post(`${base}/generate/preview`, { class_id: classId })
      .then((r) => r.data);
  },

  getById(id) {
    return api.get(`${base}/${id}`).then((r) => r.data);
  },

  create(payload) {
    return api.post(`${base}/`, payload).then((r) => r.data);
  },

  update(id, partial) {
    return api.put(`${base}/${id}`, partial).then((r) => r.data);
  },

  remove(id) {
    return api.delete(`${base}/${id}`).then((r) => r.data);
  },

  getByClass(classId) {
    return api.get(`${base}/class/${classId}`).then((r) => r.data);
  },

  getByStaff(staffId) {
    return api.get(`${base}/by-staff/${staffId}`).then((r) => r.data);
  },

  getByCourse(courseId) {
    return api.get(`${base}/by-course/${courseId}`).then((r) => r.data);
  },

  getByRoom(roomId) {
    return api.get(`${base}/by-room/${roomId}`).then((r) => r.data);
  },

  getMyTimetable() {
    return api.get(`${base}/my`).then((r) => r.data);
  },

  validateTimetable(params = {}) {
    return api.get(`${base}/validate`, { params }).then((r) => r.data);
  },

  publishClassTimetable(classId) {
    return api.post(`${base}/class/${classId}/publish`).then((r) => r.data);
  },

  approveClassTimetable(classId) {
    return api.post(`${base}/class/${classId}/approve`).then((r) => r.data);
  },

  unpublishClassTimetable(classId) {
    return api.post(`${base}/class/${classId}/unpublish`).then((r) => r.data);
  },

  createShareLink(classId) {
    return api.post(`${base}/class/${classId}/share`).then((r) => r.data);
  },

  getPublicTimetable(token) {
    return api
      .get(`/public/timetable/${encodeURIComponent(token)}`)
      .then((r) => r.data);
  },

  exportIcalUrl(params = {}) {
    const search = new URLSearchParams(params).toString();
    return `${base}/export/ical${search ? `?${search}` : ""}`;
  },
};

export default timetableService;
