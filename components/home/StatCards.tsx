import React from "react";
import StatCard from "./StatCard";
import { DollarSign, BarChart, Users, Package } from "lucide-react";
import {
  getTotalSalesOverall,
  getTotalSalesToday,
  getUsersCount,
} from "@/db/aggregations/sales-aggregation";

const StatCards = async () => {
  const [totalSalesToday, totalSalesOverall, usersCount] = await Promise.all([
    getTotalSalesToday(),
    getTotalSalesOverall(),
    getUsersCount(),
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
        title="Inventory Items"
        value="789"
        description="43 low stock alerts"
        icon={Package}
      />
    </div>
  );
};

export default StatCards;
