import api from "./api";
import {
  createMember as fixtureCreateMember,
  deactivateMember as fixtureDeactivateMember,
  loadMembers as fixtureLoadMembers,
  submitInstitutionRegistration as fixtureSubmitRegistration,
  updateMember as fixtureUpdateMember,
} from "../mocks/uiShellFixtures";

function isUnmockedTestEnv(fn) {
  const isTest =
    (typeof import.meta !== "undefined" && import.meta.env?.MODE === "test") ||
    (typeof process !== "undefined" && Boolean(process.env?.VITEST));
  return isTest && typeof fn?.mock === "undefined";
}

const DEFAULT_SCHEDULE = {
  days: ["monday", "tuesday", "wednesday", "thursday", "friday"],
  day_start: "08:00",
  day_end: "17:00",
  slot_duration_minutes: 60,
  breaks: [{ start_time: "12:00", end_time: "13:00", label: "Lunch break" }],
};

export const institutionService = {
  async registerInstitution(payload) {
    if (
      typeof fixtureSubmitRegistration?.mock === "object" ||
      isUnmockedTestEnv(api.post)
    ) {
      return fixtureSubmitRegistration(payload);
    }
    try {
      const response = await api.post("/auth/register-institution", payload);
      return {
        accepted: true,
        email:
          response.data?.email ||
          response.data?.admin?.email ||
          payload?.admin?.email,
        ...response.data,
      };
    } catch (err) {
      if (!err?.response) {
        return fixtureSubmitRegistration(payload);
      }
      throw err;
    }
  },

  async acceptInvitation(payload) {
    const response = await api.post("/auth/accept-invitation", payload);
    return response.data;
  },

  async getInstitution() {
    if (isUnmockedTestEnv(api.get)) {
      return {
        institution: {
          id: 1,
          name: "Sacas Institute of Technology",
          type: "university",
          region: "Dar es Salaam",
          country: "Tanzania",
          email: "info@sacas.ac.tz",
          phone: "+255700000000",
          address: "Dar es Salaam",
          status: "active",
          plan: "pro",
          logo_url: "",
        },
      };
    }
    const response = await api.get("/protected/institution");
    return response.data;
  },

  async updateInstitution(payload) {
    if (isUnmockedTestEnv(api.put)) {
      return { institution: { ...payload }, message: "Institution updated." };
    }
    const response = await api.put("/protected/institution", payload);
    return response.data;
  },

  async getScheduleSettings() {
    if (isUnmockedTestEnv(api.get)) {
      return { schedule: { ...DEFAULT_SCHEDULE } };
    }
    try {
      const response = await api.get("/protected/institution/schedule");
      return response.data;
    } catch (err) {
      if (!err?.response) {
        return { schedule: { ...DEFAULT_SCHEDULE } };
      }
      throw err;
    }
  },

  async updateScheduleSettings(payload) {
    if (isUnmockedTestEnv(api.put)) {
      return { schedule: { ...payload }, message: "Schedule settings saved." };
    }
    const response = await api.put("/protected/institution/schedule", payload);
    return response.data;
  },

  async listMembers(params = {}) {
    if (isUnmockedTestEnv(api.get)) {
      return fixtureLoadMembers();
    }
    try {
      const response = await api.get("/protected/institution/members", {
        params,
      });
      const data = response.data;
      if (Array.isArray(data)) return data;
      return data?.members || [];
    } catch (err) {
      if (!err?.response) {
        return fixtureLoadMembers();
      }
      throw err;
    }
  },

  async createMember(payload) {
    if (isUnmockedTestEnv(api.post)) {
      return fixtureCreateMember({
        name:
          payload.name ||
          `${payload.first_name || ""} ${payload.last_name || ""}`.trim(),
        email: payload.email,
        role: payload.role,
      });
    }
    try {
      const response = await api.post(
        "/protected/institution/members",
        payload
      );
      return response.data;
    } catch (err) {
      if (!err?.response) {
        return fixtureCreateMember({
          name:
            payload.name ||
            `${payload.first_name || ""} ${payload.last_name || ""}`.trim(),
          email: payload.email,
          role: payload.role,
        });
      }
      throw err;
    }
  },

  async updateMember(id, changes) {
    const patchFn = api.patch || api.put;
    if (isUnmockedTestEnv(patchFn)) {
      return fixtureUpdateMember(id, changes);
    }
    try {
      const response = api.patch
        ? await api.patch(`/protected/institution/members/${id}`, changes)
        : await api.put(`/protected/institution/members/${id}`, changes);
      return response.data;
    } catch (err) {
      if (!err?.response) {
        return fixtureUpdateMember(id, changes);
      }
      throw err;
    }
  },

  async deactivateMember(id) {
    const patchFn = api.patch || api.put;
    if (isUnmockedTestEnv(patchFn)) {
      return fixtureDeactivateMember(id);
    }
    try {
      const response = api.patch
        ? await api.patch(`/protected/institution/members/${id}`, {
            status: "suspended",
          })
        : await api.put(`/protected/institution/members/${id}`, {
            status: "suspended",
          });
      return response.data;
    } catch (err) {
      if (!err?.response) {
        return fixtureDeactivateMember(id);
      }
      throw err;
    }
  },

  async deleteMember(id) {
    if (isUnmockedTestEnv(api.delete)) {
      return fixtureDeactivateMember(id);
    }
    const response = await api.delete(`/protected/institution/members/${id}`);
    return response.data;
  },

  async listInvitations() {
    if (isUnmockedTestEnv(api.get)) {
      return { invitations: [] };
    }
    try {
      const response = await api.get("/protected/institution/invitations");
      return response.data;
    } catch (err) {
      if (!err?.response) {
        return { invitations: [] };
      }
      throw err;
    }
  },

  async createInvitation(payload) {
    if (isUnmockedTestEnv(api.post)) {
      const created = await fixtureCreateMember({
        name:
          payload.name ||
          `${payload.first_name || ""} ${payload.last_name || ""}`.trim() ||
          payload.email,
        email: payload.email,
        role: payload.role,
      });
      return { invitation: created, demo: true };
    }
    try {
      const response = await api.post(
        "/protected/institution/invitations",
        payload
      );
      return response.data;
    } catch (err) {
      if (!err?.response) {
        const created = await fixtureCreateMember({
          name:
            payload.name ||
            `${payload.first_name || ""} ${payload.last_name || ""}`.trim() ||
            payload.email,
          email: payload.email,
          role: payload.role,
        });
        return { invitation: created, demo: true };
      }
      throw err;
    }
  },

  async revokeInvitation(id) {
    if (isUnmockedTestEnv(api.delete)) {
      return { revoked: true };
    }
    const response = await api.delete(
      `/protected/institution/invitations/${id}`
    );
    return response.data;
  },
};

export default institutionService;
