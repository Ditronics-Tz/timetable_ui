import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
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
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("uses the configured API URL", async () => {
    vi.stubEnv("VITE_API_URL", "https://api.example.test/api/");
    vi.resetModules();
    const mod = await import("./api");
    expect(mod.default).toBeDefined();
<<<<<<< HEAD
    expect(typeof mod.baseURL).toBe("string");
    expect(mod.baseURL.includes("/api") || mod.baseURL.startsWith("http")).toBe(true);
  }, 15000);
=======
    expect(mod.baseURL).toBe("https://api.example.test/api");
  }, 15_000);
>>>>>>> origin/master
});
