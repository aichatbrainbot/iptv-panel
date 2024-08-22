import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { getMostSellingPlans } from "@/db/aggregations/sales-aggregation";
import { plans as plansData } from "@/lib/constants";

export default async function TopSellingProductsCard() {
  const plans = await getMostSellingPlans();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Selling Products</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Plan</TableHead>
              <TableHead>Sold</TableHead>
              <TableHead>Revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.map((plan) => {
              const price =
                plansData.find((p) => p.name === plan.plan_name)?.price || 1;

              return (
                <TableRow key={plan.plan_name}>
                  <TableCell>{plan.plan_name}</TableCell>
                  <TableCell>{plan.count}</TableCell>
                  <TableCell>{plan.count * Number(price)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
