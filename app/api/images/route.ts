import { type NextRequest, NextResponse } from "next/server";
import { getBucketName } from "@/lib/storage-constants";
import { deleteManyImages, uploadBulkImages } from "@/lib/upload-image";
import {
  createImage,
  deleteImages as deleteImageFromDbAndReturn,
  findImages,
  getAllFolders,
} from "@/repositories/images.repositories";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ---------------------------------------------------------------- */
// GET /api/images - List images
/* ---------------------------------------------------------------- */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Folders check
    if (searchParams.get("foldersOnly") === "true") {
      const folders = await getAllFolders();
      return NextResponse.json(
        { folders },
        {
          headers: {
            "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
          },
        },
      );
    }

    // Parse params
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const bucket = searchParams.get("bucket") || undefined;
    const folder = searchParams.get("folder") || undefined;
    const category = searchParams.get("category") || undefined;
    const search =
      searchParams.get("query") || searchParams.get("search") || undefined;
    const url = searchParams.get("url") || undefined;
    const urls = searchParams.getAll("urls");
    // Handle comma-separated urls fallback
    const urlsParam = searchParams.get("urls");
    const finalUrls =
      urls.length > 0 ? urls : urlsParam ? urlsParam.split(",") : undefined;

    const result = await findImages({
      page,
      limit,
      bucket,
      folder,
      category,
      search,
      url,
      urls: finalUrls,
    });

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("GET images error:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 },
    );
  }
}

/* ---------------------------------------------------------------- */
// POST /api/images - Upload images
/* ---------------------------------------------------------------- */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const bucket = (formData.get("bucket") as string) || getBucketName();
    const category = (formData.get("category") as string) || "uncategorized";
    const folder = (formData.get("folder") as string) || "uncategorized";

    if (!files?.length) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    // Limit check (simple)
    if (files.length > 20) {
      return NextResponse.json(
        { error: "Max 20 files per request" },
        { status: 400 },
      );
    }

    // Upload to Supabase
    const uploadResult = await uploadBulkImages(
      files,
      bucket,
      "",
      folder,
      category,
    );

    // Filter successful uploads to save to DB
    const savedImages = [];
    for (const res of uploadResult.results) {
      if (res.success && res.url && res.path && res.fileName) {
        try {
          const newImage = await createImage({
            fileName: res.fileName,
            filePath: res.path,
            fileUrl: res.url,
            fileSize: String(res.fileSize || 0),
            mimeType: res.mimeType,
            bucket,
            folder,
            category,
          });
          savedImages.push(newImage);
        } catch (dbError) {
          console.error("DB Save Error:", dbError);
          // Optional: try to delete the uploaded file if DB fails to keep consistency
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: savedImages,
      total: files.length,
      saved: savedImages.length,
      errors: uploadResult.errors,
    });
  } catch (error) {
    console.error("POST images error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

/* ---------------------------------------------------------------- */
// DELETE /api/images - Delete images
/* ---------------------------------------------------------------- */
// DELETE /api/v1/images - Delete images
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids } = body; // Array of IDs

    if (!ids || !Array.isArray(ids) || !ids.length) {
      return NextResponse.json({ error: "IDs required" }, { status: 400 });
    }

    // 1. Delete from DB first to get the file paths and ensure they existed
    //    and are removed from our records.
    const deletedImages = await deleteImageFromDbAndReturn(ids);

    if (deletedImages.length === 0) {
      return NextResponse.json({
        success: true,
        deleted: [],
        message: "No images found to delete",
      });
    }

    // 2. Group by bucket to batch delete from storage
    const imagesByBucket: Record<string, string[]> = {};
    for (const img of deletedImages) {
      if (!img.bucket || !img.filePath) continue;
      if (!imagesByBucket[img.bucket]) {
        imagesByBucket[img.bucket] = [];
      }
      imagesByBucket[img.bucket].push(img.filePath);
    }

    // 3. Delete from storage in parallel by bucket
    const storagePromises = Object.entries(imagesByBucket).map(
      ([bucket, paths]) => deleteManyImages(paths, bucket),
    );

    await Promise.all(storagePromises);

    return NextResponse.json({
      success: true,
      deleted: deletedImages.map((img) => img.id),
    });
  } catch (error) {
    console.error("DELETE images error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
