import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin, lastLoginMethod } from "better-auth/plugins";
// import { config } from "dotenv";
import { db } from "@/db"; // your drizzle instance
import * as schema from "@/db/schema";

// config({ path: ".env" });


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

  // emailVerification: {
  //   sendVerificationEmail: async ({ user, url }) => {
  //     await resend.emails.send({
  //       from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
  //       to: user.email,
  //       subject: "Verify your email",
  //       react: VerifyEmail({ username: user.name, verifyUrl: url }),
  //     });
  //   },
  //   sendOnSignUp: true,
  //   autoSignInAfterVerification: true,
  // },

  emailAndPassword: {
    enabled: true,
    // sendResetPassword: async ({ user, url }) => {
    //   await resend.emails.send({
    //     from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
    //     to: user.email,
    //     subject: "Sandi Ngarembug Anda",
    //     react: ForgotPasswordEmail({
    //       username: user.name,
    //       resetUrl: url,
    //       userEmail: user.email,
    //     }),
    //   });
    // },
  },
  plugins: [lastLoginMethod(), nextCookies(), admin()],
  advanced: {
    cookiePrefix: "secure-app",
    useSecureCookies: process.env.NODE_ENV === "production",
    generateId: () => crypto.randomUUID(),
    crossSubDomainCookies: {
      enabled: true, // ⭐ PENTING untuk Vercel preview deployments
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  trustedOrigins: [
    "http://localhost:3000",
    "https://ngarembug.vercel.app",
    "https://*.vercel.app",
  ]
});
