import { z } from "zod";
import { cafeType } from "@/db/schema/enums.schema";

// Create Schema
export const createCafeRecommendationSchema = z.object({
  cafeName: z.string().min(1, "Nama kafe wajib diisi").max(100),
  address: z.string().min(1, "Alamat wajib diisi"),
  cafeType: z.enum(cafeType.enumValues, {
    message: "Tipe kafe wajib dipilih",
  }),
  reason: z.string().optional(),
});

// Update Schema
export const updateCafeRecommendationSchema = z.object({
  id: z.string().min(1, "ID wajib diisi"),
  cafeName: z.string().max(100).optional(),
  address: z.string().optional(),
  cafeType: z.enum(cafeType.enumValues).optional(),
  reason: z.string().optional(),
});

// Query Schema
export const cafeRecommendationQuerySchema = z.object({
  id: z.string().optional(),
  userId: z.string().optional(),
  search: z.string().optional(), // Search by cafeName or address
  
  cafeType: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      return Array.isArray(val) ? val : val.split(",");
    }),

  orderBy: z.enum(["created_at", "updated_at", "name"]).optional(),
  orderDir: z.enum(["asc", "desc"]).optional(),

  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

export type CreateCafeRecommendation = z.infer<typeof createCafeRecommendationSchema>;
export type UpdateCafeRecommendation = z.infer<typeof updateCafeRecommendationSchema>;
export type CafeRecommendationQuery = z.infer<typeof cafeRecommendationQuerySchema>;
