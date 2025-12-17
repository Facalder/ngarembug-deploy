"use server";

import {
  and,
  asc,
  desc,
  eq,
  gte,
  ilike,
  inArray,
  lte,
  or,
  type SQL,
  sql,
} from "drizzle-orm";

import { db } from "@/db";
import { cafes } from "@/db/schema/cafes.schema";
import { facilities } from "@/db/schema/facilities.schema";
import type { CafeQuery, CreateCafe, UpdateCafe } from "@/schemas/cafes.dto";

export const findCafes = async (params: CafeQuery) => {
  const {
    id,
    slug,
    region,
    cafeType,
    priceRange,
    minPrice,
    maxPrice,
    minReviews,
    averageRating,
    minAvgRating,
    orderBy = "created_at",
    orderDir = "desc",
    page = 1,
    limit = 10,
    search,
    contentStatus,
    facilities,
    terms,
  } = params;

  const conditions = [
    search &&
      or(
        ilike(cafes.name, `%${search}%`),
        ilike(cafes.description, `%${search}%`),
      ),
    id && eq(cafes.id, id),
    slug && eq(cafes.slug, slug),
    region?.length && inArray(cafes.region, region as []),
    cafeType?.length && inArray(cafes.cafeType, cafeType as []),
    contentStatus?.length && inArray(cafes.contentStatus, contentStatus as []),
    priceRange?.length && inArray(cafes.priceRange, priceRange as []),
    minPrice !== undefined && gte(cafes.pricePerPerson, minPrice),
    maxPrice !== undefined && lte(cafes.pricePerPerson, maxPrice),
    minReviews !== undefined && gte(cafes.totalReviews, minReviews),
    averageRating?.length &&
      inArray(
        sql`FLOOR(${cafes.averageRating})`,
        averageRating.map((r) => {
          switch (r) {
            case "one":
              return 1;
            case "two":
              return 2;
            case "three":
              return 3;
            case "four":
              return 4;
            case "five":
              return 5;
            default:
              return 0;
          }
        }),
      ),
    minAvgRating !== undefined && gte(cafes.averageRating, minAvgRating),

    // JSONB Filtering for facilities
    facilities?.length &&
      sql`${cafes.facilities} @> ${JSON.stringify(
        (Array.isArray(facilities) ? facilities : [facilities]).map((slug) => ({
          slug,
        })),
      )}`,

    // JSONB Filtering for terms
    terms?.length &&
      sql`${cafes.terms} @> ${JSON.stringify(
        (Array.isArray(terms) ? terms : [terms]).map((slug) => ({ slug })),
      )}`,
  ].filter(Boolean) as SQL[];

  const orderCol = {
    name: cafes.name,
    price: cafes.pricePerPerson,
    rating: cafes.averageRating,
    reviews: cafes.totalReviews,
    capacity: cafes.capacity,
    distance: cafes.distance,
    created_at: cafes.createdAt,
    updated_at: cafes.updatedAt,
  }[orderBy];

  const data = await db
    .select()
    .from(cafes)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(orderDir === "asc" ? asc(orderCol) : desc(orderCol))
    .limit(limit)
    .offset((page - 1) * limit);

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(cafes)
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

export const getCafeById = async (id: string) => {
  const [cafe] = await db.select().from(cafes).where(eq(cafes.id, id));

  if (!cafe) return null;
  return cafe;
};

export const createCafe = async (data: CreateCafe) => {
  const [newCafe] = await db
    .insert(cafes)
    .values(data as any)
    .returning();
  return newCafe;
};

export const updateCafe = async (id: string, data: UpdateCafe) => {
  const { id: _, ...updateData } = data;

  const [updatedCafe] = await db
    .update(cafes)
    .set(updateData as any)
    .where(eq(cafes.id, id))
    .returning();

  return updatedCafe;
};

export const deleteCafe = async (id: string) => {
  const [deletedCafe] = await db
    .delete(cafes)
    .where(eq(cafes.id, id))
    .returning();
  return deletedCafe;
};

export const updateCafeFacilities = async (
  id: string,
  facilitySlugs: string[],
) => {
  // 1. Get facility details (name & slug)
  const selectedFacilities =
    facilitySlugs.length > 0
      ? await db
          .select({
            slug: facilities.slug,
            name: facilities.name,
          })
          .from(facilities)
          .where(inArray(facilities.slug, facilitySlugs))
      : [];

  // 2. Update cafe
  const [updatedCafe] = await db
    .update(cafes)
    .set({
      facilities: selectedFacilities,
      updatedAt: new Date(),
    } as any)
    .where(eq(cafes.id, id))
    .returning();

  return updatedCafe;
};
