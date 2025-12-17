'use client'

import Link from "next/link";
import { LoginForm } from "@/components/form/login-form";

export default function Page() {
  return (
    <div className="flex justify-center mt-20 min-h-screen">
      <div className="space-y-6 mx-auto w-full max-w-md">
        <div className="space-y-2 text-center">
          <h1 className="font-black text-3xl">Selamat datang kembali</h1>
          <p className="text-muted-foreground">
            Cari tempat rapat sesuai dengan preferensimu
          </p>
        </div>

        <div className="space-y-5">
          <LoginForm />

          <p className="text-center text-sm text-muted-foreground pt-2">
            Belum punya akun?{" "}
            <Link
              href="/signup"
              className="underline text-primary hover:text-primary/90 font-medium"
            >
              Buat Akun
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
