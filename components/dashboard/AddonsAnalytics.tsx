"use client";
import { TrendingUp } from "lucide-react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
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
import { AddonsAnalytics as AddonsAnalyticsType } from "@/db/aggregations/sales-aggregation";

type Props = {
  addonsAnalytics: AddonsAnalyticsType;
};

const AddonsAnalytics = ({ addonsAnalytics }: Props) => {
  const chartData = [
    { month: "VOD", payments: addonsAnalytics.vod_count },
    { month: "Adult Content", payments: addonsAnalytics.adult_content_count },
    { month: "Quick Delivery", payments: addonsAnalytics.quick_delivery_count },
  ];
  const chartConfig = {
    payments: {
      label: "Payments",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;
  const totalPayments =
    addonsAnalytics.vod_count +
    addonsAnalytics.adult_content_count +
    addonsAnalytics.quick_delivery_count;
  const biggestAddon =
    addonsAnalytics.vod_count > addonsAnalytics.adult_content_count &&
    addonsAnalytics.vod_count > addonsAnalytics.quick_delivery_count
      ? "VOD"
      : addonsAnalytics.adult_content_count >
          addonsAnalytics.quick_delivery_count
        ? "Adult Content"
        : "Quick Delivery";
  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>Addons Analytics</CardTitle>
        <CardDescription>Showing total payments of all time</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="month" />
            <PolarGrid />
            <Radar
              dataKey="payments"
              fill="var(--color-payments)"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Total payments: <span className="font-bold">{totalPayments}</span>
        </div>
        <div className="flex items-center gap-2 leading-none text-muted-foreground">
          Biggest addon: <span className="font-bold">{biggestAddon}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AddonsAnalytics;
