"use client";
import { useQuery } from "@tanstack/react-query";
import PayementPerDayChart from "./PayementPerDayChart";
import { getPayementsPerDay } from "@/db/aggregations/sales-aggregation";
import { useQueryState, parseAsInteger } from "nuqs";

const PayementsPerDayServer = async () => {
  const [days, _] = useQueryState("days", parseAsInteger.withDefault(30));
  const { data } = useQuery({
    queryKey: ["payements-per-day", days],
    queryFn: () => getPayementsPerDay(days || 30),
  });
  return <PayementPerDayChart data={data || []} />;
};

export default PayementsPerDayServer;
