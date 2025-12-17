"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/swr";
import { useTableState } from "@/lib/use-table";

interface UseApiQueryOptions {
  apiEndpoint: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Combined hook that integrates useTableState with SWR data fetching
 * Automatically builds URL with query params and fetches data
 *
 * @example
 * ```tsx
 * const query = useApiQuery<Cafe>({ apiEndpoint: '/cafes' })
 *
 * return (
 *   <div>
 *     {query.isLoading && <Loading />}
 *     {query.data.map(item => <div key={item.id}>{item.name}</div>)}
 *     <Pagination
 *       page={query.page}
 *       onPageChange={query.setPage}
 *     />
 *   </div>
 * )
 * ```
 */
export function useApiQuery<T>({ apiEndpoint }: UseApiQueryOptions) {
  // Get table state (URL params)
  const tableState = useTableState();
  const { searchParams } = tableState;

  // Build  URL with query params
  const endpoint = apiEndpoint.startsWith("/")
    ? apiEndpoint
    : `/${apiEndpoint}`;
  const queryString = searchParams.toString();
  const url = queryString ? `${endpoint}?${queryString}` : endpoint;

  // Fetch data with SWR
  const { data, error, isLoading, isValidating, mutate } = useSWR<
    ApiResponse<T>
  >(url, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    keepPreviousData: true,
  });

  // Extract active filters (excluding pagination, sort, search)
  const filters = tableState.getActiveFilters();

  return {
    // Data
    data: data?.data || [],
    meta: data?.meta || {
      total: 0,
      page: tableState.page,
      limit: tableState.limit,
      totalPages: 0,
    },

    // State from URL
    page: tableState.page,
    limit: tableState.limit,
    search: tableState.search,
    sortKey: tableState.sortKey,
    sortDir: tableState.sortDir,
    filters,

    // Actions
    setPage: tableState.setPage,
    setLimit: tableState.setLimit,
    setSearch: tableState.setSearch,
    setSort: tableState.setSort,
    setFilter: tableState.setFilter,
    setFilters: tableState.setFilters,
    clearFilters: tableState.clearFilters,

    // SWR state
    isLoading,
    isValidating,
    error,
    mutate,
  };
}
