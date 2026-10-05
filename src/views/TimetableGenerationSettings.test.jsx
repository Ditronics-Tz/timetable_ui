import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import TimetableGenerator from "./Timetable";

vi.mock("../services/classService", () => ({ default: { list: vi.fn() } }));
vi.mock("../services/timetableService", () => ({
  default: {
    previewGenerate: vi.fn(),
    generate: vi.fn(),
  },
}));
vi.mock("../services/generationSettingsService", () => ({
  default: {
    get: vi.fn(),
    update: vi.fn(),
  },
}));

import classService from "../services/classService";
import timetableService from "../services/timetableService";
import generationSettingsService from "../services/generationSettingsService";

describe("timetable engine result display", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    classService.list.mockResolvedValue({ classes: [{ id: 3, name: "Class C" }] });
    generationSettingsService.get.mockResolvedValue({
      settings: { engine: "greedy", time_budget_sec: 60, soft_weights: {} },
      solver_available: false,
    });
    timetableService.previewGenerate.mockResolvedValue({
      message: "Preview ready",
      engine: "greedy",
      timetables: [],
    });
  });

  it("continues to display the engine returned by the backend", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><TimetableGenerator /></MemoryRouter>);

    await screen.findByLabelText("Engine");
    await user.selectOptions(screen.getByLabelText("Class"), "3");
    await user.click(screen.getByRole("button", { name: "Preview (dry-run)" }));

    expect(await screen.findByText(/via greedy/)).toBeInTheDocument();
    expect(timetableService.previewGenerate).toHaveBeenCalledWith(3);
  });
});
