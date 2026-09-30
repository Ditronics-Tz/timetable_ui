import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./api", () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import api from "./api";
import subjectService from "./subjectService";

describe("subjectService", () => {
  beforeEach(() => vi.clearAllMocks());

  it("lists subjects with pagination and returns the response data", async () => {
    const response = { subjects: [{ id: 1, name: "Mathematics", credit_hours: 3 }] };
    api.get.mockResolvedValue({ data: response });
    await expect(subjectService.list({ limit: 10, offset: 20 })).resolves.toEqual(response);
    expect(api.get).toHaveBeenCalledWith("/protected/timetable/subjects", { params: { limit: 10, offset: 20 } });
  });

  it("gets a subject by id", async () => {
    api.get.mockResolvedValue({ data: { subject: { id: 4 } } });
    await subjectService.get(4);
    expect(api.get).toHaveBeenCalledWith("/protected/timetable/subjects/4");
  });

  it("creates a subject", async () => {
    const payload = { name: "Mathematics", credit_hours: 3 };
    api.post.mockResolvedValue({ data: { subject: { id: 1, ...payload } } });
    await subjectService.create(payload);
    expect(api.post).toHaveBeenCalledWith("/protected/timetable/subjects", payload);
  });

  it("updates a subject", async () => {
    const payload = { credit_hours: 4 };
    api.put.mockResolvedValue({ data: { subject: { id: 1, credit_hours: 4 } } });
    await subjectService.update(1, payload);
    expect(api.put).toHaveBeenCalledWith("/protected/timetable/subjects/1", payload);
  });

  it("removes a subject", async () => {
    api.delete.mockResolvedValue({ data: { message: "deleted" } });
    await subjectService.remove(1);
    expect(api.delete).toHaveBeenCalledWith("/protected/timetable/subjects/1");
  });
});
