import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { getLabel } from '@/lib/chart-helper';

export const description = 'An area chart with gradient fill';

const chartConfig = {
  thisMonth: {
    label: 'This Month'
  },
  lastMonth: {
    label: 'Last Month'
  },
  tooltipLabel: { label: '' }
} satisfies ChartConfig;

type Props = {
  dateType: string;
  isLoading?: boolean;
  data?: OverviewChartProps;
};

export default function OverviewChart({ dateType, isLoading, data }: Props) {
  const { current, prev } = getLabel(dateType);

  if (isLoading) return <Skeleton className="h-[410px] w-full" />;
  return (
    <Card className="border">
      <CardHeader>
        <div className="flex gap-6 items-center">
          <CardTitle>Overview</CardTitle>
          <div className="h-5 w-[2px] bg-gray-100"></div>
          <div className="flex gap-6">
            <Indicator label={prev} color="bg-primary" />
            <Indicator label={current} color="bg-destructive" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* not working? */}
        <ChartContainer config={chartConfig} className="h-[310px] w-full">
          <AreaChart
            accessibilityLayer
            data={data?.chartData}
            margin={{
              left: 20,
              right: 12
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis
              dataKey={'label'}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              // tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent labelKey="tooltipLabel" />}
            />
            <defs>
              {/* <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-thisMonth)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-thisMonth)" stopOpacity={0.1} />
              </linearGradient> */}
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.1} />
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <Area
              dataKey="lastMonth"
              type="natural"
              fill="url(#fillMobile)"
              fillOpacity={0.4}
              stroke="var(--color-primary)"
              stackId="a"
            />
            <Area
              dataKey="thisMonth"
              type="natural"
              fill="url(#fillDesktop)"
              strokeDasharray="5 4"
              fillOpacity={0.4}
              stroke="var(--color-destructive)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

const Indicator = ({ label, color }: { label: string; color: string }) => {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-[6px] h-[6px] rounded-full ${color}`}></div>
      <span className="text-sm">{label}</span>
    </div>
  );
};
