import { NextResponse } from "next/server";
import { signUp } from "@/repositories/auth.repositories";
import { signUpSchema } from "@/schemas/auth.dto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = signUpSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation Error", details: validation.error.flatten() },
        { status: 400 },
      );
    }

    const result = await signUp(validation.data);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Sign up error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
