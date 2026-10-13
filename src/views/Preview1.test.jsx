import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Preview1 from "./Preview1";

vi.mock("../services/classService", () => ({
  default: { list: vi.fn() },
}));
vi.mock("../services/staffService", () => ({
  default: { list: vi.fn() },
}));
vi.mock("../services/timetableService", () => ({
  default: {
    getByClass: vi.fn(),
    getByStaff: vi.fn(),
    getMyTimetable: vi.fn(),
  },
}));

import classService from "../services/classService";
import staffService from "../services/staffService";
import timetableService from "../services/timetableService";

describe("Preview class context", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    classService.list.mockResolvedValue({ classes: [{ id: 42, name: "Class A" }] });
    staffService.list.mockResolvedValue({ staff: [] });
    timetableService.getByClass.mockResolvedValue({ timetables: [] });
  });

  it("preselects and automatically loads the requested valid class", async () => {
    render(
      <MemoryRouter initialEntries={["/preview?classId=42"]}>
        <Preview1 />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(timetableService.getByClass).toHaveBeenCalledWith(42);
    });
    expect(await screen.findByLabelText("Class")).toHaveValue("42");
  });

  it("ignores an unknown class id and keeps normal manual selection available", async () => {
    render(
      <MemoryRouter initialEntries={["/preview?classId=missing"]}>
        <Preview1 />
      </MemoryRouter>
    );

    expect(await screen.findByLabelText("Class")).toHaveValue("");
    expect(timetableService.getByClass).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Load schedule" })).toBeDisabled();
  });
});
