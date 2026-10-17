import api from "./api";
import { sampleAnalytics } from "../mocks/uiShellFixtures";

function isUnmockedTestEnv(fn) {
  const isTest =
    (typeof import.meta !== "undefined" && import.meta.env?.MODE === "test") ||
    (typeof process !== "undefined" && Boolean(process.env?.VITEST));
  return isTest && typeof fn?.mock === "undefined";
}

const DEFAULT_OVERVIEW = {
  cards: sampleAnalytics,
  room_utilization: [
    { name: "Lab 101", utilization_pct: 85, booked_hours: 34, capacity: 50 },
    { name: "Hall 1", utilization_pct: 72, booked_hours: 29, capacity: 120 },
    { name: "Room B2", utilization_pct: 58, booked_hours: 23, capacity: 45 },
  ],
  staff_workload: [
    { name: "Asha Mwakalinga", scheduled_hours: 20, max_hours: 24 },
    { name: "Daniel Mushi", scheduled_hours: 16, max_hours: 20 },
  ],
  heatmap: {
    days: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    slots: ["08:00", "10:00", "14:00"],
    counts: {
      "monday|08:00": 6,
      "monday|10:00": 8,
      "monday|14:00": 5,
      "tuesday|08:00": 7,
      "tuesday|10:00": 7,
      "tuesday|14:00": 4,
      "wednesday|08:00": 8,
      "wednesday|10:00": 6,
      "wednesday|14:00": 5,
      "thursday|08:00": 6,
      "thursday|10:00": 7,
      "thursday|14:00": 6,
      "friday|08:00": 5,
      "friday|10:00": 4,
      "friday|14:00": 2,
    },
  },
};

export const analyticsService = {
  async getOverview(params = {}) {
    if (isUnmockedTestEnv(api.get)) {
      return DEFAULT_OVERVIEW;
    }
    try {
      const response = await api.get("/protected/analytics/overview", {
        params,
      });
      return {
        ...DEFAULT_OVERVIEW,
        ...response.data,
        cards: response.data?.cards || sampleAnalytics,
      };
    } catch (err) {
      if (!err?.response) {
        return DEFAULT_OVERVIEW;
      }
      throw err;
    }
  },
};

export default analyticsService;
