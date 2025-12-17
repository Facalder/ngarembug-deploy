"use client";

import dynamic from "next/dynamic";
import type { JSX } from "react";
import type { DataTableProps } from "@/components/table/table";
import { Skeleton } from "@/components/ui/skeleton";

export * from "@/components/table/table";

export const DataTable = dynamic(
  () => import("@/components/table/table").then((mod) => mod.DataTable),
  {
    loading: () => <Skeleton className="h-100 w-full rounded-md" />,
    ssr: false,
  },
) as <T extends { id: string | number }>(
  props: DataTableProps<T>,
) => JSX.Element;

export const TableToolbar = dynamic(
  () =>
    import("@/components/table/table-toolbar").then((mod) => mod.TableToolbar),
  {
    loading: () => <Skeleton className="h-9 w-full rounded-md" />,
    ssr: false,
  },
);

export const TablePagination = dynamic(
  () =>
    import("@/components/table/table-pagination").then(
      (mod) => mod.TablePagination,
    ),
  {
    ssr: false,
  },
);
