import { notFound } from "next/navigation";
import DashboardTitle from "@/components/dashboard-title";
import { CafeForm } from "@/components/form/cafe-form";
import { getCafeById } from "@/repositories/cafes.repositories";

interface EditCafePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditCafePage({ params }: EditCafePageProps) {
  const { id } = await params;

  const cafe = await getCafeById(id);

  if (!cafe) {
    notFound();
  }

  return (
    <>
      <DashboardTitle title={`${cafe.name}`} subtitle="Perbarui data" />
      <CafeForm initialData={cafe as any} />
    </>
  );
}
