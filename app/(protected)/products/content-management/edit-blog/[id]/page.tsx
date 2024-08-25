import PageWrapper from "@/components/PageWrapper";
import TailwindEditor from "@/components/products/content-management/Wrapper";
import { getBlog } from "@/db/data/blogs-data";
import { notFound } from "next/navigation";
import React from "react";

const page = async ({ params }: { params: { id: string } }) => {
  const blog = await getBlog(params.id);
  if (!blog) return notFound();
  return (
    <PageWrapper>
      <TailwindEditor initialContent={blog.content} id={params.id} />
    </PageWrapper>
  );
};

export default page;
