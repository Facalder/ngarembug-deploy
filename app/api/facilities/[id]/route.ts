import { type NextRequest, NextResponse } from "next/server";
import {
  deleteFacility,
  findFacilities,
  updateFacility,
} from "@/repositories/facilities.repositories";
import { updateFacilitySchema } from "@/schemas/facilities.dto";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const result = await findFacilities({
      id,
      page: 1,
      limit: 1,
      contentStatus: undefined,
    });
    const facility = result.data[0];

    if (!facility) {
      return NextResponse.json(
        { error: "Facility not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(facility);
  } catch (error) {
    console.error("Error fetching facility:", error);
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
    const { id } = await params;
    const body = await request.json();
    const parsedBody = updateFacilitySchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsedBody.error.flatten() },
        { status: 400 },
      );
    }

    const updated = await updateFacility(id, parsedBody.data);

    if (!updated) {
      return NextResponse.json(
        { error: "Facility not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating facility:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const deleted = await deleteFacility(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Facility not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(deleted);
  } catch (error) {
    console.error("Error deleting facility:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
