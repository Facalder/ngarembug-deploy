"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { type LoginInputDTO, loginSchema } from "@/schemas/auth.dto";

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginInputDTO>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (values: LoginInputDTO) => {
    setIsLoading(true);

    try {
      await authClient.signIn.email({
        email: values.email,
        password: values.password,
        rememberMe: values.rememberMe,
      });

      toast.success("Berhasil login!");
      router.replace("/dashboard");
      router.refresh();
    } catch (error: any) {
      toast.error(
        error?.message || "Email atau password salah. Silakan coba lagi.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  disabled={isLoading}
                  autoComplete="email"
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
              <FormLabel asChild>
                <span className="flex justify-between">
                  Password
                  <Link
                    href="/forget-password"
                    className="text-sm text-muted-foreground underline"
                  >
                    Lupa password?
                  </Link>
                </span>
              </FormLabel>
              <FormControl>
                <PasswordInput
                  {...field}
                  placeholder="Password"
                  disabled={isLoading}
                  className="transition-all"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isLoading}
          size="lg"
          className="w-full flex items-center justify-center gap-2"
        >
          {isLoading && (
            <HugeiconsIcon
              icon={Loading03Icon}
              className="size-4 animate-spin"
            />
          )}
          Masuk
        </Button>
      </form>
    </Form>
  );
}
