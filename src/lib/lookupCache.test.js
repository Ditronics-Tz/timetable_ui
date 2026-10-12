import { afterEach, describe, expect, it, vi } from "vitest";
import { clearLookupCache, getCachedLookup } from "./lookupCache";

describe("lookup cache", () => {
  afterEach(() => clearLookupCache());

  it("deduplicates in-flight requests and reuses fresh results", async () => {
    let resolveRequest;
    const fetcher = vi.fn(() => new Promise((resolve) => { resolveRequest = resolve; }));
    const first = getCachedLookup("courses", fetcher);
    const second = getCachedLookup("courses", fetcher);

    await Promise.resolve();
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(second).toBe(first);
    resolveRequest({ courses: [{ id: 1 }] });
    await expect(first).resolves.toEqual({ courses: [{ id: 1 }] });
    await expect(getCachedLookup("courses", fetcher)).resolves.toEqual({ courses: [{ id: 1 }] });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("clears cached values so the next call reloads", async () => {
    const fetcher = vi.fn().mockResolvedValueOnce([1]).mockResolvedValueOnce([2]);
    await expect(getCachedLookup("rooms", fetcher)).resolves.toEqual([1]);
    clearLookupCache("rooms");
    await expect(getCachedLookup("rooms", fetcher)).resolves.toEqual([2]);
  });
});
