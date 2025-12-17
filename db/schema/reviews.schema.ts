import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createId } from "@/lib/cuid";
import { cafes } from "./cafes.schema";
import { starRating, visitorType } from "./enums.schema";
import { users } from "./users.schema";

export const reviews = pgTable.withRLS("reviews", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  cafeId: text("cafe_id")
    .notNull()
    .references(() => cafes.id, { onDelete: "cascade" }),

  rating: starRating("rating").notNull(),
  visitorType: visitorType("visitor_type").notNull(),

  review: text("review").notNull(),
  title: varchar("title", { length: 255 }).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date()),
});
