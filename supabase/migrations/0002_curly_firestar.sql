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
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"device_type" text NOT NULL,
	"mac_address" text NOT NULL,
	"subscription_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"additional_info" text,
	"connections" text,
	"country_code" text,
	"created_at" timestamp DEFAULT now(),
	"order_number" serial NOT NULL,
	"payement_email" text,
	"payement_full_name" text,
	"payement_order_id" text,
	"plan" "subscription_plan" NOT NULL,
	"price" real NOT NULL,
	"status" "status_enum" NOT NULL,
	"subscription_type" text,
	"user_email" text NOT NULL,
	"user_name" text NOT NULL,
	"user_phone" text NOT NULL,
	"quick_delivery" boolean DEFAULT false,
	"adult_content" boolean DEFAULT false,
	"vod" boolean DEFAULT false
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "devices" ADD CONSTRAINT "devices_subscription_id_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."subscriptions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
