"use client";

import type { Column } from "@/components/table";

interface Term {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
  contentStatus: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}

export const termsColumns: Column<Term>[] = [
  {
    key: "name",
    label: "Nama",
    sortable: true,
    className: "min-w-[200px] font-medium",
  },
  {
    key: "slug",
    label: "Slug",
    className: "text-muted-foreground",
  },
  {
    key: "description",
    label: "Deskripsi",
    className: "max-w-[300px] whitespace-normal md:max-w-[400px]",
    render: (row) => (
      <span className="block" title={row.description || ""}>
        {row.description || "-"}
      </span>
    ),
  },
  {
    key: "createdAt",
    label: "Dibuat",
    sortable: true,
    render: (row) =>
      new Date(row.createdAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
  },
  {
    key: "updatedAt",
    label: "Diperbarui",
    render: (row) =>
      new Date(row.updatedAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
  },
  {
    key: "contentStatus",
    label: "Status",
    sortable: true,
    render: (row) => {
      const status = (row.contentStatus || "draft").toLowerCase();
      const statusLabels: Record<string, string> = {
        draft: "Draft",
        published: "Dipublikasikan",
        archived: "Diarsipkan",
      };
      return (
        <span className="capitalize">{statusLabels[status] || status}</span>
      );
    },
  },
];
