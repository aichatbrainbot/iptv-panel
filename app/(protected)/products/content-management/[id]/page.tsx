import PageWrapper from "@/components/PageWrapper";
import BlogWrapper from "@/components/products/content-management/id/BlogWrapper";
import { getBlogById } from "@/db/drizzle-queries/data/blogs-data";
import { notFound } from "next/navigation";

const page = async ({ params }: { params: { id: number } }) => {
  const blog = await getBlogById(params.id);
  if (!blog) return notFound();
  console.log(blog);
  return (
    <PageWrapper>
      <BlogWrapper content={blog.content} id={params.id} />
    </PageWrapper>
  );
};

export default page;
