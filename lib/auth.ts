import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin, lastLoginMethod } from "better-auth/plugins";
import { db } from "@/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
    camelCase: false,
    schema,
  }),

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
  },

  plugins: [lastLoginMethod(), nextCookies(), admin()],

  advanced: {
    cookiePrefix: "secure-app",
    useSecureCookies: process.env.NODE_ENV === "production",
    generateId: () => crypto.randomUUID(),
    crossSubDomainCookies: {
      enabled: true,
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },

  trustedOrigins: (request) => {
    const allowedOrigins = ["http://localhost:3000"];
    
    if (process.env.NODE_ENV === "production") {
      const origin = request.headers.get("origin") || "";
      
      // Allow production domain
      allowedOrigins.push("https://ngarembug.vercel.app");
      
      // Allow current Vercel deployment
      if (process.env.VERCEL_URL) {
        allowedOrigins.push(`https://${process.env.VERCEL_URL}`);
      }
      
      // Allow any vercel preview deployment (dengan validasi)
      if (origin && origin.endsWith(".vercel.app")) {
        allowedOrigins.push(origin);
      }
    }
    
    return allowedOrigins;
  },

  baseURL: 
    process.env.NEXT_PUBLIC_APP_URL || 
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
});