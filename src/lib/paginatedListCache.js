const LIST_CACHE_TTL_MS = 30_000;
const listCache = new Map();

export function getCachedList(itemsKey, limit, offset) {
  const cache = listCache.get(`${itemsKey}:${limit}:${offset}`);
  return cache && { ...cache, fresh: Date.now() - cache.updatedAt < LIST_CACHE_TTL_MS };
}

export function setCachedList(itemsKey, limit, offset, items, hasMore) {
  listCache.set(`${itemsKey}:${limit}:${offset}`, { items, hasMore, updatedAt: Date.now() });
}

export function invalidatePaginatedListCache(itemsKey) {
  if (!itemsKey) {
    listCache.clear();
    return;
  }
  for (const key of listCache.keys()) {
    if (key.startsWith(`${itemsKey}:`)) listCache.delete(key);
  }
}
