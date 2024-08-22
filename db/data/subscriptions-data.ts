"use server";

import { supabase } from "@/clients/supabaseCLient";
import { handleStatus } from "@/lib/handleStatus";
import { Subscriptions } from "@/types/tables.types";

const getRecentOrders = async (page: number = 1, limit: number = 5) => {
  const { data, error, status } = await supabase
    .from("subscriptions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit)
    .range((page - 1) * limit, page * limit - 1);

  return handleStatus(status, data, error) as Subscriptions[];
};

const getUserSubscriptions = async (userId: string) => {
  const { data, error, status } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId);

  return handleStatus(status, data, error) as Subscriptions[];
};

export { getRecentOrders, getUserSubscriptions };
