CREATE TABLE IF NOT EXISTS "articles" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" json NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
