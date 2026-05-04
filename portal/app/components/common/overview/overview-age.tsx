import { Bar, BarChart, LabelList, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
export const description = 'A horizontal bar chart';

const chartConfig = {
  value: {
    label: 'Age',
    color: 'var(--primary)'
  }
} satisfies ChartConfig;

type Props = {
  isLoading?: boolean;
  data: LabelValueProps[];
};

export default function OverviewAge({ isLoading, data }: Props) {
  // const ageData = data.filter((item) => item.label !== 'Unknown');
  const ageData = data.map((p) => ({
    ...p,
    value: Number(p.value)
  }));

  if (isLoading) {
    return <Skeleton className="h-full w-full min-w-[300px] shrink-0" />;
  }
  return (
    <Card className="h-full border w-full min-w-[300px] shrink-0 gap-0">
      <CardHeader className="px-4 pb-2">
        <CardTitle>Age Group</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer config={chartConfig} className="h-[170px] w-full">
          <BarChart
            accessibilityLayer
            data={ageData}
            layout="vertical"
            margin={{
              left: 20,
              right: 20
            }}
          >
            <defs>
              <linearGradient id="ageGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--color-primary)" /> {/* start color */}
                <stop offset="100%" stopColor="var(--color-secondary)" /> {/* end color */}
              </linearGradient>
            </defs>
            <XAxis type="number" dataKey="value" hide />
            <YAxis
              dataKey="label"
              type="category"
              tickLine={false}
              tickMargin={15}
              axisLine={false}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar barSize={26} dataKey="value" fill="url(#ageGradient)" radius={5}>
              {/* <LabelList
                dataKey="value"
                position="insideRight" // inside the bar on the right side
                offset={5} // optional spacing from bar edge
                fill="#fff" // text color
                formatter={(val: string) => `${val.toLocaleString()} users`} // format numbers
              /> */}
              <LabelList
                dataKey="value"
                content={<CustomLabel x={0} y={0} width={0} value={0} />}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

const CustomLabel = (props: { x: number; y: number; width: number; value: number }) => {
  const { x, y, width, value } = props;

  // If bar is too short (< 40px), hide the "users"
  const showUsers = width > 40;

  return (
    <text x={x + width - 5} y={y + 16} fill="#fff" fontSize={12} textAnchor="end">
      {showUsers ? `${value} users` : value}
    </text>
  );
};
