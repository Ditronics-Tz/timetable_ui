import { describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import RequireRole from "./RequireRole";
import { clearAuth, setAuth } from "../lib/auth";

function makeToken(expSecondsFromNow) {
  const header = btoa(JSON.stringify({ alg: "none" }));
  const payload = btoa(
    JSON.stringify({ exp: Math.floor(Date.now() / 1000) + expSecondsFromNow })
  );
  return `${header}.${payload}.sig`;
}

describe("RequireRole", () => {
  beforeEach(() => clearAuth());

  it("shows insufficient permissions for role=user", () => {
    setAuth({
      token: makeToken(3600),
      user: { id: 2, email: "u@x.com", role: "user" },
    });
    render(
      <MemoryRouter>
        <RequireRole allow={["administrator", "super_admin"]}>
          <div>Admin Form</div>
        </RequireRole>
      </MemoryRouter>
    );
    expect(screen.getByText(/Insufficient permissions/i)).toBeInTheDocument();
    expect(screen.queryByText("Admin Form")).not.toBeInTheDocument();
  });

  it("renders children for super_admin", () => {
    setAuth({
      token: makeToken(3600),
      user: { id: 1, role: "super_admin" },
    });
    render(
      <MemoryRouter>
        <RequireRole allow={["administrator", "super_admin"]}>
          <div>Admin Form</div>
        </RequireRole>
      </MemoryRouter>
    );
    expect(screen.getByText("Admin Form")).toBeInTheDocument();
  });
});
