import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import {
  createReview,
  findReviews,
  updateReview,
} from "@/repositories/reviews.repositories";
import {
  createReviewSchema,
  reviewQuerySchema,
  updateReviewSchema,
} from "@/schemas/reviews.dto";

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);

    const parsedParams = reviewQuerySchema.safeParse(searchParams);

    if (!parsedParams.success) {
      return NextResponse.json(
        {
          error: "Parameter tidak valid",
          details: parsedParams.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { data, pagination } = await findReviews(parsedParams.data);

    return NextResponse.json({ data, meta: pagination });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      {
        error: "Terjadi kesalahan pada server",
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
      return NextResponse.json(
        { error: "Akses Ditolak: Anda harus login." },
        { status: 401 },
      );
    }

    const body = await req.json();
    const validatedData = createReviewSchema.parse(body);

    const review = await createReview(session.user.id, validatedData);

    return NextResponse.json(
      {
        message: "Ulasan berhasil dibuat",
        data: review,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validasi gagal", details: error.issues },
        { status: 400 },
      );
    }
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const parsedData = updateReviewSchema.parse(body);
    const { id, ...updateData } = parsedData;

    const updated = await updateReview(id, updateData);

    if (!updated) {
      return NextResponse.json(
        { error: "Ulasan tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validasi gagal", details: error.flatten() },
        { status: 400 },
      );
    }

    console.error("Error updating review:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 },
    );
  }
}
