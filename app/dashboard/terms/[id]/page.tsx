import { notFound } from "next/navigation";
import DashboardTitle from "@/components/dashboard-title";
import { TermsForm } from "@/components/form/terms-form";
import { findTerms } from "@/repositories/terms.repositories";

interface EditTermPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditTermPage({ params }: EditTermPageProps) {
  const { id } = await params;

  const { data } = await findTerms({
    id,
    limit: 1,
    page: 1,
    contentStatus: ["draft", "published", "archived"],
  });

  const term = data[0];

  if (!term) {
    notFound();
  }

  return (
    <>
      <DashboardTitle title={`${term.name}`} subtitle="Perbarui data" />
      <TermsForm
        initialData={{
          ...term,
          description: term.description ?? undefined,
        }}
      />
    </>
  );
}
