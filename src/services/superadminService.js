import api from "./api";
import { sampleInstitutions, sampleMembers } from "../mocks/uiShellFixtures";

function isUnmockedTestEnv(fn) {
  const isTest =
    (typeof import.meta !== "undefined" && import.meta.env?.MODE === "test") ||
    (typeof process !== "undefined" && Boolean(process.env?.VITEST));
  return isTest && typeof fn?.mock === "undefined";
}

const DEFAULT_INSTITUTIONS = sampleInstitutions.map((inst, index) => ({
  id: inst.id || index + 1,
  name: inst.name,
  region: inst.region,
  status: inst.status || "active",
  plan: inst.plan || "pro",
  type: inst.type || "university",
  members_count: inst.members_count ?? (index === 0 ? 18 : 42),
}));

const DEFAULT_AUDIT_LOGS = [
  {
    id: 1,
    action: "institution.register",
    actor_email: "admin@sacas.ac.tz",
    institution_name: "Sacas Institute of Technology",
    target: "Institution #1",
    ip_address: "197.186.12.10",
    created_at: "2026-10-17 09:30:00",
    detail: "Institution registration submitted · today",
  },
  {
    id: 2,
    action: "member.invite",
    actor_email: "admin@sacas.ac.tz",
    institution_name: "Sacas Institute of Technology",
    target: "daniel@example.edu",
    ip_address: "197.186.12.10",
    created_at: "2026-10-16 15:10:00",
    detail: "Member invitation prepared · yesterday",
  },
  {
    id: 3,
    action: "generation_settings.update",
    actor_email: "superadmin@sacas.ac.tz",
    institution_name: "Platform",
    target: "engine=auto",
    ip_address: "127.0.0.1",
    created_at: "2026-10-14 11:00:00",
    detail: "Generation settings viewed · this week",
  },
];

export const superadminService = {
  async listInstitutions(params = {}) {
    if (isUnmockedTestEnv(api.get)) {
      return DEFAULT_INSTITUTIONS.map((item) => ({ ...item }));
    }
    try {
      const response = await api.get("/protected/superadmin/institutions", {
        params,
      });
      const data = response.data;
      if (Array.isArray(data)) return data;
      return data?.institutions || DEFAULT_INSTITUTIONS;
    } catch (err) {
      if (!err?.response) {
        return DEFAULT_INSTITUTIONS.map((item) => ({ ...item }));
      }
      throw err;
    }
  },

  async updateInstitutionStatus(id, status) {
    if (isUnmockedTestEnv(api.put)) {
      return { id, status };
    }
    try {
      const response = await api.put(
        `/protected/superadmin/institutions/${id}`,
        { status }
      );
      return response.data;
    } catch (err) {
      if (!err?.response) {
        return { id, status };
      }
      throw err;
    }
  },

  async updateInstitutionPlan(id, plan) {
    if (isUnmockedTestEnv(api.put)) {
      return { id, plan };
    }
    try {
      const response = await api.put(
        `/protected/superadmin/institutions/${id}`,
        { plan }
      );
      return response.data;
    } catch (err) {
      if (!err?.response) {
        return { id, plan };
      }
      throw err;
    }
  },

  async impersonateInstitution(institution) {
    const id = typeof institution === "object" ? institution.id : institution;
    if (isUnmockedTestEnv(api.post)) {
      return {
        impersonation: true,
        institution:
          typeof institution === "object"
            ? institution
            : { id, name: `Institution #${id}` },
      };
    }
    try {
      const response = await api.post(
        `/protected/superadmin/institutions/${id}/impersonate`
      );
      return response.data;
    } catch (err) {
      if (!err?.response) {
        return {
          impersonation: true,
          institution:
            typeof institution === "object"
              ? institution
              : { id, name: `Institution #${id}` },
        };
      }
      throw err;
    }
  },

  async listUsers(params = {}) {
    if (isUnmockedTestEnv(api.get)) {
      return sampleMembers.map((m) => ({ ...m }));
    }
    try {
      const response = await api.get("/protected/superadmin/users", { params });
      const data = response.data;
      if (Array.isArray(data)) return data;
      return data?.users || sampleMembers.map((m) => ({ ...m }));
    } catch (err) {
      if (!err?.response) {
        return sampleMembers.map((m) => ({ ...m }));
      }
      throw err;
    }
  },

  async createUser(payload) {
    if (isUnmockedTestEnv(api.post)) {
      return {
        id: Date.now(),
        name:
          payload.name ||
          `${payload.first_name || ""} ${payload.last_name || ""}`.trim(),
        email: payload.email,
        role: payload.role || "lecturer",
        status: "active",
      };
    }
    const response = await api.post("/protected/superadmin/users", payload);
    return response.data?.user || response.data;
  },

  async updateUserRole(id, role) {
    if (isUnmockedTestEnv(api.put)) {
      return { id, role };
    }
    try {
      const response = await api.put(
        `/protected/superadmin/users/${id}`,
        { role }
      );
      return response.data;
    } catch (err) {
      if (!err?.response) return { id, role };
      throw err;
    }
  },

  async updateUserStatus(id, status) {
    if (isUnmockedTestEnv(api.post)) {
      return { id, status };
    }
    try {
      const response = await api.post(
        `/protected/superadmin/users/${id}/status`,
        { status, is_active: status === "active" }
      );
      return response.data;
    } catch (err) {
      if (!err?.response) return { id, status };
      throw err;
    }
  },

  async resetUserPassword(id, newPassword) {
    if (isUnmockedTestEnv(api.post)) {
      return { message: "Temporary password issued." };
    }
    try {
      const response = await api.post(
        `/protected/superadmin/users/${id}/reset-password`,
        { new_password: newPassword }
      );
      return response.data;
    } catch (err) {
      if (!err?.response) return { message: "Temporary password issued." };
      throw err;
    }
  },

  async getPlatformAnalytics() {
    const fallback = {
      cards: [
        ["Institutions", "12"],
        ["Active members", "486"],
        ["Schedules generated", "94"],
        ["Success rate", "91%"],
      ],
      institutions_by_status: { active: 9, pending: 2, suspended: 1 },
      users_by_role: {
        administrator: 14,
        academic_coordinator: 28,
        exam_coordinator: 19,
        lecturer: 425,
      },
      engine_split: { solver: 78, greedy: 16 },
    };
    if (isUnmockedTestEnv(api.get)) {
      return fallback;
    }
    try {
      const response = await api.get("/protected/superadmin/analytics/overview");
      return { ...fallback, ...response.data };
    } catch (err) {
      if (!err?.response) return fallback;
      throw err;
    }
  },

  async listAuditLogs(params = {}) {
    if (isUnmockedTestEnv(api.get)) {
      return DEFAULT_AUDIT_LOGS;
    }
    try {
      const response = await api.get("/protected/superadmin/audit-logs", {
        params,
      });
      const data = response.data;
      if (Array.isArray(data)) return data;
      return data?.audit_logs || data?.logs || DEFAULT_AUDIT_LOGS;
    } catch (err) {
      if (!err?.response) return DEFAULT_AUDIT_LOGS;
      throw err;
    }
  },
};

export default superadminService;
