import React from "react";
import AddonsAnalytics from "./AddonsAnalytics";
import { getAddonsAnalytics } from "@/db/drizzle-queries/aggregations/subscription-aggregations";
import { unstable_noStore as noStore } from "next/cache";

const AddonsAnalyticsServer = async () => {
  noStore();
  const addonsAnalytics = await getAddonsAnalytics();
  return <AddonsAnalytics addonsAnalytics={addonsAnalytics} />;
};

export default AddonsAnalyticsServer;
