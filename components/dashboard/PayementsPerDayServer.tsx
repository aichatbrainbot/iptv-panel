import { getPayementsPerDay } from "@/db/aggregations/sales-aggregation";
import PayementsPerDayMid from "./PayementsPerDayMid";
import { unstable_noStore as noStore } from "next/cache";
import { Suspense } from "react";

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
