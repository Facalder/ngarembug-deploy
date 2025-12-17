'use client'

import Link from "next/link";
import { SignupForm } from "@/components/form/signup-form";

export default function Page() {

  return (
    <div className="flex justify-center mt-20 min-h-screen">
      <div className="space-y-6 mx-auto w-full max-w-md">
        <div className="space-y-5">
          <SignupForm />

          <p className="text-center text-sm text-muted-foreground pt-2">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="underline text-primary hover:text-primary/90 font-medium"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
