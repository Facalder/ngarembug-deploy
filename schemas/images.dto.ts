import { z } from "zod";

// Base image schema
export const imageSchema = z.object({
  id: z.string().optional(), // Changed from UUID to string (CUID)
  fileName: z
    .string()
    .min(1, "Nama file wajib diisi")
    .max(255, "Nama file maksimal 255 karakter"),
  filePath: z.string().min(1, "Path file wajib diisi"),
  fileUrl: z.string().url("URL file tidak valid"),
  fileSize: z
    .string()
    .max(50, "Ukuran file maksimal 50 karakter")
    .optional()
    .nullable(),
  mimeType: z
    .string()
    .max(100, "Mime type maksimal 100 karakter")
    .optional()
    .nullable(),

  folder: z
    .string()
    .max(100, "Nama folder maksimal 100 karakter")
    .default("uncategorized"),
  category: z
    .string()
    .max(100, "Kategori maksimal 100 karakter")
    .default("uncategorized")
    .optional()
    .nullable(),

  alt: z.string().optional().nullable(),
  description: z.string().optional().nullable(),

  bucket: z
    .string()
    .min(1, "Bucket wajib diisi")
    .max(50, "Nama bucket maksimal 50 karakter"),

  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Create schema - for INSERT operations
export const createImageSchema = imageSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Update schema - all fields optional except id
export const updateImageSchema = z.object({
  id: z.string().min(1, "ID wajib diisi"),
  fileName: z
    .string()
    .max(255, "Nama file maksimal 255 karakter")
    .optional(),
  filePath: z.string().optional(),
  fileUrl: z.string().url("URL file tidak valid").optional(),
  fileSize: z
    .string()
    .max(50, "Ukuran file maksimal 50 karakter")
    .optional()
    .nullable(),
  mimeType: z
    .string()
    .max(100, "Mime type maksimal 100 karakter")
    .optional()
    .nullable(),
  folder: z
    .string()
    .max(100, "Nama folder maksimal 100 karakter")
    .optional(),
  category: z
    .string()
    .max(100, "Kategori maksimal 100 karakter")
    .optional()
    .nullable(),
  alt: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  bucket: z
    .string()
    .max(50, "Nama bucket maksimal 50 karakter")
    .optional(),
});

// Query schema - for filtering and searching
export const imageQuerySchema = z.object({
  id: z.string().optional(),
  folder: z.string().optional(),
  category: z.string().optional(),
  bucket: z.string().optional(),

  // Specific lookups
  url: z.string().optional(),
  urls: z.array(z.string()).optional(), // For bulk lookup
  filePath: z.string().optional(),
  fileName: z.string().optional(),

  search: z.string().optional(), // Generic search term

  orderBy: z
    .enum(["fileName", "fileSize", "createdAt", "updatedAt"])
    .optional(),
  orderDir: z.enum(["asc", "desc"]).optional(),

  page: z.coerce.number().min(1, "Page must be at least 1").default(1),
  limit: z.coerce
    .number()
    .min(1, "Limit must be at least 1")
    .max(100, "Limit must be at most 100")
    .default(10),
});

// Type exports
export type Image = z.infer<typeof imageSchema>;
export type ImageQuery = z.infer<typeof imageQuerySchema>;
export type CreateImage = z.infer<typeof createImageSchema>;
export type UpdateImage = z.infer<typeof updateImageSchema>;
