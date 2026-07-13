import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("./api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import api from "./api";
import facultyService from "./facultyService";

describe("facultyService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("create sends snake_case payload", async () => {
    api.post.mockResolvedValue({
      data: { message: "ok", faculty: { id: 1, name: "Eng" } },
    });
    const payload = {
      name: "Eng",
      description: "d",
      hod_name: "Dr X",
      hod_phone: "1",
      hod_email: "a@b.c",
    };
    await facultyService.create(payload);
    expect(api.post).toHaveBeenCalledWith(
      "/protected/timetable/faculties",
      payload
    );
  });

  it("list hits correct path", async () => {
    api.get.mockResolvedValue({ data: { faculties: [] } });
    await facultyService.list({ limit: 10, offset: 0 });
    expect(api.get).toHaveBeenCalledWith("/protected/timetable/faculties", {
      params: { limit: 10, offset: 0 },
    });
  });
});
