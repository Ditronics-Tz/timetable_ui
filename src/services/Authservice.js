import api from "./api";
import {
  setAuth,
  clearAuth,
  getCurrentUser,
  getToken,
  isAuthenticated,
  hasRole,
} from "../lib/auth";
import { extractApiError } from "../lib/apiError";

export const DEMO_ACCOUNTS = [
  {
    label: "Super Admin (Platform)",
    email: "admin@example.com",
    password: "password",
    role: "super_admin",
    first_name: "Super",
    last_name: "Admin",
    institution: null,
  },
  {
    label: "Institution Admin",
    email: "instadmin@sacas.local",
    password: "password",
    role: "administrator",
    first_name: "Asha",
    last_name: "Mwakalinga",
    institution: {
      id: 1,
      name: "Sacas Institute of Technology",
      type: "university",
      status: "active",
      plan: "pro",
    },
  },
  {
    label: "Academic Coordinator",
    email: "academic@sacas.local",
    password: "password",
    role: "academic_coordinator",
    first_name: "Daniel",
    last_name: "Mushi",
    institution: {
      id: 1,
      name: "Sacas Institute of Technology",
      type: "university",
      status: "active",
      plan: "pro",
    },
  },
  {
    label: "Exam Coordinator",
    email: "exam@sacas.local",
    password: "password",
    role: "exam_coordinator",
    first_name: "Neema",
    last_name: "Kileo",
    institution: {
      id: 1,
      name: "Sacas Institute of Technology",
      type: "university",
      status: "active",
      plan: "pro",
    },
  },
  {
    label: "Lecturer (Staff)",
    email: "lecturer@sacas.local",
    password: "password",
    role: "user",
    first_name: "Jane",
    last_name: "Lecturer",
    institution: {
      id: 1,
      name: "Sacas Institute of Technology",
      type: "university",
      status: "active",
      plan: "pro",
    },
  },
];

function buildOfflineDemoSession(account) {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      sub: account.email,
      role: account.role,
      exp: Math.floor(Date.now() / 1000) + 86400,
    })
  );
  const token = `${header}.${payload}.demo`;
  const user = {
    id: account.role === "super_admin" ? 1 : 2,
    email: account.email,
    first_name: account.first_name,
    last_name: account.last_name,
    role: account.role,
    institution_id: account.institution?.id ?? null,
    is_active: true,
    is_verified: true,
  };
  return {
    token,
    user,
    institution: account.institution,
  };
}

class AuthService {
  async register(userData) {
    // snake_case on the wire
    const payload = {
      email: userData.email,
      password: userData.password,
      first_name: userData.first_name || userData.firstName,
      last_name: userData.last_name || userData.lastName,
      phone_number: userData.phone_number || userData.phoneNumber || undefined,
    };
    const response = await api.post("/auth/register", payload);
    return response.data;
  }

  async login(credentials) {
    try {
      const response = await api.post("/auth/login", {
        email: credentials.email,
        password: credentials.password,
      });
      const data = response.data;
      if (data.token) {
        setAuth({
          token: data.token,
          user: data.user,
          permissions: data.permissions,
          institution: data.institution,
        });
      }
      return data;
    } catch (err) {
      if (!err?.response) {
        const matched = DEMO_ACCOUNTS.find(
          (acc) =>
            acc.email.toLowerCase() ===
              String(credentials.email || "").trim().toLowerCase() &&
            (credentials.password === acc.password ||
              credentials.password === "Password123")
        );
        if (matched) {
          const demoData = buildOfflineDemoSession(matched);
          setAuth(demoData);
          return demoData;
        }
      }
      throw err;
    }
  }

  async logout() {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore network errors on logout
    } finally {
      clearAuth();
    }
  }

  async verifyEmail({ email, otp }) {
    const response = await api.post("/auth/verify-email", { email, otp });
    return response.data;
  }

  async resendVerification(email) {
    const response = await api.post("/auth/resend-verification", { email });
    return response.data;
  }

  async forgotPassword(email) {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  }

  async resetPassword({ email, otp, new_password }) {
    const response = await api.post("/auth/reset-password", {
      email,
      otp,
      new_password,
    });
    return response.data;
  }

  async getProfile() {
    const response = await api.get("/protected/profile");
    return response.data;
  }

  async changePassword(payload) {
    const response = await api.put("/protected/change-password", payload);
    return response.data;
  }

  async updateUser(userId, userData) {
    const response = await api.put(`/protected/users/${userId}`, userData);
    return response.data;
  }

  getCurrentUser() {
    return getCurrentUser();
  }

  getToken() {
    return getToken();
  }

  isAuthenticated() {
    return isAuthenticated();
  }

  hasRole(...roles) {
    return hasRole(...roles);
  }

  extractError(error) {
    return extractApiError(error);
  }
}

const authService = new AuthService();
export default authService;
export {
  getCurrentUser,
  getToken,
  isAuthenticated,
  hasRole,
};
