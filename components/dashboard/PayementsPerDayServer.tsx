import PayementsPerDayMid from "./PayementsPerDayMid";
import { unstable_noStore as noStore } from "next/cache";
import { Suspense } from "react";
import { getPayementsPerDay } from "@/db/drizzle-queries/aggregations/subscription-aggregations";

const PayementsPerDayServer = async () => {
  noStore();
  const data = await getPayementsPerDay(7);

  return (
    <Suspense>
      <PayementsPerDayMid initialData={data} />
    </Suspense>
  );
};

export default PayementsPerDayServer;
