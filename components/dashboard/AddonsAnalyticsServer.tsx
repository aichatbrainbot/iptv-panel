import React from "react";
import AddonsAnalytics from "./AddonsAnalytics";
import { getAddonsAnalytics } from "@/db/aggregations/sales-aggregation";

const AddonsAnalyticsServer = async () => {
  const addonsAnalytics = await getAddonsAnalytics();
  return <AddonsAnalytics addonsAnalytics={addonsAnalytics} />;
};

export default AddonsAnalyticsServer;
