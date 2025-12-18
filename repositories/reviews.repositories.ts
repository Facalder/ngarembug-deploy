"use server";

import { and, asc, desc, eq, ilike, inArray, or, type SQL, sql } from "drizzle-orm";
import { db } from "@/db";
import { cafes } from "@/db/schema";
import { reviews } from "@/db/schema/reviews.schema";
import { users } from "@/db/schema/users.schema";
import type { CreateReview, ReviewQuery, UpdateReview } from "@/schemas/reviews.dto";

export const createReview = async (userId: string, data: CreateReview) => {
  const [newReview] = await db
    .insert(reviews)
    .values({
      ...data,
      userId,
    })
    .returning();
  return newReview;
};

// Unified find function - handles both single and list queries like cafes
export const findReviews = async (params: ReviewQuery) => {
  const {
    id,
    userId,
    cafeId,
    rating,
    visitorType,
    search,
    orderBy = "created_at",
    orderDir = "desc",
    page = 1,
    limit = 10,
  } = params;

  const conditions = [
    search &&
      or(
        ilike(reviews.title, `%${search}%`),
        ilike(reviews.review, `%${search}%`)
      ),
    id && eq(reviews.id, id),
    userId && eq(reviews.userId, userId),
    cafeId && eq(reviews.cafeId, cafeId),
    rating?.length && inArray(reviews.rating, rating as []),
    visitorType?.length && inArray(reviews.visitorType, visitorType as []),
  ].filter(Boolean) as SQL[];

  const orderCol = {
    created_at: reviews.createdAt,
    updated_at: reviews.updatedAt,
    rating: reviews.rating,
  }[orderBy];

  const data = await db
    .select({
      id: reviews.id,
      rating: reviews.rating,
      visitorType: reviews.visitorType,
      review: reviews.review,
      title: reviews.title,
      cafeId: reviews.cafeId,
      userId: reviews.userId,
      createdAt: reviews.createdAt,
      updatedAt: reviews.updatedAt,
      user: {
        id: users.id,
        name: users.name,
        image: users.image,
      },
      cafe: {
        id: cafes.id,
        name: cafes.name,
        slug: cafes.slug,
      },
    })
    .from(reviews)
    .leftJoin(users, eq(reviews.userId, users.id))
    .leftJoin(cafes, eq(reviews.cafeId, cafes.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(orderDir === "asc" ? asc(orderCol) : desc(orderCol))
    .limit(limit)
    .offset((page - 1) * limit);

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(reviews)
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

export const getReviewById = async (id: string) => {
  const result = await findReviews({
    id, page: 1, limit: 1,
    rating: undefined,
    visitorType: undefined
  });
  return result.data[0] || null;
};

export const updateReview = async (id: string, data: Partial<UpdateReview>) => {
  const [updated] = await db
    .update(reviews)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(reviews.id, id))
    .returning();
  return updated;
};

export const deleteReview = async (id: string) => {
  const [deleted] = await db
    .delete(reviews)
    .where(eq(reviews.id, id))
    .returning();
  return deleted;
};

// Legacy functions kept for backward compatibility
export const getReviewsByCafeId = async (cafeId: string) => {
  return await db
    .select({
      id: reviews.id,
      rating: reviews.rating,
      visitorType: reviews.visitorType,
      review: reviews.review,
      title: reviews.title,
      createdAt: reviews.createdAt,
      user: {
        name: users.name,
        image: users.image,
      },
    })
    .from(reviews)
    .leftJoin(users, eq(reviews.userId, users.id))
    .where(eq(reviews.cafeId, cafeId))
    .orderBy(desc(reviews.createdAt));
};

export const getReviewsByUserId = async (userId: string) => {
  return await db
    .select()
    .from(reviews)
    .leftJoin(cafes, eq(reviews.cafeId, cafes.id))
    .where(eq(reviews.userId, userId))
    .orderBy(desc(reviews.createdAt));
};
