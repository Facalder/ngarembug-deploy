"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { type Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import useSWRMutation from "swr/mutation";

import { EntryActionPanel } from "@/components/entry-action-panel";
import { FormLayout } from "@/components/form-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateSlug } from "@/lib/slug";
import { mutationFetcher } from "@/lib/swr";
import {
  type CreateTerm,
  type DraftTerm,
  type Term,
  termSchema,
} from "@/schemas/terms.dto";

interface TermsFormProps {
  initialData?: Term & { id: string; contentStatus?: string };
}

export function TermsForm({ initialData }: TermsFormProps) {
  const router = useRouter();
  const [submitStatus, setSubmitStatus] = useState<
    "draft" | "published" | null
  >(null);

  const TERMS_ENDPOINT = `/terms`;
  const key = initialData?.id
    ? `${TERMS_ENDPOINT}/${initialData.id}`
    : TERMS_ENDPOINT;

  const { trigger, isMutating } = useSWRMutation(key, mutationFetcher);

  const form = useForm<Term>({
    resolver: zodResolver(termSchema) as Resolver<Term>,
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      contentStatus: initialData?.contentStatus || "draft",
    },
  });

  const name = form.watch("name");

  // Auto-generate slug when name changes
  useEffect(() => {
    if (name) {
      const slug = generateSlug(name);
      form.setValue("slug", slug, { shouldValidate: true });
    }
  }, [name, form]);

  const onSubmit = async (
    values: CreateTerm | DraftTerm,
    status: "draft" | "published",
  ) => {
    setSubmitStatus(status);

    try {
      const method = initialData?.id ? "PUT" : "POST";
      const payload = {
        ...values,
        contentStatus: status,
        ...(initialData?.id && { id: initialData.id }),
      };

      await trigger({ method, body: payload });

      toast.success(
        status === "published"
          ? "Syarat & Ketentuan berhasil dipublikasikan!"
          : "Syarat & Ketentuan berhasil disimpan sebagai draft!",
        {
          description:
            status === "published"
              ? `Item "${values.name}" telah dipublikasikan.`
              : `Item "${values.name}" disimpan sebagai draft.`,
        },
      );

      router.push("/dashboard/terms");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Gagal memproses permintaan", {
        description: "Terjadi kesalahan saat memproses permintaan.",
      });
    } finally {
      setSubmitStatus(null);
    }
  };

  const handleCancel = () => router.back();

  return (
    <FormLayout>
      <FormLayout.Form>
        <Form {...form}>
          <form className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Detail Syarat & Ketentuan</CardTitle>
                <CardDescription>
                  Isi informasi detail mengenai syarat dan ketentuan yang
                  berlaku.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 mt-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Syarat</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isMutating}
                          placeholder="Contoh: Dilarang Merokok"
                        />
                      </FormControl>
                      <FormDescription>
                        Nama syarat atau ketentuan yang akan ditampilkan.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Slug is auto-generated from name */}
                <input type="hidden" {...form.register("slug")} />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deskripsi</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          value={field.value ?? ""}
                          rows={4}
                          disabled={isMutating}
                          placeholder="Penjelasan detail mengenai syarat ini..."
                        />
                      </FormControl>
                      <FormDescription>
                        Penjelasan tambahan mengenai syarat (opsional).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </form>
        </Form>
      </FormLayout.Form>

      <FormLayout.Actions>
        <EntryActionPanel
          isLoading={isMutating}
          loadingDraft={isMutating && submitStatus === "draft"}
          loadingPublish={isMutating && submitStatus === "published"}
          onCancel={handleCancel}
          onSubmitDraft={form.handleSubmit((values) =>
            onSubmit(values, "draft"),
          )}
          onSubmitPublish={form.handleSubmit((values) =>
            onSubmit(values, "published"),
          )}
        />
      </FormLayout.Actions>
    </FormLayout>
  );
}
