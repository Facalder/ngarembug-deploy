"use server";

import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { cafes } from "@/db/schema";
import { reviews } from "@/db/schema/reviews.schema";
import { users } from "@/db/schema/users.schema";
import type { CreateReview } from "@/schemas/reviews.dto";

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
