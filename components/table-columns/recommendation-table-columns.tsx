import type { Column } from "@/components/table/table";
import { Badge } from "@/components/ui/badge";
import type { cafeRecommendations } from "@/db/schema/cafe-recommendations.schema";

export type CafeRecommendation = typeof cafeRecommendations.$inferSelect & {
    user?: { id: string; name: string | null; image: string | null };
};

export const recommendationColumns: Column<CafeRecommendation>[] = [
    {
        key: "cafeName",
        label: "Nama Cafe",
        sortable: true,
        pinned: "left",
        className: "font-medium max-w-[200px]",
    },
    {
        key: "user",
        label: "Dikirim Oleh",
        render: (row) => (
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{row.user?.name || "Unknown User"}</span>
            </div>
        ),
    },
    {
        key: "cafeType",
        label: "Tipe",
        render: (row) => {
            const typeLabels: Record<string, string> = {
                indoor_cafe: "Indoor",
                outdoor_cafe: "Outdoor",
                indoor_outdoor_cafe: "Hybrid",
            };
            return (
                <Badge variant="outline">
                    {typeLabels[row.cafeType] || row.cafeType}
                </Badge>
            );
        },
    },
    {
        key: "address",
        label: "Alamat",
        className: "max-w-[250px]",
        render: (row) => (
            <div className="truncate text-sm text-muted-foreground" title={row.address}>
                {row.address}
            </div>
        ),
    },
    {
        key: "reason",
        label: "Alasan",
        className: "max-w-[300px]",
        render: (row) => (
            <div className="truncate text-sm text-muted-foreground" title={row.reason || ""}>
                {row.reason || "-"}
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
