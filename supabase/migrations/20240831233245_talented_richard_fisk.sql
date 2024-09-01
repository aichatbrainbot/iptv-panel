
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "blogs" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text,
	"content" json,
	"created_at" timestamp DEFAULT now() NOT NULL
);
