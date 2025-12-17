"use client";

import DashboardTitle from "@/components/dashboard-title";
import { TermsForm } from "@/components/form/terms-form";

export default function NewTermPage() {
  return (
    <>
      <DashboardTitle title="Tambah syarat baru" />
      <TermsForm />
    </>
  );
}
