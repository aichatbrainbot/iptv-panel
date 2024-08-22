"use server";

import { supabase } from "@/clients/supabaseCLient";
import { handleStatus } from "@/lib/handleStatus";
import logger from "@/lib/logger";
import supabaseAdmin from "@/lib/supabase-admin";

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

const getUsersCount = async () => {
  const { data, error } = await supabaseAdmin.auth.admin.listUsers();
  if (error) {
    logger.error(error);
    return 0;
  }
  return data?.users.length;
};

export {
  getTotalSalesToday,
  getTotalSalesOverall,
  getMostSellingPlans,
  getUsersCount,
};
