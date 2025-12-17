import { pgEnum } from "drizzle-orm/pg-core";

export const contentStatus = pgEnum("ContentStatus", [
  "draft",
  "published",
  "archived",
]);

export const priceRange = pgEnum("PriceRange", ["murah", "sedang", "mahal"]);

export const cafeType = pgEnum("CafeType", [
  "indoor_cafe",
  "outdoor_cafe",
  "indoor_outdoor_cafe",
]);

export const region = pgEnum("Region", [
  "sukabirus",
  "sukapura",
  "batununggal",
  "buah_batu",
  "dayeuh_kolot",
  "ciganitri",
  "cijagra",
  "bojongsoang",
]);

export const reviewStatus = pgEnum("ReviewStatus", [
  "approved",
  "rejected",
  "pending",
]);

export const starRating = pgEnum("StarRating", [
  "satu",
  "dua",
  "tiga",
  "empat",
  "lima",
]);

export const visitorType = pgEnum("VisitorType", [
  "keluarga",
  "pasangan",
  "solo",
  "bisnis",
  "teman",
]);
