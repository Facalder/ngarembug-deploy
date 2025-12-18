import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import {
  createCafeRecommendation,
  findCafeRecommendations,
  updateCafeRecommendation,
} from "@/repositories/cafe-recommendations.repositories";
import {
  cafeRecommendationQuerySchema,
  createCafeRecommendationSchema,
  updateCafeRecommendationSchema,
} from "@/schemas/cafe-recommendations.dto";

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);

    const parsedParams = cafeRecommendationQuerySchema.safeParse(searchParams);

    if (!parsedParams.success) {
      return NextResponse.json(
        { error: "Invalid parameters", details: parsedParams.error.flatten() },
        { status: 400 },
      );
    }

    const { data, pagination } = await findCafeRecommendations(
      parsedParams.data,
    );

    return NextResponse.json({ data, meta: pagination });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
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
    const validatedData = createCafeRecommendationSchema.parse(body);

    const recommendation = await createCafeRecommendation(
      session.user.id,
      validatedData,
    );

    return NextResponse.json(
      {
        message: "Recommendation created successfully",
        data: recommendation,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 },
      );
    }
    console.error("Error creating recommendation:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID is required for updates" },
        { status: 400 },
      );
    }

    const parsedData = updateCafeRecommendationSchema.parse(body);
    const updated = await updateCafeRecommendation(id, parsedData);

    if (!updated) {
      return NextResponse.json(
        { error: "Recommendation not found" },
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

    console.error("Error updating recommendation:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
