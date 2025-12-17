"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import useSWRMutation from "swr/mutation";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { mutationFetcher } from "@/lib/swr";

const genericSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi").max(100),
  description: z.string().optional(),
});

type GenericFormValues = z.infer<typeof genericSchema>;

export interface GenericEntryConfig {
  endpoint: string;
  title: string;
  description?: string;
}

interface GenericEntryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: GenericEntryConfig | null;
  onSuccess: (data: any) => void;
}

export function GenericEntryModal({
  open,
  onOpenChange,
  config,
  onSuccess,
}: GenericEntryModalProps) {
  // Construct the endpoint URL
  // Construct the endpoint URL
  const endpoint = React.useMemo(() => {
    if (!config?.endpoint) return "";

    // Prepend /api/v1 for relative endpoints
    return `${config.endpoint}`;
  }, [config?.endpoint]);

  const { trigger, isMutating } = useSWRMutation(endpoint, mutationFetcher);

  const form = useForm<GenericFormValues>({
    resolver: zodResolver(genericSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Reset form when modal opens/closes or config changes
  React.useEffect(() => {
    if (open) {
      form.reset({ name: "", description: "" });
    }
  }, [open, form]);

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (values: GenericFormValues) => {
    if (!config) return;

    // Prevent accidental double submission
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      let slug = values.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

      if (!slug) {
        slug = `item-${Date.now()}`;
      }

      const payload = {
        ...values,
        slug,
      };

      const result = await trigger({ method: "POST", body: payload });

      // Check if result has error property even if status was ok (generic fetcher nuances)
      if (result && result.error) {
        throw new Error(result.error);
      }

      onSuccess(result);
      onOpenChange(false);
    } catch (error: any) {
      console.error("Failed to create item:", error);
      form.setError("root", {
        message: error.message || "Gagal menyimpan data. Silakan coba lagi.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!config) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Tambah {config.title}</DialogTitle>
          <DialogDescription>
            {config.description ||
              `Buat ${config.title.toLowerCase()} baru untuk ditambahkan ke daftar.`}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={`Nama ${config.title.toLowerCase()}...`}
                      {...field}
                      disabled={isMutating}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi (Opsional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Deskripsi singkat..."
                      {...field}
                      disabled={isMutating}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.errors.root && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.root.message}
              </p>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isMutating}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isMutating}>
                {isMutating ? "Menyimpan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
