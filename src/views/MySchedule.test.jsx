import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { clearAuth, setAuth } from "../lib/auth";

vi.mock("../services/timetableService", () => ({
  default: {
    getMyTimetable: vi.fn(),
    getByStaff: vi.fn(),
  },
}));
vi.mock("../services/Authservice", () => ({ default: { logout: vi.fn() } }));

import timetableService from "../services/timetableService";

describe("My Schedule route", () => {
  beforeEach(() => {
    clearAuth();
    vi.clearAllMocks();
    window.history.replaceState({}, "", "/my-schedule");
    timetableService.getMyTimetable.mockResolvedValue({
      timetables: [{ day: "monday", start_time: "08:00", module: { name: "Algorithms" } }],
    });
  });

  it.each(["user", "administrator", "super_admin"])(
    "%s can open My Schedule and sees only the personal endpoint",
    async (role) => {
      setAuth({ token: "test-token", user: { id: 5, role } });
      render(<App />);

      expect(await screen.findByRole("heading", { name: "My Schedule" })).toBeInTheDocument();
      await waitFor(() => expect(timetableService.getMyTimetable).toHaveBeenCalledTimes(1));
      expect(timetableService.getMyTimetable).toHaveBeenCalledWith();
      expect(timetableService.getByStaff).not.toHaveBeenCalled();
      expect(screen.getByRole("link", { name: "My Schedule" })).toHaveAttribute("href", "/my-schedule");
      expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
      expect(screen.getByRole("table", { name: "My weekly schedule" })).toHaveTextContent("Algorithms");
    }
  );

  it("explains how to get linked when no Staff profile exists", async () => {
    setAuth({ token: "test-token", user: { id: 5, role: "user" } });
    timetableService.getMyTimetable.mockRejectedValue({
      response: {
        status: 404,
        data: { error: "No staff profile is linked to your account" },
      },
    });
    render(<App />);

    expect(
      await screen.findByText(/Your account isn't linked to a staff profile — contact an administrator/i)
    ).toBeInTheDocument();
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  });

  it("shows a friendly empty week when the user has no allocated sessions", async () => {
    setAuth({ token: "test-token", user: { id: 5, role: "administrator" } });
    timetableService.getMyTimetable.mockResolvedValue({ timetables: [] });
    render(<App />);

    expect(await screen.findByText("No sessions are scheduled for this week.")).toBeInTheDocument();
  });

  it("shows API errors and allows a retry", async () => {
    const user = userEvent.setup();
    setAuth({ token: "test-token", user: { id: 5, role: "user" } });
    timetableService.getMyTimetable
      .mockRejectedValueOnce({ response: { data: { error: "Schedule service unavailable" } } })
      .mockResolvedValueOnce({ timetables: [{ day: "monday", start_time: "08:00", module: { name: "Algorithms" } }] });
    render(<App />);

    expect(await screen.findByRole("alert")).toHaveTextContent("Schedule service unavailable");
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(await screen.findByRole("table", { name: "My weekly schedule" })).toHaveTextContent("Algorithms");
  });
});
