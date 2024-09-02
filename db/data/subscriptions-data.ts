"use server";

import { supabase } from "@/clients/supabaseCLient";
import { handleStatus } from "@/lib/handleStatus";
import { SearchFilter } from "@/types/search.types";
import { Subscriptions } from "@/db/schema";

const getRecentOrders = async (
  page: number = 1,
  limit: number = 5,
  tab?: string,
  filter?: SearchFilter | undefined,
  search?: string | null,
) => {
  const start = (page - 1) * limit;
  const end = page * limit - 1;
  let query = supabase
    .from("subscriptions")
    .select("*")
    .order("created_at", { ascending: false })
    .range(start, end);

  if (tab) {
    query = query.eq("status", tab);
  } else {
    query = query.eq("status", "paid");
  }

  if (filter && search?.length && search?.length >= 1) {
    switch (filter) {
      case SearchFilter.ORDER_NUMBER:
        const orderNumber = parseInt(search);
        console.log(orderNumber);

        if (!isNaN(orderNumber)) {
          query = query.eq("order_number", orderNumber);
        }
        break;
      default:
        query = query.ilike(filter, `%${search}%`);
        break;
    }
  }

  const { data, error, status } = await query;

  return handleStatus(status, data, error) as Subscriptions[];
};

const getUserSubscriptions = async (userEmail: string) => {
  const { data, error, status } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_email", userEmail);

  return handleStatus(status, data, error) as Subscriptions[];
};

const getSubscription = async (id: string) => {
  const { data, error, status } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("id", id)
    .single();

  return handleStatus(status, data, error) as Subscriptions;
};

const updateSubscription = async (
  id: string,
  props: Partial<Subscriptions>,
) => {
  const { data, error, status } = await supabase
    .from("subscriptions")
    //@ts-ignore
    .update(props)
    .eq("id", id)
    .select("*")
    .single();

  return handleStatus(status, data, error) as Subscriptions;
};

export {
  getRecentOrders,
  getUserSubscriptions,
  getSubscription,
  updateSubscription,
};
