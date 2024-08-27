"use client";
import { getPayementsPerDay } from "@/db/aggregations/sales-aggregation";
import { PaymentsPerDay } from "@/types/tables.types";
import { useQuery } from "@tanstack/react-query";
import { useQueryState, parseAsInteger } from "nuqs";
import PayementPerDayChart from "./PayementPerDayChart";

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
