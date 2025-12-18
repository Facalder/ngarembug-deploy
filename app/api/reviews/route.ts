import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { createReview, findReviews, updateReview } from "@/repositories/reviews.repositories";
import { createReviewSchema, reviewQuerySchema, updateReviewSchema } from "@/schemas/reviews.dto";
import { id } from "zod/v4/locales";

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    
    const parsedParams = reviewQuerySchema.safeParse(searchParams);
    
    if (!parsedParams.success) {
      return NextResponse.json(
        { error: "Invalid parameters", details: parsedParams.error.flatten() },
        { status: 400 },
      );
    }

    const { data, pagination } = await findReviews(parsedParams.data);

    return NextResponse.json({ data, meta: pagination });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = createReviewSchema.parse(body);

    const review = await createReview(session.user.id, validatedData);

    return NextResponse.json({
      message: "Review created successfully",
      data: review,
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 },
      );
    }
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID is required for updates" },
        { status: 400 },
      );
    }

    const parsedData = updateReviewSchema.parse(body);
    const updated = await updateReview(id, parsedData);

    if (!updated) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.flatten() },
        { status: 400 },
      );
    }

    console.error("Error updating review:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
