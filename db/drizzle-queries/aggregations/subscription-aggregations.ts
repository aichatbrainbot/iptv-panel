"use server";

import { count, countDistinct, eq, inArray, sum, sql, desc } from "drizzle-orm";
import { db } from "@/db";
import { subscriptions } from "@/db/schema";

const getDraftOrdersCount = async () => {
  const draftCount = await db
    .select({ count: count() })
    .from(subscriptions)
    .where(eq(subscriptions.status, "draft"));
  return draftCount[0].count;
};

const getDistinctTotaleUsersCount = async () => {
  const distinctUsersCount = await db
    .select({ count: countDistinct(subscriptions.user_email) })
    .from(subscriptions)
    .where(inArray(subscriptions.status, ["paid", "completed"]));
  return distinctUsersCount[0].count;
};

const getTotaleOverallSales = async () => {
  const totaleOverallSales = await db
    .select({ sum: sum(subscriptions.price) })
    .from(subscriptions)
    .where(inArray(subscriptions.status, ["paid", "completed"]));
  return totaleOverallSales[0].sum;
};

const getTotalSalesToday = async () => {
  const totalSalesToday = await db
    .select({ sum: sum(subscriptions.price) })
    .from(subscriptions)
    .where(eq(sql`DATE(${subscriptions.created_at})`, sql`CURRENT_DATE`));
  return totalSalesToday[0].sum;
};

const getPayementsPerDay = async (days: number) => {
  const payementsPerDay = await db
    .select({
      payment_date: sql<string>`DATE(${subscriptions.created_at})`,
      total_payments: sql<number>`CAST(${sum(subscriptions.price)} AS FLOAT)`,
    })
    .from(subscriptions)
    .groupBy(sql`DATE(${subscriptions.created_at})`)
    .orderBy(desc(sql`DATE(${subscriptions.created_at})`))
    .limit(days);
  return payementsPerDay;
};

const getMostOccurringCountryCodes = async (limit: number) => {
  const mostOccurringCountryCodes = await db
    .select({
      country_code: sql<string>`${subscriptions.country_code}`,
      occurrences: count(),
    })
    .from(subscriptions)
    .where(inArray(subscriptions.status, ["paid", "completed"]))
    .groupBy(sql`${subscriptions.country_code}`)
    .orderBy(desc(count()))
    .limit(limit);

  return mostOccurringCountryCodes;
};

const getAddonsAnalytics = async () => {
  const addonsAnalytics = await db
    .select({
      vod_count: count(),
      adult_content_count: count(),
      quick_delivery_count: count(),
    })
    .from(subscriptions)
    .where(inArray(subscriptions.status, ["paid", "completed"]))
    .groupBy(
      sql`${subscriptions.vod}, ${subscriptions.adult_content}, ${subscriptions.quick_delivery}`,
    );

  return addonsAnalytics[0];
};

const getMostSellingPlans = async () => {
  const mostSellingPlans = await db
    .select({
      plan_name: sql<string>`${subscriptions.plan}`,
      count: count(),
    })
    .from(subscriptions)
    .groupBy(sql`${subscriptions.plan}`)
    .orderBy(desc(count()));

  return mostSellingPlans;
};

export {
  getDraftOrdersCount,
  getDistinctTotaleUsersCount,
  getTotaleOverallSales,
  getTotalSalesToday,
  getPayementsPerDay,
  getMostOccurringCountryCodes,
  getAddonsAnalytics,
  getMostSellingPlans,
};
