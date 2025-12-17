import { type NextRequest, NextResponse } from "next/server";
import type { ZodError } from "zod";
import {
  deleteCafe,
  getCafeById,
  updateCafe,
} from "@/repositories/cafes.repositories";
import { updateCafeSchema } from "@/schemas/cafes.dto";

// Fetch single cafe by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // Use getCafeById to fetch with relations
    const result = await getCafeById(id);

    if (!result) {
      return NextResponse.json({ error: "Cafe not found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching cafe:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const body = await request.json();
    const parsedData = updateCafeSchema.parse({ ...body, id });

    const updatedCafe = await updateCafe(id, parsedData);

    if (!updatedCafe) {
      return NextResponse.json(
        { error: "Cafe not found or update failed" },
        { status: 404 },
      );
    }

    return NextResponse.json(updatedCafe);
  } catch (error: any) {
    if (error?.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation Error", details: (error as ZodError).flatten() },
        { status: 400 },
      );
    }
    console.error("Error updating cafe:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const deletedCafe = await deleteCafe(id);

    if (!deletedCafe) {
      return NextResponse.json(
        { error: "Cafe not found or already deleted" },
        { status: 404 },
      );
    }

    return NextResponse.json(deletedCafe);
  } catch (error) {
    console.error("Error deleting cafe:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
