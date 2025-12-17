"use client";

import {
  AlertCircleIcon,
  ArrowDown01Icon,
  ArrowUp01Icon,
  Delete01Icon,
  FileNotFoundIcon,
  MoreHorizontalIcon,
  PencilEdit01Icon,
  ReloadIcon,
  Sorting05Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { AlertConfirmModal } from "@/components/modal/alert-confirm-modal";
import { TablePagination } from "@/components/table/table-pagination";
import { type Filter, TableToolbar } from "@/components/table/table-toolbar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

import { Skeleton } from "@/components/ui/skeleton";
import { mutationFetcher } from "@/lib/swr";
import { useApiQuery } from "@/lib/use-api-query";
import { cn } from "@/lib/utils";

export type Column<T> = {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  className?: string; // Additional classes for cell
  headerClassName?: string; // Additional classes for header
  render?: (row: T) => React.ReactNode;
  pinned?: "left" | "right";
};

export interface DataTableProps<T> {
  apiEndpoint: string;
  columns: Column<T>[];
  renderRowAction?: (row: T) => React.ReactNode;
  searchPlaceholder?: string;
  filters?: Filter[];
  editHref?: string; // If provided, shows Edit button linking to {editHref}/{id}
  canDelete?: boolean; // If true, shows Delete button and handles deletion via apiEndpoint
}

interface RowActionsProps {
  id: string | number;
  apiEndpoint: string;
  editHref?: string;
  canDelete?: boolean;
}

function RowActions({ id, apiEndpoint, editHref, canDelete }: RowActionsProps) {
  const [openDelete, setOpenDelete] = React.useState(false);
  const { mutate } = useSWRConfig();

  // Normalize endpoint for mutation
  const endpoint = apiEndpoint.startsWith("/")
    ? apiEndpoint
    : `/${apiEndpoint}`;

  const { trigger, isMutating } = useSWRMutation(
    `${endpoint}/${id}`,
    mutationFetcher,
  );

  const handleDelete = async () => {
    try {
      await trigger({ method: "DELETE" });
      toast.success("Data berhasil dihapus");
      // Invalidate any cache matching the endpoint
      mutate((key) => typeof key === "string" && key.includes(endpoint));
      setOpenDelete(false);
    } catch (error) {
      console.error(error);
      toast.error("Gagal menghapus data");
    }
  };

  if (!editHref && !canDelete) return null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <HugeiconsIcon icon={MoreHorizontalIcon} className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {editHref && (
            <DropdownMenuItem asChild>
              <Link href={`${editHref}/${id}`}>
                <HugeiconsIcon
                  icon={PencilEdit01Icon}
                  className="mr-2 h-4 w-4"
                />
                Edit
              </Link>
            </DropdownMenuItem>
          )}
          {canDelete && (
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => setOpenDelete(true)}
            >
              <HugeiconsIcon icon={Delete01Icon} className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {canDelete && (
        <AlertConfirmModal
          isOpen={openDelete}
          onOpenChange={setOpenDelete}
          onConfirm={handleDelete}
          loading={isMutating}
          title="Hapus Data?"
          description="Tindakan ini tidak dapat dibatalkan. Data akan dihapus secara permanen."
          confirmText="Hapus"
        />
      )}
    </>
  );
}

export function DataTable<T extends { id: string | number }>({
  apiEndpoint,
  columns,
  renderRowAction,
  searchPlaceholder,
  filters,
  editHref,
  canDelete,
}: DataTableProps<T>) {
  // Use the new hook for all state + fetching
  const query = useApiQuery<T>({ apiEndpoint });

  const rows = query.data;
  const pagination = query.meta;

  // Sticky Helpers
  const getStickyStyle = (col: Column<T>) => {
    if (!col.pinned) return {};
    if (col.pinned === "left") {
      return { position: "sticky", left: 0, zIndex: 10 } as React.CSSProperties;
    }
    if (col.pinned === "right") {
      return {
        position: "sticky",
        right: 0,
        zIndex: 10,
      } as React.CSSProperties;
    }
    return {};
  };

  const getStickyClass = (col: Column<T>) => {
    if (!col.pinned) return "";
    return cn(
      "bg-background shadow-[1px_0_0_0_var(--color-border)]",
      col.pinned === "left"
        ? "left-0 border-r"
        : "right-0 border-l shadow-[-1px_0_0_0_var(--color-border)]",
    );
  };

  return (
    <div className="space-y-4">
      <TableToolbar
        searchPlaceholder={searchPlaceholder}
        filters={filters}
        columns={columns}
        onRefresh={() => query.mutate()}
        isRefreshing={query.isValidating}
        // Pass controlled state from hook
        search={query.search}
        onSearch={query.setSearch}
        activeFilters={query.filters}
        onFilterChange={query.setFilter}
      />
      <div className="rounded-md border border-border overflow-hidden">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                {columns.map((col) => {
                  const isSorted = query.sortKey === col.key;
                  const sortDir = query.sortDir;

                  return (
                    <th
                      key={String(col.key)}
                      className={cn(
                        "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
                        col.headerClassName,
                        getStickyClass(col),
                      )}
                      style={getStickyStyle(col)}
                    >
                      {col.sortable ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="-ml-3 h-8 data-[state=open]:bg-accent"
                          onClick={() => query.setSort(String(col.key))}
                        >
                          <span>{col.label}</span>
                          {isSorted ? (
                            sortDir === "desc" ? (
                              <HugeiconsIcon
                                icon={ArrowDown01Icon}
                                className="ml-2 h-4 w-4"
                              />
                            ) : (
                              <HugeiconsIcon
                                icon={ArrowUp01Icon}
                                className="ml-2 h-4 w-4"
                              />
                            )
                          ) : (
                            <HugeiconsIcon
                              icon={Sorting05Icon}
                              className="ml-2 h-4 w-4 opacity-50"
                            />
                          )}
                        </Button>
                      ) : (
                        col.label
                      )}
                    </th>
                  );
                })}
                {/* Actions column */}
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground sticky right-0 z-10 bg-background border-l shadow-[-1px_0_0_0_var(--color-border)] w-12.5"></th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {query.isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr
                    key={i.toString()}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    {columns.map((_col, j) => (
                      <td key={j.toString()} className="p-4">
                        <Skeleton className="h-4 w-full" />
                      </td>
                    ))}
                    <td className="p-4">
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </td>
                  </tr>
                ))
              ) : query.error ? (
                <tr>
                  <td colSpan={columns.length + 1} className="h-24 text-center">
                    <Empty>
                      <EmptyHeader>
                        <EmptyMedia
                          variant="icon"
                          className="bg-destructive/10 text-destructive"
                        >
                          <HugeiconsIcon icon={AlertCircleIcon} />
                        </EmptyMedia>
                        <EmptyTitle>Gagal memuat data</EmptyTitle>
                        <EmptyDescription>
                          Terjadi kesalahan saat mengambil data. Silakan coba
                          lagi.
                        </EmptyDescription>
                      </EmptyHeader>
                      <EmptyContent>
                        <Button
                          variant="outline"
                          disabled={query.isValidating}
                          onClick={() => {
                            console.clear();
                            query.mutate();
                          }}
                        >
                          <HugeiconsIcon
                            icon={ReloadIcon}
                            className={cn(query.isValidating && "animate-spin")}
                          />
                          {query.isValidating ? "Memuat..." : "Muat Ulang"}
                        </Button>
                      </EmptyContent>
                    </Empty>
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="h-24 text-center">
                    <Empty>
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <HugeiconsIcon icon={FileNotFoundIcon} />
                        </EmptyMedia>
                        <EmptyTitle>Belum ada data</EmptyTitle>
                        <EmptyDescription>
                          Data yang Anda cari tidak ditemukan atau belum
                          ditambahkan.
                        </EmptyDescription>
                      </EmptyHeader>
                      <EmptyContent>
                        <Button
                          variant="outline"
                          disabled={query.isValidating}
                          onClick={() => query.mutate()}
                        >
                          <HugeiconsIcon
                            icon={ReloadIcon}
                            className={cn(query.isValidating && "animate-spin")}
                          />
                          {query.isValidating ? "Memuat..." : "Perbarui Data"}
                        </Button>
                      </EmptyContent>
                    </Empty>
                  </td>
                </tr>
              ) : (
                rows.map((row: T) => (
                  <tr
                    key={row.id}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    {columns.map((col) => (
                      <td
                        key={String(col.key)}
                        className={cn(
                          "p-4 align-middle [&:has([role=checkbox])]:pr-0",
                          col.className,
                          getStickyClass(col),
                        )}
                        style={getStickyStyle(col)}
                      >
                        {col.render
                          ? col.render(row)
                          : (row[col.key as keyof T] as React.ReactNode)}
                      </td>
                    ))}
                    <td className="p-4 align-middle sticky right-0 z-10 bg-background border-l shadow-[-1px_0_0_0_var(--color-border)]">
                      {renderRowAction ? (
                        renderRowAction(row)
                      ) : (
                        <RowActions
                          id={row.id}
                          apiEndpoint={apiEndpoint}
                          editHref={editHref}
                          canDelete={canDelete}
                        />
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!query.isLoading && (
        <TablePagination
          total={pagination.total}
          totalPages={pagination.totalPages}
          page={query.page}
          limit={query.limit}
          onPageChange={query.setPage}
          onLimitChange={query.setLimit}
        />
      )}
    </div>
  );
}
