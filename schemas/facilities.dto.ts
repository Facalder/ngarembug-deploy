import { z } from "zod";
import { contentStatus } from "@/db/schema/enums.schema";

// Base schema for facility fields
export const facilitySchema = z.object({
  name: z
    .string()
    .min(1, "Nama wajib diisi")
    .max(60, "Nama maksimal 60 karakter"),
  slug: z
    .string()
    .min(1, "Slug wajib diisi")
    .max(80, "Slug maksimal 80 karakter"),
  description: z.string().optional(),
  contentStatus: z.enum(contentStatus.enumValues).default("draft"),
});

// Create schema - for INSERT operations
export const createFacilitySchema = facilitySchema;

// Draft schema - minimal required fields (name only, slug auto-generated)
export const draftFacilitySchema = z.object({
  name: z
    .string()
    .min(1, "Nama wajib diisi")
    .max(60, "Nama maksimal 60 karakter"),
  
  // Optional fields with defaults
  slug: z.string().optional(),
  description: z.string().optional().default(""),
  contentStatus: z.enum(contentStatus.enumValues).default("draft"),
});

// Update schema - all fields optional except id
export const updateFacilitySchema = z.object({
  id: z.string().min(1, "ID wajib diisi"),
  name: z
    .string()
    .min(1, "Nama wajib diisi")
    .max(60, "Nama maksimal 60 karakter")
    .optional(),
  slug: z
    .string()
    .max(80, "Slug maksimal 80 karakter")
    .optional(),
  description: z.string().optional(),
  contentStatus: z.enum(contentStatus.enumValues).optional(),
});

// Query schema - for filtering and searching
export const facilityQuerySchema = z.object({
  id: z.string().optional(),
  slug: z.string().optional(),

  keyword: z.string().optional(),

  contentStatus: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      return Array.isArray(val) ? val : val.split(",");
    }),

  orderBy: z.enum(["name", "created_at", "updated_at"]).optional(),
  orderDir: z.enum(["asc", "desc"]).optional(),

  page: z.coerce.number().min(1, "Page must be at least 1").default(1),
  limit: z.coerce
    .number()
    .min(1, "Limit must be at least 1")
    .max(100, "Limit must be at most 100")
    .default(10),
});

// Type exports
export type Facility = z.infer<typeof facilitySchema>;
export type FacilityQuery = z.infer<typeof facilityQuerySchema>;
export type CreateFacility = z.infer<typeof createFacilitySchema>;
export type DraftFacility = z.infer<typeof draftFacilitySchema>;
export type UpdateFacility = z.infer<typeof updateFacilitySchema>;
