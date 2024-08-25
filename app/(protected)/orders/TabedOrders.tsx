"use client";

import { useQueryState } from "nuqs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrdersTable from "@/components/orders/OrdersTable";
import { OrderStatus } from "@/types/search.types";

const tabs = [
  { value: OrderStatus.DRAFT, label: "Draft" },
  { value: OrderStatus.PAID, label: "Paid" },
  { value: OrderStatus.COMPLETED, label: "Completed" },
];
const TabedOrders = () => {
  const [tab, setTab] = useQueryState<OrderStatus>("tab", {
    defaultValue: OrderStatus.COMPLETED,
    parse: (value) => {
      if (Object.values(OrderStatus).includes(value as OrderStatus)) {
        return value as OrderStatus;
      }
      return OrderStatus.COMPLETED;
    },
  });
  return (
    <Tabs
      defaultValue={OrderStatus.COMPLETED}
      className="w-full"
      onValueChange={(value) => setTab(value as OrderStatus)}
      value={tab}
    >
      <TabsList className="grid w-full grid-cols-3">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          <OrdersTable />
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default TabedOrders;
