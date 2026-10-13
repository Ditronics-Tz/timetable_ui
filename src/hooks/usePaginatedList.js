import { useCallback, useEffect, useState } from "react";
import { extractApiError } from "../lib/apiError";
import {
  getCachedList,
  setCachedList,
} from "../lib/paginatedListCache";

/**
 * Shared list/pagination hook.
 * @param {Function} fetchFn - async ({limit, offset}) => { itemsKey: [], limit, offset }
 * @param {string} itemsKey - key in response holding the array (e.g. "faculties")
 * @param {object} options - { pageSize, autoLoad }
 */
export function usePaginatedList(fetchFn, itemsKey, options = {}) {
  const pageSize = options.pageSize ?? 10;
  const autoLoad = options.autoLoad !== false;
  const initialCache = getCachedList(itemsKey, pageSize, 0);

  const [items, setItems] = useState(() => {
    return initialCache?.items ?? [];
  });
  const [limit, setLimit] = useState(pageSize);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(autoLoad);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(() => initialCache?.hasMore ?? true);

  const load = useCallback(
    async (nextOffset = offset, nextLimit = limit) => {
      setLoading(true);
      setError("");
      const cached = getCachedList(itemsKey, nextLimit, nextOffset);
      if (cached) setItems(cached.items);
      try {
        const data = await fetchFn({ limit: nextLimit, offset: nextOffset });
        const list = data?.[itemsKey] ?? [];
        const safeList = Array.isArray(list) ? list : [];
        setItems(safeList);
        setCachedList(itemsKey, nextLimit, nextOffset, safeList, safeList.length >= nextLimit);
        setOffset(nextOffset);
        setLimit(nextLimit);
        setHasMore(Array.isArray(list) && list.length >= nextLimit);
        return data;
      } catch (err) {
        setError(extractApiError(err));
        if (!cached) setItems([]);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchFn, itemsKey, limit, offset]
  );

  const refetch = useCallback(() => load(offset, limit), [load, offset, limit]);

  const nextPage = useCallback(() => {
    if (!hasMore || loading) return;
    return load(offset + limit, limit);
  }, [hasMore, loading, load, offset, limit]);

  const prevPage = useCallback(() => {
    if (offset <= 0 || loading) return;
    const next = Math.max(0, offset - limit);
    return load(next, limit);
  }, [offset, loading, load, limit]);

  useEffect(() => {
    if (autoLoad) {
      const cache = getCachedList(itemsKey, pageSize, 0);
      if (!cache?.fresh) {
        load(0, pageSize).catch(() => {});
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoLoad, itemsKey, load, pageSize]);

  return {
    items,
    loading,
    error,
    limit,
    offset,
    hasMore,
    page: Math.floor(offset / limit) + 1,
    load,
    refetch,
    nextPage,
    prevPage,
    setItems,
  };
}

export default usePaginatedList;
