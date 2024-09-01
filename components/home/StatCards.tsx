import React from "react";
import StatCard from "./StatCard";
import { DollarSign, BarChart, Users, Package } from "lucide-react";

export const dynamic = "force-dynamic";

import {
  getDistinctTotaleUsersCount,
  getDraftOrdersCount,
  getTotaleOverallSales,
  getTotalSalesToday,
} from "@/db/drizzle-queries/aggregations/subscription-aggregations";
const StatCards = async () => {
  const [totalSalesToday, totalSalesOverall, usersCount, draftOrdersCount] =
    await Promise.all([
      getTotalSalesToday(),
      getTotaleOverallSales(),
      getDistinctTotaleUsersCount(),
      getDraftOrdersCount(),
    ]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Sales Today"
        value={`$${totalSalesToday || 0}`}
        description="+12% from yesterday"
        icon={DollarSign}
      />
      <StatCard
        title="Total Sales Overall"
        value={`$${totalSalesOverall || 0}`}
        description="Lifetime sales"
        icon={BarChart}
      />
      <StatCard
        title="Active Customers"
        value={`${usersCount || 0}`}
        description="+7% from last month"
        icon={Users}
      />
      <StatCard
        title="Draft Orders"
        value={`${draftOrdersCount || 0}`}
        description="43 low stock alerts"
        icon={Package}
      />
    </div>
  );
};

export default StatCards;
