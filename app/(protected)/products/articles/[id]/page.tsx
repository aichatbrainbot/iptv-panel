import PageWrapper from "@/components/PageWrapper";
import BlogWrapper from "@/components/products/content-management/id/BlogWrapper";
import { getArticleById } from "@/db/drizzle-queries/data/articles-data";
import { notFound } from "next/navigation";

const page = async ({ params }: { params: { id: number } }) => {
  const [article] = await getArticleById(params.id);
  if (!article) return notFound();
  return (
    <PageWrapper>
      <BlogWrapper content={article.content} id={params.id} type="articles" />
    </PageWrapper>
  );
};

export default page;
