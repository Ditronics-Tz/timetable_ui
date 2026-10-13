import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./api", () => ({ default: { get: vi.fn(), put: vi.fn() } }));

import api from "./api";
import generationSettingsService from "./generationSettingsService";

describe("generationSettingsService", () => {
  beforeEach(() => vi.clearAllMocks());

  it("loads settings through the authenticated admin endpoint", async () => {
    const data = { settings: { engine: "auto", time_budget_sec: 30 }, solver_available: true };
    api.get.mockResolvedValue({ data });
    await expect(generationSettingsService.get()).resolves.toEqual(data);
    expect(api.get).toHaveBeenCalledWith("/protected/admin/generation-settings");
  });

  it("round-trips engine, budget, and soft weights", async () => {
    const settings = {
      engine: "solver",
      time_budget_sec: 90,
      soft_weights: { preferred_start_weight: 2, session_spread_weight: 1 },
    };
    api.put.mockResolvedValue({ data: { settings } });
    await expect(generationSettingsService.update(settings)).resolves.toEqual({ settings });
    expect(api.put).toHaveBeenCalledWith("/protected/admin/generation-settings", settings);
  });
});
