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
import { terms } from "@/db/schema/terms.schema";
import type { TermQuery } from "@/schemas/terms.dto";

export const findTerms = async (params: TermQuery) => {
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
    id && eq(terms.id, id),
    slug && eq(terms.slug, slug),
    keyword &&
      or(
        ilike(terms.name, `%${keyword}%`),
        ilike(terms.description, `%${keyword}%`),
      ),
    contentStatus?.length && inArray(terms.contentStatus, contentStatus as []),
  ].filter(Boolean) as SQL[];

  const orderCol = {
    name: terms.name,
    created_at: terms.createdAt,
    updated_at: terms.updatedAt,
  }[orderBy];

  const data = await db
    .select()
    .from(terms)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(orderDir === "asc" ? asc(orderCol) : desc(orderCol))
    .limit(limit)
    .offset((page - 1) * limit);

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(terms)
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

export const createTerm = async (data: typeof terms.$inferInsert) => {
  const [newTerm] = await db.insert(terms).values(data).returning();
  return newTerm;
};

export const updateTerm = async (
  id: string,
  data: Partial<typeof terms.$inferInsert>,
) => {
  const [updatedTerm] = await db
    .update(terms)
    .set(data)
    .where(eq(terms.id, id))
    .returning();
  return updatedTerm;
};

export const deleteTerm = async (id: string) => {
  const [deletedTerm] = await db
    .delete(terms)
    .where(eq(terms.id, id))
    .returning();
  return deletedTerm;
};
