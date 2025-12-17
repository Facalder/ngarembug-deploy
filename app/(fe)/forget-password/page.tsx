'use client'

import { ForgotPasswordForm } from "@/components/form/forget-password-form";

export default function ForgotPassword() {
  return (
    <div className="flex justify-center mt-20 min-h-screen">
      <div className="space-y-6 mx-auto w-full max-w-md">
        <div className="space-y-2 text-center">
          <h1 className="font-black text-3xl">Lupa dengan password kamu?</h1>
          <p className="text-muted-foreground">
            Masukan email untuk mereset password kamu
          </p>
        </div>

        <ForgotPasswordForm />
      </div>
    </div>
  );
}
