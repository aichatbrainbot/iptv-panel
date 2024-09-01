import React from "react";
import AddonsAnalytics from "./AddonsAnalytics";
import { getAddonsAnalytics } from "@/db/drizzle-queries/aggregations/subscription-aggregations";
const AddonsAnalyticsServer = async () => {
  const addonsAnalytics = await getAddonsAnalytics();
  return <AddonsAnalytics addonsAnalytics={addonsAnalytics} />;
};

export default AddonsAnalyticsServer;
