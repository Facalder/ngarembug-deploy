"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { PasswordInput } from "@/components/password-input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { type SignUpDTO, signUpSchema } from "@/schemas/auth.dto";

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignUpDTO>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      image: "",
    },
  });

  const onSubmit = async (values: SignUpDTO) => {
    setIsLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        email: values.email,
        password: values.password,
        name: values.name,
        image: values.image,
      });

      if (error) {
        toast.error("Gagal Mendaftar", {
          description: error.message || "Terjadi kesalahan saat pendaftaran.",
        });
        return;
      }

      toast.success("Registrasi Berhasil", {
        description: "Akun Anda telah dibuat. Anda akan diarahkan ke halaman utama.", // Updated message since verification might be off
      });

      window.location.href = "/";
    } catch (err: any) {
      toast.error("Terjadi Kesalahan", {
        description: err?.message || "Terjadi kesalahan sistem saat memproses registrasi.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <div className="space-y-2 mb-8 text-center">
        <h1 className="font-bold text-3xl text-pretty">
          Selamat datang di ngarembug
        </h1>
        <p className="text-muted-foreground text-pretty">
          Buat akun untuk mendapatkan tempat rapat yang enak
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Lengkap</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoComplete="name"
                  placeholder="John Doe"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="nama@example.com"
                  autoComplete="email"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput
                  {...field}
                  placeholder="Minimal 8 karakter"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading} size="lg">
          {isLoading ? (
            <>
              <HugeiconsIcon
                icon={Loading03Icon}
                className="mr-2 size-4 animate-spin"
              />
              Mendaftar...
            </>
          ) : (
            "Daftar"
          )}
        </Button>
      </form>
    </Form>
  );
}
