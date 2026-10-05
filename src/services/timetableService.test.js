import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./api", () => ({ default: { get: vi.fn() } }));

import api from "./api";
import timetableService from "./timetableService";

describe("timetableService course schedules", () => {
  beforeEach(() => vi.clearAllMocks());

  it("requests all timetable entries for a course", async () => {
    const response = { timetables: [{ class_id: 10 }, { class_id: 11 }] };
    api.get.mockResolvedValue({ data: response });

    await expect(timetableService.getByCourse(7)).resolves.toEqual(response);
    expect(api.get).toHaveBeenCalledWith("/protected/timetable/by-course/7");
  });
});
