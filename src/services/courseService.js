import api from "./api";

const base = "/protected/timetable/courses";

export const courseService = {
  list({ limit = 50, offset = 0 } = {}) {
    return api.get(base, { params: { limit, offset } }).then((r) => r.data);
  },
  get(id) {
    return api.get(`${base}/${id}`).then((r) => r.data);
  },
  create(payload) {
    return api.post(base, payload).then((r) => r.data);
  },
  update(id, payload) {
    return api.put(`${base}/${id}`, payload).then((r) => r.data);
  },
  remove(id) {
    return api.delete(`${base}/${id}`).then((r) => r.data);
  },
};

export default courseService;
