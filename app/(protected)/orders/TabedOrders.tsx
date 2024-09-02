"use client";

import { useQueryState } from "nuqs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrdersTable from "@/components/orders/OrdersTable";
import { StatusEnum } from "@/db/schema";

const tabs = [
  { value: StatusEnum.DRAFT, label: "Draft" },
  { value: StatusEnum.PAID, label: "Paid" },
  { value: StatusEnum.COMPLETED, label: "Completed" },
];
const TabedOrders = () => {
  const [tab, setTab] = useQueryState<StatusEnum>("tab", {
    defaultValue: StatusEnum.PAID,
    parse: (value) => {
      if (Object.values(StatusEnum).includes(value as StatusEnum)) {
        return value as StatusEnum;
      }
      return StatusEnum.PAID;
    },
  });
  return (
    <Tabs
      defaultValue={StatusEnum.PAID}
      className="w-full"
      onValueChange={(value) => setTab(value as StatusEnum)}
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
