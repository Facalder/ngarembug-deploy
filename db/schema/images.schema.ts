import { index, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createId } from "@/lib/cuid";

const imagesTable = pgTable.withRLS(
  "images",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),

    fileName: varchar("file_name", { length: 255 }).notNull(),
    filePath: text("file_path").notNull(),
    fileUrl: text("file_url").notNull(),
    fileSize: varchar("file_size", { length: 50 }),
    mimeType: varchar("mime_type", { length: 100 }),

    folder: varchar("folder", { length: 100 })
      .notNull()
      .default("uncategorized"),
    category: varchar("category", { length: 100 }).default("uncategorized"),

    alt: text("alt"),
    description: text("description"),

    bucket: varchar("bucket", { length: 50 }).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("images_folder_idx").using("btree", table.folder.asc().nullsLast()),
    index("images_category_idx").using(
      "btree",
      table.category.asc().nullsLast(),
    ),
    index("images_bucket_idx").using("btree", table.bucket.asc().nullsLast()),
    index("images_created_at_idx").using(
      "btree",
      table.createdAt.desc().nullsLast(),
    ),
  ],
);

export const images = imagesTable;

export type Image = typeof images.$inferSelect;
export type NewImage = typeof images.$inferInsert;
