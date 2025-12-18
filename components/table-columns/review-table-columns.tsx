import type { Column } from "@/components/table/table";
import { Badge } from "@/components/ui/badge";
import type { reviews } from "@/db/schema/reviews.schema";

export type Review = typeof reviews.$inferSelect & {
    user?: { id: string; name: string | null; image: string | null };
    cafe?: { id: string; name: string; slug: string };
};

export const reviewColumns: Column<Review>[] = [
    {
        key: "title",
        label: "Judul",
        sortable: true,
        pinned: "left",
        className: "font-medium max-w-[200px]",
    },
    {
        key: "user",
        label: "User",
        render: (row) => (
            <span className="text-sm">{row.user?.name || "Unknown"}</span>
        ),
    },
    {
        key: "cafe",
        label: "Cafe",
        render: (row) => (
            <span className="text-sm">{row.cafe?.name || "Unknown"}</span>
        ),
    },
    {
        key: "rating",
        label: "Rating",
        sortable: true,
        render: (row) => {
            const ratingLabels: Record<string, string> = {
                satu: "⭐",
                dua: "⭐⭐",
                tiga: "⭐⭐⭐",
                empat: "⭐⭐⭐⭐",
                lima: "⭐⭐⭐⭐⭐",
            };
            return <span>{ratingLabels[row.rating] || row.rating}</span>;
        },
    },
    {
        key: "visitorType",
        label: "Tipe Pengunjung",
        render: (row) => {
            const typeLabels: Record<string, string> = {
                keluarga: "Keluarga",
                pasangan: "Pasangan",
                solo: "Solo",
                bisnis: "Bisnis",
                teman: "Teman",
            };
            return (
                <Badge variant="secondary">
                    {typeLabels[row.visitorType] || row.visitorType}
                </Badge>
            );
        },
    },
    {
        key: "review",
        label: "Review",
        className: "max-w-[300px]",
        render: (row) => (
            <div className="truncate text-sm text-muted-foreground">
                {row.review}
            </div>
        ),
    },
    {
        key: "createdAt",
        label: "Dibuat",
        sortable: true,
        render: (row) => (
            <span className="text-sm">
                {new Date(row.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                })}
            </span>
        ),
    },
];
