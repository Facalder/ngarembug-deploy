"use client";

import DashboardTitle from "@/components/dashboard-title";
import { DataTable } from "@/components/table";
import { recommendationColumns } from "@/components/table-columns/recommendation-table-columns";

export default function UserRecommendationsPage() {
    return (
        <>
            <DashboardTitle
                title="Rekomendasi User"
                subtitle="Daftar kafe yang direkomendasikan oleh pengguna"
            />

            <DataTable
                apiEndpoint="cafe-recommendations"
                columns={recommendationColumns}
                searchPlaceholder="Cari nama kafe, alamat, atau alasan..."
                canDelete
            />
        </>
    );
}
