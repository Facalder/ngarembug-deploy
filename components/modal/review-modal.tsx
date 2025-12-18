"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loading03Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { starRating, visitorType } from "@/db/schema/enums.schema";
import { authClient } from "@/lib/auth-client";
import { type CreateReview, createReviewSchema } from "@/schemas/reviews.dto";

interface ReviewModalProps {
  cafeId: string;
}

export function ReviewModal({ cafeId }: ReviewModalProps) {
  const router = useRouter();
  const { data: session, isPending: isSessionLoading } =
    authClient.useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm<CreateReview>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      cafeId,
      title: "",
      review: "",
      rating: undefined,
      visitorType: undefined,
    },
  });

  const onSubmit = async (values: CreateReview) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal mengirim review");
      }

      toast.success("Review berhasil dikirim!");
      form.reset();
      setIsOpen(false);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted || isSessionLoading) {
    return (
      <Button disabled variant="outline">
        <HugeiconsIcon icon={Loading03Icon} className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </Button>
    );
  }

  if (!session) {
    return (
      <Button asChild>
        <Link href="/login">Login untuk Review</Link>
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <HugeiconsIcon icon={PlusSignIcon} className="mr-2 h-4 w-4" />
          Tulis Review
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tulis Review</DialogTitle>
          <DialogDescription>
            Bagikan pengalamanmu mengunjungi kafe ini.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih rating" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {starRating.enumValues.map((value) => {
                        const labels: Record<string, string> = {
                          satu: "⭐ 1 - Sangat Buruk",
                          dua: "⭐⭐ 2 - Buruk",
                          tiga: "⭐⭐⭐ 3 - Cukup",
                          empat: "⭐⭐⭐⭐ 4 - Bagus",
                          lima: "⭐⭐⭐⭐⭐ 5 - Sangat Bagus",
                        };
                        return (
                          <SelectItem key={value} value={value}>
                            {labels[value] || value}
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
              name="visitorType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe Kunjungan</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sama siapa kesini?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {visitorType.enumValues.map((value) => {
                        const labels: Record<string, string> = {
                          keluarga: "👨‍👩‍👧‍👦 Keluarga",
                          pasangan: "💑 Pasangan",
                          solo: "🧍 Solo",
                          bisnis: "💼 Bisnis",
                          teman: "👥 Teman",
                        };
                        return (
                          <SelectItem key={value} value={value}>
                            {labels[value] || value}
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Judul Review</FormLabel>
                  <FormControl>
                    <Input placeholder="Singkat dan jelas" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="review"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Review Lengkap</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ceritakan pengalamanmu..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <HugeiconsIcon
                    icon={Loading03Icon}
                    className="mr-2 animate-spin"
                  />
                  Mengirim...
                </>
              ) : (
                "Kirim Review"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
