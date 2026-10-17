const AUTH_KEY = "auth";
const PARENT_AUTH_KEY = "sacas_parent_auth";

export const ROLE_PERMISSIONS = {
  super_admin: [
    "platform:manage",
    "institutions:manage",
    "users:manage_all",
    "audit:read",
    "analytics:platform",
    "generation_settings:manage",
  ],
  administrator: [
    "institution:manage",
    "institution:read",
    "members:manage",
    "faculties:write",
    "faculties:read",
    "courses:write",
    "courses:read",
    "subjects:write",
    "subjects:read",
    "modules:write",
    "modules:read",
    "classes:write",
    "classes:read",
    "rooms:write",
    "rooms:read",
    "staff:write",
    "staff:read",
    "allocations:write",
    "allocations:read",
    "timetable:generate",
    "timetable:write",
    "timetable:publish",
    "timetable:approve",
    "timetable:read",
    "timetable:read_own",
    "exams:write",
    "exams:generate",
    "exams:approve",
    "exams:publish",
    "exams:read",
    "exams:read_own",
    "analytics:institution",
    "import:write",
    "profile:manage",
  ],
  academic_coordinator: [
    "institution:read",
    "faculties:write",
    "faculties:read",
    "courses:write",
    "courses:read",
    "subjects:write",
    "subjects:read",
    "modules:write",
    "modules:read",
    "classes:write",
    "classes:read",
    "rooms:write",
    "rooms:read",
    "staff:write",
    "staff:read",
    "allocations:write",
    "allocations:read",
    "timetable:generate",
    "timetable:write",
    "timetable:publish",
    "timetable:approve",
    "timetable:read",
    "timetable:read_own",
    "exams:generate",
    "exams:approve",
    "exams:publish",
    "exams:read",
    "exams:read_own",
    "analytics:institution",
    "import:write",
    "profile:manage",
  ],
  exam_coordinator: [
    "institution:read",
    "exams:write",
    "exams:generate",
    "exams:publish",
    "exams:read",
    "exams:read_own",
    "rooms:read",
    "classes:read",
    "staff:read",
    "modules:read",
    "subjects:read",
    "courses:read",
    "timetable:read",
    "timetable:read_own",
    "analytics:institution",
    "import:write",
    "profile:manage",
  ],
  user: [
    "timetable:read_own",
    "timetable:read",
    "exams:read_own",
    "profile:manage",
  ],
  lecturer: [
    "timetable:read_own",
    "timetable:read",
    "exams:read_own",
    "profile:manage",
  ],
  institution_support: [
    "institution:read",
    "faculties:read",
    "courses:read",
    "subjects:read",
    "modules:read",
    "classes:read",
    "rooms:read",
    "staff:read",
    "allocations:read",
    "timetable:read",
    "exams:read",
    "analytics:institution",
  ],
};

/** @returns {{ token?: string, user?: object, permissions?: string[], institution?: object, impersonation?: boolean, isSupportSession?: boolean } | null} */
export function getAuth() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setAuth({
  token,
  user,
  permissions,
  institution,
  impersonation,
  isSupportSession,
} = {}) {
  const existing = getAuth() || {};
  // Prefer role from JWT claims so localStorage cannot drift from signed token
  let nextUser = user ? { ...user } : null;
  let claims = null;
  if (token) {
    claims = decodeToken(token);
    if (nextUser && claims?.role) {
      nextUser.role = String(claims.role).trim();
    }
  }
  const nextInstitution =
    institution !== undefined
      ? institution
      : nextUser?.institution || existing.institution || null;
  const nextPermissions =
    Array.isArray(permissions)
      ? permissions
      : Array.isArray(nextUser?.permissions)
        ? nextUser.permissions
        : undefined;
  const nextSupport =
    isSupportSession ??
    impersonation ??
    Boolean(claims?.impersonation || claims?.support_session);

  const payload = {
    token,
    user: nextUser,
  };
  if (nextPermissions) payload.permissions = nextPermissions;
  if (nextInstitution) payload.institution = nextInstitution;
  if (nextSupport) {
    payload.impersonation = true;
    payload.isSupportSession = true;
  }

  localStorage.setItem(AUTH_KEY, JSON.stringify(payload));
  localStorage.removeItem("user");
}

export function clearAuth() {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(PARENT_AUTH_KEY);
  localStorage.removeItem("user");
}

export function getToken() {
  return getAuth()?.token || null;
}

export function getCurrentUser() {
  return getAuth()?.user || null;
}

export const getUser = getCurrentUser;

export function getDisplayName() {
  const user = getCurrentUser();
  if (!user) return "User";
  const full = `${user.first_name || ""} ${user.last_name || ""}`.trim();
  return full || user.name || user.email || "User";
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
      return String(claims.role).trim().toLowerCase();
    }
  }
  const user = getCurrentUser();
  if (user?.role != null && String(user.role).trim() !== "") {
    return String(user.role).trim().toLowerCase();
  }
  return null;
}

export function hasRole(...roles) {
  const role = getRole();
  if (!role) return false;
  return roles.flat().includes(role);
}

export function isAdmin() {
  return hasRole(
    "administrator",
    "super_admin",
    "academic_coordinator",
    "exam_coordinator"
  );
}

export function isSuperAdmin() {
  return hasRole("super_admin");
}

export function getInstitution() {
  const auth = getAuth();
  if (auth?.institution) return auth.institution;
  const user = auth?.user;
  if (user?.institution) return user.institution;
  if (user?.institution_id || user?.institution_name) {
    return {
      id: user.institution_id,
      name: user.institution_name || "Institution",
    };
  }
  return null;
}

export function setInstitution(institution) {
  const auth = getAuth();
  if (!auth) return;
  localStorage.setItem(
    AUTH_KEY,
    JSON.stringify({ ...auth, institution })
  );
}

export function getPermissions() {
  const auth = getAuth();
  if (Array.isArray(auth?.permissions) && auth.permissions.length > 0) {
    return auth.permissions;
  }
  const role = getRole();
  if (!role) return [];
  if (isSupportSession() && role === "super_admin") {
    return [
      ...ROLE_PERMISSIONS.super_admin,
      ...ROLE_PERMISSIONS.institution_support,
    ];
  }
  return ROLE_PERMISSIONS[role] || [];
}

export function setPermissions(permissions, institution = undefined) {
  const auth = getAuth();
  if (!auth) return;
  const next = {
    ...auth,
    permissions: Array.isArray(permissions) ? permissions : [],
  };
  if (institution !== undefined) {
    next.institution = institution;
  }
  localStorage.setItem(AUTH_KEY, JSON.stringify(next));
}

export function can(permission) {
  if (!permission) return true;
  if (!isAuthenticated()) return false;
  const perms = getPermissions();
  if (Array.isArray(permission)) {
    return permission.every((p) => perms.includes(p));
  }
  return perms.includes(permission);
}

export function canAny(...permissions) {
  const list = permissions.flat().filter(Boolean);
  if (list.length === 0) return true;
  if (!isAuthenticated()) return false;
  const perms = getPermissions();
  return list.some((p) => perms.includes(p));
}

export function isSupportSession() {
  const auth = getAuth();
  if (auth?.isSupportSession || auth?.impersonation) return true;
  const claims = decodeToken(auth?.token);
  return Boolean(claims?.impersonation || claims?.support_session);
}

export function startSupportSession({ token, institution, user, permissions }) {
  const current = localStorage.getItem(AUTH_KEY);
  if (current && !localStorage.getItem(PARENT_AUTH_KEY)) {
    localStorage.setItem(PARENT_AUTH_KEY, current);
  }
  const currentParsed = getAuth() || {};
  setAuth({
    token: token || currentParsed.token,
    user: user || {
      ...(currentParsed.user || {}),
      role: user?.role || "institution_support",
      institution_id: institution?.id,
    },
    institution,
    permissions: permissions || ROLE_PERMISSIONS.institution_support,
    isSupportSession: true,
    impersonation: true,
  });
}

export function exitSupportSession() {
  const parentRaw = localStorage.getItem(PARENT_AUTH_KEY);
  if (parentRaw) {
    localStorage.setItem(AUTH_KEY, parentRaw);
    localStorage.removeItem(PARENT_AUTH_KEY);
    return true;
  }
  const current = getAuth();
  if (current) {
    const cleaned = { ...current };
    delete cleaned.isSupportSession;
    delete cleaned.impersonation;
    delete cleaned.institution;
    delete cleaned.permissions;
    if (cleaned.user) {
      cleaned.user = { ...cleaned.user, role: "super_admin" };
    }
    localStorage.setItem(AUTH_KEY, JSON.stringify(cleaned));
  }
  return false;
}

export async function fetchMyPermissions() {
  const { default: api } = await import("../services/api");
  const isTest =
    (typeof import.meta !== "undefined" && import.meta.env?.MODE === "test") ||
    (typeof process !== "undefined" && Boolean(process.env?.VITEST));
  if (isTest && typeof api?.get?.mock === "undefined") {
    return {
      role: getRole(),
      institution: getInstitution(),
      permissions: getPermissions(),
    };
  }
  const response = await api.get("/protected/me/permissions");
  const data = response.data || {};
  setPermissions(
    data.permissions || [],
    data.institution !== undefined ? data.institution : undefined
  );
  return data;
}
