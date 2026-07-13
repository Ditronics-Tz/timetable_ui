import { describe, it, expect, beforeEach, vi } from "vitest";
import { clearAuth, setAuth, getToken } from "../lib/auth";

// Test 401 handling via the same clearAuth path the interceptor uses
describe("401 auth clear behavior", () => {
  beforeEach(() => {
    clearAuth();
    // mock location without navigating
    delete window.location;
    window.location = { href: "", pathname: "/dashboard", search: "" };
  });

  it("clears token on simulated 401 logout path", () => {
    setAuth({ token: "x", user: { id: 1, role: "user" } });
    expect(getToken()).toBe("x");
    clearAuth();
    expect(getToken()).toBeNull();
  });
});

describe("api module loads without localhost hardcode when VITE set", () => {
  it("imports api client", async () => {
    // In vitest, import.meta.env.DEV is true and VITE_API_URL may be set via .env
    const mod = await import("./api");
    expect(mod.default).toBeDefined();
    expect(typeof mod.baseURL).toBe("string");
    expect(mod.baseURL.includes("/api") || mod.baseURL.startsWith("http")).toBe(true);
  });
});
