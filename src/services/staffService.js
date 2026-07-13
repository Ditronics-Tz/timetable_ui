import api from "./api";

const base = "/protected/timetable/staff";

export const staffService = {
  list({ limit = 50, offset = 0 } = {}) {
    return api.get(base, { params: { limit, offset } }).then((r) => r.data);
  },
  get(id) {
    return api.get(`${base}/${id}`).then((r) => r.data);
  },
  create(payload) {
    const body = { ...payload };
    if (body.preferences != null && typeof body.preferences !== "string") {
      body.preferences = JSON.stringify(body.preferences);
    }
    return api.post(base, body).then((r) => r.data);
  },
  update(id, payload) {
    const body = { ...payload };
    if (body.preferences != null && typeof body.preferences !== "string") {
      body.preferences = JSON.stringify(body.preferences);
    }
    return api.put(`${base}/${id}`, body).then((r) => r.data);
  },
  remove(id) {
    return api.delete(`${base}/${id}`).then((r) => r.data);
  },
  assignModule(staffId, moduleId) {
    return api
      .post(`${base}/${staffId}/modules/${moduleId}`)
      .then((r) => r.data);
  },
  unassignModule(staffId, moduleId) {
    return api
      .delete(`${base}/${staffId}/modules/${moduleId}`)
      .then((r) => r.data);
  },
  listModules(staffId) {
    return api.get(`${base}/${staffId}/modules`).then((r) => r.data);
  },
};

export default staffService;
