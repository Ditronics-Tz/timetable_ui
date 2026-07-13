import api from "./api";

const base = "/protected/timetable";

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
};

export default timetableService;
