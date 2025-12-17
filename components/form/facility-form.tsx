"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { type Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import useSWRMutation from "swr/mutation";
import { ZodError } from "zod";

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
  type CreateFacility,
  createFacilitySchema,
  type DraftFacility,
  draftFacilitySchema,
} from "@/schemas/facilities.dto";

interface FacilityFormProps {
  initialData?: CreateFacility & { id: string; contentStatus?: string };
}

export function FacilityForm({ initialData }: FacilityFormProps) {
  const router = useRouter();
  const [submitStatus, setSubmitStatus] = useState<
    "draft" | "published" | null
  >(null);

  const FACILITIES_ENDPOINT = `/facilities`;
  const key = initialData?.id
    ? `${FACILITIES_ENDPOINT}/${initialData.id}`
    : FACILITIES_ENDPOINT;

  const { trigger, isMutating } = useSWRMutation(key, mutationFetcher);

  const form = useForm<CreateFacility>({
    resolver: zodResolver(createFacilitySchema) as Resolver<CreateFacility>,
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      contentStatus: initialData?.contentStatus || "draft",
    },
  });

  const name = form.watch("name");

  // Auto-generate slug when name changes (only for new entries)
  useEffect(() => {
    if (name && !initialData?.id) {
      const slug = generateSlug(name);
      form.setValue("slug", slug, { shouldValidate: true });
    }
  }, [name, form, initialData?.id]);

  const onSubmit = async (
    values: CreateFacility | DraftFacility,
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

      const isUpdate = initialData?.id;
      const action = isUpdate ? "diperbarui" : "dibuat";

      toast.success(
        status === "published"
          ? `Fasilitas berhasil ${action} dan dipublikasikan!`
          : `Fasilitas berhasil ${action} sebagai draft!`,
        {
          description:
            status === "published"
              ? `Fasilitas "${values.name}" telah dipublikasikan.`
              : `Fasilitas "${values.name}" disimpan sebagai draft.`,
        },
      );

      router.push("/dashboard/facilities");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Gagal memproses permintaan", {
        description:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat memproses permintaan.",
      });
    } finally {
      setSubmitStatus(null);
    }
  };

  // Handle submit draft - validate dengan draftFacilitySchema (less strict)
  const handleSubmitDraft = async () => {
    try {
      const values = form.getValues();
      // Validate dengan draft schema
      const validatedValues = draftFacilitySchema.parse(values);
      await onSubmit(validatedValues, "draft");
    } catch (error) {
      if (error instanceof ZodError) {
        const firstError = error.issues[0];
        toast.error("Validasi gagal", {
          description: `${firstError.path.join(".")}: ${firstError.message}`,
        });
      } else if (error instanceof Error) {
        toast.error("Validasi gagal", {
          description: error.message,
        });
      }
    }
  };

  // Handle submit publish - validate dengan createFacilitySchema (strict)
  const handleSubmitPublish = async () => {
    try {
      const values = form.getValues();
      // Validate dengan create schema (strict)
      const validatedValues = createFacilitySchema.parse(values);
      await onSubmit(validatedValues, "published");
    } catch (error) {
      if (error instanceof ZodError) {
        const firstError = error.issues[0];
        toast.error("Validasi gagal", {
          description: `${firstError.path.join(".")}: ${firstError.message}`,
        });
      } else if (error instanceof Error) {
        toast.error("Validasi gagal", {
          description: error.message,
        });
      }
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
                <CardTitle>Detail Fasilitas</CardTitle>
                <CardDescription>
                  Isi informasi detail mengenai fasilitas yang tersedia.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 mt-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Fasilitas</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isMutating}
                          placeholder="Contoh: Wifi, Parkir Luas"
                        />
                      </FormControl>
                      <FormDescription>
                        Nama fasilitas yang akan ditampilkan.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Slug is auto-generated from name for new entries */}
                <input type="hidden" {...form.register("slug")} />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deskripsi (Opsional)</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          value={field.value ?? ""}
                          rows={4}
                          disabled={isMutating}
                          placeholder="Deskripsi singkat mengenai fasilitas..."
                        />
                      </FormControl>
                      <FormDescription>
                        Penjelasan tambahan mengenai fasilitas.
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
          onSubmitDraft={handleSubmitDraft}
          onSubmitPublish={handleSubmitPublish}
        />
      </FormLayout.Actions>
    </FormLayout>
  );
}
