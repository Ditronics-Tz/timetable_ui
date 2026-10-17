import { describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import RequirePermission from "./RequirePermission";
import {
  clearAuth,
  setAuth,
  setPermissions,
  startSupportSession,
  exitSupportSession,
} from "../lib/auth";

function makeToken(expSecondsFromNow, role) {
  const header = btoa(JSON.stringify({ alg: "none" }));
  const payload = btoa(
    JSON.stringify({
      exp: Math.floor(Date.now() / 1000) + expSecondsFromNow,
      role,
    })
  );
  return `${header}.${payload}.sig`;
}

describe("RequirePermission", () => {
  beforeEach(() => clearAuth());

  it("denies access when user lacks required permission", () => {
    setAuth({
      token: makeToken(3600, "user"),
      user: { id: 2, email: "lecturer@sacas.ac.tz", role: "user" },
    });
    render(
      <MemoryRouter>
        <RequirePermission permission="rooms:write" workspace="institution">
          <div>Add Room Form</div>
        </RequirePermission>
      </MemoryRouter>
    );
    expect(screen.getByText(/Insufficient permissions/i)).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("rooms:write");
    expect(screen.queryByText("Add Room Form")).not.toBeInTheDocument();
  });

  it("allows administrator to access institution workspace routes", () => {
    setAuth({
      token: makeToken(3600, "administrator"),
      user: { id: 1, email: "admin@sacas.ac.tz", role: "administrator" },
    });
    render(
      <MemoryRouter>
        <RequirePermission permission="rooms:write" workspace="institution">
          <div>Add Room Form</div>
        </RequirePermission>
      </MemoryRouter>
    );
    expect(screen.getByText("Add Room Form")).toBeInTheDocument();
  });

  it("blocks super_admin from institution workspace unless in support session", () => {
    setAuth({
      token: makeToken(3600, "super_admin"),
      user: { id: 99, email: "root@sacas.ac.tz", role: "super_admin" },
    });
    const { unmount } = render(
      <MemoryRouter>
        <RequirePermission permission="rooms:read" workspace="institution">
          <div>Institution Rooms</div>
        </RequirePermission>
      </MemoryRouter>
    );
    expect(screen.getByText(/Platform console account/i)).toBeInTheDocument();
    expect(screen.queryByText("Institution Rooms")).not.toBeInTheDocument();
    unmount();

    startSupportSession({
      institution: { id: 5, name: "Sacas Institute" },
    });
    render(
      <MemoryRouter>
        <RequirePermission permission="rooms:read" workspace="institution">
          <div>Institution Rooms</div>
        </RequirePermission>
      </MemoryRouter>
    );
    expect(screen.getByText("Institution Rooms")).toBeInTheDocument();
    exitSupportSession();
  });

  it("respects explicit permissions loaded via setPermissions", () => {
    setAuth({
      token: makeToken(3600, "exam_coordinator"),
      user: { id: 4, email: "exam@sacas.ac.tz", role: "exam_coordinator" },
    });
    setPermissions(["exams:write", "exams:read"], {
      id: 1,
      name: "Dar Technical College",
    });
    render(
      <MemoryRouter>
        <RequirePermission permission="exams:write" workspace="institution">
          <div>Exam Scheduler</div>
        </RequirePermission>
      </MemoryRouter>
    );
    expect(screen.getByText("Exam Scheduler")).toBeInTheDocument();
  });
});
