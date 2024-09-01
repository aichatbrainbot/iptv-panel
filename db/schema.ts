import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  boolean,
  json,
  pgEnum,
  uuid,
  real,
} from "drizzle-orm/pg-core";

import { sql } from "drizzle-orm";

// Define the subscription_plan enum
export const subscriptionPlanEnum = pgEnum("subscription_plan", [
  "monthly",
  "quarterly",
  "semi-annual",
  "annual",
]);

export const connectionsEnum = pgEnum("connections_enum", ["1", "2", "3"]);

export const statusEnum = pgEnum("status_enum", ["draft", "paid", "completed"]);

export const blogs = pgTable("blogs", {
  id: serial("id").primaryKey(),
  title: text("title"),
  content: json("content"),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const devices = pgTable("devices", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  device_type: text("device_type").notNull(),
  mac_address: text("mac_address").notNull(),
  subscription_id: uuid("subscription_id").references(() => subscriptions.id),
});

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  additional_info: text("additional_info"),
  adult_content: boolean("adult_content").default(false),
  connections: text("connections"),
  country_code: text("country_code"),
  created_at: timestamp("created_at").default(sql`now()`),
  order_number: serial("order_number"),
  payement_email: text("payement_email"),
  payement_full_name: text("payement_full_name"),
  payement_order_id: text("payement_order_id"),
  plan: subscriptionPlanEnum("plan").notNull(),
  price: real("price").notNull(),
  quick_delivery: boolean("quick_delivery").default(false),
  status: statusEnum("status").notNull(),
  subscription_type: text("subscription_type"),
  user_email: text("user_email").notNull(),
  user_name: text("user_name").notNull(),
  user_phone: text("user_phone").notNull(),
  vod: boolean("vod").default(false),
});
