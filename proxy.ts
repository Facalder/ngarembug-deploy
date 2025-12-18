// middleware.ts
import { type NextRequest, NextResponse } from "next/server";

// ============================================
// CORS Configuration
// ============================================
function getCorsHeaders(origin: string | null) {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Max-Age": "86400", // 24 hours
  };

  // Check if origin is allowed
  const isAllowedOrigin =
    origin &&
    (origin.includes("localhost") || 
     origin.endsWith(".vercel.app") ||
     origin === process.env.NEXT_PUBLIC_APP_URL);

  if (isAllowedOrigin) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return { headers, isAllowed: !!isAllowedOrigin };
}

// ============================================
// Authentication & Authorization (RBAC)
// ============================================
async function checkDashboardAccess(request: NextRequest) {
  try {
    const sessionRes = await fetch(
      `${request.nextUrl.origin}/api/auth/get-session`,
      {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      }
    );

    if (!sessionRes.ok) {
      return { authorized: false, redirect: "/login" };
    }

    const session = await sessionRes.json();

    if (!session?.user) {
      return { authorized: false, redirect: "/login" };
    }

    if (session.user.role !== "admin") {
      return { authorized: false, redirect: "/" };
    }

    return { authorized: true };
  } catch (error) {
    console.error("❌ Auth check failed:", error);
    return { authorized: false, redirect: "/login" };
  }
}

function checkApiToken(request: NextRequest) {
  const token = process.env.API_TOKEN;

  if (!token) {
    return {
      authorized: false,
      error: { message: "Server misconfiguration", status: 500 },
    };
  }

  const authHeader = request.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return {
      authorized: false,
      error: { message: "Unauthorized", status: 401 },
    };
  }

  const providedToken = authHeader.replace("Bearer ", "");

  if (providedToken !== token) {
    return {
      authorized: false,
      error: { message: "Invalid token", status: 401 },
    };
  }

  return { authorized: true };
}

// ============================================
// Main Middleware
// ============================================
export async function proxy(request: NextRequest) {
  const origin = request.headers.get("origin");
  const pathname = request.nextUrl.pathname;
  const { headers: corsHeaders, isAllowed } = getCorsHeaders(origin);

  // ============================================
  // 1. Handle CORS Preflight (OPTIONS)
  // ============================================
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: isAllowed ? corsHeaders : {},
    });
  }

  // ============================================
  // 2. Dashboard Access Control (RBAC)
  // ============================================
  if (pathname.startsWith("/dashboard")) {
    const authCheck = await checkDashboardAccess(request);

    if (!authCheck.authorized) {
      const redirectUrl = new URL(authCheck.redirect!, request.url);
      const response = NextResponse.redirect(redirectUrl);

      // Add CORS headers to redirect response
      if (isAllowed) {
        Object.entries(corsHeaders).forEach(([key, value]) => {
          response.headers.set(key, value);
        });
      }

      return response;
    }

    // Authorized - continue with CORS headers
    const response = NextResponse.next();
    if (isAllowed) {
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
    }
    return response;
  }

  // ============================================
  // 3. API Routes Handling
  // ============================================
  if (pathname.startsWith("/api")) {
    // Skip auth check for auth routes
    if (pathname.startsWith("/api/auth")) {
      const response = NextResponse.next();
      if (isAllowed) {
        Object.entries(corsHeaders).forEach(([key, value]) => {
          response.headers.set(key, value);
        });
      }
      return response;
    }

    // Check if request is for BASE_API_URL (external API proxy)
    const baseApiUrl = process.env.BASE_API_URL;
    const requestUrl = request.nextUrl.href;

    if (baseApiUrl && requestUrl.startsWith(baseApiUrl)) {
      // Validate API token for external API calls
      const tokenCheck = checkApiToken(request);

      if (!tokenCheck.authorized) {
        return NextResponse.json(
          { error: tokenCheck.error!.message },
          {
            status: tokenCheck.error!.status,
            headers: isAllowed ? corsHeaders : {},
          }
        );
      }
    }

    // Continue with CORS headers
    const response = NextResponse.next();
    if (isAllowed) {
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
    }
    return response;
  }

  // ============================================
  // 4. Default - Pass through
  // ============================================
  return NextResponse.next();
}

// ============================================
// Middleware Config
// ============================================
export const config = {
  matcher: [
    "/api/:path*",
    "/dashboard/:path*",
  ],
};