import api from "./api";

const base = "/protected/timetable/rooms";

export const roomService = {
  list({ limit = 50, offset = 0 } = {}) {
    return api.get(base, { params: { limit, offset } }).then((r) => r.data);
  },
  get(id) {
    return api.get(`${base}/${id}`).then((r) => r.data);
  },
  create(payload) {
    // features & allowed_courses as JSON strings
    const body = {
      name: payload.name,
      capacity: payload.capacity,
      sticky: !!payload.sticky,
    };
    if (payload.features != null) {
      body.features =
        typeof payload.features === "string"
          ? payload.features
          : JSON.stringify(payload.features);
    }
    if (payload.allowed_courses != null) {
      body.allowed_courses =
        typeof payload.allowed_courses === "string"
          ? payload.allowed_courses
          : JSON.stringify(payload.allowed_courses);
    }
    return api.post(base, body).then((r) => r.data);
  },
  update(id, payload) {
    const body = { ...payload };
    if (body.features != null && typeof body.features !== "string") {
      body.features = JSON.stringify(body.features);
    }
    if (body.allowed_courses != null && typeof body.allowed_courses !== "string") {
      body.allowed_courses = JSON.stringify(body.allowed_courses);
    }
    return api.put(`${base}/${id}`, body).then((r) => r.data);
  },
  remove(id) {
    return api.delete(`${base}/${id}`).then((r) => r.data);
  },
};

export default roomService;
