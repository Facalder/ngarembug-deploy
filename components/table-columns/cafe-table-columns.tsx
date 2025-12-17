import type { Column } from "@/components/table/table";
import { Badge } from "@/components/ui/badge";
import type { cafes } from "@/db/schema/cafes.schema";

export type Cafe = typeof cafes.$inferSelect;

export const cafeColumns: Column<Cafe>[] = [
  {
    key: "name",
    label: "Nama",
    sortable: true,
    pinned: "left",
    className: "font-medium",
  },
  {
    key: "slug",
    label: "Slug",
    className: "text-muted-foreground",
  },
  {
    key: "cafeType",
    label: "Tipe",
    sortable: true,
    render: (row) => {
      const typeLabels: Record<string, string> = {
        indoor_cafe: "Indoor",
        outdoor_cafe: "Outdoor",
        indoor_outdoor_cafe: "Indoor & Outdoor",
      };
      return (
        <span className="capitalize">
          {typeLabels[row.cafeType] ||
            row.cafeType.replace(/_/g, " ").toLowerCase()}
        </span>
      );
    },
  },
  {
    key: "region",
    label: "Wilayah",
    sortable: true,
    render: (row) => (
      <span className="capitalize">{row.region.replace(/-/g, " ")}</span>
    ),
  },
  {
    key: "address",
    label: "Alamat",
    className: "max-w-[300px] whitespace-normal",
  },
  {
    key: "priceRange",
    label: "Rentang Harga",
    sortable: true,
    render: (row) => {
      const priceLabels: Record<string, string> = {
        low: "Murah",
        medium: "Sedang",
        high: "Mahal",
        premium: "Premium",
      };
      return (
        <span className="whitespace-nowrap">
          {priceLabels[row.priceRange] || row.priceRange}
        </span>
      );
    },
  },
  {
    key: "averageRating",
    label: "Rating",
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-1">
        <span>{Number(row.averageRating).toFixed(1)}</span>
        <span className="text-muted-foreground text-xs">
          ({row.totalReviews})
        </span>
      </div>
    ),
  },
  {
    key: "createdAt",
    label: "Dibuat",
    sortable: true,
    render: (row) => (
      <span>
        {new Date(row.createdAt).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </span>
    ),
  },
  {
    key: "updatedAt",
    label: "Diperbarui",
    sortable: true,
    render: (row) => (
      <span>
        {new Date(row.updatedAt).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </span>
    ),
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
        <Badge
          variant={status === "draft" ? "secondary" : "default"}
          className={
            status === "archived"
              ? "border bg-secondary text-muted-foreground"
              : ""
          }
        >
          {statusLabels[status] || status}
        </Badge>
      );
    },
  },
];
