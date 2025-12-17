"use client";

import DashboardTitle from "@/components/dashboard-title";
import { DataTable } from "@/components/table";
import { facilitiesColumns } from "@/components/table-columns/facilities-table-columns";

export default function FacilitiesDashboardPage() {
  return (
    <>
      <DashboardTitle
        title="Fasilitas"
        subtitle="Kelola data fasilitas"
        createLabel="Tambah Fasilitas"
        createHref="/dashboard/facilities/new"
      />

      <DataTable
        apiEndpoint="facilities"
        columns={facilitiesColumns}
        searchPlaceholder="Search name or description..."
        editHref="/dashboard/facilities"
        canDelete={true}
      />
    </>
  );
}
