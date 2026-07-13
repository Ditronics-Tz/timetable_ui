import { describe, it, expect, beforeEach } from "vitest";
import {
  setAuth,
  clearAuth,
  getToken,
  getCurrentUser,
  isAuthenticated,
  hasRole,
  isAdmin,
  getRole,
  isTokenExpired,
} from "./auth";

function makeToken(expSecondsFromNow, claims = {}) {
  const header = btoa(JSON.stringify({ alg: "none", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      exp: Math.floor(Date.now() / 1000) + expSecondsFromNow,
      ...claims,
    })
  );
  return `${header}.${payload}.sig`;
}

describe("auth helpers", () => {
  beforeEach(() => {
    clearAuth();
  });

  it("stores flat auth shape", () => {
    setAuth({
      token: makeToken(3600, { role: "super_admin" }),
      user: { id: 1, email: "a@b.c", role: "super_admin" },
    });
    expect(getToken()).toBeTruthy();
    expect(getCurrentUser().email).toBe("a@b.c");
    expect(hasRole("super_admin")).toBe(true);
    expect(hasRole("user")).toBe(false);
    expect(isAdmin()).toBe(true);
  });

  it("treats expired token as unauthenticated", () => {
    setAuth({ token: makeToken(-60, { role: "user" }), user: { id: 1, role: "user" } });
    expect(isTokenExpired(getToken())).toBe(true);
    expect(isAuthenticated()).toBe(false);
  });

  it("accepts valid token", () => {
    setAuth({ token: makeToken(3600, { role: "user" }), user: { id: 1, role: "user" } });
    expect(isAuthenticated()).toBe(true);
    expect(isAdmin()).toBe(false);
  });

  it("JWT role claim overrides stale user.role in localStorage", () => {
    setAuth({
      token: makeToken(3600, { role: "user" }),
      user: { id: 1, email: "u@x.com", role: "super_admin" },
    });
    // setAuth syncs user.role from JWT
    expect(getCurrentUser().role).toBe("user");
    expect(getRole()).toBe("user");
    expect(isAdmin()).toBe(false);
    expect(hasRole("user")).toBe(true);
  });

  it("role=user cannot pass admin hasRole checks", () => {
    setAuth({
      token: makeToken(3600, { role: "user" }),
      user: { id: 2, role: "user" },
    });
    expect(hasRole("administrator", "super_admin")).toBe(false);
    expect(isAdmin()).toBe(false);
  });
});
