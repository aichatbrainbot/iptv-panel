ALTER TABLE "articles" ALTER COLUMN "seo_keywords" SET DATA TYPE text[] USING seo_keywords::text[];
ALTER TABLE "blogs" ALTER COLUMN "seo_keywords" SET DATA TYPE text[] USING seo_keywords::text[];