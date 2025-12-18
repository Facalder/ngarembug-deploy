import { type NextRequest, NextResponse } from "next/server";
import type { ZodError } from "zod";
import {
  createCafe,
  findCafes,
  updateCafe,
} from "@/repositories/cafes.repositories";
import {
  cafeQuerySchema,
  draftCafeSchema,
  publishCafeSchema,
} from "@/schemas/cafes.dto";

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);

    // Parse and validate query parameters
    const parsedParams = cafeQuerySchema.safeParse(searchParams);

    if (!parsedParams.success) {
      console.error("Validation Error Params:", parsedParams.error);
      return NextResponse.json(
        { error: "Invalid parameters", details: parsedParams.error.flatten() },
        { status: 400 },
      );
    }

    console.log("Fetching cafes with params:", parsedParams.data);

    const result = await findCafes(parsedParams.data);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching cafes:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate based on contentStatus
    const schema =
      body.contentStatus === "draft" ? draftCafeSchema : publishCafeSchema;
    const parsedData = schema.parse(body);

    const newCafe = await createCafe(parsedData as any);

    return NextResponse.json({ data: newCafe }, { status: 201 });
  } catch (error: any) {
    if (error?.name === "ZodError") {
      console.error("POST Validation Error:", error);
      return NextResponse.json(
        { error: "Validation Error", details: (error as ZodError).flatten() },
        { status: 400 },
      );
    }

    console.error("Error creating cafe:", error);
    // Handle specific DB errors like unique constraints if needed
    if (error.code === "23505") {
      // Postgres unique constraint
      return NextResponse.json(
        { error: "Unique constraint violation", details: error.detail },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error?.message || String(error),
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const id = body.id;

    if (!id) {
      return NextResponse.json(
        { error: "ID is required for updates" },
        { status: 400 },
      );
    }

    // Validate based on contentStatus
    const schema =
      body.contentStatus === "draft" ? draftCafeSchema : publishCafeSchema;
    const parsedData = schema.parse(body);

    const updatedCafe = await updateCafe(id, parsedData as any);

    return NextResponse.json({ data: updatedCafe }, { status: 200 });
  } catch (error: any) {
    if (error?.name === "ZodError") {
      console.error("PUT Validation Error:", error);
      return NextResponse.json(
        { error: "Validation Error", details: (error as ZodError).flatten() },
        { status: 400 },
      );
    }

    console.error("Error updating cafe:", error);
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "Unique constraint violation", details: error.detail },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error?.message || String(error),
      },
      { status: 500 },
    );
  }
}
