import { NextResponse } from "next/server";
import { resetPassword } from "@/repositories/auth.repositories";
import { resetPasswordSchema } from "@/schemas/auth.dto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = resetPasswordSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation Error", details: validation.error.flatten() },
        { status: 400 },
      );
    }

    const result = await resetPassword(validation.data);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
