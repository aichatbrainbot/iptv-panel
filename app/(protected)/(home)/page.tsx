import RecentOrdersCard from "@/components/home/RecentOrdersCard";
import StatCards from "@/components/home/StatCards";
import TopSellingProductsCard from "@/components/home/TopSellingProductsCard";
import PageWrapper from "@/components/PageWrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function Home() {
  return (
    <PageWrapper className="gap-4 pt-20">
      <div className="flex min-h-screen w-full flex-col">
        <main className="flex-1 space-y-6 p-4 md:p-6">
          <Suspense
            fallback={
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-[136px] w-full rounded-lg" />
                ))}
              </div>
            }
          >
            <StatCards />
          </Suspense>
          <div className="grid gap-6 md:grid-cols-2">
            <Suspense
              fallback={<Skeleton className="h-[300px] w-full rounded-lg" />}
            >
              <RecentOrdersCard />
            </Suspense>
            <Suspense
              fallback={<Skeleton className="h-[300px] w-full rounded-lg" />}
            >
              <TopSellingProductsCard />
            </Suspense>
          </div>
        </main>
      </div>
    </PageWrapper>
  );
}
