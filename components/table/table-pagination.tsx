"use client";

import {
  ArrowLeft01Icon,
  ArrowLeftDoubleIcon,
  ArrowRight01Icon,
  ArrowRightDoubleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useTableState } from "@/lib/use-table";

interface TablePaginationProps {
  total: number;
  totalPages: number;
  isLoading?: boolean;

  // Controlled State Overrides
  page?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

export function TablePagination({
  total,
  totalPages,
  isLoading,

  page: controlledPage,
  limit: controlledLimit,
  onPageChange,
  onLimitChange,
}: TablePaginationProps) {
  const {
    page: hookPage,
    limit: hookLimit,
    setPage: hookSetPage,
    setLimit: hookSetLimit,
  } = useTableState();

  const isControlled =
    controlledPage !== undefined || controlledLimit !== undefined;

  const page = isControlled ? (controlledPage ?? 1) : hookPage;
  const limit = isControlled ? (controlledLimit ?? 10) : hookLimit;

  const setPage = isControlled ? onPageChange || (() => {}) : hookSetPage;
  const setLimit = isControlled ? onLimitChange || (() => {}) : hookSetLimit;

  if (isLoading) {
    return (
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-50" />
        <div className="flex items-center gap-6 lg:gap-8">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-25" />
          </div>
          <Skeleton className="h-8 w-37.5" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <div className="text-muted-foreground flex-1 text-sm">
        Total {total} rows
      </div>
      <div className="flex items-center gap-6 lg:gap-8">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${limit}`}
            onValueChange={(value) => {
              setLimit(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-17.5">
              <SelectValue placeholder={`${limit}`} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-25 items-center justify-center text-sm font-medium">
          Page {page} of {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => setPage(1)}
            disabled={page === 1}
          >
            <span className="sr-only">Go to first page</span>
            <HugeiconsIcon icon={ArrowLeftDoubleIcon} className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            <span className="sr-only">Go to previous page</span>
            <HugeiconsIcon icon={ArrowLeft01Icon} className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            <span className="sr-only">Go to next page</span>
            <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
          >
            <span className="sr-only">Go to last page</span>
            <HugeiconsIcon icon={ArrowRightDoubleIcon} className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
