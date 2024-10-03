import PageWrapper from "@/components/PageWrapper";
import TailwindEditor from "@/components/products/content-management/Wrapper";
import { getBlogById } from "@/db/drizzle-queries/data/blogs-data";
import { notFound } from "next/navigation";
import React from "react";

const page = async ({ params }: { params: { id: number } }) => {
  const blog = await getBlogById(params.id);
  if (!blog) return notFound();
  return (
    <PageWrapper>
      <TailwindEditor
        initialContent={blog.content}
        id={params.id}
        type="blogs"
      />
    </PageWrapper>
  );
};

export default page;
