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
    const response = await api.post("/auth/login", {
      email: credentials.email,
      password: credentials.password,
    });
    const data = response.data;
    if (data.token) {
      setAuth({
        token: data.token,
        user: data.user,
      });
    }
    return data;
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
