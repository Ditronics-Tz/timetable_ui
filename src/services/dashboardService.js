import api from "./api";

export const dashboardService = {
  adminDashboard() {
    return api.get("/protected/admin/dashboard").then((r) => r.data);
  },
  userStats() {
    return api.get("/protected/admin/users/stats").then((r) => r.data);
  },
};

export default dashboardService;
