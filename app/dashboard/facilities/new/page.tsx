"use client";

import DashboardTitle from "@/components/dashboard-title";
import { FacilityForm } from "@/components/form/facility-form";

export default function CreateFacilityPage() {
  return (
    <>
      <DashboardTitle title="Tambah fasilitas baru" />
      <FacilityForm />
    </>
  );
}
