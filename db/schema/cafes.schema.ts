import {
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  smallint,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import {
  cafeType,
  contentStatus,
  priceRange,
  region,
} from "@/db/schema/enums.schema";

import { createId } from "@/lib/cuid";

const cafesTable = pgTable.withRLS(
  "cafes",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),

    name: varchar("name", { length: 100 }).notNull().unique(),
    slug: varchar("slug", { length: 120 }).notNull().unique(),
    description: text("description"),

    cafeType: cafeType("cafe_type").notNull().default("indoor_cafe"),
    region: region("region").notNull(),
    capacity: smallint("capacity").notNull().default(0),
    distance: integer("distance").default(0), // Jarak dari Telkom University

    address: varchar("address", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 20 }).unique(),
    email: varchar("email", { length: 100 }).unique(),
    instagram: varchar("instagram", { length: 255 }).unique(),
    mapLink: varchar("map_link", { length: 255 }).notNull().unique(),

    priceRange: priceRange("price_range").notNull(),
    pricePerPerson: integer("price_per_person").notNull().default(0),

    // Assets
    thumbnail: text("thumbnail"),
    gallery: text("gallery").array(),
    menu: text("menu").array(),

    averageRating: numeric("average_rating", {
      precision: 3,
      scale: 2,
      mode: "number",
    }).default(0),
    totalReviews: integer("total_reviews").default(0),

    facilities: jsonb("facilities").notNull().default([]),
    terms: jsonb("terms").notNull().default([]),

    contentStatus: contentStatus("content_status").notNull().default("draft"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdateFn(() => new Date()),
  },
  (table) => {
    return [
      // index("idx_cafes_region_type").on(table.region, table.cafeType),
      // index("idx_cafes_avg_rating").on(table.averageRating),
      // index("idx_cafes_created_at").on(table.createdAt),

      index("idx_cafes_region_type").on(table.region, table.cafeType),
      index("idx_cafes_region_price").on(table.region, table.priceRange),
      index("idx_cafes_distance_rating").on(
        table.distance,
        table.averageRating,
      ),

      index("idx_cafes_price_rating").on(
        table.pricePerPerson,
        table.averageRating,
      ),

      index("idx_cafes_avg_rating").on(table.averageRating),
      index("idx_cafes_distance").on(table.distance),
      index("idx_cafes_price_per_person").on(table.pricePerPerson),
      index("idx_cafes_content_status").on(table.contentStatus),
      index("idx_cafes_created_at").on(table.createdAt),

      index("idx_cafes_facilities").using("gin", table.facilities),
      index("idx_cafes_terms").using("gin", table.terms),
    ];
  },
);

export const cafes = cafesTable;
