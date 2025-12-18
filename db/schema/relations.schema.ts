import { defineRelations } from "drizzle-orm";
import { accounts } from "@/db/schema/accounts.schema";
import { cafeRecommendations } from "@/db/schema/cafe-recommendations.schema";
import { cafes } from "@/db/schema/cafes.schema";
import { reviews } from "@/db/schema/reviews.schema";
import { sessions } from "@/db/schema/sessions.schema";
import { users } from "@/db/schema/users.schema";
import { verifications } from "@/db/schema/verifications.schema";

const schema = {
  cafes,
  users,
  verifications,
  sessions,
  accounts,
  reviews,
  cafeRecommendations,
};

export const relations = defineRelations(schema, (r) => ({
  users: {
    sessions: r.many.sessions(),
    accounts: r.many.accounts(),
    reviews: r.many.reviews(),
  },

  sessions: {
    user: r.one.users({
      from: r.sessions.userId,
      to: r.users.id,
    }),
  },

  accounts: {
    user: r.one.users({
      from: r.accounts.userId,
      to: r.users.id,
    }),
  },

  reviews: {
    user: r.one.users({
      from: r.reviews.userId,
      to: r.users.id,
    }),
    cafe: r.one.cafes({
      from: r.reviews.cafeId,
      to: r.cafes.id,
    }),
  },

  cafeRecommendations: {
    user: r.one.users({
      from: r.cafeRecommendations.userId,
      to: r.users.id,
    }),
  },

  cafes: {
    reviews: r.many.reviews(),
  },
}));
