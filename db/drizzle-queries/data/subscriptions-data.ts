"use server";

import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { SearchFilter } from "@/types/search.types";
import { ilike, eq } from "drizzle-orm";

const getAllUsers = async (
  page: number,
  perPage: number,
  filter?: SearchFilter,
  search?: string,
) => {
  const start = (page - 1) * perPage;
  let query = db
    .selectDistinctOn([subscriptions.user_email], {
      user_email: subscriptions.user_email,
      user_phone: subscriptions.user_phone,
    })
    .from(subscriptions)
    .orderBy(subscriptions.user_email)
    .limit(perPage)
    .offset(start);

  if (filter && search?.length && search?.length > 1) {
    switch (filter) {
      case SearchFilter.USER_EMAIL:
        query.where(ilike(subscriptions.user_email, `%${search}%`));
        break;
      case SearchFilter.USER_PHONE:
        query.where(ilike(subscriptions.user_phone, `%${search}%`));
        break;
    }
  }

  const users = await query;
  return users;
};

const getUserPurchases = async (email: string) => {
  const userPurchases = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.user_email, email));
  return userPurchases;
};

export { getAllUsers, getUserPurchases };
