import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createId } from "@/lib/cuid";
import { cafeType } from "./enums.schema";
import { users } from "./users.schema";

export const cafeRecommendations = pgTable("cafe_recommendations", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  cafeName: varchar("name", { length: 100 }).notNull(),
  reason: text('reason'),
  address: text("address").notNull(),
  cafeType: cafeType("cafe_type").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date()),
});
