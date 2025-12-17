import { NextResponse } from "next/server";
import { logout } from "@/repositories/auth.repositories";

export async function POST() {
  try {
    const result = await logout();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
