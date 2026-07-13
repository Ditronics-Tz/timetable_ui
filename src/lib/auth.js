const AUTH_KEY = "auth";

/** @returns {{ token?: string, user?: object } | null} */
export function getAuth() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setAuth({ token, user }) {
  // Prefer role from JWT claims so localStorage cannot drift from signed token
  let nextUser = user ? { ...user } : null;
  if (token && nextUser) {
    const claims = decodeToken(token);
    if (claims?.role) {
      nextUser.role = String(claims.role).trim();
    }
  }
  localStorage.setItem(AUTH_KEY, JSON.stringify({ token, user: nextUser }));
  localStorage.removeItem("user");
}

export function clearAuth() {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem("user");
}

export function getToken() {
  return getAuth()?.token || null;
}

export function getCurrentUser() {
  return getAuth()?.user || null;
}

/** Decode JWT payload without verification (client-side exp / role read only). */
export function decodeToken(token) {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(payload)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function isTokenExpired(token) {
  const claims = decodeToken(token);
  if (!claims || typeof claims.exp !== "number") return false;
  return claims.exp * 1000 <= Date.now() + 30_000;
}

export function isAuthenticated() {
  const token = getToken();
  if (!token) return false;
  if (isTokenExpired(token)) {
    clearAuth();
    return false;
  }
  return true;
}

/**
 * Effective role from signed JWT claims first, then user blob.
 * Normalized lowercase string.
 */
export function getRole() {
  const token = getToken();
  if (token && !isTokenExpired(token)) {
    const claims = decodeToken(token);
    if (claims?.role != null && String(claims.role).trim() !== "") {
      return String(claims.role).trim();
    }
  }
  const user = getCurrentUser();
  if (user?.role != null && String(user.role).trim() !== "") {
    return String(user.role).trim();
  }
  return null;
}

export function hasRole(...roles) {
  const role = getRole();
  if (!role) return false;
  return roles.includes(role);
}

export function isAdmin() {
  return hasRole("administrator", "super_admin");
}

export function isSuperAdmin() {
  return hasRole("super_admin");
}
