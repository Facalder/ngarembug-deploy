import { type NextRequest, NextResponse } from "next/server";
import { deleteReview, getReviewById } from "@/repositories/reviews.repositories";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const review = await getReviewById(id);

    if (!review) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: review });
  } catch (error) {
    console.error("Error fetching review:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const deleted = await deleteReview(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Review deleted successfully",
      data: deleted,
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
