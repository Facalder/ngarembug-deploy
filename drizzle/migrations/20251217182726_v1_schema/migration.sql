CREATE TYPE "CafeType" AS ENUM('indoor_cafe', 'outdoor_cafe', 'indoor_outdoor_cafe');--> statement-breakpoint
CREATE TYPE "ContentStatus" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "PriceRange" AS ENUM('murah', 'sedang', 'mahal');--> statement-breakpoint
CREATE TYPE "Region" AS ENUM('sukabirus', 'sukapura', 'batununggal', 'buah_batu', 'dayeuh_kolot', 'ciganitri', 'cijagra', 'bojongsoang');--> statement-breakpoint
CREATE TYPE "ReviewStatus" AS ENUM('approved', 'rejected', 'pending');--> statement-breakpoint
CREATE TYPE "StarRating" AS ENUM('satu', 'dua', 'tiga', 'empat', 'lima');--> statement-breakpoint
CREATE TYPE "VisitorType" AS ENUM('keluarga', 'pasangan', 'solo', 'bisnis', 'teman');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" text PRIMARY KEY,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cafes" (
	"id" text PRIMARY KEY,
	"name" varchar(100) NOT NULL UNIQUE,
	"slug" varchar(120) NOT NULL UNIQUE,
	"description" text,
	"cafe_type" "CafeType" DEFAULT 'indoor_cafe'::"CafeType" NOT NULL,
	"region" "Region" NOT NULL,
	"capacity" smallint DEFAULT 0 NOT NULL,
	"distance" integer DEFAULT 0,
	"address" varchar(255) NOT NULL,
	"phone" varchar(20) UNIQUE,
	"email" varchar(100) UNIQUE,
	"instagram" varchar(255) UNIQUE,
	"map_link" varchar(255) NOT NULL UNIQUE,
	"price_range" "PriceRange" NOT NULL,
	"price_per_person" integer DEFAULT 0 NOT NULL,
	"thumbnail" text,
	"gallery" text[],
	"menu" text[],
	"average_rating" numeric(3,2) DEFAULT '0',
	"total_reviews" integer DEFAULT 0,
	"facilities" jsonb DEFAULT '[]' NOT NULL,
	"terms" jsonb DEFAULT '[]' NOT NULL,
	"content_status" "ContentStatus" DEFAULT 'draft'::"ContentStatus" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "cafes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "facilities" (
	"id" text PRIMARY KEY,
	"name" varchar(60) NOT NULL UNIQUE,
	"slug" varchar(80) NOT NULL UNIQUE,
	"description" text,
	"content_status" "ContentStatus" DEFAULT 'draft'::"ContentStatus" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "facilities" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "images" (
	"id" text PRIMARY KEY,
	"file_name" varchar(255) NOT NULL,
	"file_path" text NOT NULL,
	"file_url" text NOT NULL,
	"file_size" varchar(50),
	"mime_type" varchar(100),
	"folder" varchar(100) DEFAULT 'uncategorized' NOT NULL,
	"category" varchar(100) DEFAULT 'uncategorized',
	"alt" text,
	"description" text,
	"bucket" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "images" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" text PRIMARY KEY,
	"user_id" text NOT NULL,
	"cafe_id" text NOT NULL,
	"rating" "StarRating" NOT NULL,
	"visitor_type" "VisitorType" NOT NULL,
	"review" text NOT NULL,
	"title" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "reviews" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL UNIQUE,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"impersonated_by" text
);
--> statement-breakpoint
CREATE TABLE "terms" (
	"id" text PRIMARY KEY,
	"name" varchar(60) NOT NULL UNIQUE,
	"slug" varchar(80) NOT NULL UNIQUE,
	"description" text,
	"content_status" "ContentStatus" DEFAULT 'draft'::"ContentStatus" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "terms" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"email" text NOT NULL UNIQUE,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"role" text DEFAULT 'user',
	"banned" boolean DEFAULT false,
	"ban_reason" text,
	"ban_expires" timestamp
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" text PRIMARY KEY,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "accounts_userId_idx" ON "accounts" ("user_id");--> statement-breakpoint
CREATE INDEX "idx_cafes_region_type" ON "cafes" ("region","cafe_type");--> statement-breakpoint
CREATE INDEX "idx_cafes_region_price" ON "cafes" ("region","price_range");--> statement-breakpoint
CREATE INDEX "idx_cafes_distance_rating" ON "cafes" ("distance","average_rating");--> statement-breakpoint
CREATE INDEX "idx_cafes_price_rating" ON "cafes" ("price_per_person","average_rating");--> statement-breakpoint
CREATE INDEX "idx_cafes_avg_rating" ON "cafes" ("average_rating");--> statement-breakpoint
CREATE INDEX "idx_cafes_distance" ON "cafes" ("distance");--> statement-breakpoint
CREATE INDEX "idx_cafes_price_per_person" ON "cafes" ("price_per_person");--> statement-breakpoint
CREATE INDEX "idx_cafes_content_status" ON "cafes" ("content_status");--> statement-breakpoint
CREATE INDEX "idx_cafes_created_at" ON "cafes" ("created_at");--> statement-breakpoint
CREATE INDEX "idx_cafes_facilities" ON "cafes" USING gin ("facilities");--> statement-breakpoint
CREATE INDEX "idx_cafes_terms" ON "cafes" USING gin ("terms");--> statement-breakpoint
CREATE INDEX "images_folder_idx" ON "images" ("folder");--> statement-breakpoint
CREATE INDEX "images_category_idx" ON "images" ("category");--> statement-breakpoint
CREATE INDEX "images_bucket_idx" ON "images" ("bucket");--> statement-breakpoint
CREATE INDEX "images_created_at_idx" ON "images" ("created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "sessions_userId_idx" ON "sessions" ("user_id");--> statement-breakpoint
CREATE INDEX "verifications_identifier_idx" ON "verifications" ("identifier");--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_cafe_id_cafes_id_fkey" FOREIGN KEY ("cafe_id") REFERENCES "cafes"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;