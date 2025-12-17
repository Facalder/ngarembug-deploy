import { type NextRequest, NextResponse } from "next/server";
import { createTerm, findTerms } from "@/repositories/terms.repositories";
import { createTermSchema, termQuerySchema } from "@/schemas/terms.dto";

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);

    // Parse and validate query parameters
    const parsedParams = termQuerySchema.safeParse(searchParams);

    if (!parsedParams.success) {
      return NextResponse.json(
        { error: "Invalid parameters", details: parsedParams.error.flatten() },
        { status: 400 },
      );
    }

    const result = await findTerms(parsedParams.data);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching terms:", error);
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
    const parsedBody = createTermSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        { error: "Validation Error", details: parsedBody.error.flatten() },
        { status: 400 },
      );
    }

    const newTerm = await createTerm(parsedBody.data as any);
    return NextResponse.json({ data: newTerm }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating term:", error);
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
