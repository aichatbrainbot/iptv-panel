ALTER TABLE "subscriptions" ALTER COLUMN "adult_content" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "quick_delivery" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "user_email" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "user_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "user_phone" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "vod" SET DEFAULT false;