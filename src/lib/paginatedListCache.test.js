import { afterEach, describe, expect, it } from "vitest";
import { getCachedList, invalidatePaginatedListCache, setCachedList } from "./paginatedListCache";

describe("paginated list cache", () => {
  afterEach(() => invalidatePaginatedListCache());

  it("stores page data and pagination state as fresh cache", () => {
    setCachedList("rooms", 10, 0, [{ id: 1 }], false);
    expect(getCachedList("rooms", 10, 0)).toMatchObject({
      items: [{ id: 1 }],
      hasMore: false,
      fresh: true,
    });
    expect(getCachedList("rooms", 10, 10)).toBeUndefined();
  });

  it("invalidates only the requested entity or all entities", () => {
    setCachedList("rooms", 10, 0, [], false);
    setCachedList("staff", 10, 0, [], false);
    invalidatePaginatedListCache("rooms");
    expect(getCachedList("rooms", 10, 0)).toBeUndefined();
    expect(getCachedList("staff", 10, 0)).toBeDefined();
    invalidatePaginatedListCache();
    expect(getCachedList("staff", 10, 0)).toBeUndefined();
  });
});
