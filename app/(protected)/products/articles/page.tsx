import PageWrapper from "@/components/PageWrapper";
import BlogsList from "@/components/products/content-management/BlogsList";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

const page = () => {
  return (
    <PageWrapper className="gap-4">
      <Suspense
        fallback={
          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <Skeleton
                key={index}
                className="relative aspect-video rounded-md"
              />
            ))}
          </div>
        }
      >
        <BlogsList type="articles" />
      </Suspense>
      <Button>
        <Link
          className="flex items-center gap-2"
          href="/products/articles/add-article"
        >
          <PlusCircle className="h-4 w-4" />
          Add Article
        </Link>
      </Button>
    </PageWrapper>
  );
};

export default page;
