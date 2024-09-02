"use server";

import { db } from "@/db";
import { StatusEnum, subscriptions, Subscriptions } from "@/db/schema";
import { SearchFilter } from "@/types/search.types";
import { ilike, eq, desc, DBQueryConfig, and } from "drizzle-orm";

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

const getOrders = async (
  page: number = 1,
  limit: number = 5,
  tab?: StatusEnum,
  filter?: SearchFilter | undefined,
  search?: string | null,
) => {
  const start = (page - 1) * limit;
  let findManyConfig: DBQueryConfig = {
    limit: limit,
    offset: start,
    orderBy: desc(subscriptions.created_at),
    where: (subscriptions, { ilike, eq }) => {
      const conditions = [];

      conditions.push(eq(subscriptions.status, tab));

      if (filter && search?.length && search?.length >= 1) {
        switch (filter) {
          case SearchFilter.ORDER_NUMBER:
            const orderNumber = parseInt(search);
            if (!isNaN(orderNumber)) {
              conditions.push(eq(subscriptions.order_number, orderNumber));
            }
            break;
          default:
            conditions.push(ilike(subscriptions[filter], `%${search}%`));
            break;
        }
      }

      return conditions.length > 0 ? and(...conditions) : undefined;
    },
  };

  const orders = await db.query.subscriptions.findMany(findManyConfig);
  return orders;
};

const getOrderById = async (id: string) => {
  const order = await db.query.subscriptions.findFirst({
    where: (subscriptions, { eq }) => {
      return eq(subscriptions.id, id);
    },
  });

  return order;
};

const updateOrder = async (id: string, data: Partial<Subscriptions>) => {
  const updatedOrder = await db
    .update(subscriptions)
    .set(data)
    .where(eq(subscriptions.id, id));

  return updatedOrder;
};

export { getAllUsers, getUserPurchases, getOrders, getOrderById, updateOrder };
