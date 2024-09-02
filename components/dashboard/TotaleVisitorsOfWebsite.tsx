"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

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
import { MostOccurringCountryCodes } from "@/db/schema";

type Props = {
  data: MostOccurringCountryCodes[];
  totalVisitorsOfSite: number;
};

function TotaleVisitorsOfWebsite({ data, totalVisitorsOfSite }: Props) {
  const chartData = data.map((item) => ({
    country_code: item.country_code,
    customers: item.occurrences,
    fill: `var(--color-${item.country_code?.toLowerCase()})`,
  }));

  const chartConfig = {
    customers: {
      label: "Customers",
    },
    ...Object.fromEntries(
      data.map((item, index) => [
        item.country_code?.toLowerCase(),
        {
          label: item.country_code,
          color: `hsl(var(--chart-${index + 1}))`,
        },
      ]),
    ),
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Total visitors of website</CardTitle>
        <CardDescription>Showing total visitors of all time</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="customers"
              nameKey="country_code"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalVisitorsOfSite.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Visitors
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors of all time
        </div>
      </CardFooter>
    </Card>
  );
}

export default TotaleVisitorsOfWebsite;
