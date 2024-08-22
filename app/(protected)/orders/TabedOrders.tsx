"use client";

import { useQueryState } from "nuqs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrdersTable from "@/components/orders/OrdersTable";
const TabedOrders = () => {
  const [tab, setTab] = useQueryState("tab", {
    defaultValue: "completed",
  });
  return (
    <Tabs
      defaultValue="completed"
      className="w-full"
      onValueChange={setTab}
      value={tab}
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="new">New</TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
      </TabsList>
      <TabsContent value="new">
        <OrdersTable />
      </TabsContent>
      <TabsContent value="completed">
        <OrdersTable />
      </TabsContent>
    </Tabs>
  );
};

export default TabedOrders;
