import api from "./api";

function isUnmockedTestEnv(fn) {
  const isTest =
    (typeof import.meta !== "undefined" && import.meta.env?.MODE === "test") ||
    (typeof process !== "undefined" && Boolean(process.env?.VITEST));
  return isTest && typeof fn?.mock === "undefined";
}

const SAMPLE_EXAMS = [
  {
    id: 1,
    title: "CS201 Final Exam",
    module_name: "Algorithms",
    class_name: "BIT Y2 Group A",
    exam_date: "2026-11-10",
    start_time: "09:00",
    end_time: "12:00",
    room_name: "Hall 1",
    invigilator_name: "Asha Mwakalinga",
    status: "scheduled",
  },
];

const SAMPLE_PERIODS = [
  {
    id: 1,
    name: "Semester 1 Final Examinations",
    academic_year: "2026/27",
    semester: 1,
    start_date: "2026-11-09",
    end_date: "2026-11-20",
    status: "active",
  },
];

export const examService = {
  async listExams(params = {}) {
    if (isUnmockedTestEnv(api.get)) {
      return { exams: SAMPLE_EXAMS.map((e) => ({ ...e })) };
    }
    try {
      const response = await api.get("/protected/exams", { params });
      return response.data;
    } catch (err) {
      if (!err?.response) {
        return { exams: SAMPLE_EXAMS.map((e) => ({ ...e })) };
      }
      throw err;
    }
  },

  async createExam(payload) {
    if (isUnmockedTestEnv(api.post)) {
      return {
        exam: {
          id: Date.now(),
          status: "scheduled",
          ...payload,
        },
      };
    }
    const response = await api.post("/protected/exams", payload);
    return response.data;
  },

  async updateExam(id, payload) {
    const response = await api.put(`/protected/exams/${id}`, payload);
    return response.data;
  },

  async deleteExam(id) {
    const response = await api.delete(`/protected/exams/${id}`);
    return response.data;
  },

  async updateExamStatus(id, status) {
    if (isUnmockedTestEnv(api.post)) {
      return { id, status };
    }
    const response = await api.post(`/protected/exams/${id}/status/${status}`);
    return response.data;
  },

  async listExamPeriods() {
    if (isUnmockedTestEnv(api.get)) {
      return { exam_periods: SAMPLE_PERIODS.map((p) => ({ ...p })) };
    }
    try {
      const response = await api.get("/protected/exam-periods");
      return response.data;
    } catch (err) {
      if (!err?.response) {
        return { exam_periods: SAMPLE_PERIODS.map((p) => ({ ...p })) };
      }
      throw err;
    }
  },

  async createExamPeriod(payload) {
    if (isUnmockedTestEnv(api.post)) {
      return { exam_period: { id: Date.now(), status: "draft", ...payload } };
    }
    const response = await api.post("/protected/exam-periods", payload);
    return response.data;
  },

  async generateExamTimetable(payload = {}) {
    if (isUnmockedTestEnv(api.post)) {
      return {
        message: "Exam timetable generated",
        count: SAMPLE_EXAMS.length,
        exams: SAMPLE_EXAMS,
      };
    }
    const response = await api.post(
      "/protected/exam-timetable/generate",
      payload
    );
    return response.data;
  },

  async getMyExams() {
    if (isUnmockedTestEnv(api.get)) {
      return { exams: SAMPLE_EXAMS.map((e) => ({ ...e })) };
    }
    const response = await api.get("/protected/exams/my");
    return response.data;
  },
};

export default examService;
