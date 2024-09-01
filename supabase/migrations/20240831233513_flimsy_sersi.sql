DO $$ BEGIN
 CREATE TYPE "public"."connections_enum" AS ENUM('1', '2', '3');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."status_enum" AS ENUM('draft', 'paid', 'completed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."subscription_plan" AS ENUM('monthly', 'quarterly', 'semi-annual', 'annual');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "blogs" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text,
	"content" json,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "devices" (
	"id" uuid PRIMARY KEY NOT NULL,
	"device_type" text NOT NULL,
	"mac_address" text NOT NULL,
	"subscription_id" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subscriptions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"additional_info" text,
	"adult_content" boolean,
	"connections" text,
	"country_code" text,
	"created_at" timestamp,
	"order_number" serial NOT NULL,
	"payement_email" text,
	"payement_full_name" text,
	"payement_order_id" text,
	"plan" "subscription_plan" NOT NULL,
	"price" integer NOT NULL,
	"quick_delivery" boolean,
	"status" "status_enum" NOT NULL,
	"subscription_type" text,
	"user_email" text,
	"user_name" text,
	"user_phone" text,
	"vod" boolean
);
