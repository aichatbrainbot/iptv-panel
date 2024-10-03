"use server";

import { db } from "@/db";
import { articles } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { JSONContent } from "novel";

const getArticles = async () => {
  const data = await db
    .select()
    .from(articles)
    .orderBy(desc(articles.created_at));
  return data;
};

const getArticleById = async (id: number) => {
  const data = await db.select().from(articles).where(eq(articles.id, id));
  return data;
};

const insertArticle = async (
  content: string,
  seoTitle: string,
  seoDescription: string,
  seoKeywords: string[],
) => {
  const parsedContent = JSON.parse(content) as JSONContent;
  const title =
    parsedContent.content?.find((item) => item.type === "heading")?.content?.[0]
      ?.text ?? "No Title";
  const data = await db.insert(articles).values({
    content: parsedContent,
    title: title
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .toLowerCase()
      .replace(/^-+|-+$/g, ""),
    seo_title: seoTitle,
    seo_description: seoDescription,
    seo_keywords: seoKeywords,
  });
  revalidatePath("/products/articles");
  return data;
};

const updateArticle = async (
  id: number,
  content: string,
  seoTitle: string,
  seoDescription: string,
  seoKeywords: string[],
) => {
  const parsedContent = JSON.parse(content) as JSONContent;
  const title =
    parsedContent.content?.find((item) => item.type === "heading")?.content?.[0]
      ?.text ?? "No Title";
  const data = await db
    .update(articles)
    .set({
      content: parsedContent,
      title: title
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .toLowerCase()
        .replace(/^-+|-+$/g, ""),
      seo_title: seoTitle,
      seo_description: seoDescription,
      seo_keywords: seoKeywords,
    })
    .where(eq(articles.id, id));
  revalidatePath("/products/articles");
  return data;
};

const deleteArticle = async (id: number) => {
  const data = await db.delete(articles).where(eq(articles.id, id));
  revalidatePath("/products/articles");
  return data;
};

export {
  getArticles,
  getArticleById,
  insertArticle,
  updateArticle,
  deleteArticle,
};
