import { Tables } from "./database.types";

export type Subscriptions = Tables<"subscriptions">;
export type Devices = Tables<"devices">;
export type UserData = Tables<"user_data">;

export type PaymentsPerDay = {
  payment_date: string;
  total_payments: number;
};

export type MostOccurringCountryCodes = {
  country_code: string;
  occurrences: number;
};
