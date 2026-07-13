import { describe, it, expect, beforeEach } from "vitest";
import {
  setAuth,
  clearAuth,
  getToken,
  getCurrentUser,
  isAuthenticated,
  hasRole,
  isTokenExpired,
} from "./auth";

function makeToken(expSecondsFromNow) {
  const header = btoa(JSON.stringify({ alg: "none", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({ exp: Math.floor(Date.now() / 1000) + expSecondsFromNow })
  );
  return `${header}.${payload}.sig`;
}

describe("auth helpers", () => {
  beforeEach(() => {
    clearAuth();
  });

  it("stores flat auth shape", () => {
    setAuth({
      token: "abc",
      user: { id: 1, email: "a@b.c", role: "super_admin" },
    });
    expect(getToken()).toBe("abc");
    expect(getCurrentUser().email).toBe("a@b.c");
    expect(hasRole("super_admin")).toBe(true);
    expect(hasRole("user")).toBe(false);
  });

  it("treats expired token as unauthenticated", () => {
    setAuth({ token: makeToken(-60), user: { id: 1, role: "user" } });
    expect(isTokenExpired(getToken())).toBe(true);
    expect(isAuthenticated()).toBe(false);
  });

  it("accepts valid token", () => {
    setAuth({ token: makeToken(3600), user: { id: 1, role: "user" } });
    expect(isAuthenticated()).toBe(true);
  });
});
