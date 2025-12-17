"use client";

import {
  FilterHorizontalIcon,
  ReloadIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useDebouncedCallback } from "use-debounce";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useTableState } from "@/lib/use-table";
import { cn } from "@/lib/utils";

export type FilterOption = {
  label: string;
  value: string | number;
};

export type Filter = {
  key: string;
  label: string;
  description?: string;
  options: FilterOption[];
};

import { createEnumFilter } from "@/lib/enum-utils";

const FILTER_MAPPING: Record<
  string,
  { label: string; options: { value: string; label: string }[] }
> = {
  cafeType: createEnumFilter("cafeType", "Tipe Kafe"),
  region: createEnumFilter("region", "Wilayah"),
  priceRange: createEnumFilter("priceRange", "Rentang Harga"),
  contentStatus: createEnumFilter("contentStatus", "Status"),
  visitorType: createEnumFilter("visitorType", "Tipe Pengunjung"),
  starRating: createEnumFilter("starRating", "Rating"),
};

// ... imports

interface TableToolbarProps {
  searchPlaceholder?: string;
  filters?: Filter[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns?: { key: string | number | symbol }[];
  onRefresh?: () => void;
  isRefreshing?: boolean;

  // Controlled State Overrides (Optional - for useApiQuery or local state)
  search?: string;
  onSearch?: (term: string) => void;

  activeFilters?: Record<string, string | string[]>;
  onFilterChange?: (key: string, value: string | string[] | null) => void;
}

export function TableToolbar({
  searchPlaceholder = "Search...",
  filters = [],
  columns = [],
  onRefresh,
  isRefreshing,

  search: controlledSearch,
  onSearch: controlledOnSearch,
  activeFilters: controlledFilters,
  onFilterChange: controlledOnFilterChange,
}: TableToolbarProps) {
  // Fallback to legacy hook if no controlled props
  const {
    searchParams,
    setSearch: hookSetSearch,
    setFilter: hookSetFilter,
  } = useTableState();

  const isControlled =
    controlledSearch !== undefined || controlledFilters !== undefined;

  const currentSearch = isControlled
    ? controlledSearch
    : searchParams.get("search")?.toString();

  // Create unified handlers
  const handleSearch = useDebouncedCallback((term: string) => {
    if (controlledOnSearch) {
      controlledOnSearch(term);
    } else {
      hookSetSearch(term);
    }
  }, 300);

  // Helper to get active filter value
  const getFilterValue = (key: string): string[] => {
    if (controlledFilters) {
      const val = controlledFilters[key];
      if (Array.isArray(val)) return val;
      if (val) return String(val).split(",");
      return [];
    }
    const val = searchParams.get(key);
    return val ? val.split(",") : [];
  };

  const handleFilter = (key: string, values: string[]) => {
    // Logic to sync back
    // If controlled, we pass the values array directly (or join it if the handler expects atomic updates?)
    // usage in DropdownMenu below passes "next" which is string[]
    if (controlledOnFilterChange) {
      controlledOnFilterChange(key, values);
    } else {
      hookSetFilter(key, values);
    }
  };

  // Handle Search
  // (Note: handleSearch is already defined above using useDebouncedCallback)

  const dynamicFilters: Filter[] = columns
    .map((col) => {
      const key = String(col.key);
      const mapping = FILTER_MAPPING[key];
      if (mapping) {
        return {
          key,
          label: mapping.label,
          options: mapping.options as unknown as FilterOption[],
        };
      }
      return null;
    })
    .filter((f): f is Filter => f !== null);

  const activeFilters = [...dynamicFilters, ...filters];

  return (
    <div className="flex flex-col gap-4 md:gap-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
        <div className="relative w-full sm:max-w-xs min-w-50">
          <Input
            placeholder={searchPlaceholder}
            defaultValue={currentSearch}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9 h-9"
          />
          <HugeiconsIcon
            icon={Search01Icon}
            className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
          />
        </div>
        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-1"
            disabled={isRefreshing}
            onClick={onRefresh}
          >
            <HugeiconsIcon
              icon={ReloadIcon}
              className={cn("h-4 w-4", isRefreshing && "animate-spin")}
            />
            Refresh
          </Button>
        )}

        {activeFilters.map((filter) => (
          <DropdownMenu key={filter.key}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-1 border-dashed"
              >
                <HugeiconsIcon
                  icon={FilterHorizontalIcon}
                  className="h-4 w-4"
                />
                {filter.label}
                {getFilterValue(filter.key).length > 0 && (
                  <span className="bg-primary text-primary-foreground ml-1 flex h-4 w-4 items-center justify-center rounded-sm text-[10px] p-0.5">
                    {getFilterValue(filter.key).length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>{filter.label}</DropdownMenuLabel>
              {filter.description && (
                <p className="px-2 py-1 text-xs text-muted-foreground">
                  {filter.description}
                </p>
              )}
              <DropdownMenuSeparator />
              {filter.options.map((option) => {
                const currentValues = getFilterValue(filter.key);

                // Check case-insensitively
                const isChecked = currentValues.some(
                  (v) => v.toLowerCase() === String(option.value).toLowerCase(),
                );

                return (
                  <DropdownMenuCheckboxItem
                    key={option.value}
                    checked={isChecked}
                    onCheckedChange={(checked) => {
                      const valueStr = String(option.value).toLowerCase();
                      const currentValuesLower = currentValues.map((v) =>
                        v.toLowerCase(),
                      );
                      let next: string[];

                      if (checked) {
                        if (!currentValuesLower.includes(valueStr)) {
                          next = [...currentValues, valueStr];
                        } else {
                          next = currentValues;
                        }
                      } else {
                        next = currentValues.filter(
                          (v) => v.toLowerCase() !== valueStr,
                        );
                      }
                      handleFilter(filter.key, next);
                    }}
                  >
                    {option.label}
                  </DropdownMenuCheckboxItem>
                );
              })}
              {getFilterValue(filter.key).length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={false}
                    onSelect={() => handleFilter(filter.key, [])}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </DropdownMenuCheckboxItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        ))}
      </div>
    </div>
  );
}
