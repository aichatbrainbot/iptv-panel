"use server";

import { db } from "@/db";
import { desc, eq } from "drizzle-orm";
import { blogs } from "@/db/schema";
import { JSONContent } from "@tiptap/react";
import { revalidatePath } from "next/cache";

const getBlogs = async () => {
  const data = await db.query.blogs.findMany({
    orderBy: desc(blogs.created_at),
  });
  return data;
};

const getBlogById = async (id: number) => {
  const data = await db.query.blogs.findFirst({
    where: eq(blogs.id, id),
  });
  return data;
};

const insertBlog = async (content: string) => {
  const parsedContent = JSON.parse(content) as JSONContent;
  const title =
    parsedContent.content?.find((item) => item.type === "heading")?.content?.[0]
      ?.text ?? "No Title";
  const data = await db.insert(blogs).values({
    content: JSON.parse(content) as JSONContent,
    title: title
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .toLowerCase()
      .replace(/^-+|-+$/g, ""),
  });
  revalidatePath("/products/content-management");
  return data;
};

const updateBlog = async (id: number, content: string) => {
  const parsedContent = JSON.parse(content) as JSONContent;
  const title =
    parsedContent.content?.find((item) => item.type === "heading")?.content?.[0]
      ?.text ?? "No Title";
  const data = await db
    .update(blogs)
    .set({
      content: JSON.parse(content) as JSONContent,
      title: title
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .toLowerCase()
        .replace(/^-+|-+$/g, ""),
    })
    .where(eq(blogs.id, id));
  revalidatePath("/products/content-management");
  return data;
};

const deleteBlog = async (id: number) => {
  const data = await db.delete(blogs).where(eq(blogs.id, id));
  revalidatePath("/products/content-management");
  return data;
};

export { getBlogs, getBlogById, insertBlog, updateBlog, deleteBlog };
