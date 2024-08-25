import PageWrapper from "@/components/PageWrapper";
import BlogWrapper from "@/components/products/content-management/id/BlogWrapper";
import { getBlog } from "@/db/data/blogs-data";
import { notFound } from "next/navigation";

const page = async ({ params }: { params: { id: string } }) => {
  const blog = await getBlog(params.id);
  if (!blog) return notFound();
  return (
    <PageWrapper>
      <BlogWrapper content={blog.content} id={params.id} />
    </PageWrapper>
  );
};

export default page;
