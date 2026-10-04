import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GenerationSettingsPanel from "./GenerationSettingsPanel";

vi.mock("../services/generationSettingsService", () => ({
  default: { get: vi.fn(), update: vi.fn() },
}));

import generationSettingsService from "../services/generationSettingsService";

describe("GenerationSettingsPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    generationSettingsService.get.mockResolvedValue({
      settings: {
        engine: "auto",
        time_budget_sec: 30,
        soft_weights: { preferred_start_weight: 0, session_spread_weight: 0 },
      },
      solver_available: true,
    });
    generationSettingsService.update.mockImplementation(async (settings) => ({ settings }));
  });

  it("shows the settings before generation and saves server-validated values", async () => {
    const user = userEvent.setup();
    render(<GenerationSettingsPanel />);

    const engine = await screen.findByLabelText("Engine");
    expect(screen.getByLabelText("Solver time budget (seconds)")).toBeInTheDocument();
    expect(screen.getByLabelText("Preferred staff start time")).toBeInTheDocument();
    expect(screen.getByLabelText("Spread sessions across the week")).toBeInTheDocument();

    await user.selectOptions(engine, "solver");
    await user.clear(screen.getByLabelText("Solver time budget (seconds)"));
    await user.type(screen.getByLabelText("Solver time budget (seconds)"), "90");
    await user.clear(screen.getByLabelText("Preferred staff start time"));
    await user.type(screen.getByLabelText("Preferred staff start time"), "2.5");
    await user.click(screen.getByRole("button", { name: "Save generation settings" }));

    await waitFor(() => expect(generationSettingsService.update).toHaveBeenCalledWith({
      engine: "solver",
      time_budget_sec: 90,
      soft_weights: { preferred_start_weight: 2.5, session_spread_weight: 0 },
    }));
    expect(await screen.findByRole("status")).toHaveTextContent("saved for this deployment");
  });

  it("disables the solver choice when the server reports it unavailable", async () => {
    generationSettingsService.get.mockResolvedValue({
      settings: { engine: "auto", time_budget_sec: 30, soft_weights: {} },
      solver_available: false,
    });
    render(<GenerationSettingsPanel />);

    const solverOption = await screen.findByRole("option", { name: "OR-Tools solver" });
    expect(solverOption).toBeDisabled();
  });
});
