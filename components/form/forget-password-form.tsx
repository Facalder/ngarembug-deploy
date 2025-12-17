"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import {
  type ForgotPasswordDTO,
  forgotPasswordSchema,
} from "@/schemas/auth.dto";

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ForgotPasswordDTO>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordDTO) => {
    setIsLoading(true);

    try {
      await (authClient as any).forgetPassword({
        email: values.email,
        redirectTo: "/reset-password",
      });

      toast.success("Email reset password telah dikirim!");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Terjadi kesalahan";
      toast.error(message);
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
                  placeholder="nama@example.com"
                  {...field}
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
              Mengirim...
            </>
          ) : (
            "Reset Password"
          )}
        </Button>
      </form>
    </Form>
  );
}
