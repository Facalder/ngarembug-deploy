import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/form/reset-password-form";

// ... existing imports

export default function Page() {
  return (
    <div className="flex justify-center mt-20 min-h-screen">
      <div className="space-y-6 mx-auto w-full max-w-md">
        <div className="space-y-2 text-center">
          <h1 className="font-black text-3xl">Reset password anda</h1>
          <p className="text-muted-foreground">Masukan password baru anda</p>
        </div>

        <Suspense
          fallback={
            <div className="flex justify-center py-10">
              <HugeiconsIcon
                icon={Loading03Icon}
                className="animate-spin size-8 text-primary"
              />
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
