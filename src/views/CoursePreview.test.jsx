import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Preview1 from "./Preview1";

vi.mock("../services/classService", () => ({ default: { list: vi.fn() } }));
vi.mock("../services/courseService", () => ({ default: { list: vi.fn() } }));
vi.mock("../services/staffService", () => ({ default: { list: vi.fn() } }));
vi.mock("../services/timetableService", () => ({
  default: {
    getByClass: vi.fn(),
    getByStaff: vi.fn(),
    getByCourse: vi.fn(),
    getMyTimetable: vi.fn(),
  },
}));

import classService from "../services/classService";
import courseService from "../services/courseService";
import staffService from "../services/staffService";
import timetableService from "../services/timetableService";

describe("course timetable preview", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    classService.list.mockResolvedValue({ classes: [{ id: 10, name: "Group A" }, { id: 11, name: "Group B" }] });
    courseService.list.mockResolvedValue({ courses: [{ id: 7, name: "Computing" }] });
    staffService.list.mockResolvedValue({ staff: [] });
    timetableService.getByClass.mockResolvedValue({ timetables: [] });
    timetableService.getByCourse.mockResolvedValue({
      timetables: [
        { class_id: 10, class: { name: "Group A" }, day: "monday", start_time: "08:00", module: { name: "Algorithms" } },
        { class_id: 11, class: { name: "Group B" }, day: "monday", start_time: "08:00", module: { name: "Networks" } },
      ],
    });
  });

  it("loads and separates schedules per class, including overlapping slots", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Preview1 initialMode="course" />
      </MemoryRouter>
    );

    await user.selectOptions(await screen.findByLabelText("Course"), "7");
    await user.click(screen.getByRole("button", { name: "Load schedule" }));

    expect(timetableService.getByCourse).toHaveBeenCalledWith(7);
    expect(await screen.findByRole("heading", { name: "Group A" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Group B" })).toBeInTheDocument();
    expect(screen.getByRole("table", { name: "Timetable for Group A" })).toHaveTextContent("Algorithms");
    expect(screen.getByRole("table", { name: "Timetable for Group B" })).toHaveTextContent("Networks");
  });

  it("keeps class preview usable if loading course choices fails", async () => {
    const user = userEvent.setup();
    courseService.list.mockRejectedValue(new Error("Course service unavailable"));
    render(
      <MemoryRouter>
        <Preview1 />
      </MemoryRouter>
    );

    await user.selectOptions(await screen.findByLabelText("Class"), "10");
    await user.click(screen.getByRole("button", { name: "Load schedule" }));

    await waitFor(() => expect(timetableService.getByClass).toHaveBeenCalledWith(10));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
