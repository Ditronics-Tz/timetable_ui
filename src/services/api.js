import axios from "axios";
import { getToken, clearAuth } from "../lib/auth";
import { extractApiError } from "../lib/apiError";
import { clearLookupCache } from "../lib/lookupCache";
import { invalidatePaginatedListCache } from "../lib/paginatedListCache";

function resolveBaseURL() {
  const url = import.meta.env?.VITE_API_URL;
  if (url && String(url).trim() !== "") {
    return String(url).replace(/\/$/, "");
  }
  if (import.meta.env?.DEV) {
    return "/api";
  }
  console.error(
    "VITE_API_URL is not set. Configure it for production builds (see .env.example)."
  );
  throw new Error("VITE_API_URL is required in production builds");
}

const baseURL = resolveBaseURL();

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let csrfToken = null;
let csrfBootstrap = null;

/**
 * Bootstrap CSRF for SPA when backend has CSRF_ENABLED=true.
 * Call before first mutation (login/register/etc). Safe when CSRF is off.
 */
export async function ensureCsrfToken() {
  if (csrfToken) return csrfToken;
  if (!csrfBootstrap) {
    csrfBootstrap = api
      .get("/csrf")
      .then((res) => {
        const fromBody = res.data?.csrf_token;
        const fromHeader =
          res.headers?.["x-csrf-token"] || res.headers?.["X-CSRF-Token"];
        csrfToken = fromBody || fromHeader || csrfToken;
        return csrfToken;
      })
      .catch((err) => {
        csrfBootstrap = null;
        // If CSRF is off or endpoint missing, mutations may still work
        if (import.meta.env?.DEV) {
          console.warn("CSRF bootstrap failed (ok if CSRF_ENABLED=false):", err?.message);
        }
        return null;
      });
  }
  return csrfBootstrap;
}

api.interceptors.request.use(
  async (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const method = (config.method || "get").toLowerCase();
    const isMutating = ["post", "put", "patch", "delete"].includes(method);
    if (isMutating) {
      // Ensure we have a server-issued token before mutating
      if (!csrfToken) {
        await ensureCsrfToken();
      }
      if (csrfToken) {
        config.headers["X-CSRF-Token"] = csrfToken;
      } else if (typeof document !== "undefined") {
        // Mirror cookie into header only if we already have a cookie (double-submit)
        const match = document.cookie.match(/(?:^|;\s*)csrf_token=([^;]+)/);
        if (match) {
          config.headers["X-CSRF-Token"] = decodeURIComponent(match[1]);
        }
      }
    } else if (csrfToken) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

let lastApiError = null;

export function getLastApiError() {
  return lastApiError;
}

export function clearLastApiError() {
  lastApiError = null;
}

api.interceptors.response.use(
  (response) => {
    const method = String(response.config?.method || "get").toLowerCase();
    if (["post", "put", "patch", "delete"].includes(method)) {
      clearLookupCache();
      invalidatePaginatedListCache();
    }
    const headerToken =
      response.headers?.["x-csrf-token"] || response.headers?.["X-CSRF-Token"];
    if (headerToken) {
      csrfToken = headerToken;
    }
    if (response.data?.csrf_token) {
      csrfToken = response.data.csrf_token;
    }
    return response;
  },
  async (error) => {
    const status = error?.response?.status;
    const message = extractApiError(error);
    error.normalized = { status, message };
    lastApiError = {
      status: status || 0,
      message,
      url: error?.config?.url || "",
      method: String(error?.config?.method || "get").toUpperCase(),
      timestamp: new Date().toISOString(),
    };

    // One retry after refreshing CSRF if server says token required
    const original = error.config;
    if (
      status === 403 &&
      original &&
      !original._csrfRetry &&
      /csrf/i.test(String(message))
    ) {
      original._csrfRetry = true;
      csrfToken = null;
      csrfBootstrap = null;
      await ensureCsrfToken();
      if (csrfToken) {
        original.headers = original.headers || {};
        original.headers["X-CSRF-Token"] = csrfToken;
        return api.request(original);
      }
    }

    if (status === 401) {
      clearAuth();
      if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
        const redirect = encodeURIComponent(
          window.location.pathname + window.location.search
        );
        window.location.href = `/login?redirect=${redirect}`;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
export { baseURL };

