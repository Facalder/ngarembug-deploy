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
import { facilities } from "@/db/schema/facilities.schema";
import type { FacilityQuery } from "@/schemas/facilities.dto";

export const findFacilities = async (params: FacilityQuery) => {
  const {
    id,
    slug,
    keyword,
    orderBy = "created_at",
    orderDir = "desc",
    page = 1,
    limit = 10,
    contentStatus,
  } = params;

  const conditions = [
    id && eq(facilities.id, id),
    slug && eq(facilities.slug, slug),
    keyword &&
      or(
        ilike(facilities.name, `%${keyword}%`),
        ilike(facilities.description, `%${keyword}%`),
      ),
    contentStatus?.length &&
      inArray(facilities.contentStatus, contentStatus as []),
  ].filter(Boolean) as SQL[];

  const orderCol = {
    name: facilities.name,
    created_at: facilities.createdAt,
    updated_at: facilities.updatedAt,
  }[orderBy];

  const data = await db
    .select()
    .from(facilities)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(orderDir === "asc" ? asc(orderCol) : desc(orderCol))
    .limit(limit)
    .offset((page - 1) * limit);

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(facilities)
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

export const createFacility = async (data: typeof facilities.$inferInsert) => {
  const [newFacility] = await db.insert(facilities).values(data).returning();
  return newFacility;
};

export const updateFacility = async (
  id: string,
  data: Partial<typeof facilities.$inferInsert>,
) => {
  const [updatedFacility] = await db
    .update(facilities)
    .set(data)
    .where(eq(facilities.id, id))
    .returning();
  return updatedFacility;
};

export const deleteFacility = async (id: string) => {
  const [deletedFacility] = await db
    .delete(facilities)
    .where(eq(facilities.id, id))
    .returning();
  return deletedFacility;
};
