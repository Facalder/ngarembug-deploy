"use client";

import DashboardTitle from "@/components/dashboard-title";
import { DataTable } from "@/components/table";
import { reviewColumns } from "@/components/table-columns/review-table-columns";

export default function ReviewsDashboardPage() {
    return (
        <>
            <DashboardTitle
                title="Halaman Review"
                subtitle="Kelola data review cafe"
            />

            <DataTable
                apiEndpoint="reviews"
                columns={reviewColumns}
                searchPlaceholder="Search title or review..."
                editHref="/dashboard/reviews"
                canDelete
            />
        </>
    );
}
