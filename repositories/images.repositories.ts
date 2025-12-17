"use server";

import {
  and,
  asc,
  desc,
  eq,
  ilike,
  inArray,
  or,
  type SQL,
  sql,
} from "drizzle-orm";

import { db } from "@/db";
import { images } from "@/db/schema/images.schema";
import { getBucketName } from "@/lib/storage-constants";
import type { CreateImage, ImageQuery } from "@/schemas/images.dto";

export const findImages = async (params: ImageQuery) => {
  const {
    id,
    folder,
    category,
    bucket,
    search,
    url,
    urls,
    filePath,
    fileName,
    orderBy = "createdAt",
    orderDir = "desc",
    page = 1,
    limit = 10,
  } = params;

  // Normalize bucket name if provided
  const envBucket = getBucketName();
  const normalizedBucket = bucket
    ? bucket === "VENUE_IMAGES" || bucket === "venue-images"
      ? envBucket
      : bucket === "VENUE_DETAIL_IMAGES" || bucket === "venue-detail-images"
        ? "venue-detail-images"
        : bucket
    : undefined;

  const conditions = [
    id && eq(images.id, id),
    folder && eq(images.folder, folder),
    category && eq(images.category, category),
    normalizedBucket && eq(images.bucket, normalizedBucket),
    url && eq(images.fileUrl, url),
    filePath && eq(images.filePath, filePath),
    fileName && eq(images.fileName, fileName),
    urls?.length && inArray(images.fileUrl, urls),
    search &&
      or(
        ilike(images.fileName, `%${search}%`),
        ilike(images.alt, `%${search}%`),
        ilike(images.description, `%${search}%`),
      ),
  ].filter(Boolean) as SQL[];

  const orderCol = {
    fileName: images.fileName,
    fileSize: images.fileSize,
    createdAt: images.createdAt,
    updatedAt: images.updatedAt,
  }[orderBy];

  const data = await db
    .select()
    .from(images)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(orderDir === "asc" ? asc(orderCol) : desc(orderCol))
    .limit(limit)
    .offset((page - 1) * limit);

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(images)
    .where(conditions.length ? and(...conditions) : undefined);

  return {
    data,
    pagination: {
      page,
      limit,
      total: Number(count),
      totalPages: Math.ceil(Number(count) / limit),
    },
  };
};

// Helper for specific aggregation not covered by general find
export const getAllFolders = async () => {
  const result = await db
    .selectDistinct({ folder: images.folder })
    .from(images)
    .orderBy(asc(images.folder));
  return result.map((r) => r.folder);
};

export const getAllCategories = async (folder?: string) => {
  const conditions = [
    folder ? eq(images.folder, folder) : undefined,
    sql`${images.category} IS NOT NULL`,
  ].filter(Boolean) as SQL[];

  const result = await db
    .selectDistinct({ category: images.category })
    .from(images)
    .where(and(...conditions))
    .orderBy(asc(images.category));

  return result.map((r) => r.category).filter(Boolean) as string[];
};

export const createImage = async (data: CreateImage) => {
  const [newImage] = await db.insert(images).values(data).returning();
  return newImage;
};

export const updateImage = async (id: string, data: Partial<CreateImage>) => {
  const [updatedImage] = await db
    .update(images)
    .set(data) // Timestamp update is handled by schema's $onUpdateFn
    .where(eq(images.id, id))
    .returning();
  return updatedImage || null;
};

export const deleteImage = async (id: string) => {
  const [deletedImage] = await db
    .delete(images)
    .where(eq(images.id, id))
    .returning();
  return deletedImage || null;
};

export const deleteImageByPath = async (filePath: string) => {
  const [deletedImage] = await db
    .delete(images)
    .where(eq(images.filePath, filePath))
    .returning();
  return deletedImage || null;
};
export const deleteImages = async (ids: string[]) => {
  if (!ids.length) return [];
  const deletedImages = await db
    .delete(images)
    .where(inArray(images.id, ids))
    .returning();
  return deletedImages;
};
