import { notFound } from "next/navigation";
import DashboardTitle from "@/components/dashboard-title";
import { FacilityForm } from "@/components/form/facility-form";
import { findFacilities } from "@/repositories/facilities.repositories";

interface EditFacilityPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditFacilityPage({
  params,
}: EditFacilityPageProps) {
  const { id } = await params;

  const { data } = await findFacilities({
    id,
    limit: 1,
    page: 1,
    contentStatus: ["draft", "published", "archived"], // Fetch regardless of status to edit
  });

  const facility = data[0];

  if (!facility) {
    notFound();
  }

  return (
    <>
      <DashboardTitle title={`${facility.name}`} subtitle="Perbarui data" />
      <FacilityForm
        initialData={{
          ...facility,
          description: facility.description ?? undefined,
        }}
      />
    </>
  );
}
