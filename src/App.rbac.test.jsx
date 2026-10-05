import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { clearAuth, setAuth } from "./lib/auth";

vi.mock("react-router-dom", async (importOriginal) => {
  const router = await importOriginal();
  const React = await import("react");
  return {
    ...router,
    BrowserRouter: ({ children }) =>
      React.createElement(router.MemoryRouter, { initialEntries: ["/rooms/add"] }, children),
  };
});

import App from "./App";

function makeToken(expSecondsFromNow, role) {
  const header = btoa(JSON.stringify({ alg: "none" }));
  const payload = btoa(
    JSON.stringify({ exp: Math.floor(Date.now() / 1000) + expSecondsFromNow, role })
  );
  return `${header}.${payload}.sig`;
}

describe("admin route RBAC integration", () => {
  beforeEach(() => clearAuth());

  it("shows the permissions-denied screen for a user opening an admin route", () => {
    setAuth({
      token: makeToken(3600, "user"),
      user: { id: 2, email: "regular@example.test", role: "user" },
    });

    render(<App />);

    expect(screen.getByRole("heading", { name: "Insufficient permissions" })).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("regular@example.test");
    expect(screen.queryByLabelText(/room name/i)).not.toBeInTheDocument();
  });
});
