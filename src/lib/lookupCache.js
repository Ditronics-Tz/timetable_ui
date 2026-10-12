const DEFAULT_TTL_MS = 60_000;
const values = new Map();

/** Share lookup requests between forms while keeping their values briefly fresh. */
export function getCachedLookup(key, fetcher, ttlMs = DEFAULT_TTL_MS) {
  const cached = values.get(key);
  if (cached && Date.now() - cached.updatedAt < ttlMs) {
    return Promise.resolve(cached.value);
  }
  if (cached?.request) return cached.request;

  const request = Promise.resolve()
    .then(fetcher)
    .then((value) => {
      values.set(key, { value, updatedAt: Date.now() });
      return value;
    })
    .catch((error) => {
      if (cached?.value) values.set(key, cached);
      else values.delete(key);
      throw error;
    });
  values.set(key, { ...cached, request });
  return request;
}

export function clearLookupCache(key) {
  if (key) values.delete(key);
  else values.clear();
}
