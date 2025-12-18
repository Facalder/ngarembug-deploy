"use server";

import { and, asc, desc, eq, ilike, inArray, or, type SQL, sql } from "drizzle-orm";
import { db } from "@/db";
import { cafeRecommendations } from "@/db/schema/cafe-recommendations.schema";
import { users } from "@/db/schema/users.schema";
import type { CafeRecommendationQuery, CreateCafeRecommendation, UpdateCafeRecommendation } from "@/schemas/cafe-recommendations.dto";

export const createCafeRecommendation = async (userId: string, data: CreateCafeRecommendation) => {
  const [newRecommendation] = await db
    .insert(cafeRecommendations)
    .values({
      ...data,
      userId,
    })
    .returning();
  return newRecommendation;
};

export const findCafeRecommendations = async (params: CafeRecommendationQuery) => {
  const {
    id,
    userId,
    search,
    cafeType,
    orderBy = "created_at",
    orderDir = "desc",
    page = 1,
    limit = 10,
  } = params;

  const conditions = [
    search &&
      or(
        ilike(cafeRecommendations.cafeName, `%${search}%`),
        ilike(cafeRecommendations.address, `%${search}%`),
        ilike(cafeRecommendations.reason || "", `%${search}%`)
      ),
    id && eq(cafeRecommendations.id, id),
    userId && eq(cafeRecommendations.userId, userId),
    cafeType?.length && inArray(cafeRecommendations.cafeType, cafeType as []),
  ].filter(Boolean) as SQL[];

  const orderCol = {
    created_at: cafeRecommendations.createdAt,
    updated_at: cafeRecommendations.updatedAt,
    name: cafeRecommendations.cafeName,
  }[orderBy];

  const data = await db
    .select({
      id: cafeRecommendations.id,
      cafeName: cafeRecommendations.cafeName,
      address: cafeRecommendations.address,
      cafeType: cafeRecommendations.cafeType,
      reason: cafeRecommendations.reason,
      userId: cafeRecommendations.userId,
      createdAt: cafeRecommendations.createdAt,
      updatedAt: cafeRecommendations.updatedAt,
      user: {
        id: users.id,
        name: users.name,
        image: users.image,
      },
    })
    .from(cafeRecommendations)
    .leftJoin(users, eq(cafeRecommendations.userId, users.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(orderDir === "asc" ? asc(orderCol) : desc(orderCol))
    .limit(limit)
    .offset((page - 1) * limit);

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(cafeRecommendations)
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

export const getCafeRecommendationById = async (id: string) => {
  const result = await findCafeRecommendations({
    id, page: 1, limit: 1,
    cafeType: ['indoor_cafe', 'outdoor_cafe', 'indoor_outdoor_cafe']
  });
  return result.data[0] || null;
};

export const updateCafeRecommendation = async (id: string, data: Partial<UpdateCafeRecommendation>) => {
  const [updated] = await db
    .update(cafeRecommendations)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(cafeRecommendations.id, id))
    .returning();
  return updated;
};

export const deleteCafeRecommendation = async (id: string) => {
  const [deleted] = await db
    .delete(cafeRecommendations)
    .where(eq(cafeRecommendations.id, id))
    .returning();
  return deleted;
};
