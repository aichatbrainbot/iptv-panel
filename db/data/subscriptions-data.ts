"use server";

import { supabase } from "@/clients/supabaseCLient";
import { handleStatus } from "@/lib/handleStatus";
import { SearchFilter } from "@/types/search.types";
import { Subscriptions } from "@/types/tables.types";

const getRecentOrders = async (
  page: number = 1,
  limit: number = 5,
  tab: string = "completed",
  filter?: SearchFilter | undefined,
  search?: string | null,
) => {
  const start = (page - 1) * limit;
  const end = page * limit - 1;
  let query = supabase
    .from("subscriptions")
    .select("*")
    .eq("status", tab)
    .order("created_at", { ascending: false })
    .range(start, end);

  if (filter && search?.length && search?.length > 3) {
    switch (filter) {
      case SearchFilter.ORDER_ID:
        query = query.ilike("order_id", `%${search}%`);
        break;
      case SearchFilter.PAYMENT_EMAIL:
        query = query.ilike("email", `%${search}%`);
        break;
      case SearchFilter.COUNTRY_CODE:
        query = query.ilike("country_code", `%${search}%`);
        break;
      case SearchFilter.PAYMENT_FULL_NAME:
        query = query.ilike("payment_full_name", `%${search}%`);
        break;
      case SearchFilter.USER_ID:
        query = query.ilike("user_id", `%${search}%`);
        break;
      case SearchFilter.USER_EMAIL:
        const { data } = await supabase
          .from("user_data")
          .select("user_id")
          .ilike("email", `%${search}%`);
        if (data) {
          console.log(data);
          query = query.in(
            "user_id",
            data.map((user) => user.user_id),
          );
        }
        break;
      // case SearchFilter.USER_PHONE:
      //   query = query.ilike("user_phone", `%${search}%`);
      //   break;
    }
  }

  const { data, error, status } = await query;

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
