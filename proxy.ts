import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth"; // sesuaikan path

export async function proxy(request: NextRequest) {
  const baseApiUrl = process.env.BASE_API_URL;

  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    try {
      // Better Auth: langsung ambil session dari request
      const session = await auth.api.getSession({
        headers: request.headers,
      });

      if (!session?.user) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      if (session.user.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }

      return NextResponse.next();
    } catch (error) {
      console.error("Auth check failed:", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (!baseApiUrl) {
    console.error("BASE_API_URL missing");
    return NextResponse.next();
  }

  const requestUrl = request.nextUrl.href;

  if (!requestUrl.startsWith(baseApiUrl)) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get("authorization");
  const token = process.env.API_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: "Server misconfiguration" },
      { status: 500 },
    );
  }

  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const providedToken = authHeader.replace("Bearer ", "");

  if (providedToken !== token) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/dashboard/:path*"],
};