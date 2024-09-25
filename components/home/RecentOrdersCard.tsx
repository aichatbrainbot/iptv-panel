import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getRecentOrders } from "@/db/data/subscriptions-data";
import OrderRows from "./OrderRows";
import { unstable_noStore as noStore } from "next/cache";
import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { desc, inArray } from "drizzle-orm";

export default async function RecentOrdersCard() {
  noStore();
  const orders = await db
    .select()
    .from(subscriptions)
    .limit(5)
    .orderBy(desc(subscriptions.created_at))
    .where(inArray(subscriptions.status, ["paid", "completed"]));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <OrderRows initialOrders={orders} />
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
