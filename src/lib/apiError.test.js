import { describe, it, expect } from "vitest";
import { extractApiError } from "./apiError";

describe("extractApiError", () => {
  it("prefers response.data.error", () => {
    expect(
      extractApiError({ response: { data: { error: "boom", message: "msg" } } })
    ).toBe("boom");
  });

  it("falls back to message then details then Error.message", () => {
    expect(extractApiError({ response: { data: { message: "m" } } })).toBe("m");
    expect(extractApiError({ response: { data: { details: "d" } } })).toBe("d");
    expect(extractApiError(new Error("e"))).toBe("e");
    expect(extractApiError({})).toBe("Something went wrong");
  });
});
