import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export async function requireAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    redirect("/login");
  }

  return session.user;
}

export async function requireAuth() {
  try {
    // Ambil session dari cookie
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      redirect("/login");
    }

    const user = await auth.api.getUser();

    if (!user?.email) {
      redirect("/login");
    }

    return user; // return user lengkap
  } catch (error) {
    console.error("requireAuth error:", error);
    redirect("/login"); // fallback jika error
  }
}

export async function redirectIfAuthenticated(returnUrl: string = "/") {
  let session = null;

  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch (error) {
    console.error("redirectIfAuthenticated error:", error);
    return; // Keluar jika ada error
  }

  // ✅ Redirect di luar try/catch
  if (session?.user?.email) {
    redirect(returnUrl);
  }
}

export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session;
}

export async function getUser() {
  const user = await auth.api.getUser();

  return user;
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return !!session?.user;
}

export async function isAdmin(): Promise<boolean> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return !!session?.user && session.user.role === "admin";
}
