"use client";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { MostOccurringCountryCodes as MostOccurringCountryCodesType } from "@/types/tables.types";

type Props = {
  data: MostOccurringCountryCodesType[];
};

const MostOccurringCountryCodes = ({ data }: Props) => {
  const chartData = data.map((item) => ({
    country_code: item.country_code,
    customers: item.occurrences,
    fill: `var(--color-${item.country_code.toLowerCase()})`,
  }));
  console.log(chartData);

  const chartConfig = {
    customers: {
      label: "Customers",
    },
    ...Object.fromEntries(
      data.map((item, index) => [
        item.country_code.toLowerCase(),
        {
          label: item.country_code,
          color: `hsl(var(--chart-${index + 1}))`,
        },
      ]),
    ),
  } satisfies ChartConfig;

  const totalOrders = data.reduce((acc, item) => acc + item.occurrences, 0);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Coutries with most customers</CardTitle>
        <CardDescription>
          Showing the top 5 countries with the most customers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 0,
            }}
          >
            <YAxis
              dataKey="country_code"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <XAxis dataKey="customers" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="customers" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Total Orders of {totalOrders} <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total customers from all time
        </div>
      </CardFooter>
    </Card>
  );
};

export default MostOccurringCountryCodes;
