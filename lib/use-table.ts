"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useTransition } from "react";

/**
 * Options for table state management
 */
export interface UseTableStateOptions {
  shallow?: boolean;
  debounceMs?: number;
}

/**
 * Enhanced table state hook with type-safe filter management
 * Supports complex URL params for filtering, sorting, pagination, and search
 *
 * @example
 * ```tsx
 * // Simple usage (backward compatible)
 * const { page, setPage, setFilter } = useTableState()
 *
 * // With typed filters
 * interface MyFilters {
 *   region: string[]
 *   priceRange: string[]
 * }
 * const { getFilter, setFilters } = useTableState<MyFilters>()
 * const regions = getFilter<string[]>('region')
 * ```
 */
export function useTableState<
  TFilters extends Record<string, any> = Record<string, any>,
>(_options: UseTableStateOptions = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Memoize searchParams string to prevent infinite loops
  const searchParamsString = useMemo(
    () => searchParams?.toString() || "",
    [searchParams],
  );

  // Stabilize search params value
  const safeSearchParams = useMemo(
    () => new URLSearchParams(searchParamsString),
    [searchParamsString],
  );

  /**
   * Create query string from params object
   */
  const createQueryString = useCallback(
    (params: Record<string, string | number | null | undefined>) => {
      const newSearchParams = new URLSearchParams(searchParamsString);

      for (const [key, value] of Object.entries(params)) {
        if (value === null || value === undefined || value === "") {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }

      return newSearchParams.toString();
    },
    [searchParamsString],
  );

  /**
   * Update URL with new params
   */
  const updateUrl = useCallback(
    (newParams: URLSearchParams, resetPage = false) => {
      if (resetPage) {
        newParams.set("page", "1");
      }
      const url = `${pathname}?${newParams.toString()}`;

      startTransition(() => {
        router.replace(url, { scroll: false });
      });
    },
    [pathname, router],
  );

  // Extract memoized values to avoid stale closures
  const memoizedValues = useMemo(() => {
    return {
      page: Number(safeSearchParams.get("page")) || 1,
      limit: Number(safeSearchParams.get("limit")) || 10,
      sortKey: safeSearchParams.get("orderBy"),
      sortDir: safeSearchParams.get("orderDir") as "asc" | "desc" | null,
      search:
        safeSearchParams.get("search") || safeSearchParams.get("keyword") || "",
    };
  }, [safeSearchParams]);

  // ============================================================================
  // CORE ACTIONS
  // ============================================================================

  /**
   * Set search/keyword term
   */
  const setSearch = useCallback(
    (term: string) => {
      const params = new URLSearchParams(searchParamsString);
      if (term) {
        params.set("search", term);
        // Also support 'keyword' for backward compatibility
        params.delete("keyword");
      } else {
        params.delete("search");
        params.delete("keyword");
      }
      updateUrl(params, true);
    },
    [searchParamsString, updateUrl],
  );

  /**
   * Set pagination page
   */
  const setPage = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParamsString);
      params.set("page", String(newPage));
      updateUrl(params);
    },
    [searchParamsString, updateUrl],
  );

  /**
   * Set pagination limit
   */
  const setLimit = useCallback(
    (newLimit: number) => {
      const params = new URLSearchParams(searchParamsString);
      params.set("limit", String(newLimit));
      updateUrl(params, true); // Reset page on limit change
    },
    [searchParamsString, updateUrl],
  );

  /**
   * Set sorting (toggles asc/desc)
   */
  const setSort = useCallback(
    (key: string) => {
      const params = new URLSearchParams(searchParamsString);
      const currentSort = params.get("orderBy");
      const currentDir = params.get("orderDir");

      let nextDir = "asc";
      if (currentSort === key && currentDir === "asc") {
        nextDir = "desc";
      }

      params.set("orderBy", key);
      params.set("orderDir", nextDir);
      updateUrl(params);
    },
    [searchParamsString, updateUrl],
  );

  /**
   * Set a single filter value
   * Supports: string, string[], number, number[], null
   */
  const setFilter = useCallback(
    (key: string, values: string[] | string | number | number[] | null) => {
      const params = new URLSearchParams(searchParamsString);

      if (!values || (Array.isArray(values) && values.length === 0)) {
        params.delete(key);
      } else if (Array.isArray(values)) {
        // Join arrays with comma
        const joined = values.join(",");
        params.set(key, joined);
      } else {
        params.set(key, String(values));
      }

      updateUrl(params, true);
    },
    [searchParamsString, updateUrl],
  );

  // ============================================================================
  // ENHANCED ACTIONS (Type-Safe)
  // ============================================================================

  /**
   * Get a filter value and parse it back to its type
   * Automatically handles comma-separated arrays
   */
  const getFilter = useCallback(
    <T = any>(key: keyof TFilters): T | undefined => {
      const value = safeSearchParams.get(String(key));
      if (!value) return undefined;

      // Try to parse comma-separated values as array
      if (value.includes(",")) {
        return value.split(",").filter(Boolean) as T;
      }

      // Try to parse as number
      const num = Number(value);
      if (!isNaN(num) && value !== "") {
        return num as T;
      }

      // Return as string
      return value as T;
    },
    [safeSearchParams],
  );

  /**
   * Set multiple filters at once (batch update for performance)
   */
  const setFilters = useCallback(
    (filters: Partial<TFilters>) => {
      const params = new URLSearchParams(searchParamsString);

      for (const [key, value] of Object.entries(filters)) {
        if (value === null || value === undefined) {
          params.delete(key);
        } else if (Array.isArray(value)) {
          if (value.length === 0) {
            params.delete(key);
          } else {
            params.set(key, value.join(","));
          }
        } else {
          params.set(key, String(value));
        }
      }

      updateUrl(params, true);
    },
    [searchParamsString, updateUrl],
  );

  /**
   * Clear specific filters or all filters
   */
  const clearFilters = useCallback(
    (keys?: (keyof TFilters)[]) => {
      const params = new URLSearchParams(searchParamsString);

      if (keys && keys.length > 0) {
        // Clear specific filters
        keys.map((key) => params.delete(String(key)));
      } else {
        // Clear all filters except pagination and sorting
        const preservedKeys = ["page", "limit", "orderBy", "orderDir"];
        const allKeys = Array.from(params.keys());
        allKeys.forEach((key) => {
          if (!preservedKeys.includes(key)) {
            params.delete(key);
          }
        });
      }

      updateUrl(params, true);
    },
    [searchParamsString, updateUrl],
  );

  /**
   * Get all active filters as typed object
   */
  const getActiveFilters = useCallback((): Partial<TFilters> => {
    const filters: any = {};
    const excludedKeys = [
      "page",
      "limit",
      "orderBy",
      "orderDir",
      "search",
      "keyword",
    ];

    safeSearchParams.forEach((value, key) => {
      if (!excludedKeys.includes(key)) {
        // Parse comma-separated to array
        if (value.includes(",")) {
          filters[key] = value.split(",").filter(Boolean);
        } else {
          const num = Number(value);
          filters[key] = !isNaN(num) && value !== "" ? num : value;
        }
      }
    });

    return filters;
  }, [safeSearchParams]);

  return {
    // State
    searchParams: safeSearchParams,
    page: memoizedValues.page,
    limit: memoizedValues.limit,
    sortKey: memoizedValues.sortKey,
    sortDir: memoizedValues.sortDir,
    search: memoizedValues.search,
    isPending,

    // Basic Actions (Backward Compatible)
    setSearch,
    setPage,
    setLimit,
    setSort,
    setFilter,

    // Enhanced Actions (Type-Safe)
    getFilter,
    setFilters,
    clearFilters,
    getActiveFilters,

    // Utils
    createQueryString,
  };
}

/**
 * Type helper to infer filter types from DTO query schemas
 */
export type InferFilters<T> = T extends { parse: (input: any) => infer R }
  ? R
  : never;
