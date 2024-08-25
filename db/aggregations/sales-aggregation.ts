"use server";

import { supabase } from "@/clients/supabaseCLient";
import { handleStatus } from "@/lib/handleStatus";
import logger from "@/lib/logger";
import supabaseAdmin from "@/lib/supabase-admin";
import { OrderStatus } from "@/types/search.types";
import {
  MostOccurringCountryCodes,
  PaymentsPerDay,
} from "@/types/tables.types";

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

const getPayementsPerDay = async (days: number) => {
  const { data, error, status } = await supabase.rpc(
    "total_payments_over_days",
    {
      num_days: days,
    },
  );
  return handleStatus(status, data, error) as PaymentsPerDay[];
};

const getMostOccurringCountryCodes = async (limit: number) => {
  const { data, error, status } = await supabase.rpc(
    "get_most_occurring_country_codes",
    {
      limit_num: limit,
    },
  );
  return handleStatus(status, data, error) as MostOccurringCountryCodes[];
};

export type AddonsAnalytics = {
  vod_count: number;
  adult_content_count: number;
  quick_delivery_count: number;
};

const getAddonsAnalytics = async (): Promise<AddonsAnalytics> => {
  const [vodCount, adultContentCount, quickDeliveryCount] = await Promise.all([
    supabase
      .from("subscriptions")
      .select("id", { count: "exact" })
      .eq("vod", true)
      .eq("status", OrderStatus.PAID),
    supabase
      .from("subscriptions")
      .select("id", { count: "exact" })
      .eq("adult_content", true)
      .eq("status", OrderStatus.PAID),
    supabase
      .from("subscriptions")
      .select("id", { count: "exact" })
      .eq("quick_delivery", true)
      .eq("status", OrderStatus.PAID),
  ]);

  return {
    vod_count: vodCount.count ?? 0,
    adult_content_count: adultContentCount.count ?? 0,
    quick_delivery_count: quickDeliveryCount.count ?? 0,
  };
};

export {
  getTotalSalesToday,
  getTotalSalesOverall,
  getMostSellingPlans,
  getUsersCount,
  getPayementsPerDay,
  getMostOccurringCountryCodes,
  getAddonsAnalytics,
};
