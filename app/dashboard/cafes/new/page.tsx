"use client";

import DashboardTitle from "@/components/dashboard-title";
import { CafeForm } from "@/components/form/cafe-form";

export default function CreateCafePage() {
  return (
    <>
      <DashboardTitle title="Buat data kafe baru" />
      <CafeForm />
    </>
  );
}
