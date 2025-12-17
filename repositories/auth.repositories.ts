"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import type {
  ForgotPasswordDTO,
  LoginDTO,
  ResetPasswordDTO,
  SignUpDTO,
} from "@/schemas/auth.dto";

export const signUp = async (data: SignUpDTO) => {
  const response = await auth.api.signUpEmail({
    body: {
      email: data.email,
      password: data.password,
      name: data.name,
      image: data.image,
    },
    headers: await headers(),
  });
  return response;
};

export const login = async (data: LoginDTO) => {
  const response = await auth.api.signInEmail({
    body: {
      email: data.email,
      password: data.password,
    },
    headers: await headers(),
  });
  return response;
};

export const logout = async () => {
  const response = await auth.api.signOut({
    headers: await headers(),
  });
  return response;
};

export const resetPassword = async (data: ResetPasswordDTO) => {
  const response = await auth.api.resetPassword({
    body: {
      newPassword: data.password,
      token: data.token,
    },
    headers: await headers(),
  });
  return response;
};

export const forgotPassword = async (data: ForgotPasswordDTO) => {
  // force cast to any because of type inference issues with some better-auth versions
  const response = await (auth.api as any).forgetPassword({
    body: {
      email: data.email,
      redirectTo: "/reset-password",
    },
    headers: await headers(),
  });
  return response;
};
