import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import { clearAuth, getAuth } from "../../lib/auth";

vi.mock("../../services/Authservice", () => ({
  default: {
    login: vi.fn(),
  },
}));

import authService from "../../services/Authservice";

describe("Login flow", () => {
  beforeEach(() => {
    clearAuth();
    vi.clearAllMocks();
  });

  it("stores auth shape and redirects to dashboard on success", async () => {
    authService.login.mockImplementation(async () => {
      const { setAuth } = await import("../../lib/auth");
      setAuth({
        token: "tok-abc",
        user: {
          id: 1,
          email: "admin@example.com",
          first_name: "Super",
          last_name: "Admin",
          role: "super_admin",
          is_active: true,
        },
      });
      return { token: "tok-abc", user: { id: 1 } };
    });

    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<div>Dashboard Home</div>} />
        </Routes>
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/email/i), "admin@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "password");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText("Dashboard Home")).toBeInTheDocument();
    });

    const auth = getAuth();
    expect(auth?.token).toBe("tok-abc");
    expect(auth?.user?.email).toBe("admin@example.com");
  });
});
