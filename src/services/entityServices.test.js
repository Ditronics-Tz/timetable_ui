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
import courseService from "./courseService";
import moduleService from "./moduleService";
import classService from "./classService";
import roomService from "./roomService";
import staffService from "./staffService";

describe("entity create payloads (snake_case)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("courseService.create", async () => {
    api.post.mockResolvedValue({ data: { course: { id: 1 } } });
    const payload = { name: "BIT", faculty_id: 3, description: "d", level: "NTA 6" };
    await courseService.create(payload);
    expect(api.post).toHaveBeenCalledWith("/protected/timetable/courses", payload);
  });

  it("moduleService.create", async () => {
    api.post.mockResolvedValue({ data: { module: { id: 1 } } });
    const payload = {
      name: "Algo",
      course_id: 1,
      credit_hours: 3,
      type: "core",
      requires_lab: true,
    };
    await moduleService.create(payload);
    expect(api.post).toHaveBeenCalledWith("/protected/timetable/modules", payload);
  });

  it("classService.create", async () => {
    api.post.mockResolvedValue({ data: { class: { id: 1 } } });
    const payload = {
      name: "Y2A",
      course_id: 1,
      year: 2,
      number_of_students: 40,
      academic_year: "2024/25",
    };
    await classService.create(payload);
    expect(api.post).toHaveBeenCalledWith("/protected/timetable/classes", payload);
  });

  it("roomService.create stringifies features", async () => {
    api.post.mockResolvedValue({ data: { room: { id: 1 } } });
    await roomService.create({
      name: "Lab1",
      capacity: 30,
      sticky: false,
      features: { lab: true, building: "A" },
    });
    expect(api.post).toHaveBeenCalledWith(
      "/protected/timetable/rooms",
      expect.objectContaining({
        name: "Lab1",
        capacity: 30,
        features: JSON.stringify({ lab: true, building: "A" }),
      })
    );
  });

  it("staffService.create stringifies preferences", async () => {
    api.post.mockResolvedValue({ data: { staff: { id: 1 } } });
    await staffService.create({
      name: "Dr X",
      email: "x@y.z",
      faculty_id: 1,
      max_hours: 40,
      preferences: { unavailable_days: ["saturday"] },
    });
    expect(api.post).toHaveBeenCalledWith(
      "/protected/timetable/staff",
      expect.objectContaining({
        name: "Dr X",
        preferences: JSON.stringify({ unavailable_days: ["saturday"] }),
      })
    );
  });
});
