import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import TimetableGenerator from "./Timetable";

vi.mock("../services/classService", () => ({
  default: { list: vi.fn() },
}));
vi.mock("../services/timetableService", () => ({
  default: {
    previewGenerate: vi.fn(),
    generate: vi.fn(),
  },
}));

import classService from "../services/classService";
import timetableService from "../services/timetableService";

describe("timetable preview navigation context", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    classService.list.mockResolvedValue({ classes: [{ id: 42, name: "Class A" }] });
    timetableService.previewGenerate.mockResolvedValue({ message: "Preview ready", timetables: [] });
    timetableService.generate.mockResolvedValue({ message: "Generated", timetables: [] });
  });

  it.each([
    ["Preview (dry-run)", "previewGenerate"],
    ["Generate & commit", "generate"],
  ])("preserves the selected class after %s", async (action, serviceMethod) => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <TimetableGenerator />
      </MemoryRouter>
    );

    await user.selectOptions(await screen.findByLabelText("Class"), "42");
    await user.click(screen.getByRole("button", { name: action }));

    expect(await screen.findByRole("link", { name: "View weekly grid" }))
      .toHaveAttribute("href", "/preview?classId=42");
    expect(timetableService[serviceMethod]).toHaveBeenCalledWith(42);
  });
});
