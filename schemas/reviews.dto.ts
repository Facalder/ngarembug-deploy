import { z } from "zod";
import { starRating, visitorType } from "@/db/schema/enums.schema";

// Create schema - for INSERT operations (userId added by backend from session)
export const createReviewSchema = z.object({
  cafeId: z.string().min(1, "Cafe ID wajib diisi"),
  rating: z.enum(starRating.enumValues, {
    message: "Rating wajib dipilih",
  }),
  visitorType: z.enum(visitorType.enumValues, {
    message: "Tipe kunjungan wajib dipilih",
  }),
  review: z.string().min(1, "Review tidak boleh kosong"),
  title: z.string().min(1, "Judul review wajib diisi").max(255),
});

// Update schema - all fields optional except id
export const updateReviewSchema = z.object({
  id: z.string().min(1, "ID wajib diisi"),
  cafeId: z.string().optional(),
  rating: z.enum(starRating.enumValues).optional(),
  visitorType: z.enum(visitorType.enumValues).optional(),
  review: z.string().min(1, "Review tidak boleh kosong").optional(),
  title: z.string().max(255).optional(),
});

// Query schema - for filtering and searching
export const reviewQuerySchema = z.object({
  id: z.string().optional(),
  userId: z.string().optional(),
  cafeId: z.string().optional(),

  rating: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      return Array.isArray(val) ? val : val.split(",");
    }),

  visitorType: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      return Array.isArray(val) ? val : val.split(",");
    }),

  search: z.string().optional(), // Searches review text and title

  orderBy: z.enum(["created_at", "updated_at", "rating"]).optional(),
  orderDir: z.enum(["asc", "desc"]).optional(),

  page: z.coerce.number().min(1, "Page must be at least 1").default(1),
  limit: z.coerce
    .number()
    .min(1, "Limit must be at least 1")
    .max(100, "Limit must be at most 100")
    .default(10),
});

// Type exports
export type CreateReview = z.infer<typeof createReviewSchema>;
export type UpdateReview = z.infer<typeof updateReviewSchema>;
export type ReviewQuery = z.infer<typeof reviewQuerySchema>;
