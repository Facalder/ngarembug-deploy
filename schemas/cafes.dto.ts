import { z } from "zod";
import {
  cafeType,
  contentStatus,
  priceRange,
  region,
} from "@/db/schema/enums.schema";

export const createCafeSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi").max(100),
  slug: z.string().min(1, "Slug wajib diisi"),
  description: z.string().optional(),

  // Detail Kafe
  cafeType: z.enum(cafeType.enumValues as [string, ...string[]], {
    message: "Tipe kafe wajib dipilih",
  }),
  capacity: z.coerce.number().min(0).default(0),

  // Lokasi & Kontak
  region: z.enum(region.enumValues as [string, ...string[]], {
    message: "Wilayah wajib dipilih",
  }),
  distance: z.coerce.number().min(0).default(0),
  address: z.string().min(1, "Alamat wajib diisi").max(255),
  phone: z.string().max(20).optional().nullable(),
  email: z.string().email("Email tidak valid").max(100).optional().nullable(),
  instagram: z.string().max(255).optional().nullable(),
  mapLink: z
    .string()
    .url("Link map tidak valid")
    .min(1, "Link map wajib diisi"),

  // Akomodasi
  priceRange: z.enum(priceRange.enumValues as [string, ...string[]], {
    message: "Rentang harga wajib dipilih",
  }),
  pricePerPerson: z.coerce.number().min(0).default(0),

  // Assets
  thumbnail: z.string().optional(),
  gallery: z.array(z.string()).optional(),
  menu: z.array(z.string()).optional(),

  contentStatus: z.enum(contentStatus.enumValues).default("draft"),
  facilities: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        slug: z.string(),
        description: z.string().optional(),
      }),
    )
    .default([]),
  terms: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        slug: z.string(),
        description: z.string().optional(),
      }),
    )
    .default([]),
});

// Schema untuk draft - only require nama
export const draftCafeSchema = z.object({
  // Field wajib - hanya nama
  name: z.string().min(1, "Nama wajib diisi").max(100),

  // Field opsional lainnya - slug akan otomatis tergenerate dari name
  slug: z.string().optional(),
  description: z.string().optional().default(""),

  // Detail Kafe
  cafeType: z.enum(cafeType.enumValues).optional().default("indoor_cafe"),
  capacity: z.coerce.number().min(0).default(0),

  // Lokasi & Kontak
  region: z.enum(region.enumValues).optional().default("sukabirus"),
  distance: z.coerce.number().min(0).default(0),
  address: z.string().optional().default(""),
  phone: z.string().max(20).optional().nullable().default(""),
  email: z.string().max(100).optional().nullable().default(""),
  instagram: z.string().max(255).optional().nullable().default(""),
  mapLink: z.string().optional().default(""),

  // Akomodasi
  priceRange: z.enum(priceRange.enumValues).optional().default("murah"),
  pricePerPerson: z.coerce.number().min(0).default(0),

  // Assets
  thumbnail: z.string().optional().default(""),
  gallery: z.array(z.string()).optional().default([]),
  menu: z.array(z.string()).optional().default([]),

  // Status & Relations
  contentStatus: z.enum(contentStatus.enumValues).default("draft"),
  facilities: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        slug: z.string(),
        description: z.string().optional(),
      }),
    )
    .default([]),
  terms: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        slug: z.string(),
        description: z.string().optional(),
      }),
    )
    .default([]),
});

export const publishCafeSchema = createCafeSchema;

export const updateCafeSchema = createCafeSchema.partial().extend({
  id: z.string(),
});

export type CreateCafe = z.infer<typeof createCafeSchema>;
export type UpdateCafe = z.infer<typeof updateCafeSchema>;

export const cafeQuerySchema = z.object({
  id: z.string().optional(),
  slug: z.string().optional(),

  region: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      return Array.isArray(val) ? val : val.split(",");
    }),

  cafeType: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      return Array.isArray(val) ? val : val.split(",");
    }),

  priceRange: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      return Array.isArray(val) ? val : val.split(",");
    }),

  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),

  minReviews: z.coerce.number().optional(),
  averageRating: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      const inputs = Array.isArray(val) ? val : val.split(",");
      const validRatings = ["one", "two", "three", "four", "five"];
      return inputs.filter((item) => validRatings.includes(item));
    }),

  minAvgRating: z.coerce.number().optional(),

  // Filtering by JSONB slugs (e.g. ?facilities=wifi,parking)
  facilities: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      return Array.isArray(val) ? val : val.split(",");
    }),
  terms: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      return Array.isArray(val) ? val : val.split(",");
    }),

  contentStatus: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      return Array.isArray(val) ? val : val.split(",");
    }),

  search: z.string().optional(),

  page: z.coerce.number().min(1, "Page must be at least 1").default(1),
  limit: z.coerce
    .number()
    .min(1, "Limit must be at least 1")
    .max(100, "Limit must be at most 100")
    .default(10),

  orderBy: z
    .enum([
      "created_at",
      "updated_at",
      "name",
      "price",
      "rating",
      "reviews",
      "capacity",
      "distance",
    ])
    .optional(),
  orderDir: z.enum(["asc", "desc"]).optional(),
});

export type CafeQuery = z.infer<typeof cafeQuerySchema>;
