"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Delete01Icon, ImageAdd01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useEffect, useState } from "react";
import { type Resolver, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";
import useSWRMutation from "swr/mutation";
import { ZodError } from "zod";
import { EntryActionPanel } from "@/components/entry-action-panel";
import { FormLayout } from "@/components/form-layout";
import {
  type GenericEntryConfig,
  GenericEntryModal,
} from "@/components/modal/generic-entry-modal";
import { ImageManagerModal } from "@/components/modal/image-manager-modal";
import { Button } from "@/components/ui/button";
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
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cafeType, priceRange, region } from "@/db/schema/enums.schema";
import type { Image as ImageType } from "@/db/schema/images.schema";
import { generateSlug } from "@/lib/slug";
import { STORAGE_BUCKETS } from "@/lib/storage-constants";
import { fetcher, mutationFetcher } from "@/lib/swr";
import {
  type CreateCafe,
  createCafeSchema,
  draftCafeSchema,
  publishCafeSchema,
} from "@/schemas/cafes.dto";

interface CafeFormProps {
  initialData?: CreateCafe & { id: string };
}

interface FacilityItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export function CafeForm({ initialData }: CafeFormProps) {
  const router = useRouter();
  const [submitStatus, setSubmitStatus] = useState<
    "draft" | "published" | null
  >(null);

  // States for Image Manager
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [activeImageField, setActiveImageField] = useState<
    "thumbnail" | "gallery" | "menu" | null
  >(null);

  // States for Generic Entry Modal
  const [genericModalOpen, setGenericModalOpen] = useState(false);
  const [genericConfig, setGenericConfig] = useState<GenericEntryConfig | null>(
    null,
  );

  const CAFES_ENDPOINT = `/cafes`;
  // Assuming standard API path
  const key = initialData?.id
    ? `${CAFES_ENDPOINT}/${initialData.id}`
    : CAFES_ENDPOINT;

  const { trigger, isMutating } = useSWRMutation(key, mutationFetcher);

  // Use full paths for clarity and to match buildUrl logic accurately
  const { data: facilitiesData } = useSWR(`/facilities?limit=100`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000,
  });

  const { data: termsData } = useSWR(`/terms?limit=100`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000,
  });

  const form = useForm<CreateCafe>({
    resolver: zodResolver(createCafeSchema) as Resolver<CreateCafe>,
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      cafeType:
        (initialData?.cafeType as
          | "COFFEE"
          | "RESTAURANT"
          | "BAKERY"
          | "DESSERT"
          | "BEVERAGE") || undefined,
      region:
        (initialData?.region as
          | "BOJONGSOANG"
          | "DAYEUHKOLOT"
          | "SUKABIRUS"
          | "SUKAPURA") || undefined,
      capacity: initialData?.capacity || 0,
      distance: initialData?.distance || 0,
      address: initialData?.address || "",
      phone: initialData?.phone || "",
      email: initialData?.email || "",
      instagram: initialData?.instagram || "",
      mapLink: initialData?.mapLink || "",
      priceRange:
        (initialData?.priceRange as
          | "UNDER_15K"
          | "15K_30K"
          | "30K_50K"
          | "ABOVE_50K") || undefined,
      pricePerPerson: initialData?.pricePerPerson || 0,
      thumbnail: initialData?.thumbnail || "",
      gallery: initialData?.gallery || [],
      menu: initialData?.menu || [],
      contentStatus: initialData?.contentStatus || "draft",
      facilities: initialData?.facilities || [],
      terms: initialData?.terms || [],
    },
  });

  const watchedFacilities =
    useWatch({ control: form.control, name: "facilities" }) || [];
  const watchedTerms = useWatch({ control: form.control, name: "terms" }) || [];

  const facilitiesOptions = React.useMemo(() => {
    const apiOptions =
      facilitiesData?.data?.map((f: FacilityItem) => ({
        label: f.name,
        value: f.id,
      })) || [];

    const selectedOptions = watchedFacilities.map((f: FacilityItem) => ({
      label: f.name,
      value: f.id,
    }));

    // Merge and deduplicate by value (ID)
    const combined = [...apiOptions, ...selectedOptions];
    const unique = Array.from(
      new Map(combined.map((item) => [item.value, item])).values(),
    );

    return unique;
  }, [facilitiesData, watchedFacilities]);

  const termsOptions = React.useMemo(() => {
    const apiOptions =
      termsData?.data?.map((t: FacilityItem) => ({
        label: t.name,
        value: t.id,
      })) || [];

    const selectedOptions = watchedTerms.map((t: FacilityItem) => ({
      label: t.name,
      value: t.id,
    }));

    const combined = [...apiOptions, ...selectedOptions];
    const unique = Array.from(
      new Map(combined.map((item) => [item.value, item])).values(),
    );

    return unique;
  }, [termsData, watchedTerms]);

  // Update Maps to also include watched items for lookup
  const facilitiesMap = React.useMemo(() => {
    const apiMap = new Map<string, FacilityItem>(
      facilitiesData?.data?.map((f: FacilityItem) => [f.id, f]) || [],
    );
    watchedFacilities.forEach((f: FacilityItem) => {
      if (!apiMap.has(f.id)) {
        apiMap.set(f.id, f);
      }
    });
    return apiMap;
  }, [facilitiesData, watchedFacilities]);

  const termsMap = React.useMemo(() => {
    const apiMap = new Map<string, FacilityItem>(
      termsData?.data?.map((t: FacilityItem) => [t.id, t]) || [],
    );
    watchedTerms.forEach((t: FacilityItem) => {
      if (!apiMap.has(t.id)) {
        apiMap.set(t.id, t);
      }
    });
    return apiMap;
  }, [termsData, watchedTerms]);

  const name = form.watch("name");
  // Auto-generate slug
  useEffect(() => {
    if (name && !initialData?.id) {
      const slug = generateSlug(name);
      form.setValue("slug", slug, { shouldValidate: true });
    }
  }, [name, form, initialData?.id]);

  const onSubmit = async (
    values: CreateCafe,
    status: "draft" | "published",
  ) => {
    setSubmitStatus(status);
    console.log("onSubmit called", { values, status });
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
          ? "Kafe berhasil dipublikasikan!"
          : "Kafe berhasil disimpan sebagai draft!",
        {
          description: `Kafe "${values.name}" telah ${status === "published" ? "dipublikasikan" : "disimpan"}.`,
        },
      );

      router.push("/dashboard/cafes");
      router.refresh();
    } catch (error) {
      console.error("onSubmit error", error);
      toast.error("Gagal memproses permintaan", {
        description:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat menyimpan data.",
      });
    } finally {
      setSubmitStatus(null);
    }
  };

  // Handle submit draft - validate dengan draftCafeSchema (less strict)
  const handleSubmitDraft = async () => {
    try {
      console.log("handleSubmitDraft called");
      const values = form.getValues();
      console.log("Form values (Draft):", values);
      // Validate dengan draft schema (less strict)
      const validatedValues = draftCafeSchema.parse(values);
      console.log("Validation passed (Draft)", validatedValues);
      await onSubmit(validatedValues as CreateCafe, "draft");

      router.push("/dashboard/cafes");
      router.refresh();
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

  // Handle submit publish - validate dengan publishCafeSchema (strict)
  const handleSubmitPublish = async () => {
    try {
      console.log("handleSubmitPublish called");
      const values = form.getValues();
      console.log("Form values (Publish):", values);
      // Validate dengan publish schema (strict)
      const validatedValues = publishCafeSchema.parse(values);
      console.log("Validation passed (Publish)", validatedValues);
      await onSubmit(validatedValues as CreateCafe, "published");
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

  const openImageModal = (field: "thumbnail" | "gallery" | "menu") => {
    setActiveImageField(field);
    setImageModalOpen(true);
  };

  const handleImageSelect = (images: ImageType[]) => {
    if (!activeImageField) return;

    if (activeImageField === "thumbnail") {
      if (images.length > 0) {
        form.setValue("thumbnail", images[0].fileUrl, { shouldValidate: true });
      }
    } else {
      // Append for gallery/menu or replace? Usually append is expected in manager, but here we might want to just set.
      // The modal returns ALL selected images if we pass selectedImages prop.
      // But passing selectedImages to modal requires fetching them first if they are just URLs.
      // For simplicity: Add new selections to existing list.
      const currentUrls = form.getValues(activeImageField) || [];
      const newUrls = images.map((img) => img.fileUrl);
      // Merge unique
      const combined = Array.from(new Set([...currentUrls, ...newUrls]));
      form.setValue(activeImageField, combined, { shouldValidate: true });
    }
  };

  // Helper to remove image from array
  const removeImage = (field: "gallery" | "menu", urlToRemove: string) => {
    const current = form.getValues(field) || [];
    form.setValue(
      field,
      current.filter((url) => url !== urlToRemove),
      { shouldValidate: true },
    );
  };

  return (
    <FormLayout>
      <FormLayout.Form>
        <Form {...form}>
          <form className="space-y-6">
            {/* --- Detail Kafe --- */}
            <Card>
              <CardHeader>
                <CardTitle>Detail Kafe</CardTitle>
                <CardDescription>
                  Informasi utama mengenai kafe.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Kafe</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nama kafe..."
                          {...field}
                          disabled={isMutating}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <input type="hidden" {...form.register("slug")} />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deskripsi</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Deskripsi singkat..."
                          {...field}
                          rows={4}
                          disabled={isMutating}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="cafeType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipe Kafe</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isMutating}
                        >
                          <FormControl className="w-full">
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih tipe kafe" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {cafeType.enumValues.map((type) => {
                              const typeLabels: Record<string, string> = {
                                indoor_cafe: "Indoor",
                                outdoor_cafe: "Outdoor",
                                indoor_outdoor_cafe: "Indoor & Outdoor",
                              };
                              return (
                                <SelectItem key={type} value={type}>
                                  {typeLabels[type] || type.replace(/_/g, " ")}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kapasitas (Orang)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            disabled={isMutating}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* --- Lokasi & Kontak --- */}
            <Card>
              <CardHeader>
                <CardTitle>Lokasi & Kontak</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="region"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Wilayah</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isMutating}
                        >
                          <FormControl className="w-full">
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih wilayah" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {region.enumValues.map((reg) => (
                              <SelectItem key={reg} value={reg}>
                                {reg.replace("_", " ")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                        <FormDescription>
                          Pilih area kafe yang sesuai
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="distance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jarak (m)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            disabled={isMutating}
                          />
                        </FormControl>
                        <FormDescription>
                          Jarak dari Telkom University
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alamat Lengkap</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Jl. Raya..."
                          {...field}
                          disabled={isMutating}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telepon (Opsional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="08..."
                            {...field}
                            value={field.value || ""}
                            onChange={(e) =>
                              field.onChange(e.target.value || null)
                            }
                            disabled={isMutating}
                          />
                        </FormControl>
                        <FormDescription>
                          Nomor telepon kafe (bisa dikosongkan)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email (Opsional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="email@example.com"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) =>
                              field.onChange(e.target.value || null)
                            }
                            disabled={isMutating}
                          />
                        </FormControl>
                        <FormDescription>
                          Email kafe untuk kontak (bisa dikosongkan)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="instagram"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website / Sosial Media (Opsional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://..."
                            {...field}
                            value={field.value || ""}
                            onChange={(e) =>
                              field.onChange(e.target.value || null)
                            }
                            disabled={isMutating}
                          />
                        </FormControl>
                        <FormDescription>
                          Website resmi atau link sosial media (Instagram,
                          Facebook, TikTok, dll). Format: https://...
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="mapLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Link Google Maps</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://maps.google.com..."
                            {...field}
                            disabled={isMutating}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* --- Akomodasi --- */}
            <Card>
              <CardHeader>
                <CardTitle>Akomodasi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="gap-4 items-baseline grid grid-cols-1 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="priceRange"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rentang Harga</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isMutating}
                        >
                          <FormControl className="w-full">
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih rentang harga" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {priceRange.enumValues.map((p) => (
                              <SelectItem key={p} value={p}>
                                {p.charAt(0).toUpperCase() + p.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pricePerPerson"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Harga Per Orang (Estimasi)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="50000"
                            {...field}
                            disabled={isMutating}
                          />
                        </FormControl>
                        <FormDescription>
                          Masukkan harga dalam rupiah tanpa format (misal: 50000
                          untuk Rp50.000)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* --- Fasilitas & Ketentuan --- */}
            <Card>
              <CardHeader>
                <CardTitle>Fasilitas & Ketentuan</CardTitle>
                <CardDescription>
                  Pilih fasilitas dan ketentuan yang tersedia di kafe ini.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="facilities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fasilitas</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={facilitiesOptions}
                          value={field.value?.map((v) => v.id) || []}
                          onChange={(ids) => {
                            const newValues = ids
                              .map((id) => {
                                const item = facilitiesMap.get(id);
                                if (!item) return null;
                                return {
                                  id: item.id,
                                  name: item.name,
                                  slug: item.slug,
                                  description: item.description || "",
                                };
                              })
                              .filter((v) => v !== null);
                            field.onChange(newValues);
                          }}
                          placeholder="Pilih fasilitas..."
                          onAddClick={() => {
                            setGenericConfig({
                              title: "Fasilitas",
                              endpoint: `/facilities`,
                            });
                            setGenericModalOpen(true);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ketentuan</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={termsOptions}
                          value={field.value?.map((v) => v.id) || []}
                          onChange={(ids) => {
                            const newValues = ids
                              .map((id) => {
                                const item = termsMap.get(id);
                                if (!item) return null;
                                return {
                                  id: item.id,
                                  name: item.name,
                                  slug: item.slug,
                                  description: item.description || "",
                                };
                              })
                              .filter((v) => v !== null);
                            field.onChange(newValues);
                          }}
                          placeholder="Pilih ketentuan..."
                          onAddClick={() => {
                            setGenericConfig({
                              title: "Ketentuan",
                              endpoint: `/terms`,
                            });
                            setGenericModalOpen(true);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* --- Asset Kafe --- */}
            <Card>
              <CardHeader>
                <CardTitle>Asset Kafe</CardTitle>
                <CardDescription>
                  Kelola gambar thumbnail, detail, dan menu kafe.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Thumbnail */}
                <FormField
                  control={form.control}
                  name="thumbnail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thumbnail (Gambar Utama)</FormLabel>
                      <div className="gap-4 grid">
                        {field.value ? (
                          <div className="relative border rounded-md w-full sm:w-64 overflow-hidden aspect-video group">
                            <Image
                              src={field.value}
                              alt="Thumbnail"
                              fill
                              className="object-cover"
                              unoptimized
                            />
                            <div className="absolute inset-0 flex justify-center items-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                size="sm"
                                variant="destructive"
                                type="button"
                                onClick={() => field.onChange("")}
                              >
                                <HugeiconsIcon
                                  icon={Delete01Icon}
                                  className="w-4 h-4"
                                />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col justify-center items-center border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 bg-muted/50 hover:bg-muted rounded-md w-full sm:w-64 h-32 transition-colors cursor-pointer">
                            <Button
                              type="button"
                              variant="ghost"
                              className="flex flex-col justify-center items-center hover:bg-transparent p-0 w-full h-full"
                              onClick={() => openImageModal("thumbnail")}
                            >
                              <HugeiconsIcon
                                icon={ImageAdd01Icon}
                                className="mb-2 w-8 h-8 text-muted-foreground"
                              />
                              <span className="text-muted-foreground text-xs">
                                Pilih Thumbnail
                              </span>
                            </Button>
                          </div>
                        )}
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                {/* Detail Gallery */}
                <FormField
                  control={form.control}
                  name="gallery"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Galeri Detail Kafe</FormLabel>
                      <div className="gap-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5">
                        {field.value?.map((url, idx) => (
                          <div
                            key={url}
                            className="relative border rounded-md overflow-hidden aspect-square group"
                          >
                            <Image
                              src={url}
                              alt={`Gallery ${idx}`}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                            <div className="absolute inset-0 flex justify-center items-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                size="icon"
                                variant="destructive"
                                className="w-8 h-8"
                                type="button"
                                onClick={() => removeImage("gallery", url)}
                              >
                                <HugeiconsIcon
                                  icon={Delete01Icon}
                                  className="w-4 h-4"
                                />
                              </Button>
                            </div>
                          </div>
                        ))}
                        <div className="flex flex-col justify-center items-center border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 bg-muted/50 hover:bg-muted rounded-md aspect-square transition-colors cursor-pointer">
                          <Button
                            type="button"
                            variant="ghost"
                            className="flex flex-col justify-center items-center hover:bg-transparent p-0 w-full h-full"
                            onClick={() => openImageModal("gallery")}
                          >
                            <HugeiconsIcon
                              icon={ImageAdd01Icon}
                              className="mb-2 w-6 h-6 text-muted-foreground"
                            />
                            <span className="text-center text-muted-foreground text-xs">
                              Tambah Foto
                            </span>
                          </Button>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Menu Gallery */}
                <FormField
                  control={form.control}
                  name="menu"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Daftar Menu</FormLabel>
                      <div className="gap-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5">
                        {field.value?.map((url, idx) => (
                          <div
                            key={url}
                            className="relative border rounded-md overflow-hidden aspect-3/4 group"
                          >
                            <Image
                              src={url}
                              alt={`Menu ${idx}`}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                            <div className="absolute inset-0 flex justify-center items-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                size="icon"
                                variant="destructive"
                                className="w-8 h-8"
                                type="button"
                                onClick={() => removeImage("menu", url)}
                              >
                                <HugeiconsIcon
                                  icon={Delete01Icon}
                                  className="w-4 h-4"
                                />
                              </Button>
                            </div>
                          </div>
                        ))}
                        <div className="flex flex-col justify-center items-center border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 bg-muted/50 hover:bg-muted rounded-md aspect-3/4 transition-colors cursor-pointer">
                          <Button
                            type="button"
                            variant="ghost"
                            className="flex flex-col justify-center items-center hover:bg-transparent p-0 w-full h-full"
                            onClick={() => openImageModal("menu")}
                          >
                            <HugeiconsIcon
                              icon={ImageAdd01Icon}
                              className="mb-2 w-6 h-6 text-muted-foreground"
                            />
                            <span className="text-center text-muted-foreground text-xs">
                              Tambah Menu
                            </span>
                          </Button>
                        </div>
                      </div>
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
          onCancel={() => router.back()}
          onSubmitDraft={handleSubmitDraft}
          onSubmitPublish={handleSubmitPublish}
        />
      </FormLayout.Actions>

      <ImageManagerModal
        open={imageModalOpen}
        onOpenChange={setImageModalOpen}
        onSelect={handleImageSelect}
        multiple={activeImageField !== "thumbnail"}
        maxSelect={activeImageField === "thumbnail" ? 1 : undefined}
        bucket={STORAGE_BUCKETS.NGAREMBUG_IMAGES}
      />

      <GenericEntryModal
        open={genericModalOpen}
        onOpenChange={setGenericModalOpen}
        config={genericConfig}
        onSuccess={(newItem: any) => {
          const isFacilities =
            genericConfig?.endpoint.includes("facilities") ?? false;

          const mutateKey = isFacilities
            ? `/facilities?limit=100`
            : `/terms?limit=100`;

          const fieldName = isFacilities ? "facilities" : "terms";

          // Revalidate list
          mutate(mutateKey);

          // Auto-select the new item
          const currentValues = form.getValues(fieldName as any) || [];
          form.setValue(
            fieldName as any,
            [
              ...currentValues,
              {
                id: newItem.id,
                name: newItem.name,
                slug: newItem.slug,
                description: newItem.description || "",
              },
            ],
            { shouldValidate: true },
          );

          toast.success(`${genericConfig?.title} berhasil ditambahkan!`);
        }}
      />
    </FormLayout>
  );
}
