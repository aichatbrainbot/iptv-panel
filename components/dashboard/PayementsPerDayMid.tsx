"use client";
import { PaymentsPerDay } from "@/db/schema";
import { useQuery } from "@tanstack/react-query";
import { useQueryState, parseAsInteger } from "nuqs";
import PayementPerDayChart from "./PayementPerDayChart";
import { getPayementsPerDay } from "@/db/drizzle-queries/aggregations/subscription-aggregations";
interface Props {
  initialData: PaymentsPerDay[];
}

const PayementsPerDayMid = ({ initialData }: Props) => {
  const [days] = useQueryState("days", parseAsInteger.withDefault(7));
  const { data } = useQuery({
    queryKey: ["payements-per-day", days],
    queryFn: () => getPayementsPerDay(days),
    initialData: days === 7 ? initialData : undefined,
  });

  return <PayementPerDayChart data={data || []} />;
};

export default PayementsPerDayMid;
