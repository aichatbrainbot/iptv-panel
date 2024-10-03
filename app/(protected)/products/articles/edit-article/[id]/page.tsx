import PageWrapper from "@/components/PageWrapper";
import TailwindEditor from "@/components/products/content-management/Wrapper";
import { getArticleById } from "@/db/drizzle-queries/data/articles-data";
import { notFound } from "next/navigation";

const page = async ({ params }: { params: { id: number } }) => {
  const [article] = await getArticleById(params.id);
  if (!article) return notFound();
  return (
    <PageWrapper>
      <TailwindEditor
        initialContent={article.content}
        seoTitle={article.seo_title || ""}
        seoDescription={article.seo_description || ""}
        seoKeywords={article.seo_keywords || []}
        id={params.id}
        type="articles"
      />
    </PageWrapper>
  );
};

export default page;
