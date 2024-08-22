"use server";

import { supabase } from "@/clients/supabaseCLient";
import { handleStatus } from "@/lib/handleStatus";

const getTotalSalesToday = async () => {
  const { data, error, status } = await supabase.rpc("total_sales_today");
  return handleStatus(status, data, error) as number;
};

const getTotalSalesOverall = async () => {
  const { data, error, status } = await supabase.rpc("total_sales_overall");
  return handleStatus(status, data, error) as number;
};

const getMostSellingPlans = async () => {
  const { data, error, status } = await supabase.rpc("most_selling_plans");
  return handleStatus(status, data, error) as {
    plan_name: string;
    count: number;
  }[];
};

export { getTotalSalesToday, getTotalSalesOverall, getMostSellingPlans };
